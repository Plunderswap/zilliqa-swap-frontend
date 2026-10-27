import { useEffect } from 'react'

interface SeoProps {
  title?: string
  description?: string
  noindex?: boolean
}

export function Seo({ title, description, noindex }: SeoProps) {
  useEffect(() => {
    if (title) document.title = title

    const setMeta = (name: string, content?: string) => {
      if (!content) return
      let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.name = name
        document.head.appendChild(element)
      }
      element.content = content
    }

    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex,nofollow' : undefined)
  }, [description, noindex, title])

  return null
}
