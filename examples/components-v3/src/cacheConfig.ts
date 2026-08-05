import { Fingerprint } from '@fingerprint/vue'

// Derive the cache field types straight from the agent's `StartOptions['cache']`.
type AgentCacheConfig = NonNullable<Fingerprint.StartOptions['cache']>
export type CacheStorage = AgentCacheConfig['storage']
// Agent allows a number for `duration`, but for the example UI we only expose the named presets.
export type CacheDuration = Extract<AgentCacheConfig['duration'], string>
export type ExampleCacheConfig = { storage: CacheStorage; duration: CacheDuration }

const STORAGE_PARAM = 'cacheStorage'
const DURATION_PARAM = 'cacheDuration'

const STORAGE_VALUES: ReadonlyArray<CacheStorage> = ['sessionStorage', 'localStorage', 'agent']
const DURATION_VALUES: ReadonlyArray<CacheDuration> = ['optimize-cost', 'aggressive']

const isStorage = (value: string | null): value is CacheStorage =>
  value !== null && STORAGE_VALUES.some((storage) => storage === value)

const isDuration = (value: string | null): value is CacheDuration =>
  value !== null && DURATION_VALUES.some((duration) => duration === value)

export const loadCacheConfig = (): ExampleCacheConfig | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const params = new URLSearchParams(window.location.search)
  const storage = params.get(STORAGE_PARAM)
  const duration = params.get(DURATION_PARAM)

  if (!isStorage(storage) || !isDuration(duration)) {
    return undefined
  }

  return { storage, duration }
}

export const applyCacheConfig = (config: ExampleCacheConfig | undefined): void => {
  const params = new URLSearchParams(window.location.search)

  if (config) {
    params.set(STORAGE_PARAM, config.storage)
    params.set(DURATION_PARAM, config.duration)
  } else {
    params.delete(STORAGE_PARAM)
    params.delete(DURATION_PARAM)
  }

  // Cache config is read at agent start, so we navigate to trigger a reload
  // that re-installs the FingerprintPlugin with the new options.
  const search = params.toString()
  window.location.search = search ? `?${search}` : ''
}

export const STORAGE_OPTIONS = STORAGE_VALUES
export const DURATION_OPTIONS = DURATION_VALUES
