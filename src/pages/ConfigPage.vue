<template>
  <q-page class="width-flex-fixed q-px-md">
    <div class="column" >
			<h3>Einstellungen</h3>
			<q-form
				@submit="onSubmit"
				@reset="onReset"
				class="q-gutter-md"
			>
				<q-input
	        filled
	        type="number"
	        v-model="updateRate"
	        label="Auslese Interval (Sekunden)"
	      />

				<q-input
	        filled
	        type="number"
	        v-model="keep"
	        label="Anzahl gespeicherte Werte"
	      />

	      <div>
	        <q-btn label="Speichern" type="submit" color="primary"/>
	        <q-btn label="Zurücksetzen" type="reset" color="primary" flat class="q-ml-sm" />
	      </div>
			</q-form>
		</div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const updateRate = ref(null)
const keep = ref(null)
const $q = useQuasar()

function updateConfig() {
  axios.get('http://127.0.0.1:8000/config')
    .then((response) => {
      updateRate.value = response.data.interval_seconds
      keep.value = response.data.keep
    })
}

function onSubmit() {
	const body = {
		interval_seconds: Number(updateRate.value),
		keep: Number(keep.value)
	}

	axios.post('http://127.0.0.1:8000/config', body)
		.then(function (response) {
			$q.notify({
			  color: 'green-4',
			  textColor: 'white',
			  icon: 'cloud_done',
			  message: 'Gespeichert'
			})
	  })
	  .catch(function (error) {
			$q.notify({
			  color: 'red-4',
			  textColor: 'white',
			  icon: 'warning',
			  message: 'Fehler beim Speichern'
			})
	  });

}

function onReset() {
	updateConfig()
}

onMounted(() => {
  updateConfig()
})

</script>
