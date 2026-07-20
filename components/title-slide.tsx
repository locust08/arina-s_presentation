"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { BriefcaseBusiness, Code2, UserRound } from "lucide-react"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const getScale = (width: number, height: number) => {
  if (!width || !height) {
    return 1
  }

  return Math.max(
    0.1,
    Math.min(
      width / DESIGN_WIDTH,
      height / DESIGN_HEIGHT
    )
  )
}

export function TitleSlide() {
  const [scale, setScale] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const updateScale = (width: number, height: number) => {
      setViewportWidth(width)
      setScale(getScale(width, height))
    }

    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const rect = viewport.getBoundingClientRect()
    updateScale(rect.width, rect.height)

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      updateScale(entry.contentRect.width, entry.contentRect.height)
    })

    resizeObserver.observe(viewport)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const isResponsiveViewport = viewportWidth > 0 && viewportWidth < 1024

  return (
    <main className="presentation-shell">
      <div className="title-slide__viewport" ref={viewportRef}>
        <div className="title-slide__edge-stripes" aria-hidden="true" />
        {isResponsiveViewport ? (
          <section
            aria-label="Responsive title slide"
            className="title-slide-responsive"
          >
            <div className="title-slide-responsive__inner">
              <div className="title-slide-responsive__stripes" aria-hidden="true" />
              <div className="title-slide-responsive__decor" aria-hidden="true">
                <span className="title-slide-responsive__hex title-slide-responsive__hex--one" />
                <span className="title-slide-responsive__hex title-slide-responsive__hex--two" />
                <span className="title-slide-responsive__hex title-slide-responsive__hex--three" />
                <span className="title-slide-responsive__hex title-slide-responsive__hex--four" />
                <span className="title-slide-responsive__dots" />
              </div>

              <div className="title-slide-responsive__logo">
                <div className="title-slide-responsive__logo-asset">
                  <Image
                    alt="LOCUS-T and DigitalBee"
                    fill
                    priority
                    sizes="(max-width: 1023px) 72vw, 760px"
                    src="/reference/title-locus-digitalbee-lockup.png"
                  />
                </div>
              </div>

              <div className="title-slide-responsive__body">
                <div className="title-slide-responsive__copy">
                  <h1 className="title-slide-responsive__heading">
                    Metro Pinjaman <span>Berlesen</span>
                  </h1>

                  <p className="title-slide-responsive__subtitle">
                    Internship Final Presentation
                  </p>

                  <div className="title-slide-responsive__presenter">
                    <div>
                      <Code2 aria-hidden="true" />
                      <p>Website Redesign</p>
                    </div>
                    <div>
                      <UserRound aria-hidden="true" />
                      <p>
                        Internship Project
                        <span>Final Presentation</span>
                      </p>
                    </div>
                    <div>
                      <BriefcaseBusiness aria-hidden="true" />
                      <p>
                        Full-stack
                        <span>Website Development</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="title-slide-responsive__footer">
                <div className="title-slide-responsive__footer-line" />

                <div className="title-slide-responsive__footer-copy">
                  <p>Internship Final Presentation</p>
                  <p>Metro Pinjaman Berlesen</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="title-slide title-slide--desktop" data-node-id="16:170">
            <div
              className="title-slide__canvas"
              style={{
                "--slide-scale": scale,
                visibility: viewportWidth > 0 ? "visible" : "hidden",
              } as CSSProperties}
            >
              <div className="title-slide__frame" data-node-id="20:49">
                <div className="title-slide__stripes" aria-hidden="true" />
                <div className="title-slide__decor" aria-hidden="true">
                  <span className="title-slide__hex title-slide__hex--one" />
                  <span className="title-slide__hex title-slide__hex--two" />
                  <span className="title-slide__hex title-slide__hex--three" />
                  <span className="title-slide__hex title-slide__hex--four" />
                  <span className="title-slide__dots" />
                </div>

                <div className="title-slide__logo" data-node-id="13:101">
                  <div className="title-slide__logo-asset">
                    <Image
                      alt="LOCUS-T and DigitalBee"
                      fill
                      priority
                      sizes="760px"
                      src="/reference/title-locus-digitalbee-lockup.png"
                    />
                  </div>
                </div>

                <div className="title-slide__content" data-node-id="13:107">
                  <div className="title-slide__hero-row" data-node-id="13:104">
                    <div className="title-slide__copy" data-node-id="13:103">
                      <div className="title-slide__heading" data-node-id="2:6">
                        <h1>
                          Metro Pinjaman <span>Berlesen</span>
                        </h1>
                      </div>

                      <p className="title-slide__subtitle">
                        Internship Final Presentation
                      </p>

                      <div className="title-slide__presenter" data-node-id="2:8">
                        <div className="title-slide__meta-item">
                          <Code2 aria-hidden="true" />
                          <p>Website Redesign</p>
                        </div>
                        <div className="title-slide__meta-divider" />
                        <div className="title-slide__meta-item">
                          <UserRound aria-hidden="true" />
                          <p>
                            Internship Project
                            <span>Final Presentation</span>
                          </p>
                        </div>
                        <div className="title-slide__meta-divider" />
                        <div className="title-slide__meta-item">
                          <BriefcaseBusiness aria-hidden="true" />
                          <p>
                            Full-stack
                            <span>Website Development</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="title-slide__footer-block" data-node-id="13:106">
                    <div className="title-slide__footer-line" data-node-id="2:12" />

                    <div className="title-slide__footer-copy" data-node-id="13:105">
                      <p className="title-slide__footer-left" data-node-id="2:13">
                        Internship Final Presentation
                      </p>

                      <p className="title-slide__footer-right" data-node-id="2:14">
                        Metro Pinjaman Berlesen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
