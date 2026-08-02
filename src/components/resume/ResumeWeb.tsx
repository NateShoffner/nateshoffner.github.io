'use client'

import type { Resume, ResumeExperience } from '@lib/resume'
import { groupExperience } from '@lib/experience'
import type { Certification } from '@/src/types/Certification'
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe,
  FaCalendarAlt, FaExternalLinkAlt,
} from 'react-icons/fa'
import styles from './ResumeWeb.module.scss'

interface Props {
  resume: Resume
  certifications: Certification[]
}

function CompanyName({ name, homepage, className }: {
  name: string
  homepage?: string
  className: string
}) {
  return homepage ? (
    <a className={className} href={homepage} target="_blank" rel="noopener noreferrer">
      {name} <FaExternalLinkAlt className={styles.externalIcon} />
    </a>
  ) : (
    <p className={className}>{name}</p>
  )
}

function RoleBody({ exp }: { exp: ResumeExperience }) {
  return (
    <>
      <p className={styles.entryMeta}>
        <FaCalendarAlt className={styles.metaIcon} />
        <span>{exp.start} – {exp.end}</span>
        <FaMapMarkerAlt className={styles.metaIcon} style={{ marginLeft: '0.6rem' }} />
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(exp.location)}`}
          target="_blank" rel="noopener noreferrer"
          className={styles.metaLink}
        >
          {exp.location}
        </a>
      </p>
      <ul className={styles.bulletList}>
        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
      </ul>
    </>
  )
}

export default function ResumeWeb({ resume, certifications }: Props) {
  const { contact } = resume

  return (
    <div className={styles.page}>
      {/* ── Toolbar (outside resume content) ── */}
      <div className={styles.toolbar}>
        <a
          className="btn btn-primary"
          href="/work/resume/print"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaExternalLinkAlt className={styles.btnIcon} /> Print / Download Friendly Version
        </a>
      </div>

      {/* ── Header ── */}
      <section className={styles.header}>
        <h1 className={styles.name}>{resume.name}</h1>
        <p className={styles.title}>{resume.title}</p>
        <ul className={styles.contactRow}>
          <li>
            <FaMapMarkerAlt />
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(contact.location)}`}
              target="_blank" rel="noopener noreferrer"
            >
              {contact.location}
            </a>
          </li>
          <li>
            <FaEnvelope />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <FaPhone />
            <a href={`tel:${contact.phone.replace(/\D/g, '')}`}>{contact.phone}</a>
          </li>
          <li>
            <FaLinkedin />
            <a
              href={`https://linkedin.com/in/${contact.linkedin}`}
              target="_blank" rel="noopener noreferrer"
            >
              {contact.linkedin}
            </a>
          </li>
          <li>
            <FaGithub />
            <a
              href={`https://github.com/${contact.github}`}
              target="_blank" rel="noopener noreferrer"
            >
              {contact.github}
            </a>
          </li>
          <li>
            <FaGlobe />
            <a
              href={`https://${contact.website}`}
              target="_blank" rel="noopener noreferrer"
            >
              {contact.website}
            </a>
          </li>
        </ul>
      </section>

      <div className={styles.body}>
        {/* ── Left column ── */}
        <aside className={styles.aside}>

          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Skills</h2>
            <ul className={styles.bulletList}>
              {resume.skills.soft.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Languages</h2>
            <ul className={styles.bulletList}>
              {resume.skills.languages.map(l => <li key={l}>{l}</li>)}
            </ul>
          </div>

          {certifications.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={i} className={styles.certEntry}>
                  {cert.credential_url ? (
                    <a
                      className={styles.certName}
                      href={cert.credential_url}
                      target="_blank" rel="noopener noreferrer"
                    >
                      {cert.name} <FaExternalLinkAlt className={styles.externalIcon} />
                    </a>
                  ) : (
                    <p className={styles.certName}>{cert.name}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Recent Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className={styles.projectEntry}>
                {proj.homepage ? (
                  <a
                    className={styles.projectName}
                    href={proj.homepage}
                    target="_blank" rel="noopener noreferrer"
                  >
                    {proj.name} <FaExternalLinkAlt className={styles.externalIcon} />
                  </a>
                ) : (
                  <p className={styles.projectName}>{proj.name}</p>
                )}
                <p className={styles.projectRole}>{proj.role}</p>
                <p className={styles.projectDates}>{proj.start} – {proj.end}</p>
                <ul className={styles.projectBullets}>
                  {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

        </aside>

        {/* ── Main column ── */}
        <main className={styles.main}>

          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Career Objective</h2>
            <p className={styles.objective}>{resume.objective}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Work Experience</h2>
            {groupExperience(resume.experience).map((group, i) => (
              <div key={i} className={styles.entry}>
                {group.roles.length > 1 ? (
                  <>
                    <CompanyName
                      name={group.company}
                      homepage={group.homepage}
                      className={styles.groupCompany}
                    />
                    {group.roles.map((exp, j) => (
                      <div key={j} className={styles.groupRole}>
                        <h3 className={styles.roleTitle}>{exp.title}</h3>
                        <RoleBody exp={exp} />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <h3 className={styles.entryTitle}>{group.roles[0].title}</h3>
                    <CompanyName
                      name={group.company}
                      homepage={group.homepage}
                      className={styles.entryCompany}
                    />
                    <RoleBody exp={group.roles[0]} />
                  </>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
