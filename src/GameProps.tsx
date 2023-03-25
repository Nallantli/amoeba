import { IconConfig } from "./IconConfig";

export type GameProps = {
	winLength: number,
	limit: number,
	delay: number,
	AINames: string[],
	iconConfig: IconConfig,
	AISelectOptions: { [key: string]: any }
};