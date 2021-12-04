export function flatten(x: number, d: number): number {
	while (x < 0)
		x += d;
	return x % d;
}

/* carter code */
export function fib(n: number): number {
	if (n === 1 || n === 0)
		return n;
	else
		return fib(n - 2) + fib(n - 1);
}