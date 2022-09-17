/**
 * 判断传入的值是否为空
 * @param {*} val 
 * @returns 
 */
export function isNull(val) {
	if (typeof val == "boolean") {
		return false;
	}
	if (typeof val == "number") {
		return false;
	}
	if (val instanceof Array) {
		if (val.length == 0) return true;
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === "{}") return true;
	} else {
		if (
			val == "null" ||
			val == null ||
			val == "undefined" ||
			val == undefined ||
			val == ""
		)
			return true;
		return false;
	}
	return false;
}

// 不为空
export function isDef(val) {
	return val !== undefined && val !== null;
}

// 是否是一个数字
export function isNumeric(val) {
	return /^\d+(\.\d+)?$/.test(val);
}

// 是一个对象
export function isObject(val) {
	return val !== null && typeof val === 'object';
}
// 是一个字符串
export function isString(val) {
	return Object.prototype.toString.call(val) === "[object String]"
}

// 空操作
export function noop() {}

// 是一个函数
export function isFunction(val) {
	return typeof val === 'function';
}

// 是一个promise对象
export function isPromise(val) {
	return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}



// 添加单位
export function addUnit(value) {
	if (!isDef(value)) {
		return undefined;
	}

	value = String(value);
	return isNumeric(value) ? `${value}px` : value;
}

// 获得角度
export function getAngle(angx, angy) {
	return Math.atan2(angy, angx) * 180 / Math.PI;
};

// 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
export function getDirection(startx, starty, endx, endy) {
	var angx = endx - startx;
	var angy = endy - starty;
	var result = 0;

	// 如果滑动距离太短
	if (Math.abs(angx) < 5 && Math.abs(angy) < 5) {
		return result;
	}

	var angle = getAngle(angx, angy);
	if (angle >= -135 && angle <= -45) {
		result = 1;
	} else if (angle > 45 && angle < 135) {
		result = 2;
	} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		result = 3;
	} else if (angle >= -45 && angle <= 45) {
		result = 4;
	}

	return result;
}

// 调用拦截器
export function callInterceptor(options) {
	const {
		interceptor,
		args,
		done
	} = options;

	if (interceptor) {
		const returnVal = interceptor(...args);
		if (isPromise(returnVal)) {
			returnVal.then((value) => {
				if (value) done();
			}).catch(noop);
		} else if (returnVal) {
			done();
		}
	} else {
		done();
	}
}

