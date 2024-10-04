const base = "https://api.open-meteo.com/v1";
let fetchInterval;

const locations = {
  Bern: { desc: "Switzerland", lat: 46.948056, lon: 7.4475 },
  Banana: { desc: "Kiribati", lat: 1.866667, lon: -157.4 },
  Pyongyang: {
    desc: "Democratic People's Republic of Korea",
    lat: 39.016667,
    lon: 125.7475,
  },
  Hell: { desc: "Trondheim, Norway", lat: 63.444444, lon: 10.9225 },
  Oatmeal: {
    desc: "Texas, United States",
    lat: 30.696944,
    lon: -98.094444,
  },
};

async function fetchAllLocations() {
  const container = document.getElementById("forecast");
  let content = "";
  const latitudes = Object.values(locations)
    .map((location) => location.lat)
    .join(",");
  const longitudes = Object.values(locations)
    .map((location) => location.lon)
    .join(",");

  try {
    const response = await fetch(
      `${base}/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const metric = (i, key) =>
      `${data[i].current[key]}${data[i].current_units[key]}`;

    let i = 0;
    for (const [name, { desc }] of Object.entries(locations)) {
      // Weather code conversion is located in weathercodes.js
      const weather_code = data[i].current.weather_code;
      const daytime = data[i].current.is_day ? "day" : "night";

      content += `
        <div class="card">
          <div class="metrics">
            <div class="start">
              <p>${desc}</p>
              <p>${name}</p>
            </div>
            <div class="center">
              <img src="${
                weathercodes[weather_code][daytime].image
              }" alt="${weather_code}" />
              <h1>${metric(i, "temperature_2m")}</h1>
              <h5>Feels like ${metric(i, "apparent_temperature")}</h5>
            </div>
            <ul class="end">
              <li>
                <span>Precipitation:</span>
                <span>${metric(i, "precipitation")}</span>
              </li>
              <li>
                <span>Cloud cover:</span>
                <span>${metric(i, "cloud_cover")}</span>
              </li>
              <li>
                <span>Humidity:</span>
                <span>${metric(i, "relative_humidity_2m")}</span>
              </li>
              <li>
                <span>Wind:</span>
                <span>
                ${metric(i, "wind_speed_10m")}
                <span class="material-icons" style="transform: rotate(${
                  data[i].current.wind_direction_10m
                }deg);">&#xf1e3;</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="time">
            <code>
              <p>
                Updated:
                ${new Date(data[i].current.time).toLocaleTimeString("nb", {
                  timeZoneName: "short",
                })}
              </p>
              <p>
                Fetched:
                ${new Date().toLocaleTimeString("nb-NO", {
                  hour12: false,
                })}
              </p>
            </code>
          </div>
        </div>
      `;

      i++;
    }
  } catch (error) {
    clearInterval(fetchInterval);
    console.error(error);
    document
      .getElementsByTagName("main")[0]
      .insertAdjacentHTML(
        "beforeend",
        `<p>Failed to fetch content. See console for errors 😔</p>`
      );
    return;
  }

  container.innerHTML = content;
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllLocations();

  fetchInterval = setInterval(fetchAllLocations, 20000);
});
