export const SquareIcon = (props: { color: string }) => {
	return (
		<svg className="player-icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
			<path fill={props.color} d="M0,0V1000H1000V0ZM800,800H200V200H800Z" />
		</svg>
	);
};
