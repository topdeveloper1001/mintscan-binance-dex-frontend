import {useReducer, useEffect, useState, useCallback} from "react";
import axios from "axios";
import {empty} from "src/lib/scripts";

import reducer, {initialState, INIT, FETCHING, SUCCESS, ERROR} from "./reducer";

export default function(inputUrl, method = "get") {
	const [url, setUrl] = useState(inputUrl);
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState);
	const [fetch, setFetch] = useState(0);

	useEffect(() => {
		//  url is not yet set, do nothing
		if (empty(url)) return;

		let unmounted = false;
		let source = axios.CancelToken.source();
		dispatch(state, {type: FETCHING});
		axios[method](url, {
			cancelToken: source.token,
		})
			.then(res => {
				console.log(res);
				if (!unmounted) dispatch({type: SUCCESS, payload: {data: res.data}});
			})
			.catch(ex => {
				console.warn("error during fetch", ex);
				if (!unmounted) dispatch({type: ERROR, payload: {errorMessage: ex.message}});
			});
		return () => {
			unmounted = true;
			source.cancel("Cancel cleanup");
		};
	}, [fetch, url]);

	const requestRefetch = useCallback(() => {
		setFetch(v => v + 1);
	}, [setFetch]);
	return [{...state}, requestRefetch, setUrl];
}
