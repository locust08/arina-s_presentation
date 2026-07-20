"use client"

// Layout locked: preserve structure and positioning. Content changes only.

import Image from "next/image"
import { ExternalLink, Play, X } from "lucide-react"
import { useState } from "react"

import { ContentSlideTemplate } from "@/components/content-slide-template"

import styles from "./presentation-project-showcase-slide.module.css"

type ShowcaseProject = {
  description: string
  image: string
  name: string
  url?: string
  videoUrl?: string
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
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null)
  const [showVideo, setShowVideo] = useState(false)

  const closeDialog = () => {
    setSelectedProject(null)
    setShowVideo(false)
  }

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

            return project.videoUrl ? (
              <button
                aria-label={`Open ${project.name} showcase options`}
                className={`${styles.project} ${styles.projectLink} ${styles.projectButton}`}
                key={project.name}
                onClick={() => setSelectedProject(project)}
                type="button"
              >
                {content}
              </button>
            ) : project.url ? (
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
      {selectedProject && (
        <div className={styles.dialogBackdrop} onClick={closeDialog} role="presentation">
          <div
            aria-labelledby="showcase-dialog-title"
            aria-modal="true"
            className={`${styles.dialog} ${showVideo ? styles.videoDialog : ""}`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button aria-label="Close showcase" className={styles.closeButton} onClick={closeDialog} type="button">
              <X aria-hidden="true" />
            </button>
            {showVideo ? (
              <>
                <h2 id="showcase-dialog-title">{selectedProject.name} Showcase</h2>
                <video autoPlay className={styles.video} controls playsInline src={selectedProject.videoUrl} />
              </>
            ) : (
              <>
                <span className={styles.dialogEyebrow}>PROJECT SHOWCASE</span>
                <h2 id="showcase-dialog-title">Explore {selectedProject.name}</h2>
                <p>Choose how you would like to view this project.</p>
                <div className={styles.dialogActions}>
                  <a href={selectedProject.url} rel="noopener noreferrer" target="_blank">
                    <ExternalLink aria-hidden="true" />
                    Visit Website
                  </a>
                  <button onClick={() => setShowVideo(true)} type="button">
                    <Play aria-hidden="true" />
                    Watch Showcase Video
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ContentSlideTemplate>
  )
}
