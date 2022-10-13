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

const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
export const getColor = function(colorStr) {
	const matches = colorStr.match(rgbaRegex);
	if (matches && matches.length === 5) {
		return [
			matches[1],
			matches[2],
			matches[3],
			matches[4]
		];
	}
	return [];
};

export function toClass(classObj, ...classArray) {
	const arr = Object.keys(classObj || {}).filter(key => classObj[key])
	arr.push(...classArray)
	return arr.join(" ")
}
