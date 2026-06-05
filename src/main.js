import '@fontsource/inter/400.css'
import '@/assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vClickOutside } from '@/directives/clickOutside'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('click-outside', vClickOutside)

app.mount('#app')
