"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react"
import { useEffect, useMemo, useState } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-phases-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type PhaseVideo = {
  title: string
  url: string
}

type PhaseImage = {
  title: string
  url: string
}

type PhaseModalItem =
  | (PhaseVideo & { kind: "video" })
  | (PhaseImage & { kind: "image" })

type PhaseGroup = {
  duration: string
  images?: PhaseImage[]
  items: string[]
  title: string
  videos?: PhaseVideo[]
}

type PresentationPhasesSlideProps = {
  lead: string
  phaseGroups: PhaseGroup[]
  sectionNumber: string
  title: string
}

function getPhaseDetailLines(detail: string) {
  switch (detail) {
    case "Signature Market - Two Tails":
      return ["Signature Market", "Two Tails"]
    case "Kenny Hills Bakers - Peach Strudel":
      return ["Kenny Hills Bakers", "Peach Strudel"]
    case "Kapten Batik":
      return ["Kapten Batik"]
    case "Frontend refinement, Backend learning & support":
      return ["Frontend refinement,", "Backend learning", "& support"]
    default:
      return [detail]
  }
}

function getPhaseTitleLines(title: string) {
  switch (title) {
    case "AI Video Generation Reels":
      return ["AI Video", "Generation Reels"]
    case "AI Website Generation":
      return ["AI Website", "Generation"]
    default:
      return [title]
  }
}

function extractDriveFileId(url: string) {
  const match = url.match(/\/d\/([^/]+)/)
  return match?.[1] ?? null
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

function toDrivePreviewUrl(url: string, autoplay = true) {
  const fileId = extractDriveFileId(url)
  return fileId
    ? `https://drive.google.com/file/d/${fileId}/preview?autoplay=${autoplay ? 1 : 0}&mute=1`
    : url
}

export function PresentationPhasesSlide({
  lead,
  phaseGroups,
  sectionNumber,
  title,
}: PresentationPhasesSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )
  const [activeModalItems, setActiveModalItems] = useState<PhaseModalItem[]>([])
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [shouldPreloadVideos, setShouldPreloadVideos] = useState(false)

  const modalItems = useMemo(() => {
    return activeModalItems.map((item) => {
      if (item.kind === "image") {
        return item
      }

      return {
        ...item,
        isDirectVideo: isDirectVideoUrl(item.url),
        previewUrl: isDirectVideoUrl(item.url) ? item.url : toDrivePreviewUrl(item.url),
      }
    })
  }, [activeModalItems])
  const preloadVideos = useMemo(() => {
    const seen = new Set<string>()

    return phaseGroups
      .flatMap((group) => group.videos ?? [])
      .filter((video) => {
        if (seen.has(video.url)) {
          return false
        }

        seen.add(video.url)
        return true
      })
      .map((video) => ({
        ...video,
        isDirectVideo: isDirectVideoUrl(video.url),
        previewUrl: isDirectVideoUrl(video.url)
          ? video.url
          : toDrivePreviewUrl(video.url, false),
      }))
  }, [phaseGroups])
  const [preTitle, heroTitle] = title.split(" / ")
  const ghostLabel = "TIMELINE"
  const isImageGallery = modalItems.length > 0 && modalItems.every((item) => item.kind === "image")
  const activeGalleryItem =
    isImageGallery && modalItems[activeGalleryIndex]?.kind === "image"
      ? modalItems[activeGalleryIndex]
      : null

  const closeActiveModal = () => {
    setActiveModalItems([])
    setActiveGalleryIndex(0)
  }

  useEffect(() => {
    if (activeModalItems.length === 0) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeActiveModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeModalItems.length])

  useEffect(() => {
    if (!isImageGallery || modalItems.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveGalleryIndex((currentIndex) => (currentIndex + 1) % modalItems.length)
    }, 2600)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isImageGallery, modalItems.length])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShouldPreloadVideos(true)
    }, 1200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const getGroupModalItems = (group: PhaseGroup): PhaseModalItem[] => {
    if (group.videos?.length) {
      return group.videos.map((video) => ({
        ...video,
        kind: "video" as const,
      }))
    }

    if (group.images?.length) {
      return group.images.map((image) => ({
        ...image,
        kind: "image" as const,
      }))
    }

    return []
  }

  const openGroupMedia = (group: PhaseGroup) => {
    const items = getGroupModalItems(group)

    if (!items.length) {
      return
    }

    setActiveGalleryIndex(0)
    setActiveModalItems(items)
  }

  const handleGroupKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
    group: PhaseGroup
  ) => {
    if (getGroupModalItems(group).length === 0) {
      return
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openGroupMedia(group)
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section className={styles.responsive} aria-label={`${title} slide`}>
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <div
                className={styles.responsiveBrandGhost}
                aria-hidden="true"
                data-transition-content="decor"
              >
                <span>{ghostLabel}</span>
              </div>

              <header className={styles.responsiveHeader} data-transition-content="header">
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>

                <div className={styles.responsiveTitleWrap}>
                  <p className={styles.responsivePreTitle}>{preTitle}</p>
                  <h1 className={styles.responsiveHeroTitle}>{heroTitle ?? preTitle}</h1>
                </div>

                <div className={styles.responsiveLeadBlock}>
                  <span className={styles.responsiveLeadRule} aria-hidden="true" />
                  <p className={styles.responsiveLead}>{lead}</p>
                </div>
              </header>

              <div className={styles.responsiveRoadmap} data-transition-content="main">
                <div className={styles.responsiveRoadmapTrack} aria-hidden="true" />
                <div className={styles.responsivePhases}>
                {phaseGroups.map((group, index) => (
                  <section
                    aria-label={
                      getGroupModalItems(group).length
                        ? `${group.title}. Tap the card to open the preview.`
                        : undefined
                    }
                    className={[
                      styles.responsivePhase,
                      getGroupModalItems(group).length ? styles.interactiveGroup : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`${group.title}-${group.items[0] ?? index}`}
                    onClick={() => openGroupMedia(group)}
                    onKeyDown={(event) => handleGroupKeyDown(event, group)}
                    role={getGroupModalItems(group).length ? "button" : undefined}
                    style={{ "--stagger": index } as CSSProperties}
                    tabIndex={getGroupModalItems(group).length ? 0 : undefined}
                  >
                    <div className={styles.responsivePhaseArchWrap} aria-hidden="true">
                      <div className={styles.responsivePhaseArch} />
                      <div className={styles.responsivePhaseArchCore} />
                      <span className={styles.responsiveStageBadge}>
                        Phase {index + 1}
                      </span>
                    </div>

                    <div className={styles.responsivePhaseText}>
                      <div className={styles.responsiveGroupTop}>
                        <h2 className={styles.responsiveGroupTitle}>
                          {getPhaseTitleLines(group.title).map((line, lineIndex) => (
                            <span key={`${group.title}-${lineIndex}`}>{line}</span>
                          ))}
                        </h2>
                        <p className={styles.responsivePhaseDetail}>
                          {getPhaseDetailLines(group.items[0] ?? "").map(
                            (line, lineIndex) => (
                              <span key={`${group.items[0]}-${lineIndex}`}>{line}</span>
                            )
                          )}
                        </p>
                      </div>

                      <div className={styles.responsivePhaseMeta}>
                        <p className={styles.responsiveDuration}>Duration</p>
                        <p className={styles.responsiveDurationValue}>{group.duration}</p>
                      </div>
                    </div>

                    {getGroupModalItems(group).length ? (
                      <p className={styles.responsiveGroupHint}>
                        Tap the phase to open the preview.
                      </p>
                    ) : null}
                  </section>
                ))}
                </div>
              </div>

              <footer className={styles.responsiveFooter} data-transition-content="footer">
                <div className={styles.responsiveFooterLine} aria-hidden="true" />

                <div className={styles.responsiveFooterMeta}>
                  <div className={styles.responsiveLogo}>
                    <Image
                      alt="Locus-T"
                      fill
                      sizes="(max-width: 767px) 110px, 127px"
                      src="/reference/figma-20-2-logo.png"
                    />
                  </div>

                  <p className={styles.responsiveFooterText}>LOCUS-T SDN BHD</p>
                </div>
              </footer>
            </div>
          </section>
        ) : (
          <section className={styles.desktop} aria-label={`${title} slide`}>
            <div
              className={styles.canvas}
              style={{ "--slide-scale": scale } as CSSProperties}
            >
              <div className={styles.frame}>
                <div className={styles.topLine} aria-hidden="true" />
                <div
                  className={styles.brandGhost}
                  aria-hidden="true"
                  data-transition-content="decor"
                >
                  <span>{ghostLabel}</span>
                </div>

                <div className={styles.content} data-transition-panel>
                  <header className={styles.header} data-transition-content="header">
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles.preTitle}>{preTitle}</p>
                      <h1 className={styles.heroTitle}>{heroTitle ?? preTitle}</h1>
                    </div>

                    <div className={styles.leadBlock}>
                      <span className={styles.leadRule} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <div className={styles.roadmap} data-transition-content="main">
                    <div className={styles.roadmapTrack} aria-hidden="true" />
                    <div className={styles.phases}>
                    {phaseGroups.map((group, index) => (
                      <section
                        aria-label={
                          getGroupModalItems(group).length
                            ? `${group.title}. Click the card to open the preview.`
                            : undefined
                        }
                        className={[
                          styles.phase,
                          getGroupModalItems(group).length ? styles.interactiveGroup : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={`${group.title}-${group.items[0] ?? index}`}
                        onClick={() => openGroupMedia(group)}
                        onKeyDown={(event) => handleGroupKeyDown(event, group)}
                        role={getGroupModalItems(group).length ? "button" : undefined}
                        style={{ "--stagger": index } as CSSProperties}
                        tabIndex={getGroupModalItems(group).length ? 0 : undefined}
                      >
                        <div className={styles.phaseArchWrap} aria-hidden="true">
                          <div className={styles.phaseArch} />
                          <div className={styles.phaseArchCore} />
                          <span className={styles.stageBadge}>Phase {index + 1}</span>
                        </div>

                        <div className={styles.phaseText}>
                          <div className={styles.groupTop}>
                            <h2 className={styles.groupTitle}>
                              {getPhaseTitleLines(group.title).map((line, lineIndex) => (
                                <span key={`${group.title}-${lineIndex}`}>{line}</span>
                              ))}
                            </h2>

                            <p className={styles.phaseDetail}>
                              {getPhaseDetailLines(group.items[0] ?? "").map(
                                (line, lineIndex) => (
                                  <span key={`${group.items[0]}-${lineIndex}`}>{line}</span>
                                )
                              )}
                            </p>
                          </div>

                          <div className={styles.phaseMeta}>
                            <p className={styles.duration}>Duration</p>
                            <p className={styles.durationValue}>{group.duration}</p>
                          </div>
                        </div>

                        {getGroupModalItems(group).length ? (
                          <p className={styles.groupHint}>
                            Click the phase to open the preview.
                          </p>
                        ) : null}
                      </section>
                    ))}
                    </div>
                  </div>
                </div>

                <footer className={styles.footer} data-transition-content="footer">
                  <div className={styles.footerLine} aria-hidden="true" />

                  <div className={styles.footerMeta}>
                    <div className={styles.logo}>
                      <Image
                        alt="Locus-T"
                        fill
                        sizes="127px"
                        src="/reference/figma-20-2-logo.png"
                      />
                    </div>

                    <p className={styles.footerText}>LOCUS-T SDN BHD</p>
                  </div>
                </footer>
              </div>
            </div>
          </section>
        )}

        {modalItems.length > 0 ? (
          <div
            aria-hidden="true"
            className={styles.modalBackdrop}
            onClick={closeActiveModal}
          />
        ) : null}

        {shouldPreloadVideos && preloadVideos.length > 0 ? (
          <div aria-hidden="true" className={styles.preloadVideoCache}>
            {preloadVideos.map((video) => (
              video.isDirectVideo ? (
                <video
                  key={video.url}
                  muted
                  playsInline
                  preload="auto"
                  src={video.previewUrl}
                />
              ) : (
                <iframe
                  key={video.url}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  loading="eager"
                  src={video.previewUrl}
                  tabIndex={-1}
                  title={`Preload ${video.title}`}
                />
              )
            ))}
          </div>
        ) : null}

        {modalItems.length > 0 ? (
          <section
            aria-label={isImageGallery ? "Website preview gallery" : "Video preview"}
            aria-modal="true"
            className={[
              styles.modal,
              isImageGallery ? styles.imageModal : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="dialog"
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>
                  {isImageGallery ? "AI Website Preview" : "AI Video Preview"}
                </p>
                <h2 className={styles.modalTitle}>
                  {modalItems.length === 1
                    ? modalItems[0]?.title
                    : isImageGallery
                      ? "AI Website Generation Gallery"
                      : "Phase 1 - 3 Reels"}
                </h2>
              </div>

              <button
                aria-label="Close preview"
                className={styles.modalClose}
                onClick={closeActiveModal}
                type="button"
              >
                Close
              </button>
            </div>

            {isImageGallery && activeGalleryItem?.kind === "image" ? (
              <div className={styles.imageCarousel}>
                <article
                  className={[styles.videoCard, styles.videoCardSingle, styles.imageCard]
                    .filter(Boolean)
                    .join(" ")}
                  key={activeGalleryItem.url}
                >
                  <div className={styles.imageCarouselMeta}>
                    <h3 className={styles.videoTitle}>{activeGalleryItem.title}</h3>
                    <p className={styles.imageCarouselCount}>
                      {String(activeGalleryIndex + 1).padStart(2, "0")} /{" "}
                      {String(modalItems.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div
                    className={[styles.videoFrame, styles.imageFrame, styles.imageCarouselFrame]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Image
                      alt={activeGalleryItem.title}
                      fill
                      priority
                      sizes="(max-width: 767px) 82vw, 58vw"
                      src={activeGalleryItem.url}
                    />
                  </div>

                  {modalItems.length > 1 ? (
                    <div className={styles.imageCarouselArrows}>
                      <button
                        aria-label="Show previous website preview"
                        className={styles.imageCarouselArrow}
                        onClick={() =>
                          setActiveGalleryIndex(
                            (activeGalleryIndex - 1 + modalItems.length) % modalItems.length
                          )
                        }
                        type="button"
                      >
                        {"<"}
                      </button>

                      <button
                        aria-label="Show next website preview"
                        className={styles.imageCarouselArrow}
                        onClick={() =>
                          setActiveGalleryIndex((activeGalleryIndex + 1) % modalItems.length)
                        }
                        type="button"
                      >
                        {">"}
                      </button>
                    </div>
                  ) : null}
                </article>

                <div
                  aria-label="Website preview navigation"
                  className={styles.imageDots}
                  role="tablist"
                >
                  {modalItems.map((item, index) => (
                    <button
                      aria-label={`Show ${item.title}`}
                      aria-selected={index === activeGalleryIndex}
                      className={[
                        styles.imageDot,
                        index === activeGalleryIndex ? styles.imageDotActive : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={item.url}
                      onClick={() => setActiveGalleryIndex(index)}
                      role="tab"
                      type="button"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={[
                  styles.videoGrid,
                  modalItems.length === 1 ? styles.videoGridSingle : "",
                  modalItems.length > 1 ? styles.videoGridMulti : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {modalItems.map((item) => (
                  <article
                    className={[
                      styles.videoCard,
                      modalItems.length === 1 ? styles.videoCardSingle : "",
                      modalItems.length > 1 ? styles.videoCardMulti : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={item.url}
                  >
                    {modalItems.length > 1 ? (
                      <h3 className={styles.videoTitle}>{item.title}</h3>
                    ) : null}
                    <div className={styles.videoFrame}>
                      {item.kind === "video" && item.isDirectVideo ? (
                        <video
                          autoPlay
                          controls
                          playsInline
                          preload="auto"
                          src={item.previewUrl}
                        />
                      ) : item.kind === "video" ? (
                        <iframe
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                          loading="lazy"
                          src={item.previewUrl}
                          title={item.title}
                        />
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </main>
  )
}
