<template>
  <q-pull-to-refresh class="width-flex-fixed q-px-md" @refresh="refresh">
    <q-page>
      <h2 v-if="!connected">Not connected</h2>
      <div v-if="connected" class="q-mt-md q-pl-md">
        <q-card class="row q-mb-md bg-grey-11 q-mr-md">
          <q-card-section class="full-width">
            <div class="row full-width">
              <div class="col-12 col-md q-ma-xs">
                <TemperatureCard name="Außentemperatur" :value="temperatures.sensor20.toString()" />
              </div>
              <div class="col-12 col-md q-ma-xs">
                <TemperatureCard name="Raumtemperatur EG" :value="temperatures.sensor19.toString()" />
              </div>
              <div class="col-12 col-md q-ma-xs">
                <TemperatureCard name="Letzte Messung" :value="lastUpdatedReadable" nonTemperature />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="row">
          <div class="col-6 col-md-3 q-pr-md">
            <q-card class="bg-blue-11 row q-mb-md">
              <q-card-section class="full-width">
                <div class="row text-subtitle2">Warmwasser Speicher</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P10" :value="temperatures.sensor8.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P04" :value="temperatures.sensor7.toString()" />
                </div>
                <div class="row text-subtitle2"> Solaranhebung </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P07" :value="temperatures.sensor6.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P02" :value="temperatures.sensor5.toString()" />
                </div>
              </q-card-section>
            </q-card>
            <q-card class="row bg-cyan-11 q-mb-md">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Warmwasser Zirkulation</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Bad" :value="temperatures.sensor9.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Küche" :value="temperatures.sensor10.toString()" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-6 col-md-3 q-pr-md">
            <q-card class="row bg-pink-11 q-mb-md">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Fußbodenheizung</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Vorlauf" :value="temperatures.sensor11.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Rücklauf" :value="temperatures.sensor12.toString()" />
                </div>
              </q-card-section>
            </q-card>
            <q-card class="row bg-yellow-11">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Wettervorhersage</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Datum" :value="weatherForecast.date" nonTemperature />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Min" :value="weatherForecast.min?.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Max" :value="weatherForecast.max?.toString()" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-6 col-md-3 q-pr-md">
            <q-card class="bg-amber-11 q-mb-md row">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Heizung Rücklaufanhebung</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Vorlauf" :value="temperatures.sensor15.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Rücklauf" :value="temperatures.sensor16.toString()" />
                </div>
              </q-card-section>
            </q-card>
            <q-card class="row bg-red-11">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Heizung Speicherladung</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Rücklauf" :value="temperatures.sensor13.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="Rücklauf" :value="temperatures.sensor14.toString()" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-6 col-md-3 q-pr-md">
            <q-card class="row bg-pink-11 q-mb-md">
              <q-card-section class="full-width">
                <div class="text-subtitle2">Heizung Speicher</div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P20" :value="temperatures.sensor4.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P17" :value="temperatures.sensor17.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P14" :value="temperatures.sensor3.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P11" :value="temperatures.sensor18.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P09" :value="temperatures.sensor2.toString()" />
                </div>
                <div class="row q-mb-sm full-width">
                  <TemperatureCard name="P01" :value="temperatures.sensor1.toString()" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

      </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import TemperatureCard from "components/TemperatureCard.vue";

const lastUpdated = ref(null)
const temperatures = ref([])
const connected = ref(false)

const weatherForecast = ref({
  date: null,
  min: null,
  max: null
})

const lastUpdatedReadable = computed(() => {
  return new Date(lastUpdated.value).toLocaleString()
})

function refresh(done) {
  updateTemperatures()
  done()
}

function updateWeather() {
  axios.get('https://api.open-meteo.com/v1/dwd-icon?latitude=51.06187791413632&longitude=6.71212870331567&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1')
    .then((response) => {
      weatherForecast.value = {
        date: new Date(response.data.daily.time[0]).toLocaleDateString(),
        max: response.data.daily.temperature_2m_max[0],
        min: response.data.daily.temperature_2m_min[0],
      }
    })
}

function updateTemperatures() {
  axios.get('http://127.0.0.1:8000/temperatures/last')
    .then((response) => {
      temperatures.value = []
      response.data.temperatures.forEach((temp) => {
        temperatures.value[temp.name] = temp.value
      })
      lastUpdated.value = response.data.date
      connected.value = true
    })
}

onMounted(() => {
  updateTemperatures()
  updateWeather()
})
</script>
