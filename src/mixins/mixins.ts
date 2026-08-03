import type { FingerprintVisitorQueryData } from '../types'
import type { FingerprintGetVisitorDataMethod } from './mixins.types'

const getVisitorData: FingerprintGetVisitorDataMethod = async function (options) {
  /**
   * We use this.$root as a fallback, because in nuxt sometimes this.$fingerprint might be empty, but it might exist in $root
   */
  const fingerprint = this.$fingerprint ?? this.$root?.$fingerprint

  if (!fingerprint) {
    throw new TypeError('$fingerprint is not defined.')
  }

  this.visitorData = { isLoading: true, isFetched: false, data: undefined, error: undefined }

  try {
    const data = await fingerprint.getVisitorData(options)

    this.visitorData = { isLoading: false, isFetched: true, data, error: undefined }
  } catch (error) {
    this.visitorData = {
      isLoading: false,
      isFetched: false,
      data: undefined,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * Mixin for fetching visitor data
 *
 * @example ```vue
 * <script>
 * import { fingerprintGetVisitorDataMixin } from '@fingerprint/vue';
 *
 * export default {
 *   mixins: [fingerprintGetVisitorDataMixin],
 *   async mounted() {
 *     await this.$getVisitorData();
 *   }
 * };
 * </script>
 *
 * <template>
 *   <div>
 *     <button @click='$getVisitorData'>Get visitor data</button>
 *     <span v-if='visitorData.isLoading'>Loading...</span>
 *     <span v-else-if='visitorData.error'>Error: {{ visitorData.error }}</span>
 *     <span v-else>{{ visitorData.data }}</span>
 *   </div>
 * </template>
 * ```
 */
export const fingerprintGetVisitorDataMixin = {
  data(): { visitorData: FingerprintVisitorQueryData } {
    // Initial reactive state — properties must be declared here for Vue reactivity tracking.
    return {
      visitorData: {
        isLoading: false,
        isFetched: false,
        data: undefined,
        error: undefined,
      },
    }
  },
  methods: {
    $getVisitorData: getVisitorData,
  },
}
