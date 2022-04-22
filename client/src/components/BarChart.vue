<template>
  <div>
    <!-- this part is needed to load data for bar chart faster-->
    <p style="display: none">{{ axisData }}</p>
    <svg id="svg1"></svg>
    <svg id="svg2"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "BarChart",
  props: ["axisData"],
  computed: {
    filteredData() {
      return this.axisData.filter((el) => el.country);
    },
    maxValue() {
      return Math.max(...this.axisData.map((el) => el.y + el.z));
    },
  },
  methods: {
    renderBarChart() {
      const height = 370;
      const roundedHeight = Math.ceil((height + 1) / 10) * 10;
      const width = 550;
      let color = d3.scaleOrdinal(d3.schemeCategory10);

      // set the ranges
      const xScale = d3
        .scaleBand()
        .domain(this.filteredData.map((dataPoint) => dataPoint.x))
        .range([0, width])
        .padding(0.2);

      const yScale = d3
        .scaleLinear()
        .domain([0, this.maxValue])
        .range([roundedHeight, 10]);

      const container = d3
        .select("#svg1")
        .classed("chart-container", true)
        .style("height", `${roundedHeight}px`)
        .style("width", `${width}px`);

      // eslint-disable-next-line no-unused-vars
      container
        .selectAll(".bar")
        .data(this.filteredData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", xScale.bandwidth())
        .attr("height", (data) => roundedHeight - yScale(data.y + data.z))
        .attr("x", (data) => xScale(data.x))
        .attr("y", (data) => yScale(data.y + data.z))
        .attr("fill", (d) => color(d))
      // add the x Axis
      container
        .append("g")
        .attr("transform", "translate(0," + roundedHeight + ")")
        .style("font", "16px times")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-15, 15) rotate(-45)");

      // add the y Axis
      container
        .append("g")
        .style("font", "16px times")
        .call(d3.axisLeft(yScale));    
    },

    renderPieChart() {
      this.buildChart(this.filteredData, {
        name: (d) => 'Female: ' + d.x,
        value: (d) => (d.z/(d.y + d.z) * 100).toFixed(2),
        width: 550,
        height: 380,
      });
    },
    buildChart(
      data,
      {
        name = ([x]) => x, // given d in data, returns the (ordinal) label
        value = ([, y]) => y, // given d in data, returns the (quantitative) value
        title, // given d in data, returns the title text
        width = 350, // outer width, in pixels
        height = 300, // outer height, in pixels
        innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
        outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
        labelRadius = innerRadius * 0.2 + outerRadius * 0.8, // center radius of labels
        format = ",", // a format specifier for values (in the label)
        names, // array of names (the domain of the color scale)
        colors, // array of colors for names
        stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
        strokeWidth = 1, // width of stroke separating wedges
        strokeLinejoin = "round", // line join of stroke separating wedges
        padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
      } = {}
    ) {
      // Compute values.
      const N = d3.map(data, name);
      const V = d3.map(data, value);
      const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

      // Unique the names.
      if (names === undefined) names = N;
      names = new d3.InternSet(names);

      // Chose a default color scheme based on cardinality.
      if (colors === undefined) colors = d3.schemeSpectral[names.size];
      if (colors === undefined)
        colors = d3.quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          names.size
        );

      // Construct scales.
      const color = d3.scaleOrdinal(names, colors);

      // Compute titles.
      if (title === undefined) {
        const formatValue = d3.format(format);
        title = (i) => `${N[i]}\n${formatValue(V[i])}` + '%';
      } else {
        const O = d3.map(data, (d) => d);
        const T = title;
        title = (i) => T(O[i], i, data);
      }

      // Construct arcs.
      const arcs = d3
        .pie()
        .padAngle(padAngle)
        .sort(null)
        .value((i) => V[i])(I);
      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
      const arcLabel = d3
        .arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius);

      const svg = d3
        .select("#svg2")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 40%; height: auto; height: intrinsic;");

      svg
        .append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => color(N[d.data]))
        .attr("d", arc)
        .append("title")
        .text((d) => title(d.data));

      svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data((d) => {
          const lines = `${title(d.data)}`.split(/\n/);
          return d.endAngle - d.startAngle > 0.25 ? lines : lines.slice(0, 1);
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => (i ? null : "bold"))
        .text((d) => d);

      return Object.assign(svg.node(), { scales: { color } });
    },
  },
  mounted() {
    this.renderBarChart();
    this.renderPieChart();
  },
  updated() {
    this.renderBarChart();
    this.renderPieChart();
  },
  beforeUpdate() {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.chart-container, #svg2 {
  border: 2px solid navy;
  margin-top: 1em;
  margin-left: 20px;
  margin-right: auto;
  overflow: visible;
}

text {
  fill: navy;
  font-size: smaller;
}

path.domain {
  stroke: transparent;
}
</style>
