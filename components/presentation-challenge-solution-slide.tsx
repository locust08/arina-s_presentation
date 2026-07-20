"use client"

import { ContentSlideTemplate } from "@/components/content-slide-template"

import styles from "./presentation-challenge-solution-slide.module.css"

type Item = { body: string; title: string }

export function PresentationChallengeSolutionSlide({
  challenges,
  solutions,
}: {
  challenges: Item[]
  solutions: Item[]
}) {
  const renderColumn = (title: string, items: Item[]) => (
    <section className={styles.column}>
      <h2>{title}</h2>
      <ol>
        {items.map((item, index) => (
          <li key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )

  return (
    <ContentSlideTemplate title="Biggest Challenge & How I Overcame It">
      <div className={styles.layout}>
        {renderColumn("Biggest Challenge", challenges)}
        <div className={styles.arrows} aria-hidden="true">
          <span>→</span><span>→</span><span>→</span>
        </div>
        {renderColumn("How I Overcame It", solutions)}
      </div>
    </ContentSlideTemplate>
  )
}
