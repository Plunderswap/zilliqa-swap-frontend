import { MouseEvent, ReactElement, cloneElement, forwardRef } from 'react'
import { useRouter } from 'utils/router'

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname: string; query?: Record<string, string | string[] | undefined> }
  legacyBehavior?: boolean
  passHref?: boolean
  prefetch?: boolean
  replace?: boolean
  shallow?: boolean
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { children, href, legacyBehavior, passHref: _passHref, prefetch: _prefetch, replace, shallow, onClick, ...props },
    ref,
  ) => {
    const router = useRouter()
    const resolvedHref = typeof href === 'string' ? href : href.pathname

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        props.target === '_blank' ||
        resolvedHref.startsWith('http') ||
        resolvedHref.startsWith('mailto:')
      ) {
        return
      }

      event.preventDefault()
      const navigate = replace ? router.replace : router.push
      navigate(href, undefined, { shallow })
    }

    if (legacyBehavior && children && typeof children === 'object') {
      return cloneElement(children as ReactElement<any>, {
        href: resolvedHref,
        onClick: handleClick,
        ref,
      })
    }

    return (
      <a {...props} href={resolvedHref} onClick={handleClick} ref={ref}>
        {children}
      </a>
    )
  },
)

export default Link
