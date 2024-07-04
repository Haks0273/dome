<template>
    <v-btn @click="clickHandle">
        Prompt
    </v-btn>
    <v-card v-show="show">
        <v-tabs
          v-model="tab"
          align-tabs="title"
        >
          <v-tab
            v-for="item in items"
            :key="item"
            :value="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-card-text>
            <v-window v-model="tab">
                <v-window-item
                    v-for="item in items"
                    :key="item"
                    :value="item"
                >
                <v-chip-group>
                    <v-chip>Chip 1</v-chip>

                    <v-chip>Chip 2</v-chip>

                    <v-chip>Chip 3</v-chip>
                </v-chip-group>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>




<script setup>
import { ref } from "vue"

const tab = ref(null)
const items = ref( [
    '物品-数量', '材质', '尺寸', '造型', '色彩','效果','纹样风格'
])
const text = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod')
const show = ref(false)
const clickHandle = () => {
    show.value = !show.value
}

</script>

<style>

</style>