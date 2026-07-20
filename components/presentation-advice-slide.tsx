"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-advice-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type PresentationAdviceSlideProps = {
  lead: string
  points: string[]
  quoteReveal?: boolean
  quote: {
    label?: string
    text: string | string[]
  }
  sectionNumber: string
  title: string
}

export function PresentationAdviceSlide({
  lead,
  points,
  quoteReveal = false,
  quote,
  sectionNumber,
  title,
}: PresentationAdviceSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )

  const titleTop = "Advice to My Future"
  const titleBottom = "Junior Intern"
  const quoteLines = Array.isArray(quote.text) ? quote.text : [quote.text]

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section aria-label={`${title} slide`} className={styles.responsive}>
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <header
                className={styles.responsiveHeader}
                data-transition-content="header"
              >
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>

                <div className={styles.responsiveTitleWrap}>
                  <p className={styles.responsivePreTitle}>{titleTop}</p>
                  <h1 className={styles.responsiveHeroTitle}>
                    {titleBottom || titleTop}
                  </h1>
                </div>

                <div className={styles.responsiveLeadBlock}>
                  <span className={styles.responsiveLeadRule} aria-hidden="true" />
                  <p className={styles.responsiveLead}>{lead}</p>
                </div>
              </header>

              <div
                className={styles.responsiveBody}
                data-transition-content="main"
              >
                <ol className={styles.responsiveAdviceList}>
                  {points.map((point, index) => (
                    <li
                      className={[
                        styles.responsiveAdviceCard,
                        index === 2 ? styles.responsiveAdviceCardFeature : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={point}
                      style={{ "--stagger": index } as CSSProperties}
                    >
                      <div className={styles.responsiveAdviceTop}>
                        <span className={styles.responsiveAdviceNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.responsiveAdviceLabel}>
                          {index === 0
                            ? "Ask Early"
                            : index === 1
                              ? "Think Carefully"
                              : "Keep Growing"}
                        </span>
                      </div>

                      <p className={styles.responsiveAdviceText}>{point}</p>
                    </li>
                  ))}
                </ol>

                <div className={styles.responsiveFigureWrap} aria-hidden="true">
                  <Image
                    alt=""
                    className={styles.responsiveFigure}
                    height={440}
                    sizes="(max-width: 767px) 220px, 320px"
                    src="/reference/slide-18-woman-transparent.png"
                    width={410}
                  />
                </div>

                {quoteReveal ? (
                  <div className={styles.responsiveBubbleLayer} aria-hidden="true">
                    {quoteLines.map((line, index) => (
                      <div
                        className={[
                          styles.responsiveQuoteBubble,
                          index === 0
                            ? styles.responsiveQuoteBubblePrimary
                            : styles.responsiveQuoteBubbleSecondary,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={line}
                        style={{ "--stagger": index } as CSSProperties}
                      >
                        <p className={styles.responsiveQuoteBubbleText}>{line}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
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
          <section aria-label={`${title} slide`} className={styles.desktop}>
            <div
              className={styles.canvas}
              style={{ "--slide-scale": scale } as CSSProperties}
            >
              <div className={styles.frame}>
                <div className={styles.topLine} aria-hidden="true" />

                <div
                  className={styles.content}
                  data-transition-panel
                >
                  <header
                    className={styles.header}
                    data-transition-content="header"
                  >
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles.preTitle}>{titleTop}</p>
                      <h1 className={styles.heroTitle}>{titleBottom || titleTop}</h1>
                    </div>

                    <div className={styles.leadBlock}>
                      <span className={styles.leadRule} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <div
                    className={styles.bodyColumn}
                    data-transition-content="main"
                  >
                    <ol className={styles.adviceList}>
                      {points.map((point, index) => (
                        <li
                          className={[
                            styles.adviceCard,
                            index === 2 ? styles.adviceCardFeature : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={point}
                          style={{ "--stagger": index } as CSSProperties}
                        >
                          <div className={styles.adviceTop}>
                            <span className={styles.adviceNumber}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.adviceLabel}>
                              {index === 0
                                ? "Ask Early"
                                : index === 1
                                  ? "Think Carefully"
                                  : "Keep Growing"}
                            </span>
                          </div>

                          <p className={styles.adviceText}>{point}</p>
                        </li>
                      ))}
                    </ol>

                    <div className={styles.figureWrap} aria-hidden="true">
                      <Image
                        alt=""
                        className={styles.figure}
                        height={440}
                        sizes="320px"
                        src="/reference/slide-18-woman-transparent.png"
                        width={410}
                      />
                    </div>

                    {quoteReveal ? (
                      <div className={styles.bubbleLayer} aria-hidden="true">
                        {quoteLines.map((line, index) => (
                          <div
                            className={[
                              styles.quoteBubble,
                              index === 0
                                ? styles.quoteBubblePrimary
                                : styles.quoteBubbleSecondary,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            key={line}
                            style={{ "--stagger": index } as CSSProperties}
                          >
                            <p className={styles.quoteBubbleText}>{line}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
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
