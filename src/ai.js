export function basic(getValue) {
	return {
		doTurn: (last) => {
			let search_radius = 1;
			while (true) {
				let possible = [];
				for (let i = -search_radius; i <= search_radius; i++) {
					for (let j = -search_radius; j <= search_radius; j++) {
						if (getValue(i + last.x, j + last.y) == 0)
							possible.push((i + last.x) + "_" + (j + last.y));
					}
				}
				if (possible.length > 0) {
					let choice = possible[Math.floor(Math.random() * possible.length)];
					const element = document.getElementById(choice);
					element.click();
					return;
				}
				search_radius++;
			}
		}
	};
}