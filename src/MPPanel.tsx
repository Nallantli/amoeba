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
				{players.map(({ wins, name }, index) => (
					<div
						style={{
							paddingRight: "15px",
							paddingBottom: "5px",
							borderBottom: playerIndex === index ? "3px white dotted" : "3px black dotted",
							float: "left",
							position: "relative",
							display: "flex",
						}}
					>
						<div
							style={{
								width: "30px",
								padding: "4px",
								paddingLeft: 0,
							}}
						>
							{React.createElement(iconConfig.playerIcons[index], {
								color: iconConfig.playerColors[index],
							})}
						</div>
						<div>
							<div style={{ fontSize: "16px", alignContent: "center" }}>{name}</div>
							<div style={{ fontSize: "10px" }}>{wins} WINS</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
