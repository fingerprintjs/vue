import { createApp } from 'vue'
import App from './App.vue'
import { FingerprintPlugin } from '@fingerprint/vue'
import { loadCacheConfig } from '../../components-v3/src/cacheConfig'

declare global {
  interface Window {
    API_KEY?: string
  }
}

const app = createApp(App)

const apiKey = import.meta.env.API_KEY ?? window.API_KEY

app
  .use(FingerprintPlugin, {
    apiKey,
    cache: loadCacheConfig(),
  })
  .mount('#app')
