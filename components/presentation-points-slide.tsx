"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-points-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type PresentationPointsSlideProps = {
  lead: string
  points: string[]
  quote?: {
    label?: string
    text: string
  }
  sectionNumber: string
  title: string
}

export function PresentationPointsSlide({
  lead,
  points,
  quote,
  sectionNumber,
  title,
}: PresentationPointsSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section className={styles.responsive} aria-label={`${title} slide`}>
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner}>
              <div className={styles.responsiveAccentA} aria-hidden="true" />
              <div className={styles.responsiveAccentB} aria-hidden="true" />

              <header className={styles.responsiveHeader}>
                <p className={styles.responsiveEyebrow}>Section {sectionNumber}</p>
                <h1 className={styles.responsiveTitle}>{title}</h1>
                <p className={styles.responsiveLead}>{lead}</p>
              </header>

              <ol className={styles.responsiveList}>
                {points.map((point, index) => (
                  <li
                    className={styles.responsiveCard}
                    key={point}
                    style={{ "--stagger": index } as CSSProperties}
                  >
                    <span className={styles.responsiveNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={styles.responsiveText}>{point}</p>
                  </li>
                ))}
              </ol>

              {quote ? (
                <aside className={styles.responsiveQuote}>
                  {quote.label ? (
                    <p className={styles.responsiveQuoteLabel}>{quote.label}</p>
                  ) : null}
                  <blockquote className={styles.responsiveQuoteText}>
                    {quote.text}
                  </blockquote>
                </aside>
              ) : null}

              <footer className={styles.responsiveFooter}>
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
                <div className={styles.accentA} aria-hidden="true" />
                <div className={styles.accentB} aria-hidden="true" />

                <div className={styles.content}>
                  <header className={styles.header}>
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.lead}>{lead}</p>
                  </header>

                  <div className={styles.bodyColumn}>
                    <ol className={styles.list}>
                      {points.map((point, index) => (
                        <li
                          className={styles.card}
                          key={point}
                          style={{ "--stagger": index } as CSSProperties}
                        >
                          <span className={styles.number}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className={styles.text}>{point}</p>
                        </li>
                      ))}
                    </ol>

                    {quote ? (
                      <aside className={styles.quote}>
                        {quote.label ? (
                          <p className={styles.quoteLabel}>{quote.label}</p>
                        ) : null}
                        <blockquote className={styles.quoteText}>{quote.text}</blockquote>
                      </aside>
                    ) : null}
                  </div>
                </div>

                <footer className={styles.footer}>
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
