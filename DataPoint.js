/**
 * DataPoint.js a web component for encapsulating a dependent/independent value
 * pair to be displayed as part of a bar chart.
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
