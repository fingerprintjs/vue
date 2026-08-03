import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { FingerprintPlugin } from '../src'
import { INTEGRATION_INFO_PACKAGE_NAME } from '../src/plugin'
import '../src/vue'
import { mockGet, mockStart } from './setup'
import * as packageInfo from '../package.json'
import { createApp, defineComponent } from 'vue'
import { EmptyComponent, getMountedFingerprintClient, mountWithPlugin, testData } from './helpers'

describe('FingerprintPlugin', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockStart.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('exposes $fingerprint.getVisitorData on component instances', () => {
    mountWithPlugin(
      defineComponent({
        mounted() {
          const { $fingerprint } = this

          expect($fingerprint).toBeDefined()
          expect(typeof $fingerprint.getVisitorData).toBe('function')
        },
        template: '<h1>Hello world</h1>',
      })
    )
  })

  it('fetches visitor data through $fingerprint.getVisitorData()', async () => {
    mockGet.mockResolvedValue(testData)

    const { vm } = mountWithPlugin({
      template: '<h1>Hello world</h1>',
    })

    await expect(vm.$fingerprint.getVisitorData()).resolves.toEqual(testData)
  })

  it('rejects deprecated loadOptions config shape', () => {
    const deprecatedOptions = {
      apiKey: 'test',
      loadOptions: { apiKey: 'test' },
    }

    expect(() => {
      const app = createApp(EmptyComponent)
      app.use(FingerprintPlugin, deprecatedOptions)
    }).toThrow(/loadOptions/)
  })

  it('throws when apiKey is missing', () => {
    expect(() => {
      const app = createApp(EmptyComponent)
      app.use(FingerprintPlugin)
    }).toThrow(/apiKey/)
  })

  it('rejects getVisitorData outside the browser before starting the agent', async () => {
    const fingerprint = getMountedFingerprintClient({ apiKey: 'test-key' })

    vi.stubGlobal('window', undefined)

    await expect(fingerprint.getVisitorData()).rejects.toThrow(/only be called in the browser/)
    expect(mockStart).not.toHaveBeenCalled()
  })

  it('appends integrationInfo when the agent starts and reuses the agent afterwards', async () => {
    mockGet.mockResolvedValue(testData)

    const fingerprint = getMountedFingerprintClient({ apiKey: 'test-key' })

    expect(mockStart).not.toHaveBeenCalled()

    await fingerprint.getVisitorData()
    await fingerprint.getVisitorData()

    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(mockStart).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'test-key',
        integrationInfo: [`${INTEGRATION_INFO_PACKAGE_NAME}/${packageInfo.version}`],
      })
    )
  })

  it('preserves existing integrationInfo entries', async () => {
    mockGet.mockResolvedValue(testData)

    const fingerprint = getMountedFingerprintClient({
      apiKey: 'test-key',
      integrationInfo: ['custom/1.0'],
    })

    await fingerprint.getVisitorData()

    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(mockStart).toHaveBeenCalledWith(
      expect.objectContaining({
        integrationInfo: ['custom/1.0', `${INTEGRATION_INFO_PACKAGE_NAME}/${packageInfo.version}`],
      })
    )
  })
})
