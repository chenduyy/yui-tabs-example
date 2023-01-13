<template>
	<view class="yui-tabs" :class="[tabsClass]">
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="yui-tabs__depend"></view>
		<!-- 标签区域 -->
		<view class="yui-tabs__wrap" :style="[innerWrapStyle, wrapStyle]" :class="[wrapClass]" @touchmove.stop.prevent="touchmove">
			<view class="yui-tabs__nav-left">
				<slot name="nav-left"></slot>
			</view>
			<scroll-view class="yui-tabs__scroll" :class="[scrollX ? 'yui-tabs__scroll--enable' : '']" :scroll-x="scrollX" :scroll-y="scrollY" :scroll-anchoring="true" enable-flex
				:scroll-left="scrollLeft" :scroll-into-view="!scrollToCenter || this.scrollY ? scrollId : ''" :scroll-with-animation="animated && reseted" :style="[scrollStyle]">
				<view class="yui-tabs__nav" :class="[navClass]">
					<!-- 标签项 -->
					<view class="yui-tab" v-for="(tab, index) in tabs" :key="index" @tap.stop="onClick(index)" :id="`tab_${index}`" :class="[tabClass(index, tab), tab.titleClass]"
						:style="[tabStyle(index), tab.titleStyle]">
						<!-- 标题 -->
						<view class="yui-tab__title" :class="[titleClass(tab)]">
							<!-- 图标或图片 -->
							<view class="yui-tab__icons" v-if="tab.iconType || tab.imageSrc">
								<uni-icons v-if="tab.iconType" :custom-prefix="tab.customPrefix" :type="tab.iconType" :size="tab.iconSize" />
								<image class="yui-tab__image" v-if="tab.imageSrc" :mode="tab.imageMode" :src="tab.imageSrc" />
							</view>
							<!-- 标题文本 -->
							<view class="yui-tab__text" :class="[textClass(tab)]">
								<!-- #ifndef VUE3 -->
								<slot :name="tab.titleSlot">{{ tab.title }}</slot>
								<!-- #endif -->
								<!-- #ifdef VUE3 -->
								<!-- #ifndef APP-PLUS || H5 -->
								{{ tab.title }}
								<!-- #endif -->
								<!-- #ifdef APP-PLUS || H5 -->
								<slot :name="tab.titleSlot">{{ tab.title }}</slot>
								<!-- #endif -->
								<!-- #endif -->
							</view>
						</view>
						<!-- 标题右上角信息 -->
						<view class="yui-tab__info" v-if="tab.dot || tab.badge">
							<text class="yui-tab__info--dot" v-if="tab.dot" />
							<text class="yui-tab__info--badge" v-if="tab.badge">{{ tab.badge }}</text>
						</view>
					</view>
					<view v-if="isLine" class="yui-tabs__line" :class="[lineClass]" :style="[lineStyle, lineAnimatedStyle]"></view>
				</view>
			</scroll-view>
			<view class="yui-tabs__nav-right">
				<slot name="nav-right"></slot>
			</view>
		</view>

		<view v-if="isFixed && !scrollY" class="yui-tabs__placeholder" :style="[{ height: placeholderHeight + 'px' }]" />
		<!-- 标签内容 -->
		<view class="yui-tabs__content" :class="[contentClass]" :style="[contentStyle]">
			<view class="yui-tabs__track" :class="[{ 'yui-tabs__track--scrollspy': scrollspy }]" :style="[trackStyle]">
				<!-- 滚动导航与侧边栏导航的内容区域：使用scroll-view实现区域滚动，否则就是页面级滚动 -->
				<scroll-view v-if="scrollspy && !pageScroll" scroll-y :scroll-top="paneScrollTop" :scroll-anchoring="true" enable-flex :scroll-with-animation="animated" :style="[paneScrollStyle]"
					@scroll="handleScrollByPane" @touchstart="touchstartByPane">
					<slot></slot>
				</scroll-view>
				<slot v-else></slot>
			</view>
		</view>
	</view>
</template>
<script>
	// 滚动导航增加局部滚动模式
	import { isNull, addUnit, isDef, isObject, callInterceptor, getColor, toClass } from '../js/uitls';
	import { model, emits, props } from '../js/const';

	export default {
		name: 'yTabs',
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		model,
		emits,
		props,
		data() {
			return {
				children: [], // 存放子组件数组
				tabs: [], //存放标题栏数据
				timer: null,
				initTimer: null,
				reseted: false,
				currentIndex: null, //当前选中下标
				// 标签栏的scroll-view相关
				scrollId: '', //值应为某子元素id（id不能以数字开头）；设置哪个方向可滚动，则在哪个方向滚动到该元素
				scrollLeft: 0, //设置横向滚动条位置
				// scrollTop: 0, //设置竖向滚动条位置
				// 内容区域的scroll-view相关
				paneScrollTop: 0, //设置竖向滚动条位置
				// 标签栏底部线条动画相关
				lineWidthValue: 20, //底部线条宽度值
				lineHeightValue: 20, //底部线条高度值
				lineAnimated: false, //是否开启标签栏底部线条动画（首次不开启）
				lineAnimatedStyle: {
					transform: 'translateX(-100%) translateX(0%)',
					transition: 'none'
				}, //标签栏底部线条动画样式
				isFixed: false, //是否吸顶
				halfWrapWidth: 0, //一半的标题栏区域宽度
				placeholderHeight: 0, //标题栏占位高度
				wrapTop: 0, //标签栏区域顶部与屏幕顶部的距离
				wrapBottom: 0, //标题栏区域底部与屏幕顶部的距离
				extraWidth: 0, //标签栏nav-left、nav-right插槽宽度
				extraHeight: 0, //标签栏nav-left、nav-right插槽高度
				contentWidth: 0, //内容区域宽度
				contentTop: 0, //内容区域与屏幕顶部的距离
				dependOffsetTop: 0, //依赖元素与屏幕顶端的最小距离
				// windowHeight: 0, //可使用窗口高度
				trackStyle: null, //标签内容滑动轨道样式
				lockedScrollspy: false, //锁定滚动导航模式下点击标题栏触发的滚动逻辑
				scrollTop: 0, //页面垂直滚动距离
				transparentBgColor: 'rgba(255,255,255,0)', //标题栏透明背景色
				defaultNavHeight: '100vh' //默认导航区域高度
			};
		},
		computed: {
			// 标签栏是否垂直展示
			scrollY() {
				return this.direction === 'vertical';
			},
			// 是否为滚动导航
			scrollNav() {
				return this.scrollspy && !this.scrollY;
			},
			// 是否为侧边栏导航
			sidebarNav() {
				return this.scrollspy && this.scrollY;
			},
			// 样式风格是否为line
			isLine() {
				return this.type === 'line';
			},
			// 标签页class
			tabsClass() {
				return toClass({ 'yui-tabs--vertical': this.scrollY }, `yui-tabs--${this.type}`);
			},
			// 导航栏区域class
			wrapClass() {
				return toClass({
						'yui-tabs__wrap--fixed': this.isFixed,
						'yui-tabs__wrap--transparent': this.transparent,
						'yui-tabs__wrap--vertical': this.scrollY
					},
					`yui-tabs__wrap--${this.type}`
				);
			},
			// 导航栏class
			navClass() {
				return toClass({ 'yui-tabs__nav--vertical': this.scrollY }, `yui-tabs__nav--${this.type}`);
			},
			// 内容卡片class
			contentClass() {
				return toClass({
					'yui-tabs__content--animated': this.animated,
					'yui-tabs__content--scrollspy': this.scrollspy,
					'yui-tabs__content--vertical': this.scrollY
				});
			},
			// 底部条class
			lineClass() {
				return toClass({ 'yui-tabs__line--vertical': this.scrollY });
			},
			// 导航栏区域样式
			innerWrapStyle() {
				const style = { background: !this.transparent ? this.background : this.transparentBgColor };
				if (this.type === 'card') style.borderColor = this.color;
				// 滚动吸顶下
				if (this.isFixed) {
					style.top = this.offsetTop + 'px';
				}
				style.width = !isNull(this.navWidth) ? addUnit(this.navWidth) : '';
				return style;
			},
			// 内容区域样式
			contentStyle() {
				const style = {};
				if (this.scrollY) style.width = !isNull(this.navWidth) ? `calc(100% - ${addUnit(this.navWidth)})` : '';
				return style;
			},
			// 标签栏scroll-view样式
			scrollStyle() {
				let { scrollY, extraWidth, extraHeight, navHeight, offsetTop, dependOffsetTop } = this;
				// 标签栏垂直展示时，计算其高度
				let height = '';
				if (scrollY) {
					if (isNull(navHeight)) {
						// 用户未给定导航高度时，内部处理：吸顶，需减去offsetTop;  不吸顶则减去依赖元素与顶部的最小距离dependOffsetTop
						height = `100vh - ${this.isFixed ? this.offsetTop : this.dependOffsetTop}px`;
						// 减去nav-left、nav-right插槽的高度
						height = `calc(${height} - ${extraHeight}px)`;
					} else {
						// 用户给定导航高度时，只需减去nav-left、nav-right插槽的高度
						height = `calc(${navHeight} - ${extraHeight}px)`;
					}
				}
				return {
					width: scrollY ? '' : `calc(100% - ${extraWidth}px)`, //标签栏水平时scroll-view需要减去插槽所占区域，垂直时无需设置
					height
				};
			},
			// 标签内容scroll-view样式
			paneScrollStyle() {
				if (!this.scrollspy) return {};
				let height = '';
				// 计算为区域滚动的滚动导航模式下的内容高度（需减去标题栏底部距离屏幕顶部的大小值）
				if (this.scrollNav && !this.pageScroll) {
					height = isNull(this.contentHeight) ? `calc(100vh - ${this.wrapBottom}px)` : addUnit(this.contentHeight);
				}

				// 计算为区域滚动的侧边栏导航模式下的内容高度
				if (this.sidebarNav && !this.pageScroll) {
					height = isNull(this.navHeight) ? `calc(100px - ${this.dependOffsetTop}px)` : addUnit(this.navHeight);
				}
				return { height };
			},
			// 底部线条样式
			lineStyle() {
				const { lineWidth, lineHeight, duration } = this;
				const lineStyle = {
					width: addUnit(lineWidth),
					backgroundColor: this.color
				};

				if (isDef(lineHeight)) {
					lineStyle.height = addUnit(lineHeight);
					lineStyle.borderRadius = lineStyle.height;
				}
				return lineStyle;
			},
			// 是否允许横向滚动
			scrollX() {
				return !this.scrollY && !this.ellipsis && this.tabs.length > this.scrollThreshold;
			},
			// 标签数量
			dataLen() {
				return this.tabs.length;
			},
			// 滑动动画时长(ms)
			msDuration() {
				return this.animated ? this.duration * 1000 : 0;
			},
			// 用于判断滚动的内容区域与屏幕顶部比较时所需的滚动偏移量
			scrollOffset() {
				// 滚动导航：区域滚动时，滚动偏移量为用户设置的'粘性布局下与顶部的最小距离'+'标签栏占位高度'；页面滚动时为'标签栏占位高度'
				if (this.scrollNav) return !this.pageScroll ? this.offsetTop + this.placeholderHeight : this.placeholderHeight;
				// 侧边栏导航：区域滚动时，滚动偏移量为内容容器距离顶部的高度；页面滚动时为0
				if (this.sidebarNav) return !this.pageScroll ? this.contentTop : 0;
				return 0;
			},
			// 当前激活标签的name值
			currentName() {
				const activeTab = this.children[this.currentIndex];
				if (activeTab) {
					return activeTab.computedName;
				}
			}
		},
		watch: {
			// 监听父组件的props，设置给子组件
			$props: {
				deep: true,
				immediate: true,
				handler(newValue) {
					this.children.forEach(child => {
						child.scrollspy = this.scrollspy;
						child.rendered = !newValue.isLazyRender || newValue.scrollspy;
					});
				}
			},
			// 监听子组件数组长度变化，赋index值
			'children.length'() {
				this.children.forEach((child, index) => {
					child.index = index;
					child.scrollspy = this.scrollspy;
					child.rendered = !this.isLazyRender || this.scrollspy; //标记是否渲染过，非懒加载与滚动导航模式下默认渲染
				});
			},
			// 监听选中下标变化
			currentIndex(newIdx, oldIdx) {
				this.$nextTick(() => {
					this.setLine(); //设置底部线条位置
				});
				this.changeStatus(newIdx, oldIdx); // 状态变更
				this.changeStyle(); // 样式切换
			},
			// 监听背景色变化，重新获取rgba各值
			background: {
				immediate: true,
				handler(value) {
					if (this.transparent) {
						const color = getColor(isNull(value) ? 'rgba(255,255,255,0)' : value);
						if (color.length) {
							this._R = color[0];
							this._G = color[1];
							this._B = color[2];
							this._A = parseFloat(color[3]);
						} else {
							throw new Error('元素背景颜色必须为RGBA');
						}
					}
				}
			},
			scrollTop() {
				this.handleScroll();
			}
		},
		created() {
			// 监听选中标识符变化
			this.$watch(model.prop, index => {
				if (index !== this.currentIndex) {
					this.setCurrentIndex(index); //更新当前选中下标
				}
			});
		},
		mounted() {
			this.$nextTick(() => {
				this.init(); //初始化
				this.bindListener(); //监听事件
			});
		},
		methods: {
			toJSON() {},
			// @exposed-api
			reset(callback) {
				this.reseted = false;
				this.scrollId = '';
				this.scrollLeft = 0;
				this.paneScrollTop = 0;
				this.lineAnimated = false;
				this.lineAnimatedStyle = {
					transform: 'translateX(-100%) translateX(0%)',
					transition: 'none'
				};
				this.lockedScrollspy = false;
				this.$nextTick(() => {
					this.reseted = true;
					callback && callback();
				});
			},
			// @exposed-api
			resize() {
				// 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
				this.init();
			},
			// @exposed-api
			scrollTo(name) {
				this.$nextTick(() => {
					this.setCurrentIndexByName(name);
					this.scrollToCurrentContent(true);
				});
			},
			// 添加tab
			putTab({ newValue, oldValue }) {
				this.tabs.push({
					...newValue,
					titleSlot: 'title' + this.tabs.length, //标题插槽名，以"title"+下标命名,vue3只有H5、app支持自定义标题插槽
					show: this.scrollspy //是否显示内容（滚动导航模式默认显示）
				});
				// if (this.initTimer) clearTimeout(this.initTimer);
				// this.initTimer = setTimeout(() => {
				// 	this.init(); //初始化
				// 	this.bindListener(); //监听事件
				// }, 5);
			},
			// 更新tab
			updateTab({ newValue, oldValue, index }) {
				const tab = this.tabs[index];
				Object.keys(newValue || {}).forEach(key => {
					this.$set(tab, key, newValue[key]);
				});
			},
			// 标题项class
			tabClass(index, tab) {
				return toClass({
						'yui-tab--active': this.currentIndex === index,
						'yui-tabs__ellipsis': this.ellipsis,
						'yui-tab--disabled': tab.disabled,
						'yui-tab--animated': !this.isLine,
						'yui-tab__prev': index === this.currentIndex - 1, //与当前标签相邻的前面的标签
						'yui-tab__next': index === this.currentIndex + 1 //与当前标签相邻的后面的标签
					},
					`yui-tab_${index}`,
					`yui-tab--${this.type}`
				);
			},
			// 标题区域class
			titleClass(tab) {
				return toClass({ 'yui-tabs__ellipsis': this.ellipsis }, `yui-tab__title--${tab.position}`);
			},
			// 标题文字class
			textClass(tab) {
				return toClass({ 'yui-tabs__ellipsis': this.ellipsis }, `yui-tab__text--${tab.position}`);
			},
			// 标题项style
			tabStyle(index) {
				const activated = this.currentIndex === index;
				let { titleActiveColor: color, titleInactiveColor: defColor } = this;
				let background = '';
				let borderColor = '';
				// type="line" 时
				if (this.type === 'line') {
					if (isNull(color)) color = '#646566';
					if (isNull(defColor)) defColor = '#323233';
				} else if (this.type === 'text') {
					// type="text" 时，选中时使用主题色
					if (isNull(color)) color = this.color;
					if (isNull(defColor)) defColor = '#323233';
				} else if (this.type === 'card') {
					// type="card" 时，未选中则使用主题色
					background = this.color;
					if (isNull(color)) color = '#fff';
					if (isNull(defColor)) defColor = this.color;
				} else if (this.type === 'button') {
					// type="button" 时
					background = this.color;
					if (isNull(color)) color = '#fff';
					if (isNull(defColor)) defColor = '#323233';
				} else if (this.type === 'line-button') {
					// type="line-button" 时
					borderColor = this.color;
					if (isNull(color)) color = this.color;
					if (isNull(defColor)) defColor = '#323233';
				}

				const style = {
					color: activated ? color : defColor,
					background: activated ? background : '',
					borderColor: activated ? borderColor : ''
				};
				// 水平导航下才给标签项设置高度
				if (!this.scrollY && !isNull(this.navHeight)) style.height = addUnit(this.navHeight);
				return style;
			},
			// 获取查询节点信息的对象
			getSelectorQuery() {
				let query = null;
				// #ifdef MP-ALIPAY
				query = uni.createSelectorQuery();
				// #endif
				// #ifndef MP-ALIPAY
				query = uni.createSelectorQuery().in(this);
				// #endif
				return query;
			},
			// 获取元素位置信息
			getRect(...selectors) {
				return new Promise((resolve, reject) => {
					if (!selectors) reject('Parameter is empty');
					const query = this.getSelectorQuery();
					selectors.forEach(seletor => {
						query.select(seletor).boundingClientRect();
					});
					query.exec(data => {
						data = data || [];
						resolve(data.length === 1 ? data[0] : data);
					});
				});
			},
			// 绑定监听事件
			bindListener() {
				const that = this;
				if (that.sticky || that.scrollspy) {
					uni.$on('onPageScroll', function(e) {
						that.scrollTop = e.scrollTop;
					});
				}
			},
			// 滚动事件触发逻辑
			handleScroll() {
				const { stickyThreshold, offsetTop, sticky, scrollTop, scrollspy, lockedScrollspy, transparent } = this;

				// 粘性定位布局的吸顶处理
				if (sticky) {
					this.getRect('.yui-tabs__depend').then(rect => {
						// TODO 优化触发边界值
						const bottom = rect?.bottom || 0;
						this.isFixed = bottom - stickyThreshold <= offsetTop;
						if (this.scrollspy) this.dependOffsetTop = rect?.top || 0; // 滚动导航模式下才设置
						// 	滚动时触发，仅在 sticky 模式下生效,{ scrollTop: 距离顶部位置, isFixed: 是否吸顶 }
						this.$emit('scroll', { scrollTop, isFixed: this.isFixed });
					});
				}

				// 滚动导航模式下,设置内容区域滚动时激活的下标
				this.setActivedIndexToScroll();

				// 标题栏透明渐变
				if (transparent) {
					let opacity = (scrollTop - offsetTop) / this.transparentOffset + this._A;
					opacity = Math.min(Math.max(this._A, opacity), 1);
					this.transparentBgColor = `rgba(${this._R},${this._G},${this._B},${opacity})`;
				}
			},
			// 滚动时获取要选中的下标
			getCurrIndexOnScroll(res = []) {
				return new Promise((resolve, rejct) => {
					const promises = this.children.map(child => child.getRect());
					Promise.all(promises).then(res => {
						// 标签内容的top小于标题栏的top，则说明已经与标题栏部分重合
						let index = res.reduce((idx, o, i) => (o.top < this.scrollOffset ? i : idx), 0);
						// 判断最后一个标签内容是否完整显示在底部，是则默认选中
						// const lastRect = res[res.length - 1] //最后一个标签内容
						// if (lastRect.bottom <= this.windowHeight) index = res.length - 1
						resolve(index);
					});
				});
			},
			// 初始化操作
			async init() {
				try {
					// this.windowHeight = uni.getSystemInfoSync().windowHeight;//可使用窗口高度
					const [r1, r2, r3, r4, r5, r6, r7] = await this.getRect(
						'.yui-tabs',
						'.yui-tabs__wrap',
						'.yui-tabs__line',
						'.yui-tabs__nav-left',
						'.yui-tabs__nav-right',
						'.yui-tabs__content',
						'.yui-tabs__depend'
					);
					const parentLeft = r1?.left || 0; //标签容器距离视口左侧left值
					const parentTop = r1?.top || 0; // 标签容器距离视口顶部的top值

					this.halfWrapWidth = r2?.width / 2 || 0; //一半的标签栏区域宽度
					this.wrapTop = r2.top || 0; //标签栏区域顶部与屏幕顶部的距离
					this.wrapBottom = r2.bottom || 0; //标签栏区域底部与屏幕顶部的距离

					this.lineWidthValue = r3?.width || 0; //底部线条宽度
					this.lineHeightValue = r3?.height || 0; //底部线条高度

					// nav-left、nav-right插槽宽度、高度
					const navLeftWidth = r4?.width || 0;
					const navLeftHeight = r4?.height || 0;
					const navRightWidth = r5?.width || 0;
					const navRightHeight = r5?.height || 0;
					this.extraWidth = navLeftWidth + navRightWidth;
					this.extraHeight = navLeftHeight + navRightHeight;

					this.contentWidth = r6?.width || 0; //内容区域的宽度
					this.contentTop = r6?.top || 0; //内容区域与屏幕顶部的距离
					this.dependOffsetTop = r7?.top || 0; //依赖元素与屏幕顶端的最小距离

					// 计算每个tab的相关参数
					const selectors = this.tabs.map((_, i) => `.yui-tab_${i}`);
					const rects = await this.getRect(...selectors);
					let lastIndex = this.tabs.length - 1;
					const leftSpace = parentLeft - navLeftWidth,
						topSpace = parentTop - navLeftHeight;
					this.tabs.forEach((tab, i) => {
						const rect = rects[i],
							rect2 = rects[lastIndex];
						this.$set(tab, 'diffWidth', rect ? rect.left - leftSpace : 0); //标签线条宽度差量值
						this.$set(tab, 'diffHeight', rect2 ? rect2.top - topSpace : 0); //标签线条高度差量值
						lastIndex--;
						if (i === 0) {
							this.placeholderHeight = rect?.height || 0; //占位高度等于标签栏区域高度
						}
					});

					this.setCurrentIndexByName(this[model.prop]); //更正活动选项卡的索引
					if (this.currentIndex !== this.children[0].index) {
						//非第一个标签页时内容滚动到指定位置
						setTimeout(() => {
							this.scrollToCurrentContent(true);
						}, 20);
					}

				} catch (e) {
					console.log('e:', e);
					throw new Error('y-tabs init():', e);
				}
			},
			// 标签点击事件
			onClick(index) {
				const { title, disabled, computedName } = this.children[index];
				if (disabled) {
					this.$emit('disabled', title, title);
				} else {
					callInterceptor({
						interceptor: this.beforeChange,
						args: [computedName],
						done: () => {
							this.setCurrentIndex(index); //设置当前下标
							setTimeout(() => {
								this.lockedScrollspy = true;
								this.scrollToTop(); //滚动到顶
								this.scrollToCurrentContent(); //滚动到当前标签内容
							}, 0);
						}
					});

					this.$emit('click', computedName, title); // 标签点击事件
				}
			},
			// 更正活动选项卡的索引
			setCurrentIndexByName(name) {
				const matched = this.children.find(child => child.computedName === name);
				const defaultIndex = (this.children[0] || {}).index || 0;
				this.setCurrentIndex(matched ? matched.index : defaultIndex);
			},
			// 设置当前下标
			setCurrentIndex(currentIndex) {
				const newIndex = this.findAvailableTab(currentIndex); //查询可用tab
				if (!isDef(newIndex)) {
					return;
				}

				const shouldEmit = newIndex != this.currentIndex;
				const shouldEmitChange = this.currentIndex !== null;
				const { title, computedName, rendered } = this.children[newIndex];
				// 非滚动导航模式下,触发rendered事件
				if (this.isLazyRender && !this.scrollspy && !rendered) {
					this.$emit('rendered', computedName, title);
				}

				this.currentIndex = newIndex;
				if (shouldEmit) {
					//禁止重复切换
					this.$emit(emits[0], computedName); // 更新v-model绑定的值

					if (shouldEmitChange) {
						this.$emit('change', computedName, title);
					}
				}
			},
			// 查询可用tab
			findAvailableTab(index) {
				const diff = index < this.currentIndex ? -1 : 1;
				while (index >= 0 && index < this.tabs.length) {
					if (!this.tabs[index].disabled) {
						return index;
					}
					index += diff;
				}
			},
			// 获取动态的translateX、scrollLeft
			getDynamicValue(index) {
				return new Promise(resolve => {
					const { tabs } = this;
					this.getRect(`.yui-tab_${index}`).then(rect => {
						const { diffWidth, diffHeight } = this.tabs[index];
						const translateX = diffWidth + (rect?.width || 0) / 2 - this.lineWidthValue / 2;
						const translateY = diffHeight + (rect?.height || 0) / 2 - this.lineHeightValue / 2;
						const scrollLeft = translateX - this.halfWrapWidth;
						resolve({ translateX, scrollLeft, translateY });
					});
				});
			},
			// 设置底部线条位置
			async setLine() {
				try {
					const { currentIndex, tabs } = this;
					const { translateX, scrollLeft, translateY } = await this.getDynamicValue(currentIndex);
					if (this.isLine) {
						// 仅在 type="line" 时有效
						let transform = '';
						if (this.scrollY) {
							transform = `translateY(${isDef(translateY) ? `-${translateY}px` : '-100%'})`;
						} else {
							transform = `translateX(${isDef(translateX) ? `${translateX}px` : '-100%'})`;
						}
						this.$set(this.lineAnimatedStyle, 'transform', transform);
						this.$set(this.lineAnimatedStyle, 'transition', this.lineAnimated ? `transform ${this.duration}s linear` : 'none');
						this.lineAnimated = true; //是否开启标签栏动画
					}

					this.scrollIntoView(scrollLeft); //将激活的tab滚动到可见区域中
				} catch (e) {
					throw new Error('y-tabs setLine():', e);
				}
			},
			//将激活的tab滚动到可见区域中
			scrollIntoView(scrollLeft) {
				// 标签栏允许滚动:设置横向滚动条位置，scrollToCenter为true，当前标签则滚动至中心位置
				if (this.scrollX) {
					if (this.scrollToCenter) this.scrollLeft = scrollLeft;
					else this.scrollId = `tab_${this.currentIndex - 1}`;
				}
				if (this.scrollY) this.scrollId = `tab_${this.currentIndex}`;
			},
			// 滚动到顶
			scrollToTop() {
				//标签点击时页面回滚顶部
				if (!this.scrollspy && this.tabClickScrollTop) {
					setTimeout(function() {
						uni.pageScrollTo({ scrollTop: 0, duration: 0 });
					}, this.msDuration);
				}
			},
			// 滚动到当前标签内容
			async scrollToCurrentContent(immediate = false) {
				try {
					if (this.scrollspy) {
						const duration = immediate ? 0 : this.msDuration;
						const r = await this.children[this.currentIndex].getRect();
						let scrollTop = this.scrollTop + (r?.top || 0);
						// 标签栏水平展示时，需要减去offsetTop与标签栏高度
						if (this.direction === 'horizontal') {
							const wRect = await this.getRect('.yui-tabs__wrap');
							scrollTop = scrollTop - this.offsetTop;
							// #ifndef H5
							scrollTop -= wRect?.height || 0;
							// #endif
							// H5区域滚动要减去标签栏高度
							// #ifdef H5
							if (!this.pageScroll) scrollTop -= wRect?.height || 0;
							// #endif
						}

						if (this.pageScroll) {
							this.lockedScrollspy = true;
							//滚动导航、侧边栏导航模式下的页面级滚动
							uni.pageScrollTo({ scrollTop, duration });
							setTimeout(() => {
								this.lockedScrollspy = false;
							}, duration * 2 + 100);
						} else {
							// 区域滚动
							this.paneScrollTop = scrollTop - this.dependOffsetTop;
						}
					}
				} catch (e) {
					throw new Error('y-tabs scrollToCurrentContent():', e);
				}
			},
			// 状态变更
			changeStatus(newIdx, oldIdx) {
				if (!this.scrollspy) {
					//非滚动导航模式下
					(this.tabs[oldIdx] || {}).show = false; //隐藏旧tab的内容
					(this.tabs[newIdx] || {}).show = true; //显示当前tab的内容
					this.children[newIdx].rendered = true; //标记当前tab的内容渲染过
				}

				// 子数组标记激活状态
				this.children.forEach((child, index) => {
					child.active = newIdx === index;
				});
			},
			// 样式切换
			changeStyle() {
				// 非滚动导航模式下
				if (!this.scrollspy) {
					this.changeTrackStyle(false, this.duration); //改变标签内容滑动轨道样式
					this.changePaneStyle(); //改变标签内容样式
				}
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration, offsetWidth = 0) {
				duration = isNull(duration) ? this.duration : duration;
				if (this.animated) {
					// isSlide为true，表示左右滑动；false表示点击标签的转场动画
					this.trackStyle = {
						transform: isSlide ? `translate3d(${offsetWidth}px,0,0)` : `translateX(${-100 * this.currentIndex}%)`,
						transition: `transform ${duration}s ease-in-out`
					};
				}
			},
			// 改变标签内容样式
			async changePaneStyle() {
				try {
					const rect = await this.children[this.currentIndex].getRect();
					const height = rect && this.swipeAnimated ? rect.height : 0; //拖拽动画时才需要该高度
					this.tabs.forEach((tab, index) => {
						// 有拖动动画时或指定标签内容显示时，为visible
						const paneStyle = this.animated ? {
							visibility: this.swipeAnimated || tab.show ? 'visible' : 'hidden',
							height: tab.show ? 'auto' : height + 'px'
						} : {
							display: tab.show ? 'block' : 'none'
						};
						this.children[index].paneStyle = paneStyle;
					});
				} catch (e) {
					throw new Error('y-tabs changePaneStyle():', e);
				}
			},
			// 设置内容区域滚动时激活的下标
			setActivedIndexToScroll() {
				if (!this.scrollspy || this.lockedScrollspy) {
					return;
				}

				// 侧边栏导航需要延时50ms
				if (this.sidebarNav) {
					// if (this.timer) clearTimeout(this.timer);
					// this.timer = setTimeout(() => {
					this.getCurrIndexOnScroll().then(index => {
						this.setCurrentIndex(index); //设置当前下标
					});
					// }, 50);
				}

				// 滚动导航
				if (this.scrollNav) {
					this.getCurrIndexOnScroll().then(index => {
						this.setCurrentIndex(index); //设置当前下标
					});
				}
			},
			// 触摸内容的区域滚动时，不锁定滚动处理
			touchstartByPane() {
				this.lockedScrollspy = false;
			},
			// 内容区域的scroll-view的滚动事件
			handleScrollByPane(e) {
				this.scrollTop = e.detail.scrollTop;
			},
			touchmove() {}
		}
	};
</script>
<style lang="less" scoped>
	@import url('../css/index.less');
</style>
