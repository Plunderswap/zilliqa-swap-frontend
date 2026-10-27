import { ComponentType, lazy, Suspense, useEffect, useMemo, useState } from 'react'

type Loader<T> = () => Promise<{ default: ComponentType<T> } | ComponentType<T>>

export default function dynamic<T extends object>(loader: Loader<T>, options: { ssr?: boolean } = {}) {
  return function DynamicComponent(props: T) {
    const [mounted, setMounted] = useState(options.ssr !== false)
    const LazyComponent = useMemo(
      () =>
        lazy(async () => {
          const loaded = await loader()
          return typeof loaded === 'function' ? { default: loaded } : loaded
        }),
      [],
    )

    useEffect(() => setMounted(true), [])

    if (!mounted) return null
    return (
      <Suspense fallback={null}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}
