class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="components/footer.css" />
    
      <footer>Copyright ©</footer>
    `;
  }
}

customElements.define("footer-component", Footer);
