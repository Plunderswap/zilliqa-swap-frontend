import { ImgHTMLAttributes } from 'react'

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string | { src: string; width?: number; height?: number }
  width?: number | string
  height?: number | string
  fill?: boolean
  layout?: string
  objectFit?: React.CSSProperties['objectFit']
  priority?: boolean
  placeholder?: string
  unoptimized?: boolean
}

export default function Image({
  src,
  fill,
  layout: _layout,
  objectFit,
  priority,
  placeholder: _placeholder,
  unoptimized: _unoptimized,
  alt = '',
  style,
  ...props
}: ImageProps) {
  const source = typeof src === 'string' ? src : src.src
  const intrinsicWidth = typeof src === 'string' ? undefined : src.width
  const intrinsicHeight = typeof src === 'string' ? undefined : src.height

  return (
    <img
      {...props}
      alt={alt}
      src={source}
      width={fill ? undefined : (props.width ?? intrinsicWidth)}
      height={fill ? undefined : (props.height ?? intrinsicHeight)}
      loading={priority ? 'eager' : (props.loading ?? 'lazy')}
      fetchPriority={priority ? 'high' : props.fetchPriority}
      style={
        fill
          ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit, ...style }
          : { objectFit, ...style }
      }
    />
  )
}
