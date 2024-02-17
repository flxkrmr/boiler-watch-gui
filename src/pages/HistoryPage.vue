<template>
  <q-pull-to-refresh class="width-flex-fixed q-px-md" @refresh="refresh">
    <q-page class="width-flex-fixed q-px-md">
  		<h3>Verlauf</h3>
      <div class="row">
        <q-input class="col" @update:model-value="onTimeSinceChange" v-model="timeSince" type="number" />
        <q-select class="col" @update:model-value="onTimeSinceUnitChange" v-model="timeSinceUnit" :options="timeSinceUnitOptions" label="Einheit" />
      </div>
      <div class="row">
        <q-select class="col" multiple @update:model-value="onSensorsChange" v-model="sensors" :options="sensorOptions" label="Sensoren" />
      </div>
      <canvas id="bar-chart"></canvas>
    </q-page>
  </q-pull-to-refresh>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

const sensorMap = new Map([
  [ "sensor1" , "HZ Speicher Unten (P1)" ],
  [ "sensor2" , "HZ Speicher Mitte (P9)" ],
  [ "sensor3" , "HZ Speicher Mitte (P14)" ],
  [ "sensor4" , "HZ Speicher Oben (P20)" ],
  [ "sensor5" , "WW Speicher Unten" ],
  [ "sensor6" , "WW Speicher Mitte" ],
  [ "sensor7" , "WW Speicher Mitte" ],
  [ "sensor8" , "WW Speicher Open" ],
  [ "sensor9" , "Zirkulation Bad" ],
  [ "sensor10", "Zirkulation Küche" ],
  [ "sensor11", "Vorlauf FBH" ],
  [ "sensor12", "Rücklauf FBH" ],
  [ "sensor13", "Vorlauf HZ Speicherladung" ],
  [ "sensor14", "Rücklauf HZ Speicherladung" ],
  [ "sensor15", "Vorlauf HZ Rücklaufanhebung" ],
  [ "sensor16", "Rücklauf HZ Rücklaufanhebung" ],
  [ "sensor17", "HZ Speicher Oben" ],
  [ "sensor18", "HZ Speicher Unten" ],
  [ "sensor19", "Flur Raumtemperatur" ],
  [ "sensor20", "Außentemperatur" ],
]);

function refresh(done) {
  updateHistory()
  done()
}

const sensorOptions = []

sensorMap.forEach((value, key) => {
  sensorOptions.push({ label: value, value: key})
})

const timeSinceUnitOptions = [
  { label: "Sekunden", value: "Seconds" },
  { label: "Minuten", value: "Minutes" },
  { label: "Stunden", value: "Hours" },
  { label: "Tage", value: "Days" },
]

const timeSinceUnit = ref(timeSinceUnitOptions[1]);
const timeSince = ref(10);
const sensors = ref([])
var chart = null;

function onSensorsChange(value) {
  sensors.value = value
  updateHistory()
}

function onTimeSinceChange(value) {
  timeSince.value = value
  updateHistory()
}

function onTimeSinceUnitChange(value) {
  timeSinceUnit.value = value
  updateHistory()
}

function updateHistory() {
  const timeSinceDate = new Date();
  switch (timeSinceUnit.value?.value) {
    case "Seconds":
      timeSinceDate.setSeconds(timeSinceDate.getSeconds() - timeSince.value);
      break;
    case "Minutes":
      timeSinceDate.setMinutes(timeSinceDate.getMinutes() - timeSince.value);
      break;
    case "Hours":
      timeSinceDate.setHours(timeSinceDate.getHours() - timeSince.value);
      break;
    case "Days":
      timeSinceDate.setDate(timeSinceDate.getDate() - timeSince.value);
      break;
  }

  axios.get('http://127.0.0.1:8000/temperatures/since/' + timeSinceDate.getTime())
    .then((response) => {
      const chartData = createChartData(response.data)
      chart.data = chartData
      chart.update()
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

onMounted(() => {
  chart = createChart({});
  updateHistory();
})

function createChartData(data) {
  const datasets = sensors.value.map(sensor => {
    return {
      label: sensor.label,
      data: getValuesByName(data, sensor.value)
    }
  })
  console.log(datasets)
  return {
    labels: data.map(d => new Date(d.date)?.toLocaleTimeString()),
    datasets: datasets
  }
}

function createChart(chartData) {
  const ctx = document.getElementById("bar-chart")
  return new Chart(ctx, {
    type: 'line',
    data: chartData,
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
}

</script>
