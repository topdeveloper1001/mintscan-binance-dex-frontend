import React from "react";
import _ from "lodash";
import empty from "is-empty";
import moment from "moment";

export {_, empty};

export const omitProperty = (arr, valueArray) => _.map(arr, v => _.omit(v, valueArray));

export const nilCheck = arr => !_.every(arr, el => !_.isNil(el));

export const reduceString = (str, from, end) => (str ? str.substring(0, from) + " ... " + str.substring(str.length - end) : "-");

export const setAgoTime = time => {
	const x = new moment();
	const y = new moment(time);
	const duration = moment.duration(x.diff(y));
	let ret = 0;
	// if (duration._data.years) ret = `${duration._data.years}years`;
	// else if (duration._data.months) ret = `${duration._data.months}months`;
	// else if (duration._data.days) ret = `${duration._data.days}days`;
	// else if (duration._data.hours) ret = `${duration._data.hours}h`;
	// else if (duration._data.minutes) ret = `${duration._data.minutes}m`;
	// else if (duration._data.seconds) ret = `${duration._data.seconds}s`;
	// return ret + " ago";

	// if (duration._data.years) ret = `${duration._data.years}years`;
	// if (duration._data.months) ret = `${duration._data.months}months`;
	// if (duration._data.days) ret = `${duration._data.days}d`;
	if (duration._data.hours) ret = `${ret === 0 ? "" : `${ret} `}${duration._data.hours}h`;
	if (duration._data.minutes) ret = `${ret} ${duration._data.minutes}m`;
	if (duration._data.seconds) ret = `${ret} ${duration._data.seconds}s`;
	return ret + " ago";
};

const removeCommas = str => _.replace(str, new RegExp(",", "g"), "");
const reverseString = str => removeCommas(_.toString(_.reverse(_.toArray(str))));

const recursiveReverse = input => {
	if (_.isArray(input)) return _.toString(_.reverse(_.map(input, v => recursiveReverse(v))));
	if (_.isString) return reverseString(input);
	return reverseString(`${input}`);
};
export const formatNumber = (v = 0, size = 3) => {
	let str = _.isNumber(v) ? `${v}` : `${Number(v)}`;
	if (empty(str)) return "NaN";
	let substr = str.split(".");
	str = reverseString(substr[0]);
	const regex = `.{1,${size}}`;
	const arr = str.match(new RegExp(regex, "g"));
	return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};

export const getPercentage = (num1 = 0, num2 = 100, decimal = 4) => {
	if (num2 === 0 || isNaN(num2) || isNaN(num2)) return `0.${_.repeat("0", decimal)}`;
	return `${Math.round((num1 / num2) * 100 * Math.pow(10, decimal)) / Math.pow(10, decimal)}`;
};

// TODO
//  make better
//  upgrade version if you find it better
//  delete if not
//  please consider your deadlines before working on this

//  version 1 - it was quite shite
// export const recursiveExpand = (x, result) => {
// 	if (_.isObject(x) && !_.isArray(x)) return _.map(x, val => `${result} ${recursiveExpand(val, result)}`);
// 	else if (_.isArray(x)) return _.reduce(x, (res, val) => `${recursiveExpand(val, result)} ${res}`, result);
// 	else return `${result} ${x}`;
// };

//  version 2 - not bad, but can it be better?
// export const recursiveExpand = (x, result) => {
// 	if (_.isObject(x) && !_.isArray(x)) return _.map(x, (val, key) => [`<${key}>`, recursiveExpand(val, result), `</${key}>`]);
// 	else if (_.isArray(x)) return _.reduce(x, (res, val) => `${recursiveExpand(val, result)} ${res}`, result);
// 	else return `${result} ${x}`;
// };
//  ok it's 24:00 I'm gonna call it a night trying out useless stuff

//  version 3 - I'm getting rid of undefined
const refined = v => (empty(v) ? "" : `${v} `);
export const recursiveExpand = (x, result) => {
	if (_.isObject(x) && !_.isArray(x)) return _.map(x, (val, key) => [`<${key}>`, recursiveExpand(val, result), `</${key}>`]);
	else if (_.isArray(x))
		return _.reduce(
			x,
			(res, val) => {
				const recurse = recursiveExpand(val, result);
				return `${refined(res)}${refined(recurse)}`;
			},
			result
		);
	else return `${refined(result)}${x}`;
};
