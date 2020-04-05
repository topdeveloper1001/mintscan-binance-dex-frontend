import React from "react";
import cn from "classnames/bind";
import style from "./Account.scss";
import consts from "src/constants/consts";
import {_, empty} from "src/lib/scripts";
//  components
import AssetTxs from "src/components/Account/AssetTxs";
import PageTitle from "src/components/common/PageTitle";
import TitleWrapper from "src/components/common/TitleWrapper";
import Address from "src/components/Account/Address";
import NotFound from "src/components/common/NotFound";
//  hooks
import {useGetPrices, useMultiFetch, usePrevious} from "src/hooks";

const cx = cn.bind(style);

const baseURL = `${consts.API_BASE}${consts.API.ACCOUNT}/`;
export default function Account(props) {
	const account = props.match.params.account;
	const prevAccount = usePrevious(account);
	const urlList = React.useMemo(() => [`${consts.API_BASE}${consts.API.ACCOUNT_TXS(account)}`, `${baseURL}${account}`], [account]);
	const [state, , setUrls] = useMultiFetch(urlList);
	const [txData, assetData] = [
		state.data?.[0]?.txArray && !state.loading[0] ? state.data?.[0]?.txArray : consts.DEFAULT_ARRAY,
		state.data?.[1] && !state.loading[1] ? state.data?.[1] : consts.DEFAULT_ARRAY,
	];

	const [prices, setTargetAssets] = useGetPrices(consts.NUM.ASSET_REFETCH_PRICE_INTERVAL_MS);
	// TODO
	//  attempt at keeping account data up-to-date(refetch every x seconds)
	//  fix this to work in the future
	// React.useEffect(() => {
	// 	if (!account) return;
	// 	const interval = setInterval(() => {
	// 		console.log(`refetch - ${account}`);
	// 		refetch();
	// 	}, consts.NUM.ACCOUNT_REFETCH_INTERVAL_MS);
	// 	return () => clearInterval(interval);
	// }, [account, refetch]);

	// React.useEffect(() => {
	// 	if (history.action === "PUSH" || (history.action === "POP" && !empty(state.data) && state.data.address !== account)) {
	// 		setUrl(`${baseURL}${account}`);
	// 	}
	// }, [account, history.action, refetch, setUrl, state.data]);

	//  when data from address arrives, set the useGetPrice hook to start
	React.useEffect(() => {
		if (empty(assetData?.balances)) return;
		setTargetAssets(_.map(assetData.balances, v => v.symbol));
	}, [setTargetAssets, assetData]);

	//  refetch when account has changed(url)
	React.useEffect(() => {
		if (!empty(assetData) && account !== prevAccount) {
			setUrls(urlList);
		}
	}, [urlList, prevAccount, assetData, account, setUrls]);

	const assetTxs = React.useMemo(
		() => <AssetTxs account={account} prices={prices} balances={assetData?.balances ? assetData.balances : consts.DEFAULT_ARRAY} txData={txData} />,
		[prices, assetData, txData, account]
	);

	const displayAddress = React.useMemo(() => <Address account={assetData ? assetData : {}} prices={prices} />, [assetData, prices]);

	const render = React.useMemo(
		() => (
			<div className={cx("Account-wrapper")}>
				<TitleWrapper>
					<PageTitle title={"Account Details"} />
				</TitleWrapper>
				{state.error ? (
					<NotFound altText={"Account was not found"} />
				) : (
					<>
						{displayAddress}
						{assetTxs}
					</>
				)}
			</div>
		),
		[displayAddress, assetTxs, state.error]
	);
	if ((!state.loading && (assetData?.address === "" || assetData?.error_code)) || account === "notFound") return <NotFound />;
	return render;
}
