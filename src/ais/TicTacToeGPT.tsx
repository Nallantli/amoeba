import OpenAI from "openai";
import { GameState } from "../GameState";
import { AI } from "../game/AI";

const openai = new OpenAI({ apiKey: "use ur own", dangerouslyAllowBrowser: true });

export class TicTacToeGPT extends AI {
	async queryAI(gameState: GameState) {
		const { placements, turn } = gameState;
		const placementsText = placements.map(({ x, y, v }) => `Player ${v - 1}: ${x},${y}`).join("\n");
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: `You are an AI that plays a version of TicTacToe on an infinite grid, where coordinates extend infinitely in both positive and negative directions. There are a total of ${this.pCount} players. You will be given an array of past moves, in the format "Player P: X, Y", where P is the ID of the player, X is the position on the X axis where that player has claimed a space, and Y is the position on the Y axis where that player has claimed a space. You are Player ${turn}. Your goal is to claim ${this.winLength} spaces in a line before any other players. To successfully create a line, the claimed spaces need to be owned by the same player, must be consecutive, and must form a straight line. You also need to stop the other players from claiming ${this.winLength} spaces in a line. A player cannot make a move on a space that has already been claimed, and a player cannot use a space claimed by a different player as a part of his strategy. Respond with the most optimal move for Player ${turn} where the entire response is in the format of "X,Y | R", where X is the coordinate on the X-axis of the space, Y is the coordinate on the Y-axis of the space, and R is your analysis of the board and the reason why you chose that space.`,
				},
				{
					role: "user",
					content: placementsText,
				},
			],
		});
		return completion.choices[0].message.content;
	}

	async doTurn(gameState: GameState) {
		if (gameState.placements.length === 0) {
			return { x: 0, y: 0 };
		}
		const request = async () => {
			const query = await this.queryAI(gameState);
			try {
				if (query) {
					const answer = query.split("|")[0].split(",");
					if (Number.isNaN(Number(answer[0].trim())) || Number.isNaN(Number(answer[1].trim()))) {
						throw new Error();
					}
					const x = Number(answer[0].trim());
					const y = Number(answer[1].trim());
					if (gameState.placements.find((placement) => placement.x === x && placement.y === y)) {
						throw new Error();
					}
					return { x, y };
				}
				throw new Error();
			} catch (Error) {
				console.error(query);
				return null;
			}
		};
		for (let i = 0; i < 5; i++) {
			const move = await request();
			if (move) {
				return move;
			}
		}
		throw new Error("Attempted 5 times, no successes, destroying webpage, launching nukes.");
	}
}
