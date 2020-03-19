import axios from "axios";
import consts from "src/constants/consts";

export const getAssets = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.ASSETS}`, {cancelToken});
};

export const getStatus = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.STATUS}`, {cancelToken});
};

export const getBasicData = (id, currency, cancelToken) => {
	return axios.get(`${consts.API_BASE}/market?id=${id}`, {cancelToken});
};

export const getMarketChartRange = (id, currency, from, to, cancelToken) => {
	// return axios.get(`${coinGeckoAPI}/coins/binancecoin/market_chart/range?id=${id}&vs_currency=${currency}&from=${from}&to=${to}`, {cancelToken});
	return axios.get(`${consts.API_BASE}/market/chart?id=${id}`, {cancelToken});
};

export const getTop4Assets = cancelToken => {
	return axios.get(`${consts.API_BASE}${consts.API.TOP_ASSETS}`, {cancelToken});
}


export const getGeckoMarketChartRange = (id="binancecoin", currency="USD", from, to, cancelToken) => {
	return axios.get(`${consts.API_COINGECKO.BASE}${consts.API_COINGECKO.GET_MARKET_CHART_RANGE(id, from, to)}`, {cancelToken});
}

export const getAssetImages = (cancelToken) => {
	return axios.get(`${consts.API_BASE}${consts.API.ASSET_IMAGES}`, {cancelToken});
}