"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-locus-reasons-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type PresentationLocusReasonsSlideProps = {
  lead: string
  points: string[]
  sectionNumber: string
}

export function PresentationLocusReasonsSlide({
  lead,
  points,
  sectionNumber,
}: PresentationLocusReasonsSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section
            aria-label="Why I Choose LOCUS-T slide"
            className={styles.responsive}
          >
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <div
                className={styles.responsiveBrandGhost}
                aria-hidden="true"
                data-transition-content="decor"
              >
                <span>LOCUS-T</span>
              </div>

              <header className={styles.responsiveHeader} data-transition-content="header">
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>
                <div className={styles.responsiveTitleWrap}>
                  <p className={styles.responsivePreTitle}>Why I Choose</p>
                  <h1 className={styles.responsiveHeroTitle}>LOCUS-T</h1>
                </div>
                <p className={styles.responsiveLead}>{lead}</p>
              </header>

              <ol className={styles.responsiveReasons} data-transition-content="main">
                {points.map((point, index) => (
                  <li
                    className={styles.responsiveReason}
                    key={point}
                    style={{ "--stagger": index } as CSSProperties}
                  >
                    <span className={styles.responsiveReasonNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={styles.responsiveReasonText}>{point}</p>
                  </li>
                ))}
              </ol>

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
          <section aria-label="Why I Choose LOCUS-T slide" className={styles.desktop}>
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
                  <span>LOCUS-T</span>
                </div>

                <div
                  className={styles.logoGhost}
                  aria-hidden="true"
                  data-transition-content="decor"
                >
                  <Image
                    alt=""
                    fill
                    sizes="280px"
                    src="/reference/figma-20-2-logo.png"
                  />
                </div>

                <div className={styles.content} data-transition-panel>
                  <header className={styles.header} data-transition-content="header">
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles.preTitle}>Why I Choose</p>
                      <h1 className={styles.heroTitle}>LOCUS-T</h1>
                    </div>

                    <div className={styles.leadBlock}>
                      <span className={styles.leadRule} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <ol className={styles.reasons} data-transition-content="main">
                    {points.map((point, index) => (
                      <li
                        className={styles.reason}
                        key={point}
                        style={{ "--stagger": index } as CSSProperties}
                      >
                        <div className={styles.reasonTop}>
                          <span className={styles.reasonNumber}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.reasonLine} aria-hidden="true" />
                        </div>

                        <p className={styles.reasonText}>{point}</p>
                      </li>
                    ))}
                  </ol>
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
      </div>
    </main>
  )
}
