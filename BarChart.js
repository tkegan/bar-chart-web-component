/**
 * BarChart.js a web component for creating a bar chart on a webpage
 *
 * @author Tom Egan
 * @license 2-Clause BSD NON-AI License
 */

class BarChart extends HTMLElement {
	static observedAttributes = ["dependent-axis-label"];

	constructor() {
		self = super();
	}

	connectedCallback() {
		// content may not be ready so wait until next event cycle
		setTimeout(this.updateChart.bind(this));
	}

	updateChart() {
		const dataPoints = Array.from(self.getElementsByTagName("data-point"));
		const maxValue = Math.max(...dataPoints.map((e) => Number.parseFloat(e.value)));

		const style = document.createElement("style");
		style.textContent = `
		:host {
			display: block;
		}

		:host > div {
			display: grid;
			height:100%;
			grid-template-columns: 3em 2px repeat(${dataPoints.length}, 1fr);
			grid-template-rows: 1fr 2px
		}
		
		:host .dependent-axis-label {
			writing-mode: sideways-lr;
			grid-row: 1;
			text-align: center;
		}

		:host .dependent-axis {
			grid-row: 1;
			background: #000;
		}

		:host .independent-axis {
			grid-row: 2;
			grid-column-start: 2;
			grid-column-end: -1;
			background: #000;
		}

		:host .bar {
			grid-row: 1;
			padding: 0 5px;
			display: flex;
			flex-direction: column;
			justify-content: end;
		}

		:host .bar .fill {
			background: #69C;
		}
		`;

		const chart = document.createElement("div");

		const dependentAxisLabel = document.createElement("p")
		dependentAxisLabel.className = "dependent-axis-label";
		dependentAxisLabel.innerText = this.dependentAxisLabel;
		chart.appendChild(dependentAxisLabel);

		const dependentAxis = document.createElement("div")
		dependentAxis.className = "dependent-axis";
		chart.appendChild(dependentAxis);

		const independentAxis = document.createElement("div")
		independentAxis.className = "independent-axis";
		chart.appendChild(independentAxis);

		dataPoints.forEach((dataPoint) => {
			let bar = document.createElement("div");
			bar.className = "bar";

			let barFill = document.createElement("div");
			barFill.className = "fill";
			barFill.style.height = 100 * dataPoint.value / maxValue + "%";
			barFill.title = dataPoint.value;
			bar.appendChild(barFill);
			chart.appendChild(bar);
		});

		const shadow = this.attachShadow({mode:"open"});
		shadow.appendChild(style);
		shadow.appendChild(chart);
	}

	get dependentAxisLabel() {
		return this.getAttribute("dependent-axis-label") || "";
	}

	set dependentAxisLabel(label) {
		this.setAttribute("dependent-axis-label", label);
	}
}

customElements.define("bar-chart", BarChart);
