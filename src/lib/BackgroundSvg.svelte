<svg viewBox="0 0 100 100" width="100%" class="absolute top-16 -left-0 z-0">
	<polyline
		points="0,100 20,50 30,80 65,20 90,30 120,0"
		fill="none"
		stroke-width="0.50"
		class="stroke-emerald-300"
	/>
</svg>

<style>
	svg {
		height: calc(100% - 4rem);
	}
	polyline {
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
		animation: dash 8s linear 1s forwards;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
