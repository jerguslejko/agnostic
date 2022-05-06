import type {
  ZodRawShape,
  ZodObject,
  ZodString,
  infer as zodInfer,
  string as zodString,
} from 'zod'

type Wrap<T extends Record<string, string | undefined>, K extends keyof T> = (
  key: K,
) => T[K]

export function capture<
  S extends ZodRawShape,
  // @ts-ignore
  R extends zodInfer<ZodObject<S>>,
>(schema: S, options?: { key?: string }): Wrap<R, keyof R> {
  function get(key: string) {
    const ENV = (window as any)[options?.key ?? '$ENV$']

    if (!ENV) {
      throw new Error('Environment not configured properly')
    }

    return ENV[key]
  }

  get.__schema = schema

  return get as any
}

const p: any = new Proxy({}, { get: () => p })

export const string: typeof zodString = function (): ZodString {
  return p
}
