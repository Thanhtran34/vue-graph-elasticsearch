<template>
  <div id="app">
    <h1>World Population visualization</h1>
    <p>
      <i
        >(Population by country from 1950-2022. Data shows the change in shape
        of population of country based on age in seven decades. Age Range: 0 -100+)</i
      >
    </p>
    <p><i><strong>Bar Chart</strong> shows the total population. <strong>Pie Chart</strong> shows the percentage of Female in each age group.</i></p>
    <br />
    <title>Data visualizasion</title>
    <form @submit.prevent="search('country', 'year')">
      <select v-model="selectedCountry">
        <option>Choose Country</option>
        <option
          v-for="(data, index) in countries"
          :key="index"
          v-bind:value="data.country"
        >
          {{ data.country }}
        </option>
      </select>
      <select v-model="selectedYear">
        <option>Choose Year</option>
        <option
          v-for="(data, index) in years"
          :key="index"
          v-bind:value="data.year"
        >
          {{ data.year }}
        </option>
      </select>
      <p>
        <a href="https://www.populationpyramid.net/" target="_blank"
          >Source From Kaggle</a
        >
      </p>
      <button @click="search('country', 'year')" class="btn btn-success">
        SEARCH
      </button>
    </form>
    <br />
    <BarChart :axisData="axisData" v-if="axisData.length > 0" />
  </div>
</template>

<script>
import Data from "./services/dataService.js";
import axios from "axios";
import BarChart from "./components/BarChart.vue";

export default {
  name: "App",
  components: {
    BarChart
  },
  data() {
    return {
      countries: Data.getListOfCountries(),
      years: Data.getListOfYears(),
      selectedCountry: "Choose Country",
      selectedYear: "Choose Year",
      selectedDiagram: "Choose Diagram",
      axisData: [],
      diagrams: [{ diagram: "Bar Chart" }, { diagram: "Pie Chart" }],
    };
  },
  methods: {
    search(country, year) {
      country = this.selectedCountry;
      year = this.selectedYear;
      axios
        .get(`${process.env.VUE_APP_URL}/search-country/${country}/${year}`)
        .then((response) => {
          this.axisData = response.data.records
            .filter((el) => el.Country === this.selectedCountry)
            .map((el) => ({
              x: el.Age,
              y: parseInt(el.Male),
              z: parseInt(el.Female),
              country: el.Country,
            }));
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

body {
  background-color: rgb(229, 221, 221);
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

select {
  margin-left: 10px;
  margin-bottom: 20px;
  width: auto;
  font-size: 1.1rem;
}

button {
  width: auto;
  height: auto;
  font-weight: bold;
  font-size: 1.2rem;
  background-color: rgb(113, 160, 190);
}

h1 {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  color: rgb(5, 74, 116);
}
</style>
