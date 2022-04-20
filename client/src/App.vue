<template>
  <div id="app">
    <h1>Data visualization</h1>
    <BarChart msg="Welcome to Your BarChart app"/>
  </div>
</template>

<script>
import BarChart from './components/BarChart.vue'

export default {
  name: 'App',
  components: {
    BarChart
  }
}
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
</style>
