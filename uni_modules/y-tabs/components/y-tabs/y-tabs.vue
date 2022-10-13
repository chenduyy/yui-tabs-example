<template>
	<view class="yui-tabs" :class="[tabsClass]">
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="yui-tabs__depend"></view>
		<!-- 标签区域 -->
		<view class="yui-tabs__wrap" :style="[innerWrapStyle, wrapStyle]" :class="[wrapClass]">
			<view class="yui-tabs__nav-left"><slot name="nav-left"></slot></view>
			<scroll-view
				class="yui-tabs__scroll"
				:class="[scrollX ? 'yui-tabs__scroll--enable' : '']"
				:scroll-x="scrollX"
				:scroll-anchoring="true"
				enable-flex
				:scroll-left="scrollLeft"
				:scroll-into-view="!scrollToCenter ? scrollId : ''"
				scroll-with-animation
				:style="[scrollStyle]"
			>
				<view class="yui-tabs__nav" :class="[navClass]">
					<!-- 标签项 -->
					<view
						class="yui-tab"
						v-for="(tab, index) in tabs"
						:key="index"
						@tap.stop="onClick(index)"
						:id="`tab_${index}`"
						:class="[tabClass(index, tab), tab.titleClass]"
						:style="[tabStyle(index), tab.titleStyle]"
					>
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
			<view class="yui-tabs__nav-right"><slot name="nav-right"></slot></view>
		</view>

		<view v-if="isFixed && !isVertical" class="yui-tabs__placeholder" :style="[{ height: placeholderHeight + 'px' }]"></view>
		<!-- 标签内容 -->
		<view class="yui-tabs__content" :class="[contentClass]">
			<view class="yui-tabs__track" :class="[{ 'yui-tabs__track--scrollspy': scrollspy }]" :style="[trackStyle]"><slot></slot></view>
		</view>
	</view>
</template>
<script>
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
			currentIndex: -1, //当前选中下标
			scrollId: '', //值应为某子元素id（id不能以数字开头）；设置哪个方向可滚动，则在哪个方向滚动到该元素
			scrollLeft: 0, //设置横向滚动条位置
			// 标签栏底部线条动画相关
			lineWidthValue: 20, //底部线条宽度
			lineAnimated: false, //是否开启标签栏底部线条动画（首次不开启）
			lineAnimatedStyle: {
				transform: 'translateX(-100%) translateX(0%)',
				transition: 'none'
			}, //标签栏底部线条动画样式
			isFixed: false, //是否吸顶
			extraWidth: 0, //标签栏右侧额外区域宽度
			contentWidth: 0, //标签内容宽度
			halfWrapWidth: 0, //一半的wrap宽度
			placeholderHeight: 0, //标题栏占位高度
			windowHeight: 0, //屏幕高度
			paneHeight: 0, //标签内容当前默认的高度
			trackStyle: null, //标签内容滑动轨道样式
			lockedScrollspy: false, //锁定滚动导航模式下点击标题栏触发的滚动逻辑
			scrollTop: 0, //页面垂直滚动距离
			transparentBgColor: 'rgba(255,255,255,0)' //标题栏透明背景色
		};
	},
	computed: {
		// 滚动导航模式下标签栏是否垂直展示
		isVertical() {
			return this.direction === 'vertical';
		},
		// 样式风格是否为line
		isLine() {
			return this.type === 'line';
		},
		// 标签页class
		tabsClass() {
			return toClass({ 'yui-tabs--vertical': this.isVertical }, `yui-tabs--${this.type}`);
		},
		// 导航栏区域class
		wrapClass() {
			return toClass(
				{
					'yui-tabs__wrap--fixed': this.isFixed,
					'yui-tabs__wrap--transparent': this.transparent,
					'yui-tabs__wrap--vertical': this.isVertical
				},
				`yui-tabs__wrap--${this.type}`
			);
		},
		// 导航栏class
		navClass() {
			return toClass({ 'yui-tabs__nav--vertical': this.isVertical }, `yui-tabs__nav--${this.type}`);
		},
		// 内容卡片class
		contentClass() {
			return toClass({
				'yui-tabs__content--animated': this.animated,
				'yui-tabs__content--scrollspy': this.scrollspy,
				'yui-tabs__content--vertical': this.isVertical
			});
		},
		// 底部条class
		lineClass() {
			return toClass({ 'yui-tabs__line--vertical': this.isVertical });
		},
		// 导航栏区域样式
		innerWrapStyle() {
			const style = { background: !this.transparent ? this.background : this.transparentBgColor };
			if (this.type === 'card') style.borderColor = this.color;
			// 滚动吸顶下
			if (this.isFixed) {
				style.top = this.offsetTop + 'px';
				style.zIndex = this.zIndex;
			}
			return style;
		},
		// 滚动区域样式
		scrollStyle() {
			return {
				width: !this.isVertical ? `calc(100% - ${this.extraWidth}px)` : ''
			};
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
			return !this.ellipsis && this.tabs.length > this.scrollThreshold;
		},
		// 标签数量
		dataLen() {
			return this.tabs.length;
		},
		// 滑动动画时长(ms)
		msDuration() {
			return this.animated ? this.duration * 1000 : 0;
		},
		// 粘性布局下的滚动偏移量
		scrollOffset() {
			if (this.sticky) {
				return !this.isVertical ? this.offsetTop + this.placeholderHeight : this.offsetTop;
			} else {
				return 0;
			}
		},
		// 当前激活标签的name值
		currentName() {
			const activeTab = this.children[this.currentIndex];
			if (activeTab) {
				return activeTab.computedName;
			}
		},
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
	methods: {
		toJSON() {},
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
				...newValue
			});
			if (this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.init(); //初始化
				this.bindListener(); //监听事件
			}, 5);
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
			return toClass(
				{
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
			return {
				color: activated ? color : defColor,
				background: activated ? background : '',
				borderColor: activated ? borderColor : ''
			};
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
					const { stickyThreshold, offsetTop, scrollspy, lockedScrollspy, transparent } = that;

					// 粘性定位布局的吸顶处理
					that.getRect('.yui-tabs__depend').then(rect => {
						// TODO 优化触发边界值
						const bottom = rect ? rect.bottom : 0;
						that.isFixed = bottom - stickyThreshold <= offsetTop;
						// 	滚动时触发，仅在 sticky 模式下生效,{ scrollTop: 距离顶部位置, isFixed: 是否吸顶 }
						that.$emit('scroll', { scrollTop: that.scrollTop, isFixed: that.isFixed });
					});

					// 滚动导航模式下对选中标签的处理
					if (scrollspy && !lockedScrollspy) {
						that.getCurrIndexOnScroll().then(index => {
							that.setCurrentIndex(index); //设置当前下标
						});
					}

					// 标题栏透明渐变
					if (transparent) {
						let opacity = (e.scrollTop - offsetTop) / that.transparentOffset + that._A;
						opacity = Math.min(Math.max(that._A, opacity), 1);
						that.transparentBgColor = `rgba(${that._R},${that._G},${that._B},${opacity})`;
					}
				});
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
			//屏幕高度
			this.windowHeight = uni.getSystemInfoSync().windowHeight;

			//获取额外区域的宽度
			const [rect1, rect2] = await this.getRect('.yui-tabs__nav-left', '.yui-tabs__nav-right');
			const navleftWidth = rect1?.width || 0;
			const navRightWidth = rect2?.width || 0;
			this.extraWidth = navleftWidth + navRightWidth;

			//获取标签内容区域的宽度
			let rect = await this.getRect('.yui-tabs__content');
			this.contentWidth = rect?.width || 0;

			// 底部线条宽度
			rect = await this.getRect('.yui-tabs__line');
			this.lineWidthValue = rect?.width || 0;

			// 获取标题栏包裹层的rect
			rect = await this.getRect('.yui-tabs__wrap');
			this.halfWrapWidth = rect?.width / 2 || 0;
			this.placeholderHeight = rect?.height || 0;

			//获取标签容器距离视口左侧的left值
			rect = await this.getRect('.yui-tabs');
			const parentLeft = rect?.left || 0;

			// 添加额外属性
			this.tabs.forEach((tab, index) => {
				this.$set(tab, 'titleSlot', 'title' + index); ////标题插槽名，以"title"+下标命名,vue3不支持自定义标题插槽
				this.$set(tab, 'show', this.scrollspy); //是否显示内容（滚动导航模式默认显示）
			});

			// 计算每个tab的相关参数
			const selectors = this.tabs.map((_, index) => `.yui-tab_${index}`);
			const rects = await this.getRect(...selectors);
			let len = this.tabs.length - 1;
			this.tabs.forEach((tab, index) => {
				const [r] = rects.splice(0, 1);
				this.$set(tab, 'diffWidth', r ? r.left - parentLeft - navleftWidth : 0); //标签线条差量值
				this.$set(tab, 'translateY', r ? r.height * len * -1 : 0); //标签线条垂直偏移量
				len--;
			});

			this.setCurrentIndexByName(this[model.prop]);
			if (this.currentIndex !== this.children[0].index) {
				//非第一个标签页时内容滚动到指定位置
				setTimeout(() => {
					this.scrollToCurrentContent(true);
				}, 50);
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

			const shouldEmit = newIndex !== this.currentIndex;
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
					const { diffWidth } = this.tabs[index];
					const translateX = diffWidth + (rect?.width || 0) / 2 - this.lineWidthValue / 2;
					const scrollLeft = translateX - this.halfWrapWidth;
					resolve({ translateX, scrollLeft });
				});
			});
		},
		// 设置底部线条位置
		async setLine() {
			const { currentIndex, tabs } = this;
			const { translateX, scrollLeft } = await this.getDynamicValue(currentIndex);
			if (this.isLine) {
				// 仅在 type="line" 时有效
				let transform = '';
				if (this.isVertical) {
					const { translateY } = tabs[currentIndex];
					transform = `translateY(${isDef(translateY) ? translateY + 'px' : '-100%'}) translateY(-50%)`;
				} else {
					transform = `translateX(${isDef(translateX) ? translateX + 'px' : '-100%'}) translateX(0%)`;
				}
				this.$set(this.lineAnimatedStyle, 'transform', transform);
				this.$set(this.lineAnimatedStyle, 'transition', this.lineAnimated ? `transform ${this.duration}s linear` : 'none');
				this.lineAnimated = true; //是否开启标签栏动画
			}

			this.scrollIntoView(scrollLeft); //将激活的tab滚动到可见区域中
		},
		//将激活的tab滚动到可见区域中
		scrollIntoView(scrollLeft) {
			// 标签栏允许滚动:设置横向滚动条位置，scrollToCenter为true，当前标签则滚动至中心位置
			if (this.scrollX) {
				if (this.scrollToCenter) this.scrollLeft = scrollLeft;
				else this.scrollId = `tab_${this.currentIndex - 1}`;
			}
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
			if (this.scrollspy) {
				//滚动导航模式下
				this.lockedScrollspy = true;
				const duration = immediate ? 0 : this.msDuration;
				const r = await this.children[this.currentIndex].getRect();
				const offsetTop = this.direction === 'horizontal' ? this.offsetTop : 0;
				const scrollTop = Math.trunc(this.scrollTop + (r?.top || 0) - offsetTop);
				uni.pageScrollTo({ scrollTop, duration });
				setTimeout(() => {
					this.lockedScrollspy = false;
				}, duration * 2);
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
			const rect = await this.children[this.currentIndex].getRect();
			const height = rect && this.swipeAnimated ? rect.height : 0; //拖拽动画时才需要该高度
			this.tabs.forEach((tab, index) => {
				// 有拖动动画时或指定标签内容显示时，为visible
				const paneStyle = this.animated
					? {
							visibility: this.swipeAnimated || tab.show ? 'visible' : 'hidden',
							height: tab.show ? 'auto' : height + 'px'
					  }
					: {
							display: tab.show ? 'block' : 'none'
					  };
				this.children[index].paneStyle = paneStyle;
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('../css/index.less');
</style>
