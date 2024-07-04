<template>
    <v-card
      class="mx-auto"
      max-width="300"
    >
      <v-list density="compact">
        <v-list-subheader>REPORTS</v-list-subheader>
  
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          height="70"
          width="100%"
          @click="() => $router.push(item?.route)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
  
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </template>

<script setup>
import { ref } from 'vue';

const items  = ref([
    { text: 'Home', icon: 'mdi-home', route: '/introduce' },
    { text: 'TxtToImg', icon: 'mdi-draw', route: '/txt2img' },
    { text: 'ImgToImg', icon: 'mdi-image',route: '/img2img' },
],)
</script>

<style>

</style>