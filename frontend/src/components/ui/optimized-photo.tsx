import Image, { type ImageProps } from "next/image";
import images from "@/data/optimized-images.json";

export function OptimizedPhoto({ variant = "large", alt, ...props }: ImageProps & { variant?: "small" | "large" }) {
  const asset = typeof props.src === "string"
    ? (images as Record<string, { small: string; large: string; blur: string }>)[props.src]
    : undefined;
  return <Image {...props} alt={alt} src={asset?.[variant] ?? props.src} placeholder={asset ? "blur" : props.placeholder} blurDataURL={asset?.blur ?? props.blurDataURL} />;
}
