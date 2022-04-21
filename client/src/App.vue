<template>
  <div id="app">
    <h1>Data visualization</h1>
    <title>World Population</title>
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
      <br />
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
      <br />
      <button @click="search('country', 'year')" class="btn btn-success">
        SEARCH
      </button>
    </form>
    <br />
    <BarChart :axisData="axisData"/>
  </div>
</template>

<script>
import Data from "./services/dataService.js";
import axios from "axios";
import BarChart from "./components/BarChart.vue";

export default {
  name: "App",
  components: {
    BarChart,
  },
  data() {
    return {
      countries: Data.getListOfCountries(),
      years: Data.getListOfYears(),
      selectedCountry: "Choose Country",
      selectedYear: "Choose Year",
      axisData: []
    };
  },
  methods: {
    search(country, year) {
      country = this.selectedCountry;
      year = this.selectedYear;
      axios
        .get(`http://localhost:8080/search-country/${country}/${year}`)
        .then((response) => {
          this.axisData = response.data.records
                               .filter(el => el.Country === this.selectedCountry)
                               .map(el => ({x: el.Age, y: parseInt(el.Male), z: parseInt(el.Female), country: el.Country}));
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
  margin-top: 60px;
}

select {
  margin-bottom: 20px;
  width: auto;
}

button {
  width: auto;
  height: auto;
}
</style>
