import * as React from "react";

import {_, refineAddress} from "src/lib/scripts";
import {txCheckFUBM, txCheckOrder, txCheckSend} from "../TxCase";
import {NavLink} from "react-router-dom";

import txTypes from "src/constants/txTypes";

const aBunch = [txTypes.DEX.LIST, txTypes.TOKENS.TIME_LOCK, txTypes.TOKENS.TIME_UNLOCK, txTypes.TOKENS.TIME_RELOCK];

export default function({type, txData, value, cx}) {
	let from = null;
	if (txCheckSend(type)) from = refineAddress(value?.inputs?.[0]?.address);
	else if (txCheckOrder(type)) from = refineAddress(value.sender);
	else if (txCheckFUBM(type) || _.find(aBunch, v => v === type)) from = refineAddress(value.from);
	else if (txTypes.COSMOS.VOTE === type) from = refineAddress(value.voter);
	else if (txTypes.COSMOS.PROPOSAL_SUBMIT) from = refineAddress(value.proposer);
	if (_.isString(from))
		return (
			<NavLink className={cx("blueColor")} to={`/account/${from}`}>
				{from}
			</NavLink>
		);
	return <>-</>;
}
