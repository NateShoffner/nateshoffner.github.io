'use client'

import { useEffect, useState } from 'react'
import { AboutSection } from '@components/AboutSection'
import BlogSection from '@components/BlogSection'
import { ProjectsSection } from '@components/ProjectsSection'
import WorkSection from '@components/WorkSection'
import ContactSection from '@components/ContactSection'
import ScrollButton from '@components/ScrollButton'
import TopButton from '@components/TopButton'
import { Element } from 'react-scroll'
import type { PostMeta } from '@/lib/blog'
import type { Project } from '@/src/types/Project'
import type { Profile } from '@/lib/profile'
import type { CertSummary } from '@/src/types/CertSummary'
import { workSectionEnabled } from '@/src/config'

export default function HomePage() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [certSummary, setCertSummary] = useState<CertSummary | null>(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [aboutRevealed, setAboutRevealed] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data: PostMeta[]) => setPosts(data))
      .catch(() => {})
      .finally(() => setPostsLoading(false))

    fetch('/api/projects')
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => {})
      .finally(() => setProjectsLoading(false))

    fetch('/api/profile')
      .then((r) => r.json())
      .then((data: Profile) => setProfile(data))
      .catch(() => {})

    if (workSectionEnabled) {
      fetch('/api/certs/summary')
        .then((r) => r.json())
        .then((data: CertSummary) => setCertSummary(data))
        .catch(() => {})
    }
  }, [])

  return (
    <div className="container-fluid p-0">
      <Element name="about">
        <section className="page-section about-cover p-4 p-lg-5 d-flex d-column" id="about">
          <div className="my-auto">
            <AboutSection profile={profile} onRevealed={() => setAboutRevealed(true)} />
          </div>
          <div style={{ opacity: aboutRevealed && !hasScrolled ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <ScrollButton target="blog" />
          </div>
        </section>
      </Element>

      <Element name="blog">
        <section className="page-section p-4 p-lg-5 d-flex flex-column" id="blog">
          <div className="my-auto">
            <h2 className="mb-5">
              Latest <span className="text-highlight">Blog Posts</span>
              <a href="/feed.xml">
                <i className="fa fa-rss pl-4"></i>
              </a>
            </h2>
            <BlogSection posts={posts.slice(0, 6)} loading={postsLoading} />
            <div className="mt-4">
              <a href="/blog" className="btn btn-primary px-4">
                All posts <i className="fa fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </Element>

      <Element name="projects">
        <section className="page-section p-4 p-lg-5 d-flex flex-column" id="projects">
          <div className="my-auto">
            <ProjectsSection projects={projects} limit={6} showMore={true} loading={projectsLoading} />
          </div>
        </section>
      </Element>

      {workSectionEnabled && (
        <Element name="work">
          <section className="page-section p-4 p-lg-5 d-flex flex-column" id="work">
            <div className="my-auto">
              <WorkSection profile={profile} certSummary={certSummary} />
            </div>
          </section>
        </Element>
      )}

      <Element name="contact">
        <section className="page-section p-4 p-lg-5 d-flex flex-column" id="contact">
          <div>
            <ContactSection />
          </div>
        </section>
      </Element>

      <TopButton target="about" />
    </div>
  )
}
