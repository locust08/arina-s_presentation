"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"

import { ContentSlideTemplate } from "@/components/content-slide-template"

import styles from "./presentation-project-showcase-slide.module.css"

type ShowcaseProject = {
  description: string
  image: string
  name: string
  url?: string
}

export function PresentationProjectShowcaseSlide({
  projects,
  subtitle,
  title,
}: {
  projects: ShowcaseProject[]
  subtitle: string
  title: string
}) {
  return (
    <ContentSlideTemplate title={title}>
      <div className={styles.layout}>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={projects.length === 2 ? styles.gridTwo : styles.gridThree}>
          {projects.map((project, index) => {
            const content = (
              <>
              <div className={styles.media}>
                <Image
                  alt={`${project.name} website`}
                  fill
                  priority
                  sizes={projects.length === 2 ? "760px" : "520px"}
                  src={project.image}
                  unoptimized
                />
              </div>
              <div className={styles.copy}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </div>
              </>
            )

            return project.url ? (
              <a
                aria-label={`Visit the ${project.name} website`}
                className={`${styles.project} ${styles.projectLink}`}
                href={project.url}
                key={project.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <article className={styles.project} key={project.name}>
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </ContentSlideTemplate>
  )
}
