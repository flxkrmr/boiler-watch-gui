<template>
	<q-page class="width-flex-fixed q-px-md">
		<h3>Status</h3>
		<h4>Datenbank</h4>
		<div>Dateigröße: {{ databaseSizeReadable }}</div>
		<h4>Sensoren</h4>
		<q-markup-table>
			<thead>
				<tr>
					<th class="text-left">Name</th>
					<th class="text-left">Pfad</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="sensor in sensors" :key="sensor.name">
					<td>{{ sensor.name }}</td>
					<td>{{ sensor.path }}</td>
				</tr>
			</tbody>
		</q-markup-table>
	</q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const sensors = ref([])
const databaseSize = ref(null)

const databaseSizeReadable = computed(() => {
  return humanFileSize(databaseSize.value)
})

function updateStatus() {
  const url = process.env.API_URL + '/health'
  axios.get(url)
    .then((response) => {
      console.log(response)
      sensors.value = response.data.sensor_config.sensors
      databaseSize.value = response.data.database_size_bytes
    })
}

function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

onMounted(() => {
	updateStatus()
})

</script>
