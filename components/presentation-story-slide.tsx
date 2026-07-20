"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import type { CSSProperties } from "react"

import { useSlideScale } from "@/components/use-slide-scale"

import styles from "./presentation-story-slide.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

type StorySection = {
  body: string[]
  label: string
}

type PresentationStorySlideProps = {
  challengeRevealStep?: number
  lead: string
  sectionNumber: string
  sections: StorySection[]
  title: string
  variant?: "default" | "breakthrough" | "challenge"
}

function getBreakthroughReasonMeta(point: string, index: number) {
  switch (point) {
    case "It showed my prompting and testing were improving.":
      return {
        title: "Visible Progress",
        body: "My prompting and testing were getting sharper with each attempt.",
      }
    case "It proved the effort was paying off.":
      return {
        title: "Effort Rewarded",
        body: "The result confirmed that the repeated trial and error was worth it.",
      }
    case "It gave me confidence to keep refining the work.":
      return {
        title: "Confidence to Refine",
        body: "That small breakthrough gave me the push to keep improving the output.",
      }
    default:
      return {
        title: `Reason ${String(index + 1).padStart(2, "0")}`,
        body: point,
      }
  }
}

function getBreakthroughCircleStatementLines(statement: string) {
  switch (statement) {
    case "AI generated what I want":
      return ["AI generated", "what I want"]
    case "The AI finally generated something close to what I imagined.":
      return [
        "The AI finally",
        "generated something",
        "close to what",
        "I imagined.",
      ]
    default:
      return [statement]
  }
}

function getBreakthroughCircleSupportLines(support: string) {
  switch (support) {
    case "After many wrong results and repeated testing, that moment felt truly rewarding.":
      return [
        "After many wrong results and repeated testing,",
        "that moment felt truly rewarding.",
      ]
    default:
      return [support]
  }
}

function getChallengeStatementLines(statement: string) {
  switch (statement) {
    case "Figuring out the right tools and workflow":
      return ["Figuring out the", "right tools", "and workflow"]
    default:
      return [statement]
  }
}

function getChallengeSliceMeta(point: string, index: number) {
  switch (index) {
    case 0:
      return {
        anchorX: "33%",
        anchorY: "31%",
        supportLines: [],
        titleLines: ["Test & Compare", "Tools"],
      }
    case 1:
      return {
        anchorX: "74%",
        anchorY: "52%",
        supportLines: [],
        titleLines: ["Ask Early &", "Refine Flow"],
      }
    case 2:
      return {
        anchorX: "31%",
        anchorY: "71%",
        supportLines: [],
        titleLines: ["Adapt &", "Improve"],
      }
    default:
      return {
        anchorX: "50%",
        anchorY: "50%",
        supportLines: [],
        titleLines: [point],
      }
  }
}

export function PresentationStorySlide({
  challengeRevealStep = 0,
  lead,
  sectionNumber,
  sections,
  title,
  variant = "default",
}: PresentationStorySlideProps) {
  const { isResponsiveViewport, scale, viewportRef } = useSlideScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  )
  const titleWords = title.split(" ")
  const titleTop = titleWords.slice(0, 2).join(" ")
  const titleBottom = titleWords.slice(2).join(" ")
  const isBreakthrough = variant === "breakthrough"
  const isChallenge = variant === "challenge"
  const ghostLabel = isBreakthrough
    ? "EXCITING"
    : isChallenge
      ? "CHALLENGE"
      : titleWords[titleWords.length - 1]?.toUpperCase() ?? title.toUpperCase()
  const breakthroughMoment = isBreakthrough ? sections[0] : null
  const breakthroughReasons = isBreakthrough
    ? (sections[1]?.body ?? []).map((point, index) => ({
        number: String(index + 1).padStart(2, "0"),
        ...getBreakthroughReasonMeta(point, index),
      }))
    : []
  const challengeMoment = isChallenge ? sections[0] : null
  const challengeSolutions = isChallenge
    ? (sections[1]?.body ?? []).slice(0, 3).map((point, index) => ({
        number: String(index + 1).padStart(2, "0"),
        ...getChallengeSliceMeta(point, index),
      }))
    : []
  const visibleChallengeStep = Math.min(
    challengeRevealStep,
    challengeSolutions.length
  )
  const challengeSliceToneClasses = [
    styles.challengePieSliceOne,
    styles.challengePieSliceTwo,
    styles.challengePieSliceThree,
  ]
  const challengeSliceContentClasses = [
    styles.challengePieSliceContentOne,
    styles.challengePieSliceContentTwo,
    styles.challengePieSliceContentThree,
  ]
  const revealedChallengeSolutions = challengeSolutions.slice(
    0,
    visibleChallengeStep
  )
  const challengeStage =
    isChallenge && challengeMoment ? (
      <div className={styles.challengeRevealStage} data-transition-content="main">
        <div className={styles.challengeRevealCenter}>
          <div className={styles.challengeRevealIntro}>
            <p className={[styles.eyebrow, styles.challengeRevealEyebrow].join(" ")}>
              Section {sectionNumber}
            </p>

            <div className={styles.challengeRevealTitleWrap}>
              <p className={styles.challengeRevealKicker}>The Most</p>
              <h1 className={styles.challengeRevealTitle}>
                Biggest Challenge
              </h1>
            </div>

            <div className={styles.challengeRevealLeadBlock}>
              <span className={styles.challengeRevealLeadRule} aria-hidden="true" />
              <p className={styles.challengeRevealLead}>{lead}</p>
            </div>
          </div>

          <div className={styles.challengePieChart}>
            <div className={styles.challengePieCore}>
              <p className={styles.challengePieLabel}>{challengeMoment.label}</p>
              <h1 className={styles.challengePieStatement}>
                {getChallengeStatementLines(challengeMoment.body[0] ?? lead).map(
                  (line) => (
                    <span key={line}>{line}</span>
                  )
                )}
              </h1>
            </div>

            {revealedChallengeSolutions.map((solution, index) => (
              <article
                className={[
                  styles.challengePieSlice,
                  challengeSliceToneClasses[index] ?? "",
                  styles.challengePieSliceVisible,
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={solution.number}
                style={
                  {
                    "--slice-index": index,
                  } as CSSProperties
                }
              />
            ))}

            {revealedChallengeSolutions.map((solution, index) => (
              <div
                className={[
                  styles.challengePieSliceContent,
                  challengeSliceContentClasses[index] ?? "",
                  styles.challengePieSliceContentVisible,
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={`${solution.number}-content`}
                style={
                  {
                    "--slice-index": index,
                    "--slice-anchor-x": solution.anchorX,
                    "--slice-anchor-y": solution.anchorY,
                  } as CSSProperties
                }
              >
                <span className={styles.challengePieSliceNumber}>
                  {solution.number}
                </span>
                <p className={styles.challengePieSliceTitle}>
                  {solution.titleLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                {solution.supportLines.length > 0 ? (
                  <p className={styles.challengePieSliceSupport}>
                    {solution.supportLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                ) : null}
              </div>
            ))}

            <span className={styles.challengePieRing} aria-hidden="true" />
          </div>
        </div>
      </div>
    ) : null

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

              {isChallenge && challengeStage ? (
                challengeStage
              ) : (
                <>
              <header
                className={styles.responsiveHeader}
                data-transition-content="header"
              >
                <p className={styles.responsiveEyebrow}>
                  Section {sectionNumber}
                </p>

                {isBreakthrough ? (
                  <div className={styles.responsiveBreakthroughLead}>
                    <div className={styles.responsiveBreakthroughTitleWrap}>
                      <p className={styles.responsiveBreakthroughPreTitle}>
                        {titleTop}
                      </p>
                      <h1 className={styles.responsiveBreakthroughHeroTitle}>
                        {titleBottom || titleTop}
                      </h1>
                    </div>
                    <div
                      className={[
                        styles.responsiveLeadBlock,
                        styles.responsiveBreakthroughLeadBlock,
                      ].join(" ")}
                    >
                      <span
                        className={styles.responsiveLeadRule}
                        aria-hidden="true"
                      />
                      <p className={styles.responsiveBreakthroughLeadText}>
                        {lead}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className={styles.responsiveTitle}>{title}</h1>
                    <p className={styles.responsiveLead}>{lead}</p>
                  </>
                )}
              </header>

              {isBreakthrough && breakthroughMoment ? (
                <div
                  className={styles.responsiveBreakthroughLayout}
                  data-transition-content="main"
                >
                  <section
                    className={styles.responsiveBreakthroughAnchor}
                    style={{ "--stagger": 0 } as CSSProperties}
                  >
                    <div className={styles.responsiveBreakthroughCircle}>
                      <span
                        className={styles.responsiveBreakthroughCircleGlow}
                      />
                      <div className={styles.responsiveBreakthroughCircleInner}>
                        <p className={styles.responsiveBreakthroughCircleLabel}>
                          {breakthroughMoment.label}
                        </p>
                        <p
                          className={
                            styles.responsiveBreakthroughCircleStatement
                          }
                        >
                          {getBreakthroughCircleStatementLines(
                            breakthroughMoment.body[0]
                          ).map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </p>
                        {breakthroughMoment.body[1] ? (
                          <p
                            className={
                              styles.responsiveBreakthroughCircleSupport
                            }
                          >
                            {getBreakthroughCircleSupportLines(
                              breakthroughMoment.body[1]
                            ).map((line) => (
                              <span key={line}>{line}</span>
                            ))}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </section>

                  <section
                    className={styles.responsiveBreakthroughReasons}
                    style={{ "--stagger": 1 } as CSSProperties}
                  >
                    <div className={styles.responsiveBreakthroughReasonsHeader}>
                      <p className={styles.responsiveBreakthroughReasonsLabel}>
                        {sections[1]?.label ?? "Why It Mattered"}
                      </p>
                      <p className={styles.responsiveBreakthroughReasonsLead}>
                        Three clear reasons it mattered.
                      </p>
                    </div>

                    <div className={styles.responsiveBreakthroughReasonList}>
                      <span
                        className={styles.responsiveBreakthroughReasonRail}
                        aria-hidden="true"
                      />
                      {breakthroughReasons.map((reason, index) => (
                        <article
                          className={styles.responsiveBreakthroughReason}
                          data-step={reason.number}
                          key={reason.number}
                          style={
                            {
                              "--stagger": index + 2,
                              "--point-index": index,
                            } as CSSProperties
                          }
                        >
                          <span
                            className={styles.responsiveBreakthroughReasonNode}
                          />
                          <div
                            className={styles.responsiveBreakthroughReasonTop}
                          >
                            <span
                              className={
                                styles.responsiveBreakthroughReasonNumber
                              }
                            >
                              {reason.number}
                            </span>
                            <h2
                              className={
                                styles.responsiveBreakthroughReasonTitle
                              }
                            >
                              {reason.title}
                            </h2>
                          </div>
                          <p
                            className={styles.responsiveBreakthroughReasonBody}
                          >
                            {reason.body}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                <div
                  className={styles.responsiveSections}
                  data-transition-content="main"
                >
                  {sections.map((section, index) => (
                    <article
                      className={[
                        styles.responsiveCard,
                        index === 0
                          ? styles.responsiveHeroCard
                          : styles.responsiveSupportCard,
                        isChallenge && index === 0
                          ? styles.responsiveChallengeCard
                          : "",
                        isChallenge && index > 0
                          ? styles.responsiveSolutionCard
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={section.label}
                      style={{ "--stagger": index } as CSSProperties}
                    >
                      <p className={styles.responsiveCardLabel}>
                        {section.label}
                      </p>

                      <div className={styles.responsiveCardBody}>
                        {isChallenge && index > 0 ? (
                          <div className={styles.responsiveSolutionCircleList}>
                            {section.body.map((paragraph, paragraphIndex) => (
                              <article
                                className={styles.responsiveSolutionCircle}
                                key={paragraph}
                              >
                                <span
                                  className={
                                    styles.responsiveSolutionCircleNumber
                                  }
                                >
                                  {String(paragraphIndex + 1).padStart(2, "0")}
                                </span>
                                <p className={styles.responsiveSolutionCircleText}>
                                  {paragraph}
                                </p>
                              </article>
                            ))}
                          </div>
                        ) : (
                          section.body.map((paragraph, paragraphIndex) => {
                          if (index === 0 && paragraphIndex === 0) {
                            return (
                              <p
                                className={styles.responsiveHeroQuote}
                                key={paragraph}
                              >
                                {paragraph}
                              </p>
                            )
                          }

                          if (isChallenge && index === 0) {
                            return (
                              <div
                                className={styles.responsiveChallengeSupportRow}
                                key={paragraph}
                              >
                                <span
                                  className={
                                    styles.responsiveChallengeSupportBullet
                                  }
                                  aria-hidden="true"
                                />
                                <p
                                  className={
                                    styles.responsiveChallengeSupportText
                                  }
                                >
                                  {paragraph}
                                </p>
                              </div>
                            )
                          }

                          if (isChallenge && index > 0) {
                            return (
                              <div
                                className={styles.responsiveSolutionRow}
                                key={paragraph}
                              >
                                <span
                                  className={styles.responsiveSolutionNumber}
                                >
                                  {String(paragraphIndex + 1).padStart(2, "0")}
                                </span>
                                <p className={styles.responsiveSolutionText}>
                                  {paragraph}
                                </p>
                              </div>
                            )
                          }

                          return (
                            <p
                              className={[
                                styles.responsiveParagraph,
                                index > 0 ? styles.responsiveTakeaway : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              key={paragraph}
                            >
                              {paragraph}
                            </p>
                          )
                          })
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
                </>
              )}

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
                <div
                  className={[
                    styles.content,
                    isBreakthrough ? styles.breakthroughContent : "",
                    isChallenge ? styles.challengeContent : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-transition-panel
                >
                  {isChallenge && challengeStage ? (
                    challengeStage
                  ) : (
                    <>
                  <header
                    className={[
                      styles.header,
                      isBreakthrough ? styles.breakthroughHeader : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    data-transition-content="header"
                  >
                    <p className={styles.eyebrow}>Section {sectionNumber}</p>

                    {isBreakthrough ? (
                      <div className={styles.breakthroughLead}>
                        <div className={styles.breakthroughTitleWrap}>
                          <p className={styles.breakthroughPreTitle}>
                            {titleTop}
                          </p>
                          <h1 className={styles.breakthroughHeroTitle}>
                            {titleBottom || titleTop}
                          </h1>
                        </div>
                        <div
                          className={[
                            styles.leadBlock,
                            styles.breakthroughLeadBlock,
                          ].join(" ")}
                        >
                          <span
                            className={styles.leadRule}
                            aria-hidden="true"
                          />
                          <p className={styles.breakthroughLeadText}>{lead}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.lead}>{lead}</p>
                      </>
                    )}
                  </header>

                  {isBreakthrough && breakthroughMoment ? (
                    <div
                      className={styles.breakthroughLayout}
                      data-transition-content="main"
                    >
                      <section
                        className={styles.breakthroughAnchor}
                        style={{ "--stagger": 0 } as CSSProperties}
                      >
                        <div className={styles.breakthroughCircle}>
                          <span className={styles.breakthroughCircleGlow} />
                          <div className={styles.breakthroughCircleInner}>
                            <p className={styles.breakthroughCircleLabel}>
                              {breakthroughMoment.label}
                            </p>
                            <p className={styles.breakthroughCircleStatement}>
                              {getBreakthroughCircleStatementLines(
                                breakthroughMoment.body[0]
                              ).map((line) => (
                                <span key={line}>{line}</span>
                              ))}
                            </p>
                            {breakthroughMoment.body[1] ? (
                              <p className={styles.breakthroughCircleSupport}>
                                {getBreakthroughCircleSupportLines(
                                  breakthroughMoment.body[1]
                                ).map((line) => (
                                  <span key={line}>{line}</span>
                                ))}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </section>

                      <section
                        className={styles.breakthroughReasons}
                        style={{ "--stagger": 1 } as CSSProperties}
                      >
                        <div className={styles.breakthroughReasonsHeader}>
                          <p className={styles.breakthroughReasonsLabel}>
                            {sections[1]?.label ?? "Why It Mattered"}
                          </p>
                          <p className={styles.breakthroughReasonsLead}>
                            Three clear reasons it mattered.
                          </p>
                        </div>

                        <div className={styles.breakthroughReasonList}>
                          <span
                            className={styles.breakthroughReasonRail}
                            aria-hidden="true"
                          />
                          {breakthroughReasons.map((reason, index) => (
                            <article
                              className={styles.breakthroughReason}
                              data-step={reason.number}
                              key={reason.number}
                              style={
                                {
                                  "--stagger": index + 2,
                                  "--point-index": index,
                                } as CSSProperties
                              }
                            >
                              <span className={styles.breakthroughReasonNode} />
                              <div className={styles.breakthroughReasonTop}>
                                <span
                                  className={styles.breakthroughReasonNumber}
                                >
                                  {reason.number}
                                </span>
                                <h2 className={styles.breakthroughReasonTitle}>
                                  {reason.title}
                                </h2>
                              </div>
                              <p className={styles.breakthroughReasonBody}>
                                {reason.body}
                              </p>
                            </article>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div
                      className={styles.sections}
                      data-transition-content="main"
                    >
                      {sections.map((section, index) => (
                        <article
                          className={[
                            styles.card,
                            index === 0 ? styles.heroCard : styles.supportCard,
                            isChallenge && index === 0
                              ? styles.challengeCard
                              : "",
                            isChallenge && index > 0 ? styles.solutionCard : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={section.label}
                          style={{ "--stagger": index } as CSSProperties}
                        >
                          <div className={styles.cardTop}>
                            <p className={styles.cardLabel}>{section.label}</p>
                          </div>

                          <div className={styles.cardBody}>
                            {isChallenge && index > 0 ? (
                              <div className={styles.solutionCircleList}>
                                {section.body.map((paragraph, paragraphIndex) => (
                                  <article
                                    className={styles.solutionCircle}
                                    key={paragraph}
                                  >
                                    <span className={styles.solutionCircleNumber}>
                                      {String(paragraphIndex + 1).padStart(
                                        2,
                                        "0"
                                      )}
                                    </span>
                                    <p className={styles.solutionCircleText}>
                                      {paragraph}
                                    </p>
                                  </article>
                                ))}
                              </div>
                            ) : (
                              section.body.map((paragraph, paragraphIndex) => {
                              if (index === 0 && paragraphIndex === 0) {
                                return (
                                  <p
                                    className={styles.heroQuote}
                                    key={paragraph}
                                  >
                                    {paragraph}
                                  </p>
                                )
                              }

                              if (isChallenge && index === 0) {
                                return (
                                  <div
                                    className={styles.challengeSupportRow}
                                    key={paragraph}
                                  >
                                    <span
                                      className={styles.challengeSupportBullet}
                                      aria-hidden="true"
                                    />
                                    <p className={styles.challengeSupportText}>
                                      {paragraph}
                                    </p>
                                  </div>
                                )
                              }

                              if (isChallenge && index > 0) {
                                return (
                                  <div
                                    className={styles.solutionRow}
                                    key={paragraph}
                                  >
                                    <span className={styles.solutionNumber}>
                                      {String(paragraphIndex + 1).padStart(
                                        2,
                                        "0"
                                      )}
                                    </span>
                                    <p className={styles.solutionText}>
                                      {paragraph}
                                    </p>
                                  </div>
                                )
                              }

                              return (
                                <p
                                  className={[
                                    styles.paragraph,
                                    index > 0 ? styles.takeaway : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                  key={paragraph}
                                >
                                  {paragraph}
                                </p>
                              )
                              })
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                    </>
                  )}
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
