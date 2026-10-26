/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVisitorData } from '../src'
import type { UseGetVisitorDataResult, UseVisitorDataOptions } from '../src'
import type { GetOptions } from '@fingerprint/agent'
import type { FingerprintVueGlobalClient } from '../src'
import { defineComponent, getCurrentInstance, nextTick } from 'vue'
import { deferred, flushPromises, mountWithPlugin, testData } from './helpers'
import { mockGet, mockStart } from './setup'

function mountUseVisitorData(options: UseVisitorDataOptions = {}) {
  let api!: UseGetVisitorDataResult

  mountWithPlugin(
    defineComponent({
      setup() {
        api = useVisitorData(options)

        return {}
      },
      template: '<div />',
    })
  )

  return { api }
}

const getDataOptionCases = [
  {
    name: 'passes per-call GetOptions to agent.get()',
    composableOptions: { immediate: false, linkedId: 'default-link' },
    callOptions: { tags: 'test' },
    expectedOptions: { tags: 'test', linkedId: 'default-link' },
  },
  {
    name: 'merges default GetOptions with per-call options',
    composableOptions: { immediate: false, tags: 'default-tag' },
    callOptions: { linkedId: 'link456' },
    expectedOptions: { tags: 'default-tag', linkedId: 'link456' },
  },
  {
    name: 'lets per-call options override default options',
    composableOptions: { immediate: false, tags: 'default-tag', linkedId: 'default-link' },
    callOptions: { tags: 'override-tag' },
    expectedOptions: { tags: 'override-tag', linkedId: 'default-link' },
  },
  {
    name: 'still forwards the deprecated tag option',
    composableOptions: { immediate: false, tag: 'default-tag' },
    callOptions: { linkedId: 'link456' },
    expectedOptions: { tag: 'default-tag', linkedId: 'link456' },
  },
] satisfies Array<{
  name: string
  composableOptions: UseVisitorDataOptions
  callOptions: GetOptions
  expectedOptions: GetOptions
}>

describe('useVisitorData', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockStart.mockClear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes idle refs and an imperative getter when immediate is false', () => {
    const { api } = mountUseVisitorData({ immediate: false })

    expect(api.data.value).toBeUndefined()
    expect(typeof api.getData).toBe('function')
    expect(api.error.value).toBeUndefined()
    expect(api.isLoading.value).toBe(false)
    expect(api.isFetched.value).toBe(false)
  })

  it('fetches visitor data on mount by default', async () => {
    mockGet.mockResolvedValue(testData)

    const { api } = mountUseVisitorData()

    expect(api.isLoading.value).toBe(true)
    expect(mockStart).toHaveBeenCalledTimes(1)

    await flushPromises()

    expect(api.data.value).toEqual(testData)
    expect(api.isFetched.value).toBe(true)
    expect(api.isLoading.value).toBe(false)
  })

  it('does not fetch visitor data on mount when immediate is false', () => {
    const { api } = mountUseVisitorData({ immediate: false })

    expect(api.isLoading.value).toBe(false)
    expect(api.isFetched.value).toBe(false)
    expect(mockGet).not.toHaveBeenCalled()
  })

  it('reuses the same agent across multiple useVisitorData instances', async () => {
    mockGet.mockResolvedValue(testData)

    let first!: UseGetVisitorDataResult
    let second!: UseGetVisitorDataResult

    mountWithPlugin(
      defineComponent({
        setup() {
          first = useVisitorData({ immediate: false })
          second = useVisitorData({ immediate: false })

          return {}
        },
        template: '<div />',
      })
    )

    await expect(first.getData()).resolves.toEqual(testData)
    await expect(second.getData({ tags: 'second-instance' })).resolves.toEqual(testData)

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('reuses the same agent between useVisitorData and $fingerprint.getVisitorData', async () => {
    mockGet.mockResolvedValue(testData)

    let fingerprint: FingerprintVueGlobalClient | undefined

    let api!: UseGetVisitorDataResult

    mountWithPlugin(
      defineComponent({
        setup() {
          api = useVisitorData({ immediate: false })

          const instance = getCurrentInstance()

          if (!instance?.proxy?.$fingerprint) {
            throw new Error('Expected $fingerprint on the component instance')
          }

          fingerprint = instance.proxy.$fingerprint

          return {}
        },
        template: '<div />',
      })
    )

    if (!fingerprint) {
      throw new Error('Expected $fingerprint on the component instance')
    }

    await expect(api.getData()).resolves.toEqual(testData)
    await expect(fingerprint.getVisitorData({ tags: 'plugin-call' })).resolves.toEqual(testData)

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('throws when used without installing the plugin', () => {
    expect(() => {
      mount(
        defineComponent({
          setup() {
            useVisitorData()

            return {}
          },
          template: '<div />',
        })
      )
    }).toThrow(/GET_VISITOR_DATA inject data is missing/)
  })

  it('stores mount-time errors without marking the fetch as complete', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    const { api } = mountUseVisitorData()

    expect(api.isLoading.value).toBe(true)
    expect(api.isFetched.value).toBe(false)

    await flushPromises()

    expect(api.isFetched.value).toBe(false)
    expect(api.isLoading.value).toBe(false)
    expect(api.error.value).toBe(testError)
    expect(console.error).toHaveBeenCalledWith(`Failed to fetch visitor data on mount: ${testError}`)
  })

  it('rejects imperative getData() failures and stores the error', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    const { api } = mountUseVisitorData({ immediate: false })

    await expect(api.getData()).rejects.toThrow('Test error')

    expect(api.error.value).toBe(testError)
    expect(api.isFetched.value).toBe(false)
    expect(api.isLoading.value).toBe(false)
  })

  it('normalizes non-Error rejections into Error objects', async () => {
    mockGet.mockRejectedValue('Test error')

    const { api } = mountUseVisitorData({ immediate: false })

    await expect(api.getData()).rejects.toThrow('Test error')

    expect(api.error.value).toBeInstanceOf(Error)
    expect(api.error.value?.message).toBe('Test error')
    expect(api.isFetched.value).toBe(false)
  })

  it('provides fresh data after a failed fetch', async () => {
    mockGet.mockRejectedValueOnce(new Error('Test error'))

    const { api } = mountUseVisitorData()

    await flushPromises()

    mockGet.mockResolvedValueOnce(testData)

    await expect(api.getData()).resolves.toEqual(testData)

    expect(api.data.value).toEqual(testData)
    expect(api.error.value).toBeUndefined()
    expect(api.isFetched.value).toBe(true)
  })

  it.each(getDataOptionCases)('$name', async ({ composableOptions, callOptions, expectedOptions }) => {
    mockGet.mockResolvedValue(testData)

    const { api } = mountUseVisitorData(composableOptions)

    await api.getData(callOptions)

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(expectedOptions)
  })

  it('clears stale error and data immediately when a retry begins', async () => {
    const testError = new Error('Test error')
    const retry = deferred<typeof testData>()

    mockGet.mockRejectedValueOnce(testError)
    mockGet.mockReturnValueOnce(retry.promise)

    const { api } = mountUseVisitorData()

    await flushPromises()

    expect(api.error.value).toBe(testError)
    expect(api.isFetched.value).toBe(false)

    const pending = api.getData()

    await nextTick()

    expect(api.isLoading.value).toBe(true)
    expect(api.error.value).toBeUndefined()
    expect(api.data.value).toBeUndefined()
    expect(api.isFetched.value).toBe(false)

    retry.resolve(testData)
    await pending

    expect(api.data.value).toEqual(testData)
    expect(api.error.value).toBeUndefined()
    expect(api.isFetched.value).toBe(true)
    expect(api.isLoading.value).toBe(false)
  })
})
