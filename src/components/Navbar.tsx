'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useLayoutEffect, useEffect, useState, useRef, MouseEvent } from 'react'
import { useScrollSpy } from '@hooks/useScrollSpy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import NavCircuitTraces from '@components/NavCircuitTraces'
import { circuitTracesEnabled, workSectionEnabled } from '@/src/config'

type NavItem = { id: string; label: string; route: string; hash: string }
type SocialItem = { id: string; icon: IconDefinition; url: string }

const NavItems: NavItem[] = [
  { id: 'about', label: 'About', route: '/about', hash: '/#about' },
  { id: 'blog', label: 'Blog', route: '/blog', hash: '/#blog' },
  { id: 'projects', label: 'Projects', route: '/projects', hash: '/#projects' },
  { id: 'work', label: 'Work', route: '/work', hash: '/#work' },
  { id: 'contact', label: 'Contact', route: '/contact', hash: '/#contact' },
].filter((item) => item.id !== 'work' || workSectionEnabled)

const SocialItems: SocialItem[] = [
  { id: 'x', icon: faXTwitter, url: 'https://x.com/NateShoffner' },
  { id: 'github', icon: faGithub, url: 'https://github.com/NateShoffner' },
  { id: 'linkedin', icon: faLinkedinIn, url: 'https://www.linkedin.com/in/NateShoffner' },
]

type TraceData = { points: string; nodeX: number; nodeY: number; length: number }

const CX = 100, CY = 100, CR = 84;
const ANG_MARGIN = Math.PI / 18;

function snapGridY(svgY: number, svgTop: number): number {
  const navY = svgTop + svgY;
  return Math.round((navY - 12) / 24) * 24 + 12 - svgTop;
}

function genTrace(aMin: number, aMax: number, exitX: number, svgTop: number): TraceData {
  const angle = aMin + Math.random() * (aMax - aMin);
  const px = CX + CR * Math.cos(angle);
  const py = CY + CR * Math.sin(angle);
  const offsets = [-48, -24, 0, 24, 48];
  const off = offsets[Math.floor(Math.random() * offsets.length)];
  const snapY = snapGridY(py + off, svgTop);
  const len = Math.max(Math.abs(exitX - px) + Math.abs(snapY - py), 24);
  return {
    points: `${px.toFixed(1)},${py.toFixed(1)} ${exitX},${py.toFixed(1)} ${exitX},${snapY.toFixed(1)}`,
    nodeX: exitX,
    nodeY: snapY,
    length: len,
  };
}

function genAllTraces(svgTop: number): TraceData[] {
  return [
    genTrace(Math.PI + ANG_MARGIN,       3 * Math.PI / 2 - ANG_MARGIN, -8,  svgTop), // TL
    genTrace(3 * Math.PI / 2 + ANG_MARGIN, 2 * Math.PI - ANG_MARGIN,   208, svgTop), // TR
    genTrace(Math.PI / 2 + ANG_MARGIN,   Math.PI - ANG_MARGIN,         -8,  svgTop), // BL
    genTrace(ANG_MARGIN,                 Math.PI / 2 - ANG_MARGIN,     208, svgTop), // BR
  ];
}

const DEFAULT_TRACES: TraceData[] = [
  { points: '31,60 -8,60 -8,30',       nodeX: -8,  nodeY: 30,  length: 81 },
  { points: '140,31 208,31 208,55',     nodeX: 208, nodeY: 55,  length: 92 },
  { points: '31,140 -8,140 -8,165',     nodeX: -8,  nodeY: 165, length: 64 },
  { points: '169,140 208,140 208,165',  nodeX: 208, nodeY: 165, length: 64 },
];

function scrollToId(id: string, smooth = true) {
  const el =
    document.getElementById(id) ||
    document.querySelector<HTMLElement>(`[name="${id}"]`)
  if (!el) return
  // Desktop has a fixed left sidebar (no top bar), so only a small offset is needed.
  // Mobile has a fixed top navbar (~56px), so clear it with a bit of breathing room.
  const offset = window.innerWidth >= 992 ? 0 : 60
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
}

export default function Navbar() {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [navOpen, setNavOpen] = useState(false)
  const [traces, setTraces] = useState<TraceData[]>(DEFAULT_TRACES)
  const [traceHovered, setTraceHovered] = useState(false)
  const svgTopRef = useRef(0)
  const rAFRef = useRef<number | null>(null)

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  useEffect(() => {
    const measure = () => {
      const circle = document.querySelector<HTMLElement>('#navbar .circle-border')
      const navbar = document.querySelector<HTMLElement>('#navbar')
      if (!circle || !navbar) return
      const navRect = navbar.getBoundingClientRect()
      const circRect = circle.getBoundingClientRect()
      svgTopRef.current = circRect.top - navRect.top - 20
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const handleCircleEnter = () => {
    if (rAFRef.current != null) cancelAnimationFrame(rAFRef.current)
    setTraces(genAllTraces(svgTopRef.current))
    setTraceHovered(false)
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        setTraceHovered(true)
        rAFRef.current = null
      })
      rAFRef.current = id2
    })
    rAFRef.current = id1
  }

  const handleCircleLeave = () => {
    if (rAFRef.current != null) {
      cancelAnimationFrame(rAFRef.current)
      rAFRef.current = null
    }
    setTraceHovered(false)
  }

  const traceStyle = (i: number, delay: number): React.CSSProperties => ({
    strokeDasharray: traces[i].length,
    strokeDashoffset: traceHovered ? 0 : traces[i].length,
    transition: traceHovered ? `stroke-dashoffset 0.28s ease ${delay}s` : 'none',
  })

  useLayoutEffect(() => {
    if (!onHome || !window.location.hash) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    scrollToId(id)
  }, [onHome])

  useEffect(() => {
    if (!navOpen) return
    const onScroll = () => { if (window.innerWidth < 992) setNavOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navOpen])

  useEffect(() => {
    if (!navOpen) return
    const onOutsideClick = (e: Event) => {
      if (window.innerWidth >= 992) return
      const navbar = document.getElementById('navbar')
      if (navbar && !navbar.contains(e.target as Node)) setNavOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    document.addEventListener('touchstart', onOutsideClick)
    return () => {
      document.removeEventListener('mousedown', onOutsideClick)
      document.removeEventListener('touchstart', onOutsideClick)
    }
  }, [navOpen])

  const activeSectionId = useScrollSpy(
    NavItems.map((n) => n.id),
    100
  )

  const isActive = (item: NavItem) => {
    if (onHome) {
      return (activeSectionId ?? NavItems[0].id) === item.id
    }
    return pathname === item.route || pathname.startsWith(`${item.route}/`)
  }

  const handleHomeClick =
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return
      e.preventDefault()
      scrollToId(id)
      setNavOpen(false)
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="navbar">
      <NavCircuitTraces />
      <NextLink href="/" className="navbar-brand">
        {!(onHome && (activeSectionId ?? 'about') === 'about') && (
          <span className="d-block d-lg-none navbar-brand-text">Nate Shoffner</span>
        )}
        <span className="d-none d-lg-block">
          <div
            className="circle-border"
            onMouseEnter={circuitTracesEnabled ? handleCircleEnter : undefined}
            onMouseLeave={circuitTracesEnabled ? handleCircleLeave : undefined}
          >
            <div className="circle">
              <img
                className="img-fluid rounded-circle img-profile mx-auto"
                src="/assets/images/profile-pic.jpg"
                alt="Nate Shoffner"
              />
            </div>
            {circuitTracesEnabled && (
              <svg className="profile-circuit" viewBox="0 0 200 200" fill="none" aria-hidden="true">
                <polyline className="pc-trace pc-trace-1" points={traces[0].points} style={traceStyle(0, 0)} />
                <circle className="pc-node" cx={traces[0].nodeX} cy={traces[0].nodeY} r="2" />
                <polyline className="pc-trace pc-trace-2" points={traces[1].points} style={traceStyle(1, 0.04)} />
                <circle className="pc-node" cx={traces[1].nodeX} cy={traces[1].nodeY} r="2" />
                <polyline className="pc-trace pc-trace-3" points={traces[2].points} style={traceStyle(2, 0.02)} />
                <circle className="pc-node" cx={traces[2].nodeX} cy={traces[2].nodeY} r="2" />
                <polyline className="pc-trace pc-trace-4" points={traces[3].points} style={traceStyle(3, 0.06)} />
                <circle className="pc-node" cx={traces[3].nodeX} cy={traces[3].nodeY} r="2" />
              </svg>
            )}
          </div>
        </span>
      </NextLink>

      <button
        className="navbar-toggler"
        type="button"
        aria-controls="navbarSupportedContent"
        aria-expanded={navOpen}
        aria-label="Toggle navigation"
        onClick={() => setNavOpen(o => !o)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`} id="navbarSupportedContent">
        <ul className="navbar-nav">
          {NavItems.map((item) => {
            const active = isActive(item)
            const classes = `nav-link${active ? ' active' : ''}`
            return (
              <li className="nav-item" key={item.id}>
                {onHome ? (
                  <NextLink
                    href={`#${item.id}`}
                    onClick={handleHomeClick(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={classes}
                  >
                    {item.label}
                  </NextLink>
                ) : (
                  <NextLink
                    href={item.hash}
                    aria-current={active ? 'page' : undefined}
                    className={classes}
                  >
                    {item.label}
                  </NextLink>
                )}
              </li>
            )
          })}

          <li className="nav-item">
            <ul className="social-list">
              {SocialItems.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                </li>
              ))}
              <li>
                <a href="/feed.xml" aria-label="RSS feed">
                  <i className="fa fa-rss" />
                </a>
              </li>
              <li className="d-none d-lg-inline-block theme-toggle-item">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
                  <i className="fa fa-moon-o theme-icon-for-light" />
                  <i className="fa fa-sun-o theme-icon-for-dark" />
                </button>
              </li>
            </ul>
          </li>
        </ul>

        <div className="theme-toggle-mobile d-lg-none">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <i className="fa fa-moon-o theme-icon-for-light" />
            <i className="fa fa-sun-o theme-icon-for-dark" />
            <span className="theme-toggle-label">
              <span className="theme-icon-for-light">Dark mode</span>
              <span className="theme-icon-for-dark">Light mode</span>
            </span>
          </button>
        </div>
      </div>

    </nav>
  )
}
