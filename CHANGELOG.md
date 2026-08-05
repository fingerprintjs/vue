# @fingerprint/vue

## 2.0.1

### Patch Changes

- Remove unused `tslib` runtime dependency. ([5b3e95d](https://github.com/fingerprintjs/vue/commit/5b3e95d82a3181219bd4f6d383f80ca3e2ba8a78))

## 2.0.0

### Major Changes

- Upgrade to JavaScript agent v4

  **Breaking changes:**

  - Replaced `@fingerprintjs/fingerprintjs-pro-spa` dependency with `@fingerprint/agent` v4
  - The default caching strategy has changed from `sessionStorage` caching to **no caching by default**, aligned with the underlying [JavaScript agent v4 default](https://docs.fingerprint.com/reference/js-agent-v4-start-function#cache).
  - Plugin options are now passed directly instead of nested under `loadOptions` — use `{ apiKey: '...' }` instead of `{ loadOptions: { apiKey: '...' } }`
  - Renamed `fpjsPlugin` to `FingerprintPlugin`, `FpjsVueOptions` to `FingerprintPluginOptions`
  - Renamed `$fpjs` global property to `$fingerprint`
  - Renamed `fpjsGetVisitorDataMixin` to `fingerprintGetVisitorDataMixin`
  - Removed `fpjsGetVisitorDataExtendedMixin` — agent v4 has a single result format, no `extendedResult` distinction
  - Removed `extendedResult`, `ignoreCache`, and `clearCache` options. Caching is now configured at the plugin level using the `cache` option in `StartOptions`.
  - Removed `CLEAR_CACHE` injection symbol
  - Removed SPA re-exports: `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`, `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern`, `FingerprintJSPro`
  - Removed root type re-exports: `VisitorData`, `ExtendedGetResult`, `LoadOptions`, `FpjsClientOptions`, `GetResult`. The agent v4 equivalents are now accesible under `Fingerprint` namespace, which is still re-exported from the Vue SDK package for direct agent access.
  - Result fields now use snake_case: `visitor_id`, `event_id`, `sealed_result`, `cache_hit`, `suspect_score`
  - `useVisitorData()` takes a single options object, returns `isFetched` ref, and `getData()` throws on failure ([a37ab8c](https://github.com/fingerprintjs/vue/commit/a37ab8c73525a88aa0fc6f3d1100d9cc5190e8bf))

## 2.0.0-rc.0

### Major Changes

- Upgrade to JavaScript agent v4

  **Breaking changes:**

  - Replaced `@fingerprintjs/fingerprintjs-pro-spa` dependency with `@fingerprint/agent` v4
  - Plugin options are now passed directly instead of nested under `loadOptions` — use `{ apiKey: '...' }` instead of `{ loadOptions: { apiKey: '...' } }`
  - Renamed `fpjsPlugin` to `FingerprintPlugin`, `FpjsVueOptions` to `FingerprintPluginOptions`
  - Renamed `$fpjs` global property to `$fingerprint`
  - Renamed `fpjsGetVisitorDataMixin` to `fingerprintGetVisitorDataMixin`
  - Removed `fpjsGetVisitorDataExtendedMixin` — agent v4 has a single result format, no `extendedResult` distinction
  - Removed `extendedResult`, `ignoreCache`, and `clearCache` options. Caching is now configured at the plugin level using the `cache` option in `StartOptions`.
  - Removed `CLEAR_CACHE` injection symbol
  - Removed SPA re-exports: `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`, `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern`, `FingerprintJSPro`
  - Removed root type re-exports: `VisitorData`, `ExtendedGetResult`, `LoadOptions`, `FpjsClientOptions`, `GetResult`. The agent v4 equivalents are now accesible under `Fingerprint` namespace, which is still re-exported from the Vue SDK package for direct agent access.
  - Result fields now use snake_case: `visitor_id`, `event_id`, `sealed_result`, `cache_hit`, `suspect_score`
  - `useVisitorData()` takes a single options object, returns `isFetched` ref, and `getData()` throws on failure ([a37ab8c](https://github.com/fingerprintjs/vue/commit/a37ab8c73525a88aa0fc6f3d1100d9cc5190e8bf))

## [1.5.0](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue3-v1.4.0...fingerprintjs-pro-vue3-v1.5.0) (2024-03-25)

### Features

- bump @fingerprintjs/fingerprintjs-pro-spa to 1.3.1 ([c919e31](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/c919e31cac2f58d75a904198b797a35fb4abb160))

### Documentation

- **README:** add a code example with linking and tagging ([deee32a](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/deee32a76cdcb6b73a85f46ff84176a92af9b61d))
- **README:** mention removal of vue 2 sdk ([efc200e](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/efc200ef5ee421820a0165cead9793cec364b7f0))

## [1.3.0](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.2.1...fingerprintjs-pro-vue2-v1.3.0) (2023-10-11)

### Features

- update @fingerprintjs/fingerprintjs-pro-spa to 1.2.0, add FingerprintJSPro export ([401c5c6](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/401c5c642f8c73cd24c27fbcc59ec2e00603117d))

## [1.2.1](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.2.0...fingerprintjs-pro-vue2-v1.2.1) (2023-10-05)

## [1.2.0](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.1.1...fingerprintjs-pro-vue2-v1.2.0) (2023-09-20)

### Features

- update spa library to 1.1.3 ([9ce47bd](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/9ce47bddb48a394c6422e96ba973cb5bf747d4e4))

## [1.1.1](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.1.0...fingerprintjs-pro-vue2-v1.1.1) (2023-09-14)

### Bug Fixes

- bump spa package version to 1.1.2 ([d85e85b](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/d85e85bfc9701c98afedac8ce35b4b12f878e988))

## [1.1.0](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.5...fingerprintjs-pro-vue2-v1.1.0) (2023-07-06)

### Bug Fixes

- update JS Agent with fixed `subdivisions` type ([7b0cdcf](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/7b0cdcfdeb661d82d87e9f6505d63a2cb7ae1962))

### Features

- add reexports for `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern` ([fe16ae6](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/fe16ae6e036aad0acd4de6d9fb1a824dec8ffdc9))

## [1.0.5](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.4...fingerprintjs-pro-vue2-v1.0.5) (2023-04-20)

### Bug Fixes

- correctly bump version in code during release ([e189f0d](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/e189f0d0f154e3f92cbc7bca9478de8740690055))
- update SPA package ([6e00fb9](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/6e00fb9225e8abf8c8480e9d27ea32b2dc319f2d))

## [1.0.4](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.3...fingerprintjs-pro-vue2-v1.0.4) (2022-11-17)

### Bug Fixes

- update SPA library to 0.7.0 ([f71d891](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/f71d891706f690bf6ba98767d01faf69814b7e66))

## [1.0.3](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.2...fingerprintjs-pro-vue2-v1.0.3) (2022-09-19)

## [1.0.2](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.1...fingerprintjs-pro-vue2-v1.0.2) (2022-06-14)

### Bug Fixes

- change build target to es6 ([c9fc643](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/c9fc643872029fa10d04312681daa8dc6d518809))

## [1.0.1](https://github.com/fingerprintjs/fingerprintjs-pro-vue/compare/fingerprintjs-pro-vue2-v1.0.0...fingerprintjs-pro-vue2-v1.0.1) (2022-06-13)

### Bug Fixes

- use correct badges ([de957d7](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/de957d79fe2319b1b9a05a68ed0e1bf33531946d))

## 1.0.0 (2022-06-13)

### Features

- add vue2 integration ([d42acd2](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/d42acd267e499ea0a869aa77ab1849e8f4e68546))
- Create vue integration ([f232fc0](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/f232fc0f0e9d76ebb28529701a24c3b2b0393381))
- introduce mixins ([77bb2f9](https://github.com/fingerprintjs/fingerprintjs-pro-vue/commit/77bb2f999aeafc1162e7432e7cba926279d21bbb))
