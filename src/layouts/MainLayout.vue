<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn class="q-mr-sm" flat round dense icon="menu" @click="toggleMenu" />

        <q-separator dark vertical inset />

        <q-toolbar-title>
          Wärmemanagement im Haus von Barbara und Achim
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="menuOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :to="menuItem.link" :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="flex flex-center full-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)

const menuList = [
  {
    icon: 'local_fire_department',
    label: 'Aktuelle Werte',
    link: '/',
    separator: false
  },
  {
    icon: 'timeline',
    label: 'Verlauf',
    link: '/history',
    separator: false
  },
  {
    icon: 'download',
    label: 'Export',
    link: '/export',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Einstellungen',
    link: '/config',
    separator: false
  },
  {
    icon: 'settings_input_component',
    label: 'Status',
    link: '/status',
    separator: false
  },
]

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<style lang="sass">
.width-flex-fixed
  width: 100%
  max-width: 1100px
</style>
