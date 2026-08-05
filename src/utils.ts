export type FalseValue = false | 0 | null | undefined

export function isTruthy<T>(value: T | FalseValue): value is T {
  return Boolean(value)
}
