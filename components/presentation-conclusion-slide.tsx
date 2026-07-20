"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-conclusion-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type PresentationConclusionSlideProps = {
  lead: string
  points: string[]
  sectionNumber: string
}

function renderConclusionIcon(index: number, className: string) {
  switch (index) {
    case 0:
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 64 64"
        >
          <path d="M8 34 20 22h24l12 12" />
          <path d="M12 30h40" />
          <circle cx="32" cy="31" r="8" />
          <path d="M18 22l-4-8" />
          <path d="M25 20l-2-10" />
          <path d="M32 19V8" />
          <path d="M39 20l2-10" />
          <path d="M46 22l4-8" />
        </svg>
      )
    case 1:
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 64 64"
        >
          <circle cx="16" cy="11" r="4.5" />
          <path d="M12 28l7-9 8 5" />
          <path d="M15 28l-6 11" />
          <path d="M23 31l7 1" />
          <path d="M21 23l-1 12" />
          <path d="M20 35l-6 11" />
          <path d="M21 35l9 11" />
          <path d="M7 49V40h8v9z" />
          <path d="M20 49V31h9v18z" />
          <path d="M34 49V24h9v25z" />
          <path d="M48 49V14h9v35z" />
          <path d="M34 18l18-12" />
          <path d="M45 6h7v7" />
        </svg>
      )
    default:
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 64 64"
        >
          <path d="M20 44V18a15 15 0 0 1 30 0" />
          <path d="M50 18c0 6-2 11-4 15" />
          <path d="M22 45h26v7H22z" />
          <path d="M24 52l2 4h18l2-4" />
          <path d="M30 56v4h10v-4" />
          <circle cx="30" cy="22" r="5" />
          <path d="M30 27v11" />
          <path d="M30 29h18" />
          <rect height="14" rx="3" width="6" x="44" y="22" />
          <path d="M50 24h2a5 5 0 0 1 0 10h-2" />
        </svg>
      )
  }
}

export function PresentationConclusionSlide({
  lead,
  points,
  sectionNumber,
}: PresentationConclusionSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section aria-label="Conclusion slide" className={styles.responsive}>
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <div
                className={styles.responsiveBrandGhost}
                aria-hidden="true"
                data-transition-content="decor"
              >
                <span>FINAL</span>
              </div>

              <header className={styles.responsiveHeader} data-transition-content="header">
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>

                <div className={styles.responsiveTitleWrap}>
                  <p className={styles.responsivePreTitle}>Final</p>
                  <h1 className={styles.responsiveHeroTitle}>Conclusion</h1>
                </div>

                <div className={styles.responsiveLeadBlock}>
                  <span className={styles.responsiveLeadRule} aria-hidden="true" />
                  <p className={styles.responsiveLead}>{lead}</p>
                </div>
              </header>

              <ol className={styles.responsiveTakeaways} data-transition-content="main">
                {points.map((point, index) => (
                  <li
                    className={[
                      styles.responsiveTakeaway,
                      index === 1 ? styles.responsiveTakeawayFeature : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={point}
                    style={{ "--stagger": index } as CSSProperties}
                    >
                      <div className={styles.responsiveTakeawayTop}>
                        <span className={styles.responsiveTakeawayNumber}>
                          {renderConclusionIcon(
                            index,
                            styles.responsiveTakeawayIcon
                          )}
                        </span>
                        <span className={styles.responsiveTakeawayLabel}>
                          {index === 0
                          ? "Perspective"
                          : index === 1
                            ? "Growth"
                            : "Takeaway"}
                      </span>
                    </div>

                    <p className={styles.responsiveTakeawayText}>{point}</p>
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
          <section aria-label="Conclusion slide" className={styles.desktop}>
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
                  <span>FINAL</span>
                </div>

                <div className={styles.content} data-transition-panel>
                  <header className={styles.header} data-transition-content="header">
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles.preTitle}>Final</p>
                      <h1 className={styles.heroTitle}>Conclusion</h1>
                    </div>

                    <div className={styles.leadBlock}>
                      <span className={styles.leadRule} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <ol className={styles.takeaways} data-transition-content="main">
                    {points.map((point, index) => (
                      <li
                        className={[
                          styles.takeaway,
                          index === 1 ? styles.takeawayFeature : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={point}
                        style={{ "--stagger": index } as CSSProperties}
                      >
                        <div className={styles.takeawayTop}>
                          <span className={styles.takeawayNumber}>
                            {renderConclusionIcon(index, styles.takeawayIcon)}
                          </span>
                          <span className={styles.takeawayLabel}>
                            {index === 0
                              ? "Perspective"
                              : index === 1
                                ? "Growth"
                                : "Takeaway"}
                          </span>
                        </div>

                        <p className={styles.takeawayText}>{point}</p>
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
