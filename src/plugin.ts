import type { Plugin } from 'vue'
import * as packageInfo from '../package.json'
import { GET_VISITOR_DATA } from './symbols'
import type { FingerprintPluginOptions } from './types'
import { getOptions } from './config'
import { makeGetVisitorData } from './client'
import { isTruthy } from './utils'

// Using the original package name instead of just `vue` for data analytics consistency
export const INTEGRATION_INFO_PACKAGE_NAME = 'fingerprintjs-pro-vue-v3'

/**
 * Fingerprint plugin for Vue 3
 *
 * @example ```ts
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import { FingerprintPlugin } from '@fingerprint/vue';
 *
 * const app = createApp(App);
 *
 * app
 *   .use(FingerprintPlugin, {
 *     apiKey: '<YOUR_API_KEY>',
 *   })
 *   .mount('#app');
 * ```
 */
export const FingerprintPlugin: Plugin = {
  install: (app, options?: FingerprintPluginOptions) => {
    if (options && 'loadOptions' in options) {
      throw new Error(
        'The "loadOptions" option has been removed. Pass options directly to FingerprintPlugin, e.g. { apiKey: "..." } instead of { loadOptions: { apiKey: "..." } }. See the migration guide for details.'
      )
    }

    if (!isTruthy(options?.apiKey)) {
      throw new Error('FingerprintPlugin requires an apiKey. Pass { apiKey: "..." } when installing the plugin.')
    }

    const startOptions = getOptions(options, INTEGRATION_INFO_PACKAGE_NAME, packageInfo.version)
    const getVisitorData = makeGetVisitorData(startOptions)

    app.provide(GET_VISITOR_DATA, getVisitorData)

    app.config.globalProperties.$fingerprint = {
      getVisitorData,
    }
  },
}
