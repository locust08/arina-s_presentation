/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useRef, useState } from "react"

import styles from "./presentation-embedded-website-slide.module.css"

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+*?[]{}"
const INTRO_TITLE = "THIBAULT - CREATIVE DEVELOPER"
const INTRO_LEAD =
  "I EXPLORE THE WEB BETWEEN DESIGN AND CODE TO CREATE PROJECTS THAT STAND OUT"

type IntroStage = "preface" | "kindle" | "cta"

type PresentationEmbeddedWebsiteSlideProps = {
  musicSrc?: string
  src: string
  title: string
}

function useScrambledText(target: string, durationMs: number, delayMs = 0) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let frameId = 0
    let startTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime

      if (elapsed < delayMs) {
        frameId = window.requestAnimationFrame(animate)
        return
      }

      const progress = Math.min((elapsed - delayMs) / durationMs, 1)
      const settledCount = Math.floor(progress * target.length)

      const nextText = target
        .split("")
        .map((character, index) => {
          if (character === " ") {
            return " "
          }

          if (index < settledCount) {
            return character
          }

          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ]
        })
        .join("")

      setDisplayText(progress >= 1 ? target : nextText)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    setDisplayText("")
    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [delayMs, durationMs, target])

  return displayText
}

export function PresentationEmbeddedWebsiteSlide({
  musicSrc,
  src,
  title,
}: PresentationEmbeddedWebsiteSlideProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasLoadedInitialFrameRef = useRef(false)
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [introStage, setIntroStage] = useState<IntroStage>("preface")
  const [isPlaying, setIsPlaying] = useState(false)
  const [frameSrc] = useState(() => {
    const separator = src.includes("?") ? "&" : "?"
    return `${src}${separator}slideSession=${Date.now()}`
  })
  const scrambledTitle = useScrambledText(INTRO_TITLE, 1800, 260)
  const scrambledLead = useScrambledText(INTRO_LEAD, 2200, 460)

  const restoreDeckFocus = () => {
    const deckRoot = document.querySelector<HTMLElement>(
      '[data-presentation-deck-root="true"]'
    )
    deckRoot?.focus({ preventScroll: true })
  }

  const stopPlayback = (markEntered = false) => {
    const audio = audioRef.current

    if (!audio) {
      if (markEntered) {
        setHasEnteredSite(true)
      }
      return
    }

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    if (markEntered) {
      setHasEnteredSite(true)
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.activeElement?.tagName === "IFRAME") {
        restoreDeckFocus()
      }
    }, 160)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const tryPlay = async () => {
      try {
        audio.volume = 0.42
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }

    void tryPlay()

    return () => {
      stopPlayback()
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const intervalId = window.setInterval(() => {
      if (document.activeElement?.tagName === "IFRAME") {
        stopPlayback(true)
        restoreDeckFocus()
      }
    }, 200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPlaying])

  useEffect(() => {
    if (hasEnteredSite) {
      return
    }

    setIntroStage("preface")

    const kindleTimer = window.setTimeout(() => {
      setIntroStage("kindle")
    }, 5600)

    const ctaTimer = window.setTimeout(() => {
      setIntroStage("cta")
    }, 9000)

    return () => {
      window.clearTimeout(kindleTimer)
      window.clearTimeout(ctaTimer)
    }
  }, [frameSrc, hasEnteredSite])

  const handleFrameLoad = () => {
    if (!musicSrc) {
      return
    }

    if (!hasLoadedInitialFrameRef.current) {
      hasLoadedInitialFrameRef.current = true
      return
    }

    stopPlayback(true)
  }

  return (
    <section
      aria-label={title}
      className={styles.shell}
      data-transition-panel
      data-transition-content="main"
    >
      {musicSrc && !hasEnteredSite ? (
        <audio loop preload="auto" ref={audioRef} src={musicSrc} />
      ) : null}

      <div
        className={styles.frameWrap}
        onMouseDown={() => {
          if (!hasEnteredSite) {
            stopPlayback(true)
          }
        }}
      >
        <button
          aria-label="Discover my projects"
          className={`${styles.introOverlay} ${
            hasEnteredSite ? styles.introOverlayHidden : ""
          }`}
          data-stage={introStage}
          onClick={() => stopPlayback(true)}
          type="button"
        >
          <video
            aria-hidden="true"
            autoPlay
            className={styles.introVideo}
            loop
            muted
            playsInline
            poster="/reference/thibault/vid/posters/vid30.webp"
          >
            <source src="/reference/thibault/vid/vid30.mp4" type="video/mp4" />
          </video>

          <span className={styles.introShade} aria-hidden="true" />

          <span className={styles.introPreface} aria-hidden="true">
            <span className={styles.introPrefaceTitle}>{scrambledTitle}</span>
            <span className={styles.introPrefaceLead}>{scrambledLead}</span>
          </span>

          <span className={styles.introDiamond} data-slot="1" aria-hidden="true">
            <span>1</span>
          </span>
          <span className={styles.introDiamond} data-slot="2" aria-hidden="true">
            <span>2</span>
          </span>
          <span className={styles.introDiamond} data-slot="3" aria-hidden="true">
            <span>3</span>
          </span>
          <span className={styles.introDiamond} data-slot="4" aria-hidden="true">
            <span>4</span>
          </span>
          <span className={styles.introDiamond} data-slot="5" aria-hidden="true">
            <span>5</span>
          </span>
          <span className={styles.introDiamond} data-slot="6" aria-hidden="true">
            <span>6</span>
          </span>

          <span className={styles.introCta} aria-hidden="true">
            DISCOVER MY PROJECTS{" "}
            <span className={styles.introArrow}>{"\u2197"}</span>
          </span>

          <span className={styles.introScreenReader}>
            Discover my projects
          </span>
        </button>

        <iframe
          allow="autoplay; fullscreen"
          className={styles.frame}
          loading="eager"
          onLoad={handleFrameLoad}
          referrerPolicy="strict-origin-when-cross-origin"
          src={frameSrc}
          title={title}
        />
      </div>
    </section>
  )
}
