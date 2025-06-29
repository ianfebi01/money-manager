'use client'
import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils' // Adjust the import path as needed

interface Source {
  location: string
  codec: string
}

interface VideoPlayerProps {
  sources: Source[]
  autoplay?: boolean
  loop?: boolean
  isPlaying: boolean
  inline?: boolean
  dimension?: 'width' | 'height' | 'cover'
  enableControls?: boolean
  youtubeRef?: string | null
  poster?: string
  onEnded?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ( {
  sources = [{ location : '', codec : '' }],
  autoplay = false,
  loop = false,
  isPlaying = false,
  inline = false,
  dimension = 'width',
  enableControls = false,
  youtubeRef = '',
  poster,
  onEnded,
} ) => {
  const videoRef = useRef<HTMLVideoElement | null>( null )

  useEffect( () => {
    const currentVideo = videoRef.current
    if ( currentVideo ) {
      currentVideo.currentTime = 0
      if ( isPlaying ) {
        currentVideo.play()
      } else {
        currentVideo.pause()
      }
    }
  }, [isPlaying] )

  useEffect( () => {
    const currentVideo = videoRef.current
    if ( currentVideo && !youtubeRef ) {
      currentVideo.onended = () => {
        if ( onEnded ) {
          setTimeout( onEnded, 1000 )
        }
      }
      if ( autoplay && !currentVideo.onplaying ) {
        currentVideo.play()
      }
    }
  }, [youtubeRef, autoplay, onEnded] )

  if ( youtubeRef ) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeRef}?autoplay=${0}`}
        title="YouTube video player"
        className={cn( 'max-w-full max-h-full', 'w-full h-full aspect-video' )}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    )
  }

  return (
    <video
      ref={videoRef}
      className={cn(
        dimension === 'height' && 'match-height',
        dimension === 'width' && 'match-width',
        dimension === 'cover' && 'object-cover w-full h-full'
      )}
      preload="auto"
      autoPlay={autoplay}
      muted={autoplay}
      loop={loop}
      playsInline={inline}
      controls={enableControls}
      poster={poster}
    >
      {sources.map( ( source, key ) => (
        <source key={key}
          src={source.location}
          type={source.codec}
        />
      ) )}
      Sorry, your browser doesn’t support embedded videos.
    </video>
  )
}

export default VideoPlayer
