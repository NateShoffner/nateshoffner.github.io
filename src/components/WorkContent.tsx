import Link from 'next/link'
import type { Profile } from '@lib/profile'
import type { CertSummary } from '@/src/types/CertSummary'
import styles from './WorkContent.module.scss'

interface Props {
  profile: Profile | null
  certs?: CertSummary
  compact?: boolean
}

export default function WorkContent({ profile, certs, compact = false }: Props) {
  const openToWork = profile?.open_to_work ?? false

  return (
    <div className={styles.wrap}>
      <div className={styles.availabilityRow}>
        <span className={openToWork ? styles.openBadge : styles.closedBadge}>
          <span className={openToWork ? styles.openDot : styles.closedDot} />
          {openToWork ? 'Available for New Roles' : 'Not Currently Available'}
        </span>
        <span className={styles.availabilityNote}>
          {openToWork
            ? 'Open to full-time and contract opportunities.'
            : 'Currently employed and not seeking new positions.'}
        </span>
      </div>

      <div className={compact ? styles.panelsCompact : styles.panels}>

        {/* ── Resume ── */}
        <div className={styles.panel}>
          <div className={styles.panelLeft}>
            <div className={styles.panelMeta}>
              <i className={`fa fa-file-text-o ${styles.panelIcon}`} />
              <span className={styles.panelLabel}>Resume</span>
            </div>
            <h3 className={styles.panelTitle}>Work History &amp; Skills</h3>
            <p className={styles.panelDesc}>
              A detailed record of professional experience, technical skills,
              and career background.
            </p>
            <Link href="/work/resume" className={styles.panelBtn}>
              View Resume <i className="fa fa-arrow-right" />
            </Link>
          </div>

          <div className={styles.panelRight}>
            <div className={styles.docPreview}>
              <div className={styles.docSection}>
                <div className={styles.docSectionLabel}>Experience</div>
                <div className={styles.docLine} style={{ width: '85%' }} />
                <div className={styles.docLine} style={{ width: '65%' }} />
                <div className={styles.docLine} style={{ width: '75%' }} />
              </div>
              <div className={styles.docDivider} />
              <div className={styles.docSection}>
                <div className={styles.docSectionLabel}>Skills</div>
                <div className={styles.docLine} style={{ width: '60%' }} />
                <div className={styles.docLine} style={{ width: '50%' }} />
                <div className={styles.docLine} style={{ width: '70%' }} />
              </div>
              <div className={styles.docDivider} />
              <div className={styles.docSection}>
                <div className={styles.docSectionLabel}>Projects</div>
                <div className={styles.docLine} style={{ width: '70%' }} />
                <div className={styles.docLine} style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className={styles.panel}>
          <div className={styles.panelLeft}>
            <div className={styles.panelMeta}>
              <i className={`fa fa-certificate ${styles.panelIcon}`} />
              <span className={styles.panelLabel}>Certifications</span>
            </div>
            <h3 className={styles.panelTitle}>Industry Credentials</h3>
            <p className={styles.panelDesc}>
              Verified certifications across various platforms, vendors,
              and technologies.
            </p>
            <Link href="/work/certifications" className={styles.panelBtn}>
              View Certifications <i className="fa fa-arrow-right" />
            </Link>
          </div>

          <div className={styles.panelRight}>
            {certs && (
              <>
                <div className={styles.issuerLogos}>
                  {certs.issuers.map(({ name, logo }) => {
                    if (!logo) return (
                      <div key={name} className={styles.issuerLogoPlaceholder}>
                        {name.charAt(0)}
                      </div>
                    )
                    const lightSrc = `/assets/images/certs/${logo}`
                    const darkSrc = lightSrc.replace('-black.', '-white.')
                    const hasVariants = lightSrc !== darkSrc
                    return hasVariants ? (
                      <span key={name} className={styles.issuerLogoWrap}>
                        <img src={lightSrc} alt={name} className={`${styles.issuerLogo} ${styles.issuerLogoLight}`} />
                        <img src={darkSrc} alt={name} className={`${styles.issuerLogo} ${styles.issuerLogoDark}`} />
                      </span>
                    ) : (
                      <img key={name} src={lightSrc} alt={name} className={styles.issuerLogo} />
                    )
                  })}
                </div>
                <div className={styles.statsStrip}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{certs.active}</span>
                    <span className={styles.statLabel}>Active</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{certs.total}</span>
                    <span className={styles.statLabel}>Total</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{certs.issuers.length}</span>
                    <span className={styles.statLabel}>Issuers</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
