import { defineConfig } from 'vite'
import licensePlugin from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'
import { dependencies, peerDependencies, version } from './package.json'

const licenseContents = `Fingerprint Vue v${version} - Copyright (c) FingerprintJS, Inc, ${new Date().getFullYear()} (https://fingerprint.com)
Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.`

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      fileName: 'fingerprint-vue',
      formats: ['cjs', 'es'],
      name: 'FingerprintVue',
    },
    rollupOptions: {
      external: [...Object.keys(dependencies ?? {}), ...Object.keys(peerDependencies ?? {})],
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [
    licensePlugin({
      content: licenseContents,
    }),
    dts({
      bundleTypes: true,
    }),
  ],
})
