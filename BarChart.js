/**
 * BarChart.js a webcomponent for creating a bar chart on a webpage
 *
 * @author Tom Egan
 * @license 2-Clause BSD NON-AI License
 */

class BarChart extends HTMLElement {
	static style =`
	:host { display: block }
	`;

	constructor() {
		super();
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: "open" });

		const e = document.createElement("p");
		e.innerText = "Hello World";
		shadow.appendChild(e);
	}
}

customElements.define("bar-chart", BarChart);
