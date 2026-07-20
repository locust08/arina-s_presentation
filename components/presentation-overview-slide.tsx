"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-overview-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type OverviewCard = {
  body: string
  label: string
}

type PresentationOverviewSlideProps = {
  cards: OverviewCard[]
  lead: string
  sectionNumber: string
  title: string
}

function OverviewBadgeIcon({ label }: { label: string }) {
  if (label === "Strategic Goal") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <path d="M22 36v-3.5c-4-2.8-6.5-7.1-6.5-12 0-8.6 7.1-15.5 16.5-15.5s16.5 6.9 16.5 15.5c0 4.9-2.5 9.2-6.5 12V36" />
        <circle cx="32" cy="20.5" r="11.5" />
        <circle cx="32" cy="20.5" r="6" />
        <circle cx="32" cy="20.5" r="2" fill="currentColor" stroke="none" />
        <path d="M32 20.5h16.5" />
        <path d="m44.5 17.5 8 3-8 3" />
        <path d="M23 36h18" />
        <path d="M23 43h18" />
        <path d="M25.5 51h13" />
      </svg>
    )
  }

  if (label === "AI Video Generation") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <path d="M46 48A22 22 0 1 1 50 18" />
        <path d="m27 21 14 9-14 9Z" fill="currentColor" stroke="none" />
        <path d="M43 44h11" />
        <path d="M48.5 38.5v11" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <rect x="9" y="16" width="31" height="23" rx="3.2" />
      <path d="M16 31l7-7 8 9 4-4 5 5" />
      <circle cx="32.5" cy="24.5" r="2.5" />
      <path d="M23 39v8" />
      <path d="M15 47h19" />
      <rect x="39" y="12" width="16" height="16" rx="2.5" />
      <path d="M44 17h6" />
      <path d="M47 14v10" />
    </svg>
  )
}

function getOverviewLines(label: string, body: string) {
  switch (label) {
    case "Strategic Goal":
      return [
        "Explore how AI can help clients increase",
        "traffic and sales while maintaining or",
        "reducing total ad spend.",
      ]
    case "AI Video Generation":
      return [
        "Test AI-generated video production",
        "to speed up creative output and",
        "campaign execution.",
      ]
    case "AI Website & Embedded Form Generation":
      return [
        "Develop AI-assisted website and",
        "embedded forms to improve",
        "speed, consistency, and lead capture.",
      ]
    default:
      return [body]
  }
}

export function PresentationOverviewSlide({
  cards,
  lead,
  sectionNumber,
  title,
}: PresentationOverviewSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )
  const [preTitle, ...heroTitleParts] = title.split(" ")
  const heroTitle = heroTitleParts.join(" ")

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section className={styles.responsive} aria-label={`${title} slide`}>
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <header className={styles.responsiveHeader} data-transition-content="header">
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>

                <div className={styles.responsiveTitleWrap}>
                  <p className={styles["responsive-pre-title"]}>{preTitle}</p>
                  <h1 className={styles["responsive-hero-title"]}>{heroTitle}</h1>
                </div>

                <div className={styles["responsive-lead-block"]}>
                  <span className={styles["responsive-lead-rule"]} aria-hidden="true" />
                  <p className={styles.responsiveLead}>{lead}</p>
                </div>
              </header>

              <div className={styles.responsiveGrid} data-transition-content="main">
                {cards.map((card, index) => (
                  <article
                    className={[
                      styles.responsiveCard,
                      index === 0 ? styles.responsiveCardTeam : "",
                      index === 1 ? styles.responsiveCardFeature : "",
                      index === 2 ? styles.responsiveCardScope : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={card.label}
                    style={{ "--stagger": index } as CSSProperties}
                  >
                    <div className={styles["responsive-card-top"]}>
                      <span className={styles["responsive-card-number"]}>
                        <OverviewBadgeIcon label={card.label} />
                      </span>
                      <p className={styles.responsiveCardLabel}>{card.label}</p>
                    </div>
                    <p className={styles.responsiveCardBody}>{card.body}</p>
                  </article>
                ))}
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
                  className={styles["brand-ghost"]}
                  aria-hidden="true"
                  data-transition-content="decor"
                >
                  <span>OVERVIEW</span>
                </div>

                <div className={styles.content} data-transition-panel>
                  <header className={styles.header} data-transition-content="header">
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles["pre-title"]}>{preTitle}</p>
                      <h1 className={styles["hero-title"]}>{heroTitle}</h1>
                    </div>

                    <div className={styles["lead-block"]}>
                      <span className={styles["lead-rule"]} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <div className={styles.targetStage} data-transition-content="main">
                    <div className={styles.targetBackdropWord} aria-hidden="true">
                      FOCUS
                    </div>
                    <div className={styles.targetAccentBlur} aria-hidden="true" />
                    <div className={styles.targetBoard} aria-hidden="true">
                      <div className={styles.targetBoardShadow} />
                      <div className={styles.targetBoardOuter}>
                        <div className={styles.targetBoardRingA}>
                          <div className={styles.targetBoardRingB}>
                            <div className={styles.targetBoardRingC}>
                              <div className={styles.targetBoardRingD}>
                                <div className={styles.targetBoardCore} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <svg
                      aria-hidden="true"
                      className={styles.targetConnectors}
                      viewBox="0 0 1120 760"
                      preserveAspectRatio="none"
                    >
                      <path
                        className={styles.targetConnector}
                        d="M210 378 C320 228 422 86 532 19"
                      />
                      <path
                        className={styles.targetConnectorStrong}
                        d="M210 378 C384 296 530 268 648 278"
                      />
                      <path
                        className={styles.targetConnector}
                        d="M210 378 C354 430 456 502 542 590"
                      />
                      <circle className={styles.targetConnectorDot} cx="210" cy="378" r="7" />
                      <circle className={styles.targetConnectorDot} cx="532" cy="19" r="5.5" />
                      <circle className={styles.targetConnectorDot} cx="648" cy="278" r="5.5" />
                      <circle className={styles.targetConnectorDot} cx="542" cy="590" r="5.5" />
                    </svg>

                    {cards.map((card, index) => (
                      <article
                        className={[
                          styles.targetPoint,
                          index === 0 ? styles.targetPointGoal : "",
                          index === 1 ? styles.targetPointVideo : "",
                          index === 2 ? styles.targetPointWebsite : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={card.label}
                        style={{ "--stagger": index } as CSSProperties}
                      >
                        <div className={styles.targetPointTop}>
                          <span className={styles.targetPointNumber}>
                            <OverviewBadgeIcon label={card.label} />
                          </span>
                          <p className={styles.targetPointLabel}>{card.label}</p>
                        </div>
                        <p className={styles.targetPointBody}>
                          {getOverviewLines(card.label, card.body).map(
                            (line, lineIndex) => (
                              <span
                                className={styles.targetPointBodyLine}
                                key={`${card.label}-${lineIndex}`}
                              >
                                {line}
                              </span>
                            )
                          )}
                        </p>
                      </article>
                    ))}
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
      </div>
    </main>
  )
}
