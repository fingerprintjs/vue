import { start } from '@fingerprint/agent'
import type { Agent, GetOptions, GetResult, StartOptions } from '@fingerprint/agent'
import type { GetVisitorData } from './types'

export function makeGetVisitorData(startOptions: StartOptions): GetVisitorData {
  let agent: Agent | undefined

  return async (options?: GetOptions): Promise<GetResult> => {
    if (typeof window === 'undefined') {
      throw new Error(
        'getVisitorData() can only be called in the browser. If you are using nuxt, you should apply our plugin only on client side.'
      )
    }

    //  Agent is started lazily on first getVisitorData call, then reused for subsequent calls
    agent ??= start(startOptions)

    return agent.get(options)
  }
}
