<template>
  <div class="shadow-1 q-py-sm q-px-lg bg-white rounded-borders full-height full-width">
    <div class="row text-caption text-no-wrap">{{ props.name }}</div>
    <div class="row text-h6 text-no-wrap">{{ valueReadable }}</div>
  </div>
</template>

<style lang="sass" scoped>
.temperature-border
  border: 1px solid
  border-color: green
</style>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: String,
  value: String,
  nonTemperature: Boolean,
});

const valueReadable = computed(() => {
  return props.nonTemperature ? props.value : `${props.value} °C`;
})

</script>
