import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
import vuetify from './plugins/vuetify'
import '@/styles/common.scss'
import 'element-plus/dist/index.css'
import 'github-markdown-css'
import 'highlight.js/styles/github.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
