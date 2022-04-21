<template>
  <div>
    <!-- this part is needed to load data for bar chart faster-->
    <p style="display: none">{{ axisData }}</p>
    <svg></svg>
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
    renderChart() {
      const height = 400;
      const roundedHeight = Math.ceil((height + 1) / 10) * 10;
      const width = 800;
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
        .select("svg")
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
        .attr("fill", d=>color(d));
      // add the x Axis
      container
        .append("g")
        .attr("transform", "translate(0," + roundedHeight + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-15, 15) rotate(-45)");

      // add the y Axis
      container
        .append("g")
        .call(d3.axisLeft(yScale));
    },
  },
  mounted() {
    this.renderChart();
  },
  updated() {
    this.renderChart();
  },
  beforeUpdate() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.chart-container {
  border: 1px solid navy;
  margin-left: auto;
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
