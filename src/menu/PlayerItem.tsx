import { SvgIcon, Select, MenuItem, Button } from "@mui/material";
import React from "react";
import { IconConfig } from "../IconConfig";

interface PlayerItemProps {
	AIName: string;
	index: number;
	iconConfig: IconConfig;
	removeItem: Function;
	changeAI: Function;
	canDelete: boolean;
	AIMenuOptions: string[];
}

export function PlayerItem({ AIName, index, iconConfig, removeItem, changeAI, canDelete, AIMenuOptions }: PlayerItemProps) {
	return (
		<div style={{ padding: "5px", border: "1px solid white", display: "flex", alignItems: "center" }}>
			<SvgIcon sx={{ margin: 1 }}>
				{React.createElement(iconConfig.playerIcons[index], {
					color: iconConfig.playerColors[index],
				})}
			</SvgIcon>
			<Select sx={{ margin: 1 }} variant="filled" id={`p${index + 1}`} value={AIName} onChange={(e) => changeAI(index, e.target.value)}>
				<MenuItem value="player">No AI</MenuItem>
				{AIMenuOptions.map((selectOption) => (
					<MenuItem value={selectOption}>{selectOption}</MenuItem>
				))}
			</Select>
			{canDelete && (
				<Button sx={{ margin: 1 }} onClick={() => removeItem(index)}>
					Remove
				</Button>
			)}
		</div>
	);
}
