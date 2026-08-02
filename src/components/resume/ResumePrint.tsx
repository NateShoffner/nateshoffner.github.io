import type { Resume } from '@lib/resume'
import { groupExperience } from '@lib/experience'
import type { Certification } from '@/src/types/Certification'
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe,
  FaCalendarAlt,
} from 'react-icons/fa'
import { PrintButton } from './PrintButton'
import styles from './ResumePrint.module.scss'

interface Props {
  resume: Resume
  certifications: Certification[]
}

export default function ResumePrint({ resume, certifications }: Props) {

  return (
    <>
    <style>{`@media print { [data-rp-toolbar] { display: none !important; } }`}</style>
    <div data-rp-toolbar className={styles.toolbar}>
      <PrintButton />
    </div>
    <div className={styles.page}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>

        {/* Dark top: name, title, contact */}
        <div className={styles.sidebarTop}>
          <div className={styles.nameBlock}>
            <h1 className={styles.name}>{resume.name}</h1>
            <p className={styles.title}>{resume.title}</p>
          </div>
          <ul className={styles.contactList}>
            <li><FaMapMarkerAlt className={styles.contactIcon} /><span>{resume.contact.location}</span></li>
            <li><FaEnvelope className={styles.contactIcon} /><span>{resume.contact.email}</span></li>
            <li><FaPhone className={styles.contactIcon} /><span>{resume.contact.phone}</span></li>
            <li><FaLinkedin className={styles.contactIcon} /><span>{resume.contact.linkedin}</span></li>
            <li><FaGithub className={styles.contactIcon} /><span>{resume.contact.github}</span></li>
            <li><FaGlobe className={styles.contactIcon} /><span>{resume.contact.website}</span></li>
          </ul>
        </div>

        {/* Light bottom: skills, languages, projects */}
        <div className={styles.sidebarBottom}>

          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarHeading}>Skills</h2>
            <ul className={styles.skillList}>
              {resume.skills.soft.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarHeadingMixed}>Languages</h2>
            <p className={styles.languagesInline}>
              {resume.skills.languages.join(', ')}
            </p>
          </div>

          {certifications.length > 0 && (
            <div className={styles.sidebarSection}>
              <h2 className={styles.sidebarHeading}>Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={i} className={styles.certEntry}>
                  <p className={styles.certName}>{cert.name}</p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarHeading}>Recent Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className={styles.projectEntry}>
                <p className={styles.projectName}>{proj.name}</p>
                <p className={styles.projectRole}>{proj.role}</p>
                <p className={styles.projectDates}>{proj.start} – {proj.end}</p>
                <ul className={styles.projectBullets}>
                  {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Career Objective</h2>
          <p className={styles.objective}>{resume.objective}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Work Experience</h2>
          {groupExperience(resume.experience).map((group, i) => (
            <div key={i} className={styles.entry}>
              {group.roles.length > 1 && (
                <p className={styles.groupCompany}>{group.company}</p>
              )}
              {group.roles.map((exp, j) => (
                <div key={j} className={group.roles.length > 1 ? styles.groupRole : undefined}>
                  {group.roles.length > 1 ? (
                    <h3 className={styles.roleTitle}>{exp.title}</h3>
                  ) : (
                    <>
                      <h3 className={styles.entryTitle}>{exp.title}</h3>
                      <p className={styles.entryCompany}>{exp.company}</p>
                    </>
                  )}
                  <p className={styles.entryMeta}>
                    <FaCalendarAlt className={styles.metaIcon} />
                    <span>{exp.start} – {exp.end}</span>
                    <FaMapMarkerAlt className={styles.metaIcon} style={{ marginLeft: '0.35rem' }} />
                    <span>{exp.location}</span>
                  </p>
                  <ul className={styles.bulletList}>
                    {exp.bullets.map((b, k) => <li key={k}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>

      </main>
    </div>
    </>
  )
}
