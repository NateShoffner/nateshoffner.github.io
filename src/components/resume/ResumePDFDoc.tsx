import React from 'react'
import { Document, Page, Text, View, StyleSheet, type TextProps } from '@react-pdf/renderer'
import type { Resume } from '@lib/resume'
import { groupExperience } from '@lib/experience'
import type { Certification } from '@/src/types/Certification'

const DARK_BG = '#2d2d2d'
const DARK_TEXT = '#e0e0e0'
const LIGHT_BG = '#f0f0f0'
const LIGHT_TEXT = '#212529'
const MUTED = '#666'

const s = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  sidebar: {
    width: 195,
    flexDirection: 'column',
  },
  sidebarTop: {
    backgroundColor: DARK_BG,
    padding: 20,
    paddingBottom: 18,
  },
  sidebarBottom: {
    backgroundColor: LIGHT_BG,
    padding: 16,
    flex: 1,
  },
  main: {
    flex: 1,
    padding: 24,
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },

  name: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  jobTitle: {
    color: DARK_TEXT,
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  contactText: {
    color: DARK_TEXT,
    fontSize: 8,
    flexShrink: 1,
  },

  sidebarSection: {
    marginBottom: 14,
  },
  sidebarHeading: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: LIGHT_TEXT,
    marginBottom: 5,
  },
  skillItem: {
    fontSize: 8.5,
    color: LIGHT_TEXT,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  languagesText: {
    fontSize: 8.5,
    color: LIGHT_TEXT,
    lineHeight: 1.5,
  },

  certEntry: {
    marginBottom: 4,
  },
  certName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
  },

  projectEntry: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 8.5,
    color: LIGHT_TEXT,
  },
  projectRole: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
    marginBottom: 1,
  },
  projectDates: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 3,
  },
  projectBullet: {
    fontSize: 8,
    color: LIGHT_TEXT,
    lineHeight: 1.5,
    marginBottom: 1,
    paddingLeft: 8,
  },

  section: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: LIGHT_TEXT,
    borderBottom: '1 solid #ccc',
    paddingBottom: 3,
    marginBottom: 8,
  },
  objective: {
    fontSize: 9,
    color: LIGHT_TEXT,
    lineHeight: 1.5,
  },

  entry: {
    marginBottom: 10,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
    marginBottom: 1,
  },
  entryCompany: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
    marginBottom: 1,
  },
  entryMeta: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 5,
  },

  groupCompany: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
    marginBottom: 6,
  },
  roleRow: {
    flexDirection: 'row',
  },
  timelineCol: {
    width: 12,
    alignItems: 'center',
  },
  timelineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: MUTED,
    marginTop: 3,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#cccccc',
    marginTop: 2,
  },
  roleContent: {
    flex: 1,
    paddingBottom: 10,
  },
  roleContentLast: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: LIGHT_TEXT,
    marginBottom: 1,
  },
  bullet: {
    fontSize: 9,
    color: LIGHT_TEXT,
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 10,
  },
})

function Bullet({ text, style }: { text: string; style: TextProps['style'] }) {
  return <Text style={style}>{'• ' + text}</Text>
}

export function ResumePDFDoc({ resume, certifications }: { resume: Resume; certifications: Certification[] }) {
  const { contact } = resume
  const experienceGroups = groupExperience(resume.experience)
  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* ── Sidebar ── */}
        <View style={s.sidebar}>

          {/* Dark top */}
          <View style={s.sidebarTop}>
            <Text style={s.name}>{resume.name}</Text>
            <Text style={s.jobTitle}>{resume.title}</Text>
            <View style={s.contactItem}><Text style={s.contactText}>{contact.email}</Text></View>
            <View style={s.contactItem}><Text style={s.contactText}>{contact.phone}</Text></View>
            <View style={s.contactItem}><Text style={s.contactText}>{contact.location}</Text></View>
            <View style={s.contactItem}><Text style={s.contactText}>linkedin.com/in/{contact.linkedin}</Text></View>
            <View style={s.contactItem}><Text style={s.contactText}>github.com/{contact.github}</Text></View>
            <View style={s.contactItem}><Text style={s.contactText}>{contact.website}</Text></View>
          </View>

          {/* Light bottom */}
          <View style={s.sidebarBottom}>

            <View style={s.sidebarSection}>
              <Text style={s.sidebarHeading}>Skills</Text>
              {resume.skills.soft.map((skill, i) => (
                <Text key={i} style={s.skillItem}>{'• ' + skill}</Text>
              ))}
            </View>

            <View style={s.sidebarSection}>
              <Text style={s.sidebarHeading}>Languages</Text>
              <Text style={s.languagesText}>{resume.skills.languages.join(', ')}</Text>
            </View>

            {certifications.length > 0 && (
              <View style={s.sidebarSection}>
                <Text style={s.sidebarHeading}>Certifications</Text>
                {certifications.map((cert, i) => (
                  <View key={i} style={s.certEntry}>
                    <Text style={s.certName}>{cert.name}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={s.sidebarSection}>
              <Text style={s.sidebarHeading}>Recent Projects</Text>
              {resume.projects.map((proj, i) => (
                <View key={i} style={s.projectEntry}>
                  <Text style={s.projectName}>{proj.name}</Text>
                  <Text style={s.projectRole}>{proj.role}</Text>
                  <Text style={s.projectDates}>{proj.start} – {proj.end}</Text>
                  {proj.bullets.map((b, j) => (
                    <Text key={j} style={s.projectBullet}>{'• ' + b}</Text>
                  ))}
                </View>
              ))}
            </View>

          </View>
        </View>

        {/* ── Main ── */}
        <View style={s.main}>

          <View style={s.section}>
            <Text style={s.sectionHeading}>Career Objective</Text>
            <Text style={s.objective}>{resume.objective}</Text>
          </View>

          {/* Heading and entries are siblings (not one wrapping View) so
              react-pdf can break between entries instead of relocating the
              whole section to the next page. */}
          <Text style={s.sectionHeading}>Work Experience</Text>
          {experienceGroups.map((group, i) => (
            <View
              key={i}
              style={i === experienceGroups.length - 1 ? [s.entry, { marginBottom: 0 }] : s.entry}
            >
              {group.roles.length > 1 && (
                <Text style={s.groupCompany}>{group.company}</Text>
              )}
              {group.roles.map((exp, j) =>
                group.roles.length > 1 ? (
                  <View key={j} style={s.roleRow}>
                    <View style={s.timelineCol}>
                      <View style={s.timelineDot} />
                      {j < group.roles.length - 1 && <View style={s.timelineLine} />}
                    </View>
                    <View style={j === group.roles.length - 1 ? s.roleContentLast : s.roleContent}>
                      <Text style={s.roleTitle}>{exp.title}</Text>
                      <Text style={s.entryMeta}>{exp.start} – {exp.end}  ·  {exp.location}</Text>
                      {exp.bullets.map((b, k) => (
                        <Bullet key={k} text={b} style={s.bullet} />
                      ))}
                    </View>
                  </View>
                ) : (
                  <View key={j}>
                    <Text style={s.entryTitle}>{exp.title}</Text>
                    <Text style={s.entryCompany}>{exp.company}</Text>
                    <Text style={s.entryMeta}>{exp.start} – {exp.end}  ·  {exp.location}</Text>
                    {exp.bullets.map((b, k) => (
                      <Bullet key={k} text={b} style={s.bullet} />
                    ))}
                  </View>
                )
              )}
            </View>
          ))}

        </View>

      </Page>
    </Document>
  )
}
