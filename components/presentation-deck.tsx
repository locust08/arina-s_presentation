"use client"

import Image from "next/image"
import type { WheelEvent } from "react"
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { PresentationPhasesSlide } from "@/components/presentation-phases-slide"
import { PresentationConclusionSlide } from "@/components/presentation-conclusion-slide"
import { PresentationAdviceSlide } from "@/components/presentation-advice-slide"
import { PresentationInitialExpectationSlide } from "@/components/presentation-initial-expectation-slide"
import { PresentationHumanValueSlide } from "@/components/presentation-human-value-slide"
import { PresentationLocusReasonsSlide } from "@/components/presentation-locus-reasons-slide"
import { PresentationOverviewSlide } from "@/components/presentation-overview-slide"
import { PresentationVideoSlide } from "@/components/presentation-video-slide"
import { SECTION_TITLES } from "@/components/presentation-sections"
import { PresentationStorySlide } from "@/components/presentation-story-slide"
import { SectionOpenerSlide } from "@/components/section-opener-slide"
import { TableOfContents } from "@/components/table-of-contents"
import { TitleSlide } from "@/components/title-slide"

import styles from "./presentation-deck.module.css"

const CONTROL_HIDE_MS = 2200
const SLIDE_SWIPE_DISTANCE = 48
const WHEEL_NAVIGATION_THRESHOLD = 72
const SHARED_MORPH_DURATION_MS = 720
const SHARED_REVEAL_DELAY_MS = 660
const SHARED_TRANSITION_TOTAL_MS = 1380
const SHARED_SHAPE_CLIP_PATH =
  "polygon(46% 0%, 54% 0%, 97% 22%, 97% 78%, 54% 100%, 46% 100%, 3% 78%, 3% 22%)"
const SHARED_PANEL_CLIP_PATH =
  "polygon(3% 0%, 97% 0%, 100% 8%, 100% 92%, 97% 100%, 3% 100%, 0% 92%, 0% 8%)"
const PHASES_INTERSTITIAL_SLIDE_ID = "project-phases"
const CHALLENGE_REVEAL_SLIDE_ID = "biggest-challenge-content"
const MAX_CHALLENGE_REVEAL_STEP = 3
const ADVICE_REVEAL_SLIDE_ID = "advice-to-future-intern"
const MAX_ADVICE_REVEAL_STEP = 1
const NAVIGATION_STORAGE_KEY = "final-presentation-navigation"

type SharedElementKind = "shape" | "panel"

type SharedMorphRect = {
  clipPath: string
  height: number
  left: number
  top: number
  width: number
}

type SharedMorphTransition = {
  direction: "forward" | "backward"
  fromIndex: number
  overlayRect: SharedMorphRect | null
  sourceKind: SharedElementKind | null
  stage: "mount" | "morph" | "reveal"
  targetKind: SharedElementKind | null
  targetRect: SharedMorphRect | null
  toIndex: number
}

type PersistedNavigationState = {
  adviceRevealStep?: number
  challengeRevealStep?: number
  currentIndex?: number
  showPhasesInterstitial?: boolean
  slideId?: string
}

const BASE_SLIDES = [
  {
    id: "title",
    label: "Title Slide",
    theme: "dark" as const,
    render: () => <TitleSlide />,
  },
  {
    id: "toc",
    label: "Table of Contents",
    theme: "light" as const,
    render: () => <TableOfContents />,
  },
]

function isSectionOpenerSlide(slideId: string) {
  return slideId.startsWith("section-opener-")
}

function isSharedMorphPair(...args: [number, number]) {
  const [_fromIndex, _toIndex] = args

  void _fromIndex
  void _toIndex

  return false
}

function toSharedMorphRect(
  elementRect: DOMRect,
  containerRect: DOMRect,
  kind: SharedElementKind
): SharedMorphRect {
  return {
    clipPath:
      kind === "shape" ? SHARED_SHAPE_CLIP_PATH : SHARED_PANEL_CLIP_PATH,
    height: elementRect.height,
    left: elementRect.left - containerRect.left,
    top: elementRect.top - containerRect.top,
    width: elementRect.width,
  }
}

function getSlides(challengeRevealStep: number, adviceRevealStep: number) {
  return [
    ...BASE_SLIDES,
    ...SECTION_TITLES.flatMap((title, index) => {
    const sectionNumber = String(index + 1).padStart(2, "0")
    const openerSlide = {
      id: `section-opener-${sectionNumber}`,
      label: title,
      theme: "dark" as const,
      render: () => (
        <SectionOpenerSlide sectionNumber={sectionNumber} title={title} />
      ),
    }

    if (index === 0) {
      return [
        openerSlide,
        {
          id: "why-i-choose-locus-t",
          label: "Why I Choose LOCUS-T",
          theme: "light" as const,
          render: () => (
            <PresentationLocusReasonsSlide
              lead="Three reasons LOCUS-T felt like the right place to learn, contribute, and grow."
              points={[
                "Strong learning opportunities",
                "Real work, real application",
                "Strong digital reputation",
              ]}
              sectionNumber="01"
            />
          ),
        },
        {
          id: "my-initial-expectation",
          label: "My Initial Expectations",
          theme: "light" as const,
          render: () => (
            <PresentationInitialExpectationSlide
              lead="The expectations I had before the internship began."
              points={[
                {
                  label: "Real Work",
                  text: "Learn how real digital marketing works.",
                },
                {
                  label: "HANDS-ON EXPERIENCE",
                  text: "Gain hands-on experience in real working environment.",
                },
                {
                  label: "Client Output",
                  text: "Learn how ideas become real client outputs.",
                },
              ]}
              sectionNumber="01"
            />
          ),
        },
      ]
    }

    if (index === 1) {
      return [
        openerSlide,
        {
          id: "project-overview-content",
          label: "Project Overview",
          theme: "light" as const,
          render: () => (
            <PresentationOverviewSlide
              cards={[
                {
                  label: "AI Video Generation",
                  body: "Test AI-generated video production to speed up creative output and campaign execution.",
                },
                {
                  label: "Strategic Goal",
                  body: "Explore how AI can help clients increase traffic and sales while maintaining or reducing total ad spend.",
                },
                {
                  label: "AI Website & Embedded Form Generation",
                  body: "Develop AI-assisted website and embedded forms to improve speed, consistency, and lead capture.",
                },
              ]}
              lead="A structured overview of where I was placed, what I worked on, and why the project mattered."
              sectionNumber="02"
              title="Project Overview"
            />
          ),
        },
        {
          id: "project-phases",
          label: "Project Phases / What Was Expected",
          theme: "light" as const,
          render: () => (
            <PresentationPhasesSlide
              lead="A four-phase roadmap showing how the internship moved from AI-generated reel experiments into a broader AI website generation stage."
              phaseGroups={[
                {
                  duration: "2 weeks",
                  title: "AI Video Generation Reels",
                  items: ["Signature Market - Two Tails"],
                  videos: [
                    {
                      title: "Signature Market - Two Tails",
                      url: "/videos/slide-8/signature-market-two-tails.mp4",
                    },
                  ],
                },
                {
                  duration: "2 weeks",
                  title: "AI Video Generation Reels",
                  items: ["Kenny Hills Bakers - Peach Strudel"],
                  videos: [
                    {
                      title: "Kenny Hills Bakers - Peach Strudel",
                      url: "/videos/slide-8/kenny-hills-bakers-peach-strudel.mp4",
                    },
                  ],
                },
                {
                  duration: "2 weeks",
                  title: "AI Video Generation Reels",
                  items: ["Kapten Batik"],
                  videos: [
                    {
                      title: "Kapten Batik",
                      url: "/videos/slide-8/kapten-batik.mp4",
                    },
                  ],
                },
                {
                  duration: "1 month",
                  title: "AI Website Generation",
                  items: ["Frontend refinement, Backend learning & support"],
                  images: [
                    {
                      title: "Signature Market Website",
                      url: "/reference/slide-8/website-gallery/signature-market-site.png",
                    },
                    {
                      title: "Kenny Hills Bakers Website",
                      url: "/reference/slide-8/website-gallery/kenny-hills-site.png",
                    },
                    {
                      title: "Kapten Batik Website",
                      url: "/reference/slide-8/website-gallery/kapten-batik-site.png",
                    },
                  ],
                },
              ]}
              sectionNumber="02"
              title="Project Timeline / 4 Phases"
            />
          ),
        },
      ]
    }

    if (index === 2) {
      return [
        openerSlide,
        {
          id: "my-most-exciting-moment-content",
          label: "My Most Exciting Moment",
          theme: "light" as const,
          render: () => (
            <PresentationStorySlide
              lead="A breakthrough that turned repeated trial and error into visible progress."
              sectionNumber="03"
              sections={[
                {
                  label: "Exciting Moment",
                  body: [
                    "AI generated what I want",
                    "After many wrong results and repeated testing, that moment felt truly rewarding.",
                  ],
                },
                {
                  label: "Why It Mattered",
                  body: [
                    "It showed my prompting and testing were improving.",
                    "It proved the effort was paying off.",
                    "It gave me confidence to keep refining the work.",
                  ],
                },
              ]}
              title="My Most Exciting Moment"
              variant="breakthrough"
            />
          ),
        },
      ]
    }

    if (index === 3) {
      return [
        openerSlide,
        {
          id: "biggest-challenge-content",
          label: "Biggest Challenge & How I Overcame It",
          theme: "light" as const,
          render: () => (
            <PresentationStorySlide
              challengeRevealStep={challengeRevealStep}
              lead="One of the toughest parts of the internship was learning how to choose the right tools and build a workflow that actually worked."
              sectionNumber="04"
              sections={[
                {
                  label: "Biggest Challenge",
                  body: [
                    "Figuring out the right tools and workflow",
                    "Some outputs looked promising at first, but did not really work in practice.",
                    "It was stressful because I had to learn fast and still produce something useful.",
                  ],
                },
                {
                  label: "How I Overcame It",
                  body: [
                    "I tested things step by step and compared the results properly.",
                    "I started asking questions earlier and improved the workflow each time.",
                    "That process made me more adaptable, organised, and confident.",
                  ],
                },
              ]}
              title="Biggest Challenge & How I Overcame It"
              variant="challenge"
            />
          ),
        },
      ]
    }

    if (index === 4) {
      return [
        openerSlide,
        {
          id: "product-showcase-runtime",
          label: "Product Showcase Runtime",
          theme: "light" as const,
          render: () => (
            <PresentationVideoSlide
              title="Product showcase video"
              videoSrc="/videos/slide-14/outputs.mp4"
            />
          ),
        },
      ]
    }

    if (index === 5) {
      return [
        openerSlide,
        {
          id: "conclusion-summary",
          label: "Conclusion",
          theme: "light" as const,
          render: () => (
            <PresentationConclusionSlide
              lead="The internship brought my AI learning closer to real working practice and helped me build stronger problem-solving habits."
              points={[
                "This internship gave me a clearer view of how AI supports real work.",
                "My AI journey became more practical and problem-solving focused.",
                "Overall, I learned to explore, adapt, and improve through testing.",
              ]}
              sectionNumber="06"
            />
          ),
        },
        {
          id: "human-vs-ai",
          label: "What Makes Me Different and Unique Compared to AI?",
          theme: "light" as const,
          render: () => (
            <PresentationHumanValueSlide
              lead="The experience also reminded me that speed alone is not enough. Human value still matters in how work is judged, shaped, and trusted."
              points={[
                "AI can generate faster, but I bring judgement and responsibility.",
                "I can adapt, communicate, and make more careful decisions.",
                "Human understanding, flexibility, and trust.",
              ]}
              sectionNumber="06"
              title="What Makes Me Different from AI"
            />
          ),
        },
        {
          id: "advice-to-future-intern",
          label: "Advice to My Future Junior Intern",
          theme: "light" as const,
          render: () => (
            <PresentationAdviceSlide
              lead="If I could leave a short message for a future junior intern, it would be to stay curious, stay thoughtful, and keep learning through the process."
              points={[
                "Ask questions early and clarify the task before starting.",
                "Use AI as a support tool, but always review and improve the output.",
                "Stay organised, document progress, and learn from feedback.",
              ]}
              quote={{
                label: "Quote",
                text: [
                  "Failure is not the opposite of success. It is part of success.",
                  "Work Smart Not Hard",
                ],
              }}
              quoteReveal={adviceRevealStep > 0}
              sectionNumber="06"
              title="Advice to My Future Junior Intern"
            />
          ),
        },
      ]
    }

    if (index === 6) {
      return [
        openerSlide,
        {
          id: "my-internship-my-future-content",
          label: "My Internship & My Future",
          theme: "light" as const,
          render: () => (
            <PresentationVideoSlide
              title="My Internship & My Future"
              videoSrc="/videos/slide-20/fp-video.mp4"
            />
          ),
        },
      ]
    }

      return [openerSlide]
    }),
    {
      id: "thank-you",
      label: "Thank You",
      theme: "dark" as const,
      render: () => <SectionOpenerSlide sectionNumber="" title="Thank You" />,
    },
  ].map((slide, index) => ({
    ...slide,
    shortLabel: `Slide ${index + 1}`,
  }))
}

export function PresentationDeck() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasRestoredNavigation, setHasRestoredNavigation] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isResponsiveViewport, setIsResponsiveViewport] = useState(false)
  const [showPhasesInterstitial, setShowPhasesInterstitial] = useState(false)
  const [challengeRevealStep, setChallengeRevealStep] = useState(0)
  const [adviceRevealStep, setAdviceRevealStep] = useState(0)
  const [isProgressMenuOpen, setIsProgressMenuOpen] = useState(false)
  const [sharedMorphTransition, setSharedMorphTransition] =
    useState<SharedMorphTransition | null>(null)
  const deckRef = useRef<HTMLDivElement | null>(null)
  const transitionFromRef = useRef<HTMLDivElement | null>(null)
  const transitionToRef = useRef<HTMLDivElement | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const sharedTransitionRevealTimerRef = useRef<number | null>(null)
  const sharedTransitionFinishTimerRef = useRef<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const wheelDeltaRef = useRef(0)
  const slides = useMemo(
    () => getSlides(challengeRevealStep, adviceRevealStep),
    [adviceRevealStep, challengeRevealStep]
  )

  const currentSlide = slides[currentIndex]
  const visibleSlide = sharedMorphTransition
    ? slides[sharedMorphTransition.toIndex]
    : currentSlide
  const isPhasesInterstitialActive =
    currentSlide.id === PHASES_INTERSTITIAL_SLIDE_ID &&
    showPhasesInterstitial &&
    !sharedMorphTransition

  const clearSharedTransitionRevealTimer = () => {
    if (sharedTransitionRevealTimerRef.current) {
      window.clearTimeout(sharedTransitionRevealTimerRef.current)
      sharedTransitionRevealTimerRef.current = null
    }
  }

  const clearSharedTransitionFinishTimer = () => {
    if (sharedTransitionFinishTimerRef.current) {
      window.clearTimeout(sharedTransitionFinishTimerRef.current)
      sharedTransitionFinishTimerRef.current = null
    }
  }

  const controlsClassName = useMemo(() => {
    return [
      styles.controls,
      showControls ? styles.controlsVisible : "",
      visibleSlide.id === "product-showcase-runtime"
        ? styles.controlsHidden
        : "",
      visibleSlide.theme === "dark"
        ? styles.controlsDark
        : styles.controlsLight,
    ]
      .filter(Boolean)
      .join(" ")
  }, [showControls, visibleSlide.id, visibleSlide.theme])

  useLayoutEffect(() => {
    try {
      const rawNavigation = window.localStorage.getItem(NAVIGATION_STORAGE_KEY)

      if (!rawNavigation) {
        setHasRestoredNavigation(true)
        return
      }

      const savedNavigation = JSON.parse(rawNavigation) as PersistedNavigationState
      const savedChallengeRevealStep = Math.max(
        0,
        Math.min(
          Number(savedNavigation.challengeRevealStep ?? 0),
          MAX_CHALLENGE_REVEAL_STEP
        )
      )
      const savedAdviceRevealStep = Math.max(
        0,
        Math.min(
          Number(savedNavigation.adviceRevealStep ?? 0),
          MAX_ADVICE_REVEAL_STEP
        )
      )
      const savedIndexById = savedNavigation.slideId
        ? slides.findIndex((slide) => slide.id === savedNavigation.slideId)
        : -1
      const savedIndexByNumber =
        typeof savedNavigation.currentIndex === "number"
          ? savedNavigation.currentIndex
          : 0
      const nextIndex =
        savedIndexById >= 0
          ? savedIndexById
          : Math.max(0, Math.min(savedIndexByNumber, slides.length - 1))
      const nextSlide = slides[nextIndex]

      setChallengeRevealStep(savedChallengeRevealStep)
      setAdviceRevealStep(savedAdviceRevealStep)
      setCurrentIndex(nextIndex)
      setShowPhasesInterstitial(
        nextSlide?.id === PHASES_INTERSTITIAL_SLIDE_ID &&
          Boolean(savedNavigation.showPhasesInterstitial)
      )
    } catch {
      window.localStorage.removeItem(NAVIGATION_STORAGE_KEY)
    } finally {
      setHasRestoredNavigation(true)
    }
  }, [])

  useEffect(() => {
    if (!hasRestoredNavigation) {
      return
    }

    const navigationState: PersistedNavigationState = {
      adviceRevealStep,
      challengeRevealStep,
      currentIndex,
      showPhasesInterstitial,
      slideId: currentSlide.id,
    }

    window.localStorage.setItem(
      NAVIGATION_STORAGE_KEY,
      JSON.stringify(navigationState)
    )
  }, [
    adviceRevealStep,
    challengeRevealStep,
    currentIndex,
    currentSlide.id,
    hasRestoredNavigation,
    showPhasesInterstitial,
  ])

  useEffect(() => {
    const syncViewportMode = () => {
      setIsResponsiveViewport(window.innerWidth < 1024)
    }

    syncViewportMode()
    window.addEventListener("resize", syncViewportMode)

    return () => {
      window.removeEventListener("resize", syncViewportMode)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
      }

      clearSharedTransitionRevealTimer()
      clearSharedTransitionFinishTimer()
    }
  }, [])

  const scheduleHide = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
    }

    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false)
    }, CONTROL_HIDE_MS)
  }

  const revealControls = () => {
    setShowControls(true)
    scheduleHide()
  }

  const goToSlide = (nextIndex: number) => {
    if (sharedMorphTransition) {
      return
    }

    const clampedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1))
    const isOnPhasesSlide = currentSlide.id === PHASES_INTERSTITIAL_SLIDE_ID
    const isOnChallengeRevealSlide =
      currentSlide.id === CHALLENGE_REVEAL_SLIDE_ID
    const isOnAdviceRevealSlide = currentSlide.id === ADVICE_REVEAL_SLIDE_ID

    if (
      isOnPhasesSlide &&
      showPhasesInterstitial &&
      clampedIndex === currentIndex - 1
    ) {
      setShowPhasesInterstitial(false)
      revealControls()
      return
    }

    if (
      isOnPhasesSlide &&
      !showPhasesInterstitial &&
      clampedIndex === currentIndex + 1
    ) {
      setShowPhasesInterstitial(true)
      revealControls()
      return
    }

    if (
      isOnChallengeRevealSlide &&
      challengeRevealStep > 0 &&
      clampedIndex === currentIndex - 1
    ) {
      setChallengeRevealStep((previousStep) => Math.max(0, previousStep - 1))
      revealControls()
      return
    }

    if (
      isOnChallengeRevealSlide &&
      challengeRevealStep < MAX_CHALLENGE_REVEAL_STEP &&
      clampedIndex === currentIndex + 1
    ) {
      setChallengeRevealStep((previousStep) =>
        Math.min(MAX_CHALLENGE_REVEAL_STEP, previousStep + 1)
      )
      revealControls()
      return
    }

    if (
      isOnAdviceRevealSlide &&
      adviceRevealStep > 0 &&
      clampedIndex === currentIndex - 1
    ) {
      setAdviceRevealStep((previousStep) => Math.max(0, previousStep - 1))
      revealControls()
      return
    }

    if (
      isOnAdviceRevealSlide &&
      adviceRevealStep < MAX_ADVICE_REVEAL_STEP &&
      clampedIndex === currentIndex + 1
    ) {
      setAdviceRevealStep((previousStep) =>
        Math.min(MAX_ADVICE_REVEAL_STEP, previousStep + 1)
      )
      revealControls()
      return
    }

    if (clampedIndex === currentIndex) {
      return
    }

    if (showPhasesInterstitial) {
      setShowPhasesInterstitial(false)
    }

    if (isSharedMorphPair(currentIndex, clampedIndex)) {
      setSharedMorphTransition({
        direction: clampedIndex > currentIndex ? "forward" : "backward",
        fromIndex: currentIndex,
        overlayRect: null,
        sourceKind: null,
        stage: "mount",
        targetKind: null,
        targetRect: null,
        toIndex: clampedIndex,
      })
      revealControls()
      return
    }

    setCurrentIndex(clampedIndex)
    revealControls()
  }

  const handleKeyboardNavigation = useEffectEvent((delta: number) => {
    goToSlide(currentIndex + delta)
    revealControls()
  })

  useEffect(() => {
    const goToSectionHash = () => {
      const hash = window.location.hash.replace("#", "")

      if (!hash.startsWith("section-opener-")) {
        return
      }

      const nextIndex = slides.findIndex((slide) => slide.id === hash)

      if (nextIndex < 0) {
        return
      }

      goToSlide(nextIndex)
    }

    const handleSectionNavigation = (event: Event) => {
      const navigationEvent = event as CustomEvent<{ sectionNumber?: string }>
      const sectionNumber = navigationEvent.detail?.sectionNumber

      if (!sectionNumber) {
        return
      }

      const nextIndex = slides.findIndex(
        (slide) => slide.id === `section-opener-${sectionNumber}`
      )

      if (nextIndex < 0) {
        return
      }

      goToSlide(nextIndex)
    }

    goToSectionHash()
    window.addEventListener("hashchange", goToSectionHash)
    window.addEventListener("presentation:go-to-section", handleSectionNavigation)

    return () => {
      window.removeEventListener("hashchange", goToSectionHash)
      window.removeEventListener(
        "presentation:go-to-section",
        handleSectionNavigation
      )
    }
  })

  const handleDeckKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape" && showPhasesInterstitial) {
      event.preventDefault()
      setShowPhasesInterstitial(false)
      revealControls()
      return
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault()
      handleKeyboardNavigation(-1)
      return
    }

    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault()
      handleKeyboardNavigation(1)
    }
  })

  const handleWheelNavigation = (event: WheelEvent<HTMLDivElement>) => {
    revealControls()

    if (isResponsiveViewport || sharedMorphTransition) {
      return
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    event.preventDefault()

    wheelDeltaRef.current += event.deltaY

    if (Math.abs(wheelDeltaRef.current) < WHEEL_NAVIGATION_THRESHOLD) {
      return
    }

    const direction = wheelDeltaRef.current > 0 ? 1 : -1
    wheelDeltaRef.current = 0
    goToSlide(currentIndex + direction)
  }

  useLayoutEffect(() => {
    if (!sharedMorphTransition || sharedMorphTransition.stage !== "mount") {
      return
    }

    const deckElement = deckRef.current
    const fromElement = transitionFromRef.current
    const toElement = transitionToRef.current

    if (!deckElement || !fromElement || !toElement) {
      return
    }

    const fromSlide = slides[sharedMorphTransition.fromIndex]
    const toSlide = slides[sharedMorphTransition.toIndex]
    const fromIsOpener = isSectionOpenerSlide(fromSlide.id)
    const toIsOpener = isSectionOpenerSlide(toSlide.id)
    const sourceSelector = fromIsOpener
      ? "[data-transition-shape]"
      : "[data-transition-panel]"
    const targetSelector = toIsOpener
      ? "[data-transition-shape]"
      : "[data-transition-panel]"
    const sourceKind: SharedElementKind = fromIsOpener ? "shape" : "panel"
    const targetKind: SharedElementKind = toIsOpener ? "shape" : "panel"
    const sourceElement = fromElement.querySelector<HTMLElement>(sourceSelector)
    const targetElement = toElement.querySelector<HTMLElement>(targetSelector)

    if (!sourceElement || !targetElement) {
      const fallbackFrameId = window.requestAnimationFrame(() => {
        setCurrentIndex(sharedMorphTransition.toIndex)
        setSharedMorphTransition(null)
      })

      return () => {
        window.cancelAnimationFrame(fallbackFrameId)
      }
    }

    const deckRect = deckElement.getBoundingClientRect()
    const sourceRect = toSharedMorphRect(
      sourceElement.getBoundingClientRect(),
      deckRect,
      sourceKind
    )
    const targetRect = toSharedMorphRect(
      targetElement.getBoundingClientRect(),
      deckRect,
      targetKind
    )

    setSharedMorphTransition((previousTransition) => {
      if (!previousTransition || previousTransition.stage !== "mount") {
        return previousTransition
      }

      return {
        ...previousTransition,
        overlayRect: sourceRect,
        sourceKind,
        stage: "morph",
        targetKind,
        targetRect,
      }
    })

    const frameId = window.requestAnimationFrame(() => {
      setSharedMorphTransition((previousTransition) => {
        if (!previousTransition || previousTransition.stage !== "morph") {
          return previousTransition
        }

        return {
          ...previousTransition,
          overlayRect: targetRect,
        }
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [sharedMorphTransition])

  useEffect(() => {
    if (!sharedMorphTransition || sharedMorphTransition.stage !== "morph") {
      return
    }

    clearSharedTransitionRevealTimer()

    sharedTransitionRevealTimerRef.current = window.setTimeout(() => {
      setSharedMorphTransition((previousTransition) => {
        if (!previousTransition || previousTransition.stage !== "morph") {
          return previousTransition
        }

        return {
          ...previousTransition,
          stage: "reveal",
        }
      })
    }, SHARED_REVEAL_DELAY_MS)

    return () => {
      clearSharedTransitionRevealTimer()
    }
  }, [sharedMorphTransition])

  const sharedMorphToIndex = sharedMorphTransition?.toIndex ?? null

  useEffect(() => {
    if (sharedMorphToIndex === null) {
      return
    }

    clearSharedTransitionFinishTimer()

    sharedTransitionFinishTimerRef.current = window.setTimeout(() => {
      setCurrentIndex(sharedMorphToIndex)
      setSharedMorphTransition(null)
    }, SHARED_TRANSITION_TOTAL_MS)

    return () => {
      clearSharedTransitionFinishTimer()
    }
  }, [sharedMorphToIndex])

  useEffect(() => {
    deckRef.current?.focus({ preventScroll: true })
  }, [currentIndex, sharedMorphTransition])

  useEffect(() => {
    if (
      currentSlide.id !== PHASES_INTERSTITIAL_SLIDE_ID &&
      showPhasesInterstitial
    ) {
      setShowPhasesInterstitial(false)
    }
  }, [currentSlide.id, showPhasesInterstitial])

  useEffect(() => {
    document.addEventListener("keydown", handleDeckKeyDown)

    return () => {
      document.removeEventListener("keydown", handleDeckKeyDown)
    }
  }, [])

  const sharedMorphClassName = useMemo(() => {
    return [
      styles.sharedMorph,
      sharedMorphTransition?.direction === "backward"
        ? styles.sharedMorphBackward
        : "",
      sharedMorphTransition?.stage === "reveal"
        ? styles.sharedMorphSettled
        : "",
    ]
      .filter(Boolean)
      .join(" ")
  }, [sharedMorphTransition?.direction, sharedMorphTransition?.stage])

  const sharedTransitionClassName = useMemo(() => {
    return [
      styles.slideStage,
      sharedMorphTransition ? styles.slideStageTransitioning : "",
      sharedMorphTransition?.direction === "forward"
        ? styles.slideStageForward
        : "",
      sharedMorphTransition?.direction === "backward"
        ? styles.slideStageBackward
        : "",
      sharedMorphTransition?.stage === "reveal" ? styles.slideStageReveal : "",
    ]
      .filter(Boolean)
      .join(" ")
  }, [sharedMorphTransition])

  return (
    <div
      className={styles.deck}
      data-presentation-deck-root="true"
      data-navigation-restored={hasRestoredNavigation ? "true" : "false"}
      onMouseDownCapture={() => {
        deckRef.current?.focus({ preventScroll: true })
      }}
      onMouseMove={() => {
        if (!isResponsiveViewport) {
          revealControls()
        }
      }}
      onTouchEnd={(event) => {
        if (!isResponsiveViewport) {
          touchStartRef.current = null
          return
        }

        const start = touchStartRef.current
        const touch = event.changedTouches[0]
        touchStartRef.current = null

        if (!start || !touch) {
          return
        }

        const deltaX = touch.clientX - start.x
        const deltaY = touch.clientY - start.y

        if (
          Math.abs(deltaX) < SLIDE_SWIPE_DISTANCE ||
          Math.abs(deltaX) <= Math.abs(deltaY)
        ) {
          return
        }

        if (deltaX < 0) {
          goToSlide(currentIndex + 1)
          return
        }

        goToSlide(currentIndex - 1)
      }}
      onTouchMove={() => {
        if (isResponsiveViewport) {
          revealControls()
        }
      }}
      onTouchStart={(event) => {
        if (!isResponsiveViewport) {
          return
        }

        const touch = event.touches[0]

        if (!touch) {
          return
        }

        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      }}
      onWheel={handleWheelNavigation}
      ref={deckRef}
      tabIndex={-1}
    >
      <div className={sharedTransitionClassName}>
        {sharedMorphTransition ? (
          <>
            <div
              className={[styles.slideLayer, styles.slideLayerTo].join(" ")}
              ref={transitionToRef}
            >
              {slides[sharedMorphTransition.toIndex].render()}
            </div>

            <div
              className={[styles.slideLayer, styles.slideLayerFrom].join(" ")}
              ref={transitionFromRef}
            >
              {slides[sharedMorphTransition.fromIndex].render()}
            </div>

            {sharedMorphTransition.overlayRect ? (
              <div
                className={sharedMorphClassName}
                style={{
                  clipPath: sharedMorphTransition.overlayRect.clipPath,
                  height: `${sharedMorphTransition.overlayRect.height}px`,
                  left: `${sharedMorphTransition.overlayRect.left}px`,
                  top: `${sharedMorphTransition.overlayRect.top}px`,
                  transitionDuration: `${SHARED_MORPH_DURATION_MS}ms`,
                  width: `${sharedMorphTransition.overlayRect.width}px`,
                }}
              />
            ) : null}
          </>
        ) : (
          <div className={styles.slideLayerCurrent} key={currentSlide.id}>
            {currentSlide.render()}
          </div>
        )}
      </div>

      {isPhasesInterstitialActive ? (
        <div
          aria-label="Detailed gantt chart for project phases"
          className={styles.slideInterstitial}
          onClick={() => setShowPhasesInterstitial(false)}
          role="dialog"
        >
          <div
            className={styles.slideInterstitialFrame}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.slideInterstitialImageWrap}>
              <Image
                alt="Gantt chart showing the detailed project timeline from January to April 2026"
                className={styles.slideInterstitialImage}
                fill
                priority
                sizes="(max-width: 1023px) 92vw, 78vw"
                src="/reference/slide-8/gantt-chart.png"
                unoptimized
              />
            </div>

            <button
              aria-label="Close detailed timeline"
              className={styles.slideInterstitialClose}
              onClick={() => setShowPhasesInterstitial(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className={controlsClassName}>
        <button
          aria-label="Previous slide"
          className={styles.controlButton}
          disabled={currentIndex === 0}
          onClick={() => goToSlide(currentIndex - 1)}
          type="button"
        >
          {"<"}
        </button>

        <div className={styles.controlMeta}>
          <strong>{visibleSlide.shortLabel}</strong>
          <span>{visibleSlide.label}</span>
        </div>

        <button
          aria-label="Next slide"
          className={styles.controlButton}
          disabled={currentIndex === slides.length - 1}
          onClick={() => goToSlide(currentIndex + 1)}
          type="button"
        >
          {">"}
        </button>
      </div>

      {!isResponsiveViewport ? (
        <nav
          aria-label="Slide progress"
          className={styles.progressRail}
          onMouseLeave={() => setIsProgressMenuOpen(false)}
          onMouseEnter={revealControls}
          onPointerLeave={() => setIsProgressMenuOpen(false)}
        >
          <div
            className={[
              styles.progressMenu,
              isProgressMenuOpen ? styles.progressMenuOpen : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onFocus={() => setIsProgressMenuOpen(true)}
            onMouseEnter={() => setIsProgressMenuOpen(true)}
            onPointerEnter={() => setIsProgressMenuOpen(true)}
          >
            <p className={styles.progressMenuTitle}>Presentation Flow</p>

            <div className={styles.progressMenuList}>
              {slides.map((slide, index) => {
                const isActive = index === currentIndex
                const isCompleted = index < currentIndex

                return (
                  <button
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      styles.progressMenuItem,
                      isActive ? styles.progressMenuItemActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    type="button"
                  >
                    <span
                      className={[
                        styles.progressMenuLine,
                        isActive ? styles.progressMenuLineActive : "",
                        isCompleted ? styles.progressMenuLineCompleted : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                    <span className={styles.progressMenuMeta}>
                      <strong>{slide.shortLabel}</strong>
                      <span>{slide.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className={styles.progressTicks}
            onFocus={() => setIsProgressMenuOpen(true)}
            onMouseEnter={() => setIsProgressMenuOpen(true)}
            onPointerEnter={() => setIsProgressMenuOpen(true)}
          >
            {slides.map((slide, index) => {
              const isActive = index === currentIndex
              const isCompleted = index < currentIndex

              return (
                <button
                  aria-label={`Go to ${slide.shortLabel}: ${slide.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    styles.progressTick,
                    isActive ? styles.progressTickActive : "",
                    isCompleted ? styles.progressTickCompleted : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={`${slide.id}-tick`}
                  onClick={() => goToSlide(index)}
                  type="button"
                />
              )
            })}
          </div>
        </nav>
      ) : null}
    </div>
  )
}
