"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./section-opener-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const TRACKER_ITEMS = Array.from({ length: 9 }, (_, index) =>
  String(index + 1).padStart(2, "0")
)

type SectionOpenerSlideProps = {
  sectionNumber?: string
  title?: string
}

function renderTitle(title: string) {
  if (title === "Why I Chose the Company & My Initial Expectations") {
    return (
      <>
        Why I Chose
        <br />
        the Company & <span>My Initial Expectations</span>
      </>
    )
  }

  if (title.includes("&")) {
    const [before, after] = title.split(/&(.+)/)

    return (
      <>
        {before.trim()} & <span>{after.trim()}</span>
      </>
    )
  }

  const words = title.trim().split(/\s+/)

  if (words.length <= 1) {
    return <span>{title}</span>
  }

  const highlight = words.pop()

  return (
    <>
      {words.join(" ")} <span>{highlight}</span>
    </>
  )
}

export function SectionOpenerSlide({
  sectionNumber = "01",
  title = "Section Title",
}: SectionOpenerSlideProps) {
  const showNumber = sectionNumber.trim().length > 0
  const { isResponsiveViewport, scale, viewportHeight, viewportRef, viewportWidth } =
    useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )
  const useAdaptiveLayout =
    isResponsiveViewport || (viewportWidth > 0 && viewportHeight > 0 && viewportHeight < 760)
  const useCompactFallbackLayout =
    useAdaptiveLayout &&
    ((viewportWidth > 0 && viewportWidth <= 560) ||
      (viewportHeight > 0 && viewportHeight <= 760) ||
      scale <= 0.52)

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.edgeDecor} aria-hidden="true">
          <div className={styles.edgeStripes} />
          <div className={styles.edgeDotClusterBottom} />
          <div className={styles.edgeRightDecor}>
            <span className={styles.edgeRightHexOne} />
            <span className={styles.edgeRightHexTwo} />
            <span className={styles.edgeRightHexThree} />
            <span className={styles.edgeRightHexFour} />
            <span className={styles.edgeRightLine} />
          </div>
          <div className={styles.edgeCornerHex} />
          <div className={styles.edgeFooterRule} />
        </div>

        {useAdaptiveLayout ? (
          <section
            className={[
              styles.responsive,
              useCompactFallbackLayout ? styles.responsiveCompact : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Section opener slide"
          >
            <div className={styles.responsiveInner}>
              <div className={styles.responsiveStripes} aria-hidden="true" />
              <div className={styles.responsiveDecor} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className={styles.responsiveShapes} aria-hidden="true">
                {showNumber ? (
                  <p className={styles.responsiveNumber} data-transition-content="title">
                    {sectionNumber}
                  </p>
                ) : null}
              </div>

              <div className={styles.responsiveCopy} data-transition-content="title">
                <h1 className={styles.responsiveTitle}>{renderTitle(title)}</h1>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.desktop} aria-label="Section opener slide">
            <div
              className={styles.canvas}
              style={{ "--slide-scale": scale } as CSSProperties}
            >
              <div className={styles.frame}>
                <div className={styles.stripes} aria-hidden="true" />
                <div className={styles.dotClusterTop} aria-hidden="true" />
                <div className={styles.dotClusterBottom} aria-hidden="true" />
                <div className={styles.rightDecor} aria-hidden="true">
                  <span className={styles.rightHexOne} />
                  <span className={styles.rightHexTwo} />
                  <span className={styles.rightHexThree} />
                  <span className={styles.rightHexFour} />
                  <span className={styles.rightLine} />
                </div>
                <div className={styles.cornerHex} aria-hidden="true" />
                <div className={styles.footerRule} aria-hidden="true" />

                <nav className={styles.tracker} aria-label="Section tracker">
                  {TRACKER_ITEMS.map((item) => {
                    const isActive = item === sectionNumber

                    return (
                      <div
                        className={[
                          styles.trackerItem,
                          isActive ? styles.trackerItemActive : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={item}
                      >
                        <span>{item}</span>
                      </div>
                    )
                  })}
                </nav>

                <h1 className={styles.title} data-transition-content="title">
                  {renderTitle(title)}
                </h1>

                {showNumber ? (
                  <p className={styles.number} data-transition-content="title">
                    {sectionNumber}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
