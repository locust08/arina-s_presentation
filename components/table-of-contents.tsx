"use client"

import Image from "next/image"
import type { CSSProperties, MouseEvent, TouchEvent } from "react"
import { useEffect, useRef, useState } from "react"

import { SECTION_TITLES } from "@/components/presentation-sections"

import styles from "./table-of-contents.module.css"

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const NAV_AUTO_HIDE_MS = 2200
const EDGE_TRIGGER_WIDTH = 72
const SWIPE_TRIGGER_DISTANCE = 18

type NavSide = "left" | "right"

const getScale = (width: number, height: number) => {
  if (!width || !height) {
    return 1
  }

  const padding = width <= 900 ? 12 : 24

  return Math.max(
    0.1,
    Math.min(
      (width - padding * 2) / DESIGN_WIDTH,
      (height - padding * 2) / DESIGN_HEIGHT
    )
  )
}

export function TableOfContents() {
  const [scale, setScale] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [navSide, setNavSide] = useState<NavSide | null>(null)
  const [activeNavItem, setActiveNavItem] = useState("toc-01")
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const hoverLockRef = useRef(false)
  const sectionNavigationLockRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const updateScale = (width: number, height: number) => {
      setViewportWidth(width)
      setScale(getScale(width, height))
    }

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

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const syncActiveNavItem = () => {
      const hash = window.location.hash.replace("#", "")

      if (hash) {
        setActiveNavItem(hash)
      }
    }

    syncActiveNavItem()
    window.addEventListener("hashchange", syncActiveNavItem)

    return () => {
      window.removeEventListener("hashchange", syncActiveNavItem)
    }
  }, [])

  const isResponsiveViewport = viewportWidth > 0 && viewportWidth < 1024
  const isNavOpen = navSide !== null

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const closeNav = () => {
    clearHideTimer()
    setNavSide(null)
  }

  const openNav = (side: NavSide, autoHide = false) => {
    clearHideTimer()
    setNavSide(side)

    if (autoHide) {
      hideTimerRef.current = window.setTimeout(() => {
        if (!hoverLockRef.current) {
          setNavSide(null)
        }
      }, NAV_AUTO_HIDE_MS)
    }
  }

  const handleViewportMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isResponsiveViewport) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left

    if (x <= EDGE_TRIGGER_WIDTH) {
      openNav("left")
      return
    }

    if (x >= bounds.width - EDGE_TRIGGER_WIDTH) {
      openNav("right")
      return
    }

    if (!hoverLockRef.current) {
      closeNav()
    }
  }

  const handleViewportMouseLeave = () => {
    if (!hoverLockRef.current) {
      closeNav()
    }
  }

  const handleResponsiveWheel = () => {
    if (!isResponsiveViewport) {
      return
    }

    openNav("right")
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isResponsiveViewport) {
      return
    }

    const touch = event.touches[0]

    if (!touch) {
      return
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!isResponsiveViewport) {
      return
    }

    const touch = event.touches[0]
    const start = touchStartRef.current

    if (!touch || !start) {
      return
    }

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (deltaY <= -SWIPE_TRIGGER_DISTANCE && Math.abs(deltaY) > Math.abs(deltaX)) {
      openNav("right")
      touchStartRef.current = null
    }
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
  }

  const goToSection = (index: number) => {
    if (sectionNavigationLockRef.current) {
      return
    }

    sectionNavigationLockRef.current = true

    const sectionNumber = String(index + 1).padStart(2, "0")
    const itemId = `section-opener-${sectionNumber}`
    const nextHash = `#${itemId}`

    setActiveNavItem(itemId)
    closeNav()

    if (window.location.hash === nextHash) {
      window.dispatchEvent(new HashChangeEvent("hashchange"))
      window.setTimeout(() => {
        sectionNavigationLockRef.current = false
      }, 350)
      return
    }

    window.location.hash = itemId
    window.dispatchEvent(
      new CustomEvent("presentation:go-to-section", {
        detail: { sectionNumber },
      })
    )

    window.setTimeout(() => {
      sectionNavigationLockRef.current = false
    }, 350)
  }

  const navClasses = [
    styles.nav,
    navSide === "left" ? styles.navLeft : styles.navRight,
    isNavOpen ? styles.navOpen : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <main className={styles.shell}>
      <div
        className={styles.viewport}
        onMouseLeave={handleViewportMouseLeave}
        onMouseMove={handleViewportMouseMove}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onWheel={handleResponsiveWheel}
        ref={viewportRef}
      >
        {isResponsiveViewport ? (
          <section className={styles.responsive} aria-label="Table of Contents slide">
            <div className={styles.responsiveTopLine} aria-hidden="true" />

            <div className={styles.responsiveInner}>
              <header className={styles.responsiveHeader}>
                <h1>Table of Contents</h1>
              </header>

              <ol className={styles.responsiveList}>
                {SECTION_TITLES.map((item, index) => (
                  <li
                    className={styles.responsiveItem}
                    id={`toc-${String(index + 1).padStart(2, "0")}`}
                    key={item}
                  >
                    <span className={styles.responsiveNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.responsiveText}>{item}</span>
                  </li>
                ))}
              </ol>

              <footer className={styles.responsiveFooter}>
                <div className={styles.responsiveFooterLine} aria-hidden="true" />

                <div className={styles.responsiveFooterCopy}>
                  <div className={styles.responsiveLogo}>
                    <Image
                      alt="Locus-T"
                      fill
                      sizes="(max-width: 767px) 84px, 110px"
                      src="/reference/figma-27-82-logo.png"
                    />
                  </div>
                  <p>LOCUS-T SDN BHD</p>
                </div>
              </footer>
            </div>
          </section>
        ) : (
          <section className={styles.desktopSlide} data-node-id="27:82">
            <div
              className={styles.canvas}
              style={{ "--slide-scale": scale } as CSSProperties}
            >
              <div className={styles.frame}>
                <div className={styles.topLine} aria-hidden="true" />

                <header className={styles.header}>
                  <h1>Table of Contents</h1>
                </header>

                <ol className={styles.list}>
                  {SECTION_TITLES.map((item, index) => (
                    <li
                      className={styles.item}
                      id={`toc-${String(index + 1).padStart(2, "0")}`}
                      key={item}
                    >
                      <span className={styles.number}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.text}>{item}</span>
                    </li>
                  ))}
                </ol>

                <footer className={styles.footer}>
                  <div className={styles.footerLine} aria-hidden="true" />

                  <div className={styles.footerMeta}>
                    <div className={styles.footerLogo}>
                      <Image
                        alt="Locus-T"
                        fill
                        sizes="127px"
                        src="/reference/figma-27-82-logo.png"
                      />
                    </div>

                    <p className={styles.footerText}>LOCUS-T SDN BHD</p>
                  </div>
                </footer>
              </div>
            </div>
          </section>
        )}

        <aside
          aria-hidden={!isNavOpen}
          className={navClasses}
          onMouseEnter={() => {
            hoverLockRef.current = true
            clearHideTimer()
          }}
          onMouseLeave={() => {
            hoverLockRef.current = false
            if (!isResponsiveViewport) {
              closeNav()
            } else {
              openNav(navSide ?? "right")
            }
          }}
        >
          <div className={styles.navHeader}>
            <p className={styles.navEyebrow}>Slide Menu</p>
            <button
              aria-label="Close navigation"
              className={styles.navClose}
              onClick={closeNav}
              type="button"
            >
              Close
            </button>
          </div>

          <nav aria-label="Presentation sections" className={styles.navBody}>
            <ol className={styles.navList}>
              {SECTION_TITLES.map((item, index) => {
                const sectionNumber = String(index + 1).padStart(2, "0")
                const itemId = `section-opener-${sectionNumber}`
                const isActive = activeNavItem === itemId

                return (
                  <li className={styles.navItem} key={item}>
                    <button
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        styles.navLink,
                        isActive ? styles.navLinkActive : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => goToSection(index)}
                      onPointerDown={(event) => {
                        event.preventDefault()
                        goToSection(index)
                      }}
                      type="button"
                    >
                      <span className={styles.navNumber}>
                        {sectionNumber}
                      </span>
                      <span className={styles.navLabel}>{item}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </aside>

        {isNavOpen ? (
          <button
            aria-label="Dismiss navigation overlay"
            className={styles.navBackdrop}
            onClick={closeNav}
            type="button"
          />
        ) : null}
      </div>
    </main>
  )
}
