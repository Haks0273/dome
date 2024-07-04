<template>
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer  width="300">
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
          <List />
          <v-list-item >
            <v-btn @click="toggleTheme">toggle theme</v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-app-bar title="Application bar"></v-app-bar>
  
      <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
        <RouterView />
      </v-main>
    </v-layout>
</template>

<script setup>
import { useTheme } from 'vuetify'
import List from './components/List.vue'
import { ref } from 'vue';

const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const widthOfNavigation = ref()
</script>

<style>
</style>