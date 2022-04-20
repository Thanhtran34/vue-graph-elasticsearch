<template>
  <div class="chart">
    <h3>{{title}}</h3>
    <form>
    <select v-model="selectedCountry" >
      <option v-for="country in countries" :key="country" :value="country">{{titleCase(country)}}</option>
    </select>
    <br />
    <select v-model="selectedYear" >
      <option v-for="year in years" :key="year" :value="year">{{titleCase(year)}}</option>
    </select>
    <br />
     <button v-on:click="search(country, year)" class="btn btn-success">Search</button>
    </form>
    <svg></svg>
  </div>
</template>

<script>
import Data from '../services/dataService.js'
export default {
  name: 'BarChart',
  countries: Data.getListOfCountries(),
  years: Data.getListOfYears(),
  title: ''
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
