class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="components/header.css" />

      <header>
        <h2>Header Logo</h2>
        <nav>
          <ul>
            <li><a href="index.html">Header link one</a></li>
            <li><a href="posts.html">Header link two</a></li>
            <li><a href="weather.html">Header link three</a></li>
          </ul>
        </nav>
      </header>
    `;
  }
}

customElements.define("header-component", Header);
