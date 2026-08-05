import type { GetOptions } from '@fingerprint/agent'
import type { FingerprintVisitorQueryData, FingerprintVueGlobalClient } from '../types'

export type FingerprintGetVisitorDataMethodThis = {
  visitorData?: FingerprintVisitorQueryData
  $root?: {
    $fingerprint?: FingerprintVueGlobalClient
  } | null
  $fingerprint?: FingerprintVueGlobalClient
}

export type FingerprintGetVisitorDataMethod = (
  this: FingerprintGetVisitorDataMethodThis,
  options?: GetOptions
) => Promise<void>

export interface FingerprintVueMixins {
  /**
   * Method for fetching visitor data
   */
  $getVisitorData: FingerprintGetVisitorDataMethod

  /**
   * Query state for visitor data
   */
  visitorData: FingerprintVisitorQueryData
}
