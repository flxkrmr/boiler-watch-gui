<template>
  <q-pull-to-refresh class="width-flex-fixed q-px-md" @refresh="refresh">
    <q-page>
      <h2 v-if="!connected">Not connected</h2>
      <div v-if="connected" class="column">
        <h3>Aktuelle Werte</h3>
      	<q-markup-table>
      		<thead>
      			<tr>
      				<th class="text-left">Sensor</th>
      				<th class="text-left">Temperatur (Celsius)</th>
      			</tr>
      		</thead>
      		<tbody>
      			<tr v-for="temp in temperatures" :key="temp.name">
      				<td>{{ temp.name }}</td>
      				<td>{{ temp.value }}</td>
      			</tr>
      		</tbody>
      	</q-markup-table>
        <span class="text-caption">Letzte Messung: {{ lastUpdatedReadable }}</span>
      </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const lastUpdated = ref(null)
const temperatures = ref([])
const connected = ref(false)

const lastUpdatedReadable = computed(() => {
  return new Date(lastUpdated.value).toLocaleString()
})

function refresh(done) {
  updateTemperatures()
  done()
}

function updateTemperatures() {
  axios.get('http://127.0.0.1:8000/temperatures/last')
    .then((response) => {
      temperatures.value = response.data.temperatures
      lastUpdated.value = response.data.date
      connected.value = true
    })
}

onMounted(() => {
  updateTemperatures()
})
</script>
