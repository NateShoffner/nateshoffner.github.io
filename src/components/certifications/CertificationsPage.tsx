'use client'

import { useState, useMemo } from 'react'
import type { Certification } from '@/src/types/Certification'
import styles from './CertificationsPage.module.scss'

const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}


function parseMonthYear(str: string): Date {
  const [mon, year] = str.split(' ')
  return new Date(parseInt(year), MONTHS[mon] ?? 0)
}

function certIsActive(cert: Certification): boolean {
  if (!cert.expires) return true
  return parseMonthYear(cert.expires) >= new Date()
}

function IssuerLogo({ cert, size = 28 }: { cert: Certification; size?: number }) {
  if (cert.issuer_logo) {
    const lightSrc = `/assets/images/certs/${cert.issuer_logo}`
    const darkSrc = lightSrc.replace('-black.', '-white.')
    const hasVariants = lightSrc !== darkSrc

    return (
      <div className={styles.logo} style={{ width: size, height: size }}>
        {hasVariants ? (
          <>
            <img src={lightSrc} alt={cert.issuer} className={styles.logoLight} />
            <img src={darkSrc} alt={cert.issuer} className={styles.logoDark} />
          </>
        ) : (
          <img src={lightSrc} alt={cert.issuer} />
        )}
      </div>
    )
  }
  return (
    <div className={styles.logo} style={{ width: size, height: size }}>
      <div className={styles.logoPlaceholder}>{cert.issuer.charAt(0)}</div>
    </div>
  )
}

type ViewMode = 'cards' | 'table'

interface Props {
  certifications: Certification[]
}

export default function CertificationsPage({ certifications }: Props) {
  const [issuerFilter, setIssuerFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  const issuers = useMemo(
    () => Array.from(new Set(certifications.map((c) => c.issuer))),
    [certifications]
  )

  const filtered = useMemo(() => {
    return certifications.filter((cert) => {
      if (issuerFilter && cert.issuer !== issuerFilter) return false
      const active = certIsActive(cert)
      if (statusFilter === 'active' && !active) return false
      if (statusFilter === 'expired' && active) return false
      return true
    })
  }, [certifications, issuerFilter, statusFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Certification[]>()
    for (const cert of filtered) {
      if (!map.has(cert.issuer)) map.set(cert.issuer, [])
      map.get(cert.issuer)!.push(cert)
    }
    return Array.from(map.entries())
  }, [filtered])

  const activeCount = filtered.filter(certIsActive).length
  const expiredCount = filtered.length - activeCount
  const hasFilters = issuerFilter !== '' || statusFilter !== ''
  const clearFilters = () => { setIssuerFilter(''); setStatusFilter('') }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Certifications</h1>

      <div className={styles.toolbar}>
        <span className={styles.count}>
          {filtered.length} Credential{filtered.length !== 1 ? 's' : ''}
          <span className={styles.countBreakdown}>
            <span className={styles.countActive}>{activeCount} Active</span>
            <span className={styles.countSep}>·</span>
            <span className={styles.countExpired}>{expiredCount} Expired</span>
          </span>
        </span>
        <div className={styles.controls}>
          <select
            className="form-control gw-select"
            value={issuerFilter}
            onChange={(e) => setIssuerFilter(e.target.value)}
          >
            <option value="">All Issuers</option>
            {issuers.map((issuer) => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>

          <select
            className="form-control gw-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {hasFilters && (
            <button
              className="gw-compact-clear"
              onClick={clearFilters}
              title="Clear filters"
              aria-label="Clear filters"
            >
              <i className="fa fa-times" />
            </button>
          )}

          <div className="gw-view-toggle">
            <button
              className={`gw-view-btn${viewMode === 'cards' ? ' active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
              aria-label="Card view"
            >
              <i className="fa fa-th-large" />
            </button>
            <button
              className={`gw-view-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
              aria-label="Table view"
            >
              <i className="fa fa-list" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-5 text-center text-muted">
          <i className="fa fa-search fa-2x mb-3 d-block" />
          No certifications match the selected filters.
        </div>
      )}

      {viewMode === 'cards' && filtered.length > 0 && (
        <div className={styles.sections}>
          {grouped.map(([issuer, certs]) => (
            <section key={issuer} className={styles.section}>
              <div className={styles.sectionHeader}>
                <IssuerLogo cert={certs[0]} size={28} />
                <span className={styles.sectionTitle}>{issuer}</span>
                <span className={styles.sectionCount}>{certs.length}</span>
              </div>

              <div className={styles.list}>
                {certs.map((cert, i) => {
                  const active = certIsActive(cert)
                  return (
                    <div key={i} className={`${styles.item} ${!active ? styles.itemExpired : ''}`}>
                      <div className={styles.nameRow}>
                        <p className={styles.name}>{cert.name}</p>
                        {active
                          ? <span className={styles.activeBadge}>Active</span>
                          : <span className={styles.expiredBadge}>Expired</span>
                        }
                      </div>
                      <div className={styles.metaGrid}>
                        <span className={styles.metaKey}><i className="fa fa-calendar-o" /> Issued</span>
                        <span className={styles.metaVal}>{cert.issued}</span>
                        {cert.expires && (
                          <>
                            <span className={styles.metaKey}><i className="fa fa-clock-o" /> Expires</span>
                            <span className={styles.metaVal}>{cert.expires}</span>
                          </>
                        )}
                      </div>
                      {cert.skills && cert.skills.length > 0 && (
                        <div className={styles.skills}>
                          {cert.skills.map((skill) => (
                            <span key={skill} className="badge">{skill}</span>
                          ))}
                        </div>
                      )}
                      {cert.credential_url && (
                        <a
                          className={styles.credentialLink}
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Show credential <i className="fa fa-external-link" />
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {viewMode === 'table' && filtered.length > 0 && (
        <table className="gw-table">
          <thead>
            <tr>
              <th>Certification</th>
              <th>Issuer</th>
              <th>Issued</th>
              <th>Expires</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cert, i) => {
              const active = certIsActive(cert)
              return (
                <tr key={i}>
                  <td>
                    <span className={styles.tableName}>{cert.name}</span>
                    {cert.skills && cert.skills.length > 0 && (
                      <div className={styles.skills}>
                        {cert.skills.map((skill) => (
                          <span key={skill} className="badge">{skill}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={styles.tableIssuer}>
                      <IssuerLogo cert={cert} size={20} />
                      <span>{cert.issuer}</span>
                    </div>
                  </td>
                  <td className="gw-table-date">{cert.issued}</td>
                  <td className="gw-table-date">{cert.expires ?? '—'}</td>
                  <td>
                    {active
                      ? <span className={styles.activeBadge}>Active</span>
                      : <span className={styles.expiredBadge}>Expired</span>
                    }
                  </td>
                  <td>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.credentialLink}
                      >
                        Show credential <i className="fa fa-external-link" />
                      </a>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
