"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-initial-expectation-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type ExpectationPoint = {
  label: string
  text: string
}

type PresentationInitialExpectationSlideProps = {
  lead: string
  points: ExpectationPoint[]
  sectionNumber: string
}

function getBubbleLines(label: string, text: string) {
  switch (label) {
    case "Real Work":
      return ["Learn how real digital", "marketing works."]
    case "HANDS-ON EXPERIENCE":
      return ["Gain hands-on experience in", "real working environment"]
    case "Client Output":
      return ["Learn how ideas become", "real client outputs."]
    default:
      return [text]
  }
}

export function PresentationInitialExpectationSlide({
  lead,
  points,
  sectionNumber,
}: PresentationInitialExpectationSlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )

  return (
    <main className={styles.shell}>
      <div className={styles.viewport} ref={viewportRef}>
        {isResponsiveViewport ? (
          <section
            aria-label="My Initial Expectations slide"
            className={styles.responsive}
          >
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner} data-transition-panel>
              <div
                className={styles.responsiveBrandGhost}
                aria-hidden="true"
                data-transition-content="decor"
              >
                <span>EXPECTATION</span>
              </div>

              <header
                className={styles.responsiveHeader}
                data-transition-content="header"
              >
                <p className={styles.responsiveEyebrow}>
                  Section {sectionNumber}
                </p>

                <div className={styles.responsiveTitleWrap}>
                  <p className={styles.responsivePreTitle}>My Initial</p>
                  <h1 className={styles.responsiveHeroTitle}>EXPECTATION</h1>
                </div>

                <div className={styles.responsiveLeadBlock}>
                  <span
                    className={styles.responsiveLeadRule}
                    aria-hidden="true"
                  />
                  <p className={styles.responsiveLead}>{lead}</p>
                </div>
              </header>

              <div
                className={styles.responsiveScene}
                data-transition-content="main"
              >
                <div
                  className={styles.responsiveThoughtCore}
                  aria-hidden="true"
                >
                  <span className={styles.responsiveThoughtHalo} />
                  <span className={styles.responsiveThoughtOrbPrimary} />
                  <span className={styles.responsiveThoughtOrbSecondary} />
                  <span className={styles.responsiveThoughtOrbTertiary} />
                </div>

                <ol className={styles.responsivePoints}>
                  {points.map((point, index) => (
                    <li
                      className={styles.responsivePoint}
                      data-bubble={index + 1}
                      data-emphasis={index === 1 ? "strong" : "default"}
                      key={point.label}
                      style={{ "--stagger": index } as CSSProperties}
                    >
                      <div className={styles.responsivePointContent}>
                        <div className={styles.responsivePointTop}>
                          <span className={styles.responsivePointNumber}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className={styles.responsivePointLabel}>
                            {point.label}
                          </p>
                        </div>

                        <p className={styles.responsivePointText}>
                          {getBubbleLines(point.label, point.text).map(
                            (line, lineIndex) => (
                              <span
                                className={styles.pointTextLine}
                                key={`${point.label}-${lineIndex}`}
                              >
                                {line}
                              </span>
                            )
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className={styles.responsiveFigure} aria-hidden="true">
                  <Image
                    alt=""
                    className={styles.responsiveFigureImage}
                    fill
                    sizes="(max-width: 767px) 240px, 320px"
                    src="/reference/slide-5-woman-cutout.png"
                  />
                </div>
              </div>

              <footer
                className={styles.responsiveFooter}
                data-transition-content="footer"
              >
                <div
                  className={styles.responsiveFooterLine}
                  aria-hidden="true"
                />

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
          <section
            aria-label="My Initial Expectations slide"
            className={styles.desktop}
          >
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
                  <span>EXPECTATION</span>
                </div>

                <div className={styles.content} data-transition-panel>
                  <header
                    className={styles.header}
                    data-transition-content="header"
                  >
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    <div className={styles.titleWrap}>
                      <p className={styles.preTitle}>My Initial</p>
                      <h1 className={styles.heroTitle}>EXPECTATION</h1>
                    </div>

                    <div className={styles.leadBlock}>
                      <span className={styles.leadRule} aria-hidden="true" />
                      <p className={styles.lead}>{lead}</p>
                    </div>
                  </header>

                  <div className={styles.scene} data-transition-content="main">
                    <div className={styles.thoughtCore} aria-hidden="true">
                      <span className={styles.thoughtHalo} />
                      <span className={styles.thoughtRing} />
                      <span className={styles.thoughtOrbPrimary} />
                      <span className={styles.thoughtOrbSecondary} />
                      <span className={styles.thoughtOrbTertiary} />
                    </div>

                    <ol className={styles.points}>
                      {points.map((point, index) => (
                        <li
                          className={styles.point}
                          data-bubble={index + 1}
                          data-emphasis={index === 1 ? "strong" : "default"}
                          key={point.label}
                          style={{ "--stagger": index } as CSSProperties}
                        >
                          <div className={styles.pointContent}>
                            <div className={styles.pointTop}>
                              <span className={styles.pointNumber}>
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <p className={styles.pointLabel}>{point.label}</p>
                            </div>

                            <p className={styles.pointText}>
                              {getBubbleLines(point.label, point.text).map(
                                (line, lineIndex) => (
                                  <span
                                    className={styles.pointTextLine}
                                    key={`${point.label}-${lineIndex}`}
                                  >
                                    {line}
                                  </span>
                                )
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className={styles.figure} aria-hidden="true">
                      <Image
                        alt=""
                        className={styles.figureImage}
                        fill
                        sizes="430px"
                        src="/reference/slide-5-woman-cutout.png"
                      />
                    </div>
                  </div>
                </div>

                <footer
                  className={styles.footer}
                  data-transition-content="footer"
                >
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
