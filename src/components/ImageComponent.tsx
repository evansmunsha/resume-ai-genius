import Image from 'next/image'

interface OptimizedImageProps {
  src: string;
  alt: string;
  [key: string]: any;
}

export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      quality={75}
      placeholder="blur"
      {...props}
    />
  )
} 