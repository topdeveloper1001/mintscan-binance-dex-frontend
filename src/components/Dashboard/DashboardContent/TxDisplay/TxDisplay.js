import React from "react";
import cn from "classnames/bind";
import styles from "./TxDisplay.scss";

const cx = cn.bind(styles);

export default function(props) {
	return (
		<div className={cx("TxDisplay")}>
			TxDisplay
			<div>testtest</div>
		</div>
	);
}
