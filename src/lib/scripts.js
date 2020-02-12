import React from "react";
import _ from "lodash";
import empty from "is-empty";
import moment from "moment";

export {_, empty};

export const omitProperty = (arr, valueArray) => _.map(arr, v => _.omit(v, valueArray));

export const nilCheck = arr => !_.every(arr, el => !_.isNil(el));

//  version 1 - it was quite shite
// export const recursiveExpand = (x, result) => {
// 	if (_.isObject(x) && !_.isArray(x)) return _.map(x, val => `${result} ${recursiveExpand(val, result)}`);
// 	else if (_.isArray(x)) return _.reduce(x, (res, val) => `${recursiveExpand(val, result)} ${res}`, result);
// 	else return `${result} ${x}`;
// };

//  version 2 - not bad, but can it be better?
export const recursiveExpand = (x, result) => {
	if (_.isObject(x) && !_.isArray(x)) return _.map(x, (val, key) => [`<${key}>`, recursiveExpand(val, result), `</${key}>`]);
	else if (_.isArray(x)) return _.reduce(x, (res, val) => `${recursiveExpand(val, result)} ${res}`, result);
	else return `${result} ${x}`;
};
//  ok it's 24:00 I'm gonna call it a night trying out useless stuff

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
	if (duration._data.days) ret = `${ret} ${duration._data.days}d`;
	if (duration._data.hours) ret = `${ret} ${duration._data.hours}h`;
	if (duration._data.minutes) ret = `${ret} ${duration._data.minutes}m`;
	if (duration._data.seconds) ret = `${ret} ${duration._data.seconds}s`;
	return ret + " ago";
};
