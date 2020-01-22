class SpinningDots extends HTMLElement {
	constructor(){
		super()

		const computedStyle = window.getComputedStyle(this)
		const width = this._pxToInt(computedStyle.width, 28, 0);
		const circleRadius = this._pxToInt(computedStyle.strokeWidth, width / 14, 1)
		const circlesCount = parseInt(this.getAttribute('dots'), 10) || 0
		const root = this.attachShadow({mode: 'open'})

		root.innerHTML = `<div>
			${this.buildStyle(width, circleRadius * 2, circlesCount)}
			${this.buildTrail(width / 2 - circleRadius, circleRadius * 2)}
			${this.buildCircles(width, circlesCount, circleRadius)}
		</div>`
	}

	_pxToInt(value, defaultValue, threshold) {
		if (value === undefined || value === null) {
			return defaultValue
		}

		let int = parseInt(value.replace('px'), 10)

		if (int <= threshold) {
			return defaultValue
		}

		return int
	}

	buildTrail(radius, strokeWidth) {
		const width = radius * 2 + strokeWidth

		return `
			<svg
				class="trail"
				width="${width}"
				height="${width}"
				viewBox="0 0 ${width} ${width}"
				fill="none"
			>
				<circle
					cx="${width / 2}"
					cy="${width / 2}"
					r="${radius}"
					stroke="currentColor"
					stroke-width="${strokeWidth}"
					stroke-linecap="round"
				/>
			</svg>
		`
	}

	buildCircles(width, count, radius) {
		const halfWidth = width / 2
		const halfWidthMinusRadius = halfWidth - radius
		const partAngle = (Math.PI * 2) / count

		let circles = '';

		for	(let i = 0; i < count; i++) {
			const angle = i * partAngle
			const x = halfWidthMinusRadius * Math.sin(angle) + halfWidth
			const y = halfWidthMinusRadius * Math.cos(angle) + halfWidth

			circles += `<circle cx="${x}" cy="${y}" r="${radius}" fill="currentColor"/>`
		}

		return `
			<svg
				class="circles"
				width="${width}"
				height="${width}"
				viewBox="0 0 ${width} ${width}"
			>
				${circles}
			</svg>
		`
	}

	buildStyle(width, strokeWidth, circlesCount) {
		const perimeter = Math.PI * (width - strokeWidth)

		return `<style>
			:host {
				display: inline-block;
			}

			div {
				position: relative;
				width: ${width}px;
				height: ${width}px;
			}

			svg {
				position: absolute;
				top: 0;
				left: 0;
			}

			.circles {
				animation: spin 16s linear infinite;
			}

			@keyframes spin {
				from {transform: rotate(0deg)}
				to {transform: rotate(360deg)}
			}

			.trail {
				stroke-dasharray: ${perimeter};
				stroke-dashoffset: ${perimeter + perimeter / (circlesCount || 10)};
				animation: trail 1.6s cubic-bezier(.5, .15, .5, .85) infinite;
			}

			@keyframes trail {
				from {transform: rotate(0deg)}
				to {transform: rotate(720deg)}
			}

			.trail circle {
				animation: trailCircle 1.6s cubic-bezier(.5, .15, .5, .85) infinite;
			}

			@keyframes trailCircle {
				0% {stroke-dashoffset: ${perimeter + perimeter / (circlesCount || 10)};}
				50% {stroke-dashoffset: ${perimeter + 2.5 * perimeter / (circlesCount || 10)};}
				100% {stroke-dashoffset: ${perimeter + perimeter / (circlesCount || 10)};}
			}
		</style>`
	}
}

try	{
	customElements.define('spinning-dots', SpinningDots)
} catch (exception) {
	if (exception instanceof DOMException) {
		console.error('DOMException : ' + exception.message);
	} else {
		throw exception
	}
}
