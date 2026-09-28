<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
     <img src="https://fingerprintjs.github.io/home/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
   <a href="https://github.com/fingerprintjs/vue/actions/workflows/ci.yml"><img src="https://github.com/fingerprintjs/vue/actions/workflows/ci.yml/badge.svg" alt="Build status"></a>
   <a href="https://github.com/fingerprintjs/vue/actions/workflows/release.yml"><img src="https://github.com/fingerprintjs/vue/actions/workflows/release.yml/badge.svg" alt="Release status"></a>
   <a href="https://www.npmjs.com/package/@fingerprint/vue"><img src="https://img.shields.io/npm/v/@fingerprint/vue.svg" alt="Current NPM version"></a>
   <a href="https://www.npmjs.com/package/@fingerprint/vue"><img src="https://img.shields.io/npm/dm/@fingerprint/vue.svg" alt="Monthly downloads from NPM"></a>
   <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license"></a>
   <a href="https://discord.gg/39EpE2neBg"><img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server"></a>
</p>

# Fingerprint Vue 3 SDK

[Fingerprint](https://fingerprint.com/) is a device intelligence platform offering industry-leading accuracy.

Fingerprint Vue SDK is an easy way to integrate [Fingerprint](https://fingerprint.com/) into your Vue 3 application. It supports all capabilities of the Fingerprint JavaScript agent.

## Requirements

- For Typescript users: Typescript 4.5 or higher
- Vue 3.1 or higher
- For Nuxt users: Nuxt 3.0 or higher

This package works with the commercial [Fingerprint platform](https://fingerprint.com/). It is not compatible with the source-available [FingerprintJS library](https://github.com/fingerprintjs/fingerprintjs). Learn more about the [differences between Fingerprint and FingerprintJS](https://fingerprint.com/github/).

## Installation

To install the plugin run:

```shell
yarn add @fingerprint/vue
```

Or:

```shell
npm install @fingerprint/vue
```

```shell
pnpm add @fingerprint/vue
```

## Getting started

To identify visitors, you'll need a Fingerprint account (you
can [sign up for free](https://dashboard.fingerprint.com/signup/)).
Get your API key and get started with the [Fingerprint documentation](https://docs.fingerprint.com/docs/quick-start-guide).

Register the plugin in your Vue application.

* Set a [region](https://docs.fingerprint.com/docs/regions) if you have chosen a non-global region during registration.
* Set `endpoints` if you are using one of our proxy integrations to [increase the accuracy and effectiveness](https://docs.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) of visitor identification.

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { FingerprintPlugin } from '@fingerprint/vue';

const app = createApp(App);

app
  .use(FingerprintPlugin, {
    apiKey: '<your-public-api-key>',
    endpoints: "https://metrics.yourwebsite.com",
    region: 'eu',
  })
  .mount('#app');
```

You can use the plugin with Composition API, Options API, or Mixins, with or without Nuxt. See the usage examples below.

## Composition API

The plugin provides a `useVisitorData` composable you can use to identify visitors:

```vue
<script setup>
import { useVisitorData } from '@fingerprint/vue';
import { watch } from 'vue';

const { data, error, isLoading, isFetched, getData } = useVisitorData(
  // Set to false to prevent fetching data on mount
  { immediate: false }
);

watch(data, (currentData) => {
  if (currentData) {
    // Do something with the data
    console.log(currentData.visitor_id);
  }
});
</script>

<template>
  <button @click='getData()'>Get visitor data</button>
</template>
```

The `getData()` function throws on error. You can catch errors using try/catch or check the `error` ref:

```vue
<script setup>
import { useVisitorData } from '@fingerprint/vue';

const { data, error, isLoading, isFetched, getData } = useVisitorData();

async function handleClick() {
  try {
    const result = await getData();
    console.log(result.visitor_id);
  } catch (err) {
    console.error('Identification failed:', err);
  }
}
</script>
```

## Options API

The plugin injects a `$fingerprint` object into your components that you can use to identify visitors:

```vue
<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    async getVisitorData() {
      const result = await this.$fingerprint.getVisitorData();
      // Do something with result
      console.log(result.visitor_id);
    }
  }
});
</script>

<template>
  <button @click='getVisitorData'>Get visitor data</button>
</template>
```

### Mixins

For convenience, we also provide a mixin that handles all query states:

```vue
<script lang='ts'>
import { defineComponent } from 'vue';
import { fingerprintGetVisitorDataMixin } from '@fingerprint/vue';

export default defineComponent({
  mixins: [fingerprintGetVisitorDataMixin],
  async mounted() {
    // You can also fetch data on mount
    // await this.$getVisitorData();
  }
});
</script>

<template>
  <div>
    <button @click='$getVisitorData'>
      Get visitor data
    </button>
    <span v-if='visitorData.isLoading'>
      Loading...
    </span>
    <span v-else-if='visitorData.error'>
      Error: {{ visitorData.error }}
    </span>
    <span v-else-if='visitorData.isFetched'>
      Visitor ID: {{ visitorData.data.visitor_id }}
    </span>
  </div>
</template>
```

## Nuxt

The plugin works with Nuxt out of the box, however, you need to register it on the client side only.

```typescript
// plugins/fingerprint.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { FingerprintPlugin } from '@fingerprint/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(FingerprintPlugin, {
    apiKey: config.public.API_KEY,
    endpoints: "https://metrics.yourwebsite.com",
    region: 'eu',
  });
});
```

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Inject Fingerprint API key
      API_KEY: process.env.API_KEY,
    },
  }
});
```

See the [example Nuxt Application](examples/nuxt-v3-example) for more details.

## Linking and tagging information

The `visitor_id` provided by Fingerprint Identification is especially useful when combined with information you already know about your users, for example, account IDs, order IDs, etc. To learn more about various applications of the `linkedId` and `tag`, see [Linking and tagging information](https://docs.fingerprint.com/docs/tagging-information).

Associate your data with a visitor ID using the `linkedId` or `tag` parameter of the `useVisitorData()` composable or the `getData()` function:

```vue
<script setup>
import { useVisitorData } from '@fingerprint/vue';

const { data, error, isLoading, getData } = useVisitorData({
  linkedId: 'user_1234',
  tag: {
    userAction: 'login',
    analyticsId: 'UA-5555-1111-1',
  },
})
</script>

<template>
<!--...-->
</template>
```

## Direct agent access

For advanced use cases, you can access the full `@fingerprint/agent` API using the `Fingerprint` namespace export:

```typescript
import { Fingerprint } from '@fingerprint/vue';

// Use agent types
type Result = Fingerprint.GetResult;
type Options = Fingerprint.GetOptions;

// Or call start() directly
const agent = Fingerprint.start({ apiKey: '...' });
const result = await agent.get();
```

## Caching

Fingerprint usage is billed per API call. To avoid unnecessary API calls, it is a good practice to [cache identification results](https://docs.fingerprint.com/docs/caching-visitor-information).

Caching is disabled by default, aligned with the underlying [JavaScript agent v4 default](https://docs.fingerprint.com/reference/js-agent-v4-start-function#cache). To enable caching, pass the [`cache` start option](https://docs.fingerprint.com/reference/js-agent-v4-start-function#cacheconfig):

```typescript
app.use(FingerprintPlugin, {
  apiKey: '<your-public-api-key>',
  cache: {
    storage: 'sessionStorage', // or 'localStorage' or 'agent'
    duration: 'optimize-cost', // or 'aggressive' or a number in seconds
  },
});
```

## Migration from v1.x

Version 2.0 upgrades the underlying Fingerprint agent from v3 to v4 and introduces several breaking changes. See the [migration guide](docs/migration-v1-to-v2.md) for detailed instructions and the [JavaScript agent v3 to v4 migration guide](https://docs.fingerprint.com/docs/migrating-from-v3-to-v4) for underlying agent changes.

## Documentation

You can find detailed documentation in the [API reference](https://fingerprintjs.github.io/vue).

## Version support

| SDK major version | JS Agent version | Status | End of support |
|---|---|---|---|
| v2.x (current) | [v4](https://docs.fingerprint.com/reference/js-agent) | Supported | - |
| v1.x | [v3](https://docs.fingerprint.com/reference/v3/javascript-agent) | Deprecated (security fixes only). See the [migration guide](https://docs.fingerprint.com/docs/vuejs#migration-guide-for-vue-sdk-v2-0-0). | To be decided |

## Support and feedback

To ask questions or provide feedback, use [Issues](https://github.com/fingerprintjs/vue/issues). If you need private support, please email us at `oss-support@fingerprint.com`. If you'd like to have a similar Vue wrapper for the [source-available FingerprintJS](https://github.com/fingerprintjs/fingerprintjs), consider creating an issue in the main [FingerprintJS repository](https://github.com/fingerprintjs/fingerprintjs/issues).

## Examples

You can find the following examples in the [examples](examples) directory:

- [SPA Application](examples/spa-v3-example)
- [Nuxt Application](examples/nuxt-v3-example)

## License

This project is licensed under the [MIT license](https://github.com/fingerprintjs/vue/blob/main/LICENSE).
