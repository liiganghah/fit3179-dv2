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
  actions: { export: true, source: false, compiled: false, editor: true },
  renderer: "svg"
};

for (const [id, spec] of charts) {
  const node = document.getElementById(id);
  embed(node, spec, options).catch((error) => {
    node.textContent = "This chart could not be drawn.";
    console.error(spec, error);
  });
}
