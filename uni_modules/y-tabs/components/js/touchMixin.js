function getDirection(x, y) {
	if (x > y) {
		return 'horizontal';
	}

	if (y > x) {
		return 'vertical';
	}

	return '';
}

export const touchMixin = {
	data() {
		return {
			direction: '',
			startX: '',
			startY: '',
			nextIndex: -1,
			moved: false, //是否为一次水平滑动
		};
	},
	methods: {
		touchStart(event) {
			if (!this.parent.swipeable) { return }
			this.resetTouchStatus();
			this.startX = event.touches[0].clientX;
			this.startY = event.touches[0].clientY;
		},
		touchMove(event) {
			if (!this.parent.swipeable) { return }
			const touch = event.touches[0];
			this.deltaX = touch.clientX < 0 ? 0 : touch.clientX - this.startX;
			this.deltaY = touch.clientY - this.startY;
			const offsetX = Math.abs(this.deltaX);
			const offsetY = Math.abs(this.deltaY);
			// 当距离大于某个值时锁定方向
			const lock_distance = 10;
			if (!this.direction || (offsetX < lock_distance && offsetY < lock_distance)) {
				this.direction = getDirection(offsetX, offsetY);
			}

			if (this.direction === "horizontal") { //水平滑动
				const { dataLen, contentWidth, currentIndex, tabs, swipeAnimated } = this.parent
				const { deltaX } = this
				// 如果当前为第一页内容，则不允许向右滑；最后一页内容，则不允许左滑
				if ((deltaX > 0 && currentIndex === 0) || (deltaX < 0 && currentIndex === dataLen - 1)) {
					return
				}
				this.nextIndex = currentIndex + (deltaX > 0 ? -1 : 1)
				if (tabs[this.nextIndex].disabled) { return } //禁用的标签不允许滑动

				this.moved = true //标记为一次水平滑动

				// 改变标签内容的样式，模拟拖动动画效果
				if (swipeAnimated) {
					const offsetWidth = contentWidth * currentIndex * -1 + deltaX
					this.parent.changeTrackStyle(true, 0, offsetWidth)
				}
			}
		},
		touchEnd() {
			if (!this.moved) { return }
			// if (!this.parent.swipeable) { return }
			const { deltaX, nextIndex } = this;
			const { dataLen, swipeThreshold } = this.parent
			if (Math.abs(deltaX) >= swipeThreshold) { //当滑动距离大于某个值时切换标签
				this.parent.setCurrentIndex(nextIndex)
			} else { //否则还原
				this.parent.changeTrackStyle(false)
			}
		},
		resetTouchStatus() {
			this.direction = '';
			this.deltaX = 0;
			this.deltaY = 0;
			this.newIndex = -1;
			this.moved = false;
		},
	}
}
