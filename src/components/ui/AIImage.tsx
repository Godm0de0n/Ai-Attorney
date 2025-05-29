
"use client";

import NextImage from 'next/image'; // Renamed to avoid conflict
import { useEffect, useState } from 'react';
import { generateImage, type GenerateImageInput, type GenerateImageOutput } from '@/ai/flows/generate-image-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface AIImageProps {
  prompt: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string; // e.g. a generic placeholder or specific image URL
  className?: string;
  imageClassName?: string; // Class for the NextImage component itself
  layout?: "fill" | "responsive" | "intrinsic" | "fixed";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
}

export function AIImage({ 
  prompt, 
  alt, 
  width, 
  height, 
  fallbackSrc, 
  className, // For the wrapper div
  imageClassName, // For the NextImage
  layout = "fill", 
  objectFit = "cover",
  priority = false,
}: AIImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveFallbackSrc = fallbackSrc || `https://placehold.co/${width}x${height}.png?text=Image`;

  useEffect(() => {
    let isMounted = true;
    async function fetchImage() {
      if (!prompt) {
        if (isMounted) {
          setImageUrl(effectiveFallbackSrc);
          setIsLoading(false);
        }
        return;
      }
      
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const input: GenerateImageInput = { prompt };
        const result: GenerateImageOutput = await generateImage(input);
        if (isMounted) {
          if (result.imageDataUri && !result.error) {
            setImageUrl(result.imageDataUri);
          } else {
            setError(result.error || 'Image data URI was empty.');
            setImageUrl(effectiveFallbackSrc);
          }
        }
      } catch (err) {
        console.error('Failed to generate AI image for prompt "'+prompt+'":', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Image generation failed unexpectedly');
          setImageUrl(effectiveFallbackSrc);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchImage();
    
    return () => { isMounted = false; };
  }, [prompt, width, height, effectiveFallbackSrc]); // effectiveFallbackSrc ensures stability

  const imageProps = layout === 'fill' ? 
    { layout: "fill" as const, objectFit } : 
    { width, height, layout: layout as "responsive" | "intrinsic" | "fixed" };


  if (isLoading) {
    return (
        <Skeleton 
            className={cn(
                'bg-muted/50', 
                className, 
                layout === 'fill' ? 'w-full h-full' : ''
            )} 
            style={layout !== 'fill' ? { width: `${width}px`, height: `${height}px` } : {}}
        />
    );
  }

  if (error || !imageUrl) {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center bg-destructive/10 text-destructive", className, layout === 'fill' ? 'w-full h-full' : '')}
        style={layout !== 'fill' ? { width: `${width}px`, height: `${height}px` } : {}}
        title={`Error: ${error || 'Could not load image'}`}
      >
        <AlertCircle className="w-1/3 h-1/3 max-w-[48px] max-h-[48px]" />
        <p className="text-xs mt-1 text-center px-1">AI Image Error</p>
         {/* Fallback to a simple placeholder if even the AI placeholder fails */}
        <NextImage
            src={effectiveFallbackSrc}
            alt={alt || 'Error loading image'}
            {...imageProps}
            className={cn("absolute opacity-0", imageClassName)} // Hidden but available for SEO/accessibility if needed
            priority={priority}
            unoptimized={effectiveFallbackSrc.startsWith('https://placehold.co')}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={layout !== 'fill' ? { width: `${width}px`, height: `${height}px` } : {}}>
      <NextImage
        src={imageUrl}
        alt={alt}
        {...imageProps}
        className={cn(imageClassName)}
        data-ai-hint={prompt} // Keep the original hint
        priority={priority}
        unoptimized={imageUrl.startsWith('data:') || imageUrl.startsWith('https://placehold.co')} // Data URIs and placeholders don't need optimization
      />
    </div>
  );
}
