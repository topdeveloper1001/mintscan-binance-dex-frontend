import * as React from "react";

import {_, refineAddress} from "src/lib/scripts";
import {txCheckFUBM, txCheckOrder, txCheckSend} from "../TxCase";
import {NavLink} from "react-router-dom";

import txTypes from "src/constants/txTypes";

const aBunch = [txTypes.DEX.LIST, txTypes.TOKENS.TIME_LOCK, txTypes.TOKENS.TIME_UNLOCK, txTypes.TOKENS.TIME_RELOCK];

export default function({type, txData, value, cx}) {
	let from = null;
	if (txCheckSend(type)) from = refineAddress(value?.outputs?.[0]?.address);
	else if (txCheckOrder(type)) from = refineAddress(value.sender);
	else if (txCheckFUBM(type) || _.find(aBunch, v => v === type)) from = refineAddress(value.from);
	else if (txTypes.COSMOS.VOTE === type) from = refineAddress(value.voter);
	if (_.isString(from))
		return (
			<NavLink className={cx("blueColor")} to={`/accounts/${from}`}>
				{from}
			</NavLink>
		);
	return <>-</>;
}
