(function () {
  const METHOD1 = [
    [0.61, 0.82, 0.98, 0.97, 0.95, 0.74],
    [0.77, 0.96, 1.0, 1.0, 0.99, 0.83],
    [0.65, 0.91, 0.99, 1.0, 0.97, 0.9],
    [0.43, 0.62, 0.9, 0.92, 0.81, 0.5],
  ];

  const METHOD2 = [
    [0.0, 0.0, 0.0, 0.05, 0.0, 0.0],
    [0.0, 0.0, 0.12, 0.24, 0.02, 0.0],
    [0.0, 0.0, 0.49, 0.3, 0.02, 0.0],
    [0.0, 0.0, 0.03, 0.0, 0.0, 0.0],
  ];

  const X_LABELS = [20, 22, 24, 26, 28, 30];
  const Y_LABELS = [55, 60, 65, 70];

  // Matplotlib Greens sampled from linspace(0.05, 0.68, 256) — matches heatmap script
  const GREENS_CMAP = [
    [0.0, "#f0f9ed"],
    [0.125, "#e3f4de"],
    [0.25, "#d1edca"],
    [0.375, "#bbe4b5"],
    [0.5, "#a4da9e"],
    [0.625, "#88cd86"],
    [0.75, "#69be70"],
    [0.875, "#49af61"],
    [1.0, "#339c51"],
  ];

  function formatMatrix(matrix) {
    return matrix.map((row) => row.map((value) => value.toFixed(2)));
  }

  function buildHeatmapTrace(matrix, textColor, showScale, colorbar) {
    return {
      type: "heatmap",
      z: matrix,
      x: X_LABELS,
      y: Y_LABELS,
      text: formatMatrix(matrix),
      texttemplate: "%{text}",
      textfont: {
        family: "IBM Plex Mono, monospace",
        size: 16,
        color: textColor,
      },
      colorscale: GREENS_CMAP,
      zmin: 0,
      zmax: 1,
      showscale: showScale,
      colorbar: colorbar,
      xgap: 2,
      ygap: 2,
      hovertemplate:
        "Inclination: %{y} deg<br>" +
        "Spacing: %{x} cm<br>" +
        "Success rate: %{z:.2f}<extra></extra>",
    };
  }

  function renderSuccessRateHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof Plotly === "undefined") {
      return;
    }

    const traces = [
      Object.assign(
        buildHeatmapTrace(METHOD1, "white", false, undefined),
        { xaxis: "x", yaxis: "y" }
      ),
      Object.assign(
        buildHeatmapTrace(METHOD2, "black", true, {
          title: {
            text: "Success rate",
            font: { family: "IBM Plex Mono, monospace", size: 16 },
            side: "right",
            pad: 28,
          },
          tickfont: { family: "IBM Plex Mono, monospace", size: 12 },
          len: 0.85,
          thickness: 18,
          xpad: 8,
        }),
        { xaxis: "x2", yaxis: "y2" }
      ),
    ];

    const axisStyle = {
      titlefont: { family: "IBM Plex Mono, monospace", size: 16 },
      tickfont: { family: "IBM Plex Mono, monospace", size: 13 },
      showgrid: false,
      zeroline: false,
      ticks: "outside",
      mirror: false,
      showline: false,
    };

    const layout = {
      font: { family: "IBM Plex Mono, monospace" },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      margin: { l: 65, r: 90, t: 60, b: 65 },
      xaxis: Object.assign({}, axisStyle, {
        domain: [0.0, 0.46],
        title: { text: "Spacing, <i>z</i> (cm)" },
        tickmode: "array",
        tickvals: X_LABELS,
        ticktext: X_LABELS.map((value) => value.toFixed(2)),
        anchor: "y",
      }),
      yaxis: Object.assign({}, axisStyle, {
        domain: [0.0, 1.0],
        title: { text: "Inclination, φ (deg)" },
        tickmode: "array",
        tickvals: Y_LABELS,
        ticktext: Y_LABELS.map(String),
        autorange: "reversed",
        anchor: "x",
      }),
      xaxis2: Object.assign({}, axisStyle, {
        domain: [0.50, 0.98],
        title: { text: "Spacing, <i>z</i> (cm)" },
        tickmode: "array",
        tickvals: X_LABELS,
        ticktext: X_LABELS.map((value) => value.toFixed(2)),
        anchor: "y2",
      }),
      yaxis2: Object.assign({}, axisStyle, {
        domain: [0.0, 1.0],
        showticklabels: false,
        autorange: "reversed",
        anchor: "x2",
      }),
      annotations: [
        {
          text: "<b>LadderMan</b>",
          x: 0.5,
          y: 1.08,
          xref: "x domain",
          yref: "paper",
          xanchor: "center",
          showarrow: false,
          font: { family: "IBM Plex Mono, monospace", size: 18 },
        },
        {
          text: "<b>Baseline</b>",
          x: 0.5,
          y: 1.08,
          xref: "x2 domain",
          yref: "paper",
          xanchor: "center",
          showarrow: false,
          font: { family: "IBM Plex Mono, monospace", size: 18 },
        },
      ],
    };

    const config = {
      responsive: true,
      displayModeBar: false,
      displaylogo: false,
    };

    Plotly.newPlot(container, traces, layout, config);

    window.addEventListener("resize", function () {
      Plotly.Plots.resize(container);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderSuccessRateHeatmap("success-rate-heatmap");
  });
})();
