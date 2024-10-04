const base = "https://jsonplaceholder.typicode.com";
const rows = 3;
const cols = 5;
let id = 1;

/**
 * Check if an element is visible in the viewport.
 * Source: https://stackoverflow.com/a/5354536
 */
function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

async function* fetchContent() {
  while (true) {
    try {
      const response = await fetch(`${base}/posts/${id}`);

      if (!response.ok && !(id > 1 && response.status === 404)) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.title || !data.body) {
        yield { type: "end" };
        break;
      }

      const card = `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.body}</p>
        </div>
      `;

      id++;
      yield { type: "content", card };
    } catch (error) {
      console.error(error);
      yield {
        type: "error",
        message: "Failed to fetch content. See console for errors.",
      };
      break;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("posts");
  const mainElement = document.getElementsByTagName("main")[0];
  const contentGenerator = fetchContent();

  await fetchNItems(contentGenerator, rows * cols, container, mainElement);

  document.addEventListener("scroll", async () => {
    if (checkVisible(document.getElementsByTagName("footer")[0])) {
      await fetchNItems(contentGenerator, rows, container, mainElement);
    }
  });
});

async function fetchNItems(generator, n, container, mainElement) {
  let cards = "";

  for (let i = 0; i < n; i++) {
    const result = await generator.next();
    if (result.done) break;

    const { type, card, message } = result.value;
    if (type === "content") {
      cards += card;
    } else if (type === "end") {
      mainElement.insertAdjacentHTML(
        "beforeend",
        `<p>You have reached the end 👋</p>`
      );
      break;
    } else if (type === "error") {
      mainElement.insertAdjacentHTML("beforeend", `<p>${message} 😔</p>`);
      break;
    }
  }

  container.insertAdjacentHTML("beforeend", cards);
}
