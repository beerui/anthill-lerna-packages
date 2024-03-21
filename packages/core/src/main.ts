import { createApp } from 'vue'
import App from './app.vue'

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import anthill from './index'

const app = createApp(App)

app.use(TDesign)
app.use(anthill);
app.mount('#app')
