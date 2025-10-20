/**
 * BarChart.js a web component for creating a bar chart on a webpage
 *
 * @author Tom Egan
 * @license 2-Clause BSD NON-AI License
 */
class DataPoint extends HTMLElement {
	static observedAttributes = ["label", "value"];

	constructor() {
		super();
	}

	get label() {
		return this.getAttribute("label") ?? "";
	}

	set label(label) {
		this.setAttribute("label", label);
	}

	get value() {
		return this.getAttribute("value") ?? "";
	}

	set value(value) {
		this.setAttribute("value", value);
	}
}

customElements.define("data-point", DataPoint);

class DataSeries extends HTMLElement {
	static observedAttributes = ["color"];

	constructor() {
		super();
	}

	get color() {
		return this.getAttribute("color") ?? "#69C";
	}

	set color(color) {
		this.setAttribute("color", color);
	}

	get data() {
		const data = {};

		Array.from(this.getElementsByTagName("data-point")).forEach((point) => {
			data[point.label] = Number.parseFloat(point.value);
		});

		return data;
	}
}

customElements.define("data-series", DataSeries);

class BarChart extends HTMLElement {
	static observedAttributes = ["dependent-axis-label", "independent-axis-label"];

	constructor() {
		self = super();
	}

	connectedCallback() {
		// content may not be ready so wait until next event cycle
		setTimeout(this.updateChart.bind(this));
	}

	updateChart() {
		const seriesColors = [];
		const seriesMaxValues = [];
		const chartData = {};
		const seriesIds = [];

		const dataSeries = Array.from(self.getElementsByTagName("data-series"));
		dataSeries.forEach((series, index) => {
			const seriesId = 'series' + index;
			seriesIds.push(seriesId);

			seriesColors.push(series.color);

			const data = series.data;
			seriesMaxValues.push(Math.max(...Object.values(data)));

			for (const key in data) {
				if (!Object.hasOwn(chartData, key)) {
					chartData[key] = {};
				}

				chartData[key][seriesId] = data[key];
			}
		});

		let styleRules = `
		:host {
			display: grid;
			grid-template-columns: 3em 2px repeat(${Object.keys(chartData).length}, 1fr);
			grid-template-rows: 1fr 2px 1.5em;
		}

		:host .dependent-axis {
			grid-row: 1;
			grid-column:2;
			background: #000;
		}

		:host .dependent-axis-label {
			writing-mode: sideways-lr;
			grid-row: 1;
			grid-column: 1;
			text-align: center;
		}

		:host .independent-axis {
			grid-row: 2;
			grid-column: 2 / -1;
			background: #000;
		}

		:host .independent-axis-label {
			grid-row: 3;
			grid-column: 2 / -1;
			text-align: center;
		}

		:host .bar {
			grid-row: 1;
			padding: 0 5px;
			display: flex;
			flex-direction: row;
			align-items: end;
		}

		:host .bar .fill {
			width: ${100 / seriesIds.length}%;
		}

		`;
		seriesColors.forEach((color, i) => {
			styleRules += `
			:host .bar .fill.series${i} {
				background: ${color}
			}
			`;
		});

		const style = document.createElement("style");
		style.textContent = styleRules;

		const shadow = this.attachShadow({mode:"open"});
		shadow.appendChild(style);

		const dependentAxisLabel = document.createElement("p")
		dependentAxisLabel.className = "dependent-axis-label";
		dependentAxisLabel.innerText = this.dependentAxisLabel;
		shadow.appendChild(dependentAxisLabel);

		const dependentAxis = document.createElement("div")
		dependentAxis.className = "dependent-axis";
		shadow.appendChild(dependentAxis);

		const maxValue = Math.max(...seriesMaxValues);
		for (const barLabel in chartData) {
			let bar = document.createElement("div");
			bar.className = "bar";
			seriesIds.forEach((seriesId) => {
				let barFill = document.createElement("div");
				barFill.className = "fill " + seriesId;
				let value = 0;
				if (Object.hasOwn(chartData[barLabel], seriesId)) {
					value = chartData[barLabel][seriesId];
				}
				barFill.style.height = 100 * value / maxValue + "%";
				barFill.title = barLabel + ": " + value;
				bar.appendChild(barFill);
			});
			shadow.appendChild(bar);
		}

		const independentAxis = document.createElement("div")
		independentAxis.className = "independent-axis";
		shadow.appendChild(independentAxis);

		const independentAxisLabel = document.createElement("p")
		independentAxisLabel.className = "independent-axis-label";
		independentAxisLabel.innerText = this.independentAxisLabel;
		shadow.appendChild(independentAxisLabel);
	}

	get dependentAxisLabel() {
		return this.getAttribute("dependent-axis-label") || "";
	}

	set dependentAxisLabel(label) {
		this.setAttribute("dependent-axis-label", label);
	}

	get independentAxisLabel() {
		return this.getAttribute("independent-axis-label") || "";
	}

	set independentAxisLabel(label) {
		this.setAttribute("independent-axis-label", label);
	}
}

customElements.define("bar-chart", BarChart);
