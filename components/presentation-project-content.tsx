"use client"

import Image from "next/image"
import type { ReactNode } from "react"

import { ContentSlideTemplate } from "@/components/content-slide-template"

import styles from "./presentation-project-content.module.css"

type Card = { label: string; text: string }

type PresentationProjectContentProps = {
  cards?: Card[]
  children?: ReactNode
  eyebrow?: string
  imageAlt?: string
  imageSrc?: string
  imageLabel?: string
  lead?: string
  quote?: string
  title: string
  variant?: "cards" | "process" | "showcase" | "story"
}

export function PresentationProjectContent({
  cards = [],
  children,
  eyebrow,
  imageAlt = "Metro Pinjaman Berlesen website preview",
  imageSrc,
  imageLabel,
  lead,
  quote,
  title,
  variant = "cards",
}: PresentationProjectContentProps) {
  return (
    <ContentSlideTemplate title={title}>
      <div className={[styles.layout, styles[variant]].join(" ")}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {lead ? <p className={styles.lead}>{lead}</p> : null}

          {cards.length ? (
            <div className={styles.grid}>
              {cards.map((card, index) => (
                <article className={styles.card} key={`${card.label}-${index}`}>
                  {variant === "process" ? (
                    <span className={styles.step}>{String(index + 1).padStart(2, "0")}</span>
                  ) : null}
                  <h2>{card.label}</h2>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          ) : null}

          {quote ? <blockquote>{quote}</blockquote> : null}
          {children}
        </div>

        {imageSrc ? (
          <figure className={styles.media}>
            <Image alt={imageAlt} fill sizes="(max-width: 1023px) 92vw, 52vw" src={imageSrc} unoptimized />
            {imageLabel ? <figcaption>{imageLabel}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </ContentSlideTemplate>
  )
}
