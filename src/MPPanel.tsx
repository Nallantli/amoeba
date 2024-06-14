import { MultiplayerState } from "./MultiplayerState";
import { IconConfig } from "./IconConfig";
import React from "react";

interface MPPanelProps {
	multiplayerState: MultiplayerState;
	iconConfig: IconConfig;
}

export function MPPanel({ multiplayerState, iconConfig }: MPPanelProps) {
	const { players, playerIndex, id } = multiplayerState;
	return (
		<div id="mp-panel">
			<div style={{ fontSize: "16px", display: "flex", justifyContent: "center", fontWeight: "bold" }}>{id}</div>
			<div style={{ fontSize: "12px", display: "flex", justifyContent: "center", marginBottom: "5px" }}>Currently Connected ({players.length}/4)</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				{players.map(({ wins }, index) => (
					<div
						style={{
							padding: "5px",
							borderBottom: playerIndex === index ? "3px white dotted" : "none",
							boxSizing: "border-box",
							width: "40px",
							float: "left",
							position: "relative",
						}}
					>
						{React.createElement(iconConfig.playerIcons[index], {
							color: iconConfig.playerColors[index],
						})}
						<span style={{ fontSize: "12px", position: "absolute", top: 0, right: 0 }}>{wins}</span>
					</div>
				))}
			</div>
		</div>
	);
}
