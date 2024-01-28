<template>
  <q-page class="width-flex-fixed q-px-md">
		<h3>Verlauf</h3>
    <canvas id="bar-chart"></canvas>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

function getMeasurement() {
  axios.get('http://127.0.0.1:8000/temperatures/since/1706353440029')
    .then((response) => {
      console.log(response.data
        .map(d => d.temperatures)
        .map(t => {
          return t
            .filter(temp => temp.name == "Sensor 1")
            .map(temp => temp.value)[0]
        })
        )
      createChart(response.data)
    })
}

function getValuesByName(data, name) {
  return data
    .map(d => d.temperatures)
    .map(t => {
      return t
        .filter(temp => temp.name == name)
        .map(temp => temp.value)[0]
    })
}

function createChart(data) {
  const ctx = document.getElementById("bar-chart")
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => new Date(d.date)?.toLocaleTimeString()),
      datasets: [
        {
          label: 'Sensor 1',
          data: getValuesByName(data, "P1")
        },
        {
          label: 'Sensor 2',
          data: getValuesByName(data, "P2")
        },
        {
          label: 'Sensor 3',
          data: getValuesByName(data, "P3")
        },
        {
          label: 'Sensor 4',
          data: getValuesByName(data, "P4")
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Hello'
      }
    }
  })
  return myChart
}

onMounted(() => {
  getMeasurement()
})

const measurements = ref([])
</script>
