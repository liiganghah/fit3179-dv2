import embed from "https://cdn.jsdelivr.net/npm/vega-embed@6.29.0/+esm";

const charts = [
  ["chart-isotype", "specs/09-isotype.vl.json"],
  ["chart-slope", "specs/01-slope.vl.json"],
  ["chart-heatmap", "specs/02-heatmap.vl.json"],
  ["chart-adults", "specs/03-adults.vl.json"],
  ["chart-marimekko", "specs/04-marimekko.vl.json"],
  ["chart-states", "specs/06-choropleth.vl.json"],
  ["chart-bump", "specs/05-bump.vl.json"],
  ["chart-waterfall", "specs/10-waterfall.vl.json"],
  ["chart-treemap", "specs/08-treemap.vl.json"],
  ["chart-symbols", "specs/07-symbols.vl.json"],
  ["chart-flows", "specs/11-flow.vl.json"]
];

const options = {
  actions: false,
  renderer: "svg"
};

function lines(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

function fill(parent, parts) {
  parts.forEach((line, index) => {
    if (index) parent.append(document.createElement("br"));
    parent.append(document.createTextNode(line));
  });
}

function placeTitle(node, title) {
  const text = lines(title && title.text);
  if (!text.length) return;
  const head = document.createElement("div");
  head.className = "chart-head";
  const heading = document.createElement("h3");
  fill(heading, text);
  head.append(heading);
  const subtitle = lines(title.subtitle);
  if (subtitle.length) {
    const note = document.createElement("p");
    fill(note, subtitle);
    head.append(note);
  }
  node.before(head);
}

for (const [id, url] of charts) {
  const node = document.getElementById(id);
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((spec) => {
      placeTitle(node, spec.title);
      delete spec.title;
      if (id === "chart-isotype") {
        const avail = node.clientWidth || 480;
        const step = Math.max(28, Math.min(39, Math.floor((avail - 8) / 10)));
        spec.width = { step };
        spec.height = { step };
      }
      return embed(node, spec, options);
    })
    .then((result) => {
      if (id === "chart-isotype") return;
      let last = 0;
      const redraw = () => {
        const width = node.clientWidth;
        if (!width || width === last) return;
        last = width;
        result.view.resize().run();
      };
      requestAnimationFrame(redraw);
      if (window.ResizeObserver) new ResizeObserver(redraw).observe(node);
    })
    .catch((error) => {
      node.textContent = "This chart could not be drawn.";
      console.error(url, error);
    });
}
