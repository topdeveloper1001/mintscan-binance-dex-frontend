import * as React from "react";
import styles from "./Table.scss";
import classNames from "classnames/bind";
import {_, searchProperties, compareProperty} from "src/lib/scripts";

//  components
import {TableBody, Table, TableCell, TableHead, TableRow} from "@material-ui/core";
import SortButton from "src/components/common/SortButton";
import AssetTableRow, {ThinTableRow} from "../TableRow";
import Search from "../Search";

const cx = classNames.bind(styles);

const ORDER_COMPARE = Object.freeze(["mappedAsset", "marketCap", "price", "supply"]);
const SEARCH_PROPERTY = Object.freeze(["asset", "mappedAsset", "name"]);

// TODO
//  consider using react window if loading speeds are considered slow

export default function({assets}) {
	const [search, setSearch] = React.useState("");
	const [sort, setSort] = React.useState({orderBy: 1, asc: false});

	const displayAssets = React.useMemo(() => {
		let filteredAssets = [...assets];
		if (sort.orderBy === 1) return sort.asc ? _.reverse(filteredAssets) : filteredAssets;
		else if (_.includes([0, 2, 3], sort.orderBy)) return filteredAssets.sort((a, b) => compareProperty(a, b, ORDER_COMPARE[sort.orderBy], "id", sort.asc));
		console.error(`orderBy is not a possible value - ${sort.orderBy}`);

		return filteredAssets;
	}, [assets, sort]);

	const clickHeader = React.useCallback( num => {
		console.log("headerClicked - num", num);
		if(sort.orderBy === num) setSort(v => ({...v, asc: !sort.asc}));
		else {
			setSort({orderBy: num, asc: false});
		}
	}, [sort]);

	const tableHeaderRender = React.useMemo(
		() => (
			<TableHead>
				<TableRow>
					<TableCell className={cx("tableHeaderCell", "nameCell")}>
						<div className={cx("header-content")} onClick={e => clickHeader(0)}>
							<span>Name</span><SortButton asc={sort.asc} active={sort.orderBy === 0}/>
						</div>
					</TableCell>
					<TableCell className={cx("tableHeaderCell")} align='right'>
						<div className={cx("header-content")} onClick={e => clickHeader(1)}>
							<span>Market Cap(USD)</span><SortButton asc={sort.asc} active={sort.orderBy === 1}/>
						</div>
					</TableCell>
					<TableCell className={cx("tableHeaderCell")} align='right'>
						<div className={cx("header-content")} onClick={e => clickHeader(2)}>
							<span>Price(USD)</span><SortButton asc={sort.asc} active={sort.orderBy === 2}/>
						</div>
					</TableCell>
					<TableCell className={cx("tableHeaderCell")} align='right'>
						<div className={cx("header-content")} onClick={e => clickHeader(3)}>
							<span>Supply</span><SortButton asc={sort.asc} active={sort.orderBy === 3}/>
						</div>
					</TableCell>
					<TableCell className={cx("tableHeaderCell", "OwnerCell")} align='right'>
						Owner
					</TableCell>
				</TableRow>
			</TableHead>
		),
		[sort, clickHeader]
	);
	const tableBodyRender = React.useMemo(() => {
		return (
			<TableBody>
				{_.map(displayAssets, asset => {
					return (
						<AssetTableRow key={asset.id} asset={asset} displayNone={search !== "" ? !searchProperties(asset, SEARCH_PROPERTY, search.toUpperCase()) : false} />
					);
				})}
			</TableBody>
		);
	}, [displayAssets, search, sort]);

	const thinTableBodyRender = React.useMemo(() => {
		return (
			<div className={cx("table-thin")}>
				<div className={cx("thinTableRows-wrapper")}>
					{_.map(displayAssets, asset => (
						<ThinTableRow key={asset.id} asset={asset} displayNone={search !== "" ? !searchProperties(asset, SEARCH_PROPERTY, search.toUpperCase()) : false} />
					))}
				</div>
			</div>
		);
	}, [displayAssets, search, sort]);

	return (
		<div className={cx("AssetsTable-wrapper")}>
			<Search setSearch={setSearch} cx={cx} />
			<Table className={cx("table")}>
				{tableHeaderRender}
				{tableBodyRender}
			</Table>
			{thinTableBodyRender}
		</div>
	);
}
