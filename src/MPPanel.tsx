import { MultiplayerState } from "./AppState";
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
			<div style={{ fontSize: "12px", display: "flex", justifyContent: "center" }}>Currently Connected ({players.length}/4)</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				{players.map((_, index) => (
					<div
						style={{ padding: "5px", borderBottom: playerIndex === index ? "3px white dotted" : "none", boxSizing: "border-box", width: "40px", float: "left" }}
					>
						{React.createElement(iconConfig.playerIcons[index], {
							color: iconConfig.playerColors[index],
						})}
					</div>
				))}
			</div>
		</div>
	);
}
