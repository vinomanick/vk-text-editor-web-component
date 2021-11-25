import { VkButton } from "vk-text-editor";
import ReactDOM from "react-dom";

export class VkTextEditor extends HTMLElement {
  constructor() {
    super();
    // write element functionality in here
  }

  connectedCallback() {
    console.log("Vk editor element added to page.");
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    this.mount(mountPoint);
  }

  mount(mountPoint) {
    const props = {
      ...this.getProps(this.attributes, VkButton.propTypes),
      ...this.getEvents(VkButton.propTypes),
    };
    console.log(this.getEvents(VkButton.propTypes));
    ReactDOM.render(<VkButton {...props} />, mountPoint);
  }

  getProps(attributes, propTypes = {}) {
    return [...attributes]
      .filter((attr) => attr.name !== "style")
      .map((attr) => this.convert(propTypes, attr.name, attr.value))
      .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {});
  }

  convert(propTypes, attrName, attrValue) {
    const propName = Object.keys(propTypes).find(
      (key) => key.toLowerCase() === attrName
    );
    let value = attrValue;
    if (attrValue === "true" || attrValue === "false") {
      value = attrValue === "true";
    } else if (!isNaN(attrValue) && attrValue !== "") {
      value = +attrValue;
    } else if (/^{.*}/.exec(attrValue)) {
      value = JSON.parse(attrValue);
    }
    return { name: propName ? propName : attrName, value: value };
  }

  getEvents(propTypes = {}) {
    return Object.keys(propTypes)
      .filter((key) => /on([A-Z].*)/.exec(key))
      .reduce(
        (events, ev) => ({
          ...events,
          [ev]: (args) => this.dispatchEvent(new CustomEvent(ev, { ...args })),
        }),
        {}
      );
  }

  disconnectedCallback() {
    console.log("Vk editor element removed from page.");
  }

  adoptedCallback() {
    console.log("Vk editor element moved to new page.");
  }

  attributeChangedCallback(/*name, oldValue, newValue*/) {
    console.log("Vk editor element attributes changed.");
  }
}
customElements.define("vk-text-editor", VkTextEditor);
