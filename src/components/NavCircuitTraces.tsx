'use client'

import { useEffect, useState, useRef } from 'react'
import { circuitTracesEnabled } from '@/src/config'

const DR = 2;

function Dot({ cx, cy, animated = false, traceId = "", pathDistance = 0 }: { cx: number; cy: number; animated?: boolean; traceId?: string; pathDistance?: number }) {
  return <circle cx={cx} cy={cy} r={DR} fill="var(--circuit-dot)" className={animated ? "trace-dot" : ""} data-trace-id={traceId} data-path-distance={pathDistance} />;
}

function Trace({
  spd, dim, id, ...props
}: { spd: string; dim?: boolean; id?: string } & React.SVGProps<SVGPolylineElement>) {
  const pulseClass = `nct-pulse${dim ? " nct-dim" : ""}`;
  return (
    <>
      <polyline strokeWidth={dim ? 1 : 1.2} {...props} className="trace-path" data-trace-id={id} />
      <polyline
        className={pulseClass}
        style={{ "--spd": spd } as React.CSSProperties}
        strokeWidth={2}
        data-trace-id={id}
        {...props}
      />
    </>
  );
}

function TraceLine({
  spd, dim, ...props
}: { spd: string; dim?: boolean } & React.SVGProps<SVGLineElement>) {
  const pulseClass = `nct-pulse${dim ? " nct-dim" : ""}`;
  return (
    <>
      <line strokeWidth={dim ? 1 : 1.2} {...props} />
      <line
        className={pulseClass}
        style={{ "--spd": spd } as React.CSSProperties}
        strokeWidth={2}
        {...props}
      />
    </>
  );
}

// Grid: background-size 24px, dot centers at (12+24n, 12+24m) in navbar-relative coords.
// Left SVGs (left:0): svgX = navbarX → valid x: 12, 36, 60, 84, 108
// Right SVGs (right:0, sidebar 240px, width 110): navbarX = 130+svgX → valid svgX: 26, 50, 74, 98
// Top SVGs aligned exactly; bottom SVGs (bottom-relative) have grid-aligned x only.

/**
 * Calculate distance along polyline to a given point
 * points format: "x1,y1 x2,y2 x3,y3 ..."
 */
function calculatePathDistance(pointsStr: string, targetX: number, targetY: number): number {
  const points = pointsStr.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });
  
  let distance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    // Check if target is on this segment
    const segmentDist = Math.sqrt(
      (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
    );
    
    // Simple check: if both points are close to segment
    if (Math.abs(p1.x - targetX) < 1 && Math.abs(p1.y - targetY) < 1) {
      return distance;
    }
    
    distance += segmentDist;
  }
  
  return distance;
}

// Wrapper keeps the flag check outside the hook-bearing component so the
// early return does not trip rules-of-hooks.
export default function NavCircuitTraces() {
  if (!circuitTracesEnabled) return null
  return <NavCircuitTracesInner />
}

function NavCircuitTracesInner() {
  const [bottomTop, setBottomTop] = useState<number | null>(null)
  const animationRefRef = useRef<number | null>(null)

  useEffect(() => {
    const measure = () => {
      const social = document.querySelector<HTMLElement>('#navbar ul.social-list')
      const navbar = document.querySelector<HTMLElement>('#navbar')
      if (social && navbar) {
        const navbarRect = navbar.getBoundingClientRect()
        const socialRect = social.getBoundingClientRect()
        // Position SVG so its bottom (120px tall) ends one grid row above the social list
        const socialRelTop = socialRect.top - navbarRect.top
        const rawTop = socialRelTop - 120
        const snapped = Math.round((rawTop - 12) / 24) * 24 + 12
        setBottomTop(snapped)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Track pulse position and highlight dots
  useEffect(() => {
    const checkPulseOverDots = () => {
      const pulsePolylines = document.querySelectorAll<SVGPolylineElement>('polyline.nct-pulse')
      
      pulsePolylines.forEach(pulsePolyline => {
        const traceId = pulsePolyline.getAttribute('data-trace-id')
        if (!traceId) return
        
        // Get computed stroke-dashoffset
        const style = window.getComputedStyle(pulsePolyline)
        const dashOffset = style.strokeDashoffset || '0'
        const dashOffsetNum = parseFloat(dashOffset)
        
        // The animation cycles 0 to -368 and back
        // Normalize: -368 to 0 becomes 0 to 368
        const normalizedOffset = ((-dashOffsetNum % 368) + 368) % 368
        
        // Pulse is 8px wide
        const pulseStart = normalizedOffset
        const pulseEnd = normalizedOffset + 8
        
        // Find all dots on this trace
        const svg = pulsePolyline.closest('svg')
        if (!svg) return
        
        const dots = svg.querySelectorAll<SVGCircleElement>(`circle[data-trace-id="${traceId}"]`)
        
        dots.forEach(dot => {
          const pathDistance = parseFloat(dot.getAttribute('data-path-distance') || '0')
          
          // Check if pulse covers this dot's position on the path
          const isUnderPulse = pathDistance >= pulseStart && pathDistance <= pulseEnd
          
          if (isUnderPulse) {
            dot.setAttribute('fill', 'rgba(52, 168, 219, 0.9)')
            dot.setAttribute('r', '3')
          } else {
            dot.setAttribute('fill', 'var(--circuit-dot)')
            dot.setAttribute('r', '2')
          }
        })
      })
      
      animationRefRef.current = requestAnimationFrame(checkPulseOverDots)
    }
    
    animationRefRef.current = requestAnimationFrame(checkPulseOverDots)
    
    return () => {
      if (animationRefRef.current) {
        cancelAnimationFrame(animationRefRef.current)
      }
    }
  }, [])

  const btL = bottomTop ?? -9999
  const btR = bottomTop != null ? bottomTop - 24 : -9999

  return (
    <div
      className="d-none d-lg-block nav-circuit-traces"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      {/* Top-left: top:0, left:0 */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="110" height="96" viewBox="0 0 110 96" fill="none">
        {/* open-ended: enters from left, terminates inside */}
        <TraceLine spd="5.0s" dim x1="0" y1="12" x2="36" y2="12" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={12} animated traceId="tl-1" pathDistance={calculatePathDistance("0,12 36,12", 36, 12)} />

        <Trace spd="3.0s" id="tl-2" points="0,36 84,36 84,60 108,60" stroke="var(--circuit-stroke)" />
        <Dot cx={84} cy={36} animated traceId="tl-2" pathDistance={calculatePathDistance("0,36 84,36 84,60 108,60", 84, 36)} />
        <Dot cx={84} cy={60} animated traceId="tl-2" pathDistance={calculatePathDistance("0,36 84,36 84,60 108,60", 84, 60)} />
        <Dot cx={108} cy={60} animated traceId="tl-2" pathDistance={calculatePathDistance("0,36 84,36 84,60 108,60", 108, 60)} />

        {/* closed-loop diagonal: enters left, diagonal, exits left */}
        <Trace spd="4.3s" id="tl-3" dim points="0,60 36,60 60,84 0,84" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={60} animated traceId="tl-3" pathDistance={calculatePathDistance("0,60 36,60 60,84 0,84", 36, 60)} />
        <Dot cx={60} cy={84} animated traceId="tl-3" pathDistance={calculatePathDistance("0,60 36,60 60,84 0,84", 60, 84)} />
      </svg>

      {/* Top-right: top:40, right:0 */}
      <svg style={{ position: "absolute", top: 40, right: 0 }} width="110" height="96" viewBox="0 0 110 96" fill="none">
        {/* closed-loop diagonal: enters right, diagonal, exits right */}
        <Trace spd="3.5s" id="tr-1" points="110,20 74,20 50,44 110,44" stroke="var(--circuit-stroke)" />
        <Dot cx={74} cy={20} animated traceId="tr-1" pathDistance={calculatePathDistance("110,20 74,20 50,44 110,44", 74, 20)} />
        <Dot cx={50} cy={44} animated traceId="tr-1" pathDistance={calculatePathDistance("110,20 74,20 50,44 110,44", 50, 44)} />

        {/* open-ended: enters from right, terminates inside */}
        <Trace spd="5.9s" id="tr-2" dim points="110,68 74,68 74,92" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={74} cy={68} animated traceId="tr-2" pathDistance={calculatePathDistance("110,68 74,68 74,92", 74, 68)} />
        <Dot cx={74} cy={92} animated traceId="tr-2" pathDistance={calculatePathDistance("110,68 74,68 74,92", 74, 92)} />
      </svg>

      {/* Bottom-left: dynamically positioned below navbar-collapse */}
      <svg style={{ position: "absolute", top: btL, left: 0 }} width="110" height="120" viewBox="0 0 110 120" fill="none">
        {/* open-ended: enters from left, terminates inside */}
        <Trace spd="3.3s" id="bl-1" points="0,24 60,24 60,48 84,48" stroke="var(--circuit-stroke)" />
        <Dot cx={60} cy={24} animated traceId="bl-1" pathDistance={calculatePathDistance("0,24 60,24 60,48 84,48", 60, 24)} />
        <Dot cx={60} cy={48} animated traceId="bl-1" pathDistance={calculatePathDistance("0,24 60,24 60,48 84,48", 60, 48)} />
        <Dot cx={84} cy={48} animated traceId="bl-1" pathDistance={calculatePathDistance("0,24 60,24 60,48 84,48", 84, 48)} />

        {/* closed-loop diagonal: enters left, diagonal, exits left */}
        <Trace spd="5.5s" id="bl-2" dim points="0,72 36,72 60,96 0,96" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={72} animated traceId="bl-2" pathDistance={calculatePathDistance("0,72 36,72 60,96 0,96", 36, 72)} />
        <Dot cx={60} cy={96} animated traceId="bl-2" pathDistance={calculatePathDistance("0,72 36,72 60,96 0,96", 60, 96)} />
      </svg>

      {/* Bottom-right: dynamically positioned below navbar-collapse */}
      <svg style={{ position: "absolute", top: btR, right: 0 }} width="110" height="120" viewBox="0 0 110 120" fill="none">
        {/* closed-loop diagonal: enters right, diagonal, exits right */}
        <Trace spd="3.9s" id="br-1" points="110,24 74,24 50,48 110,48" stroke="var(--circuit-stroke)" />
        <Dot cx={74} cy={24} animated traceId="br-1" pathDistance={calculatePathDistance("110,24 74,24 50,48 110,48", 74, 24)} />
        <Dot cx={50} cy={48} animated traceId="br-1" pathDistance={calculatePathDistance("110,24 74,24 50,48 110,48", 50, 48)} />

        {/* open-ended: enters from right, terminates inside */}
        <Trace spd="6.4s" id="br-2" dim points="110,72 98,72 98,96" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={98} cy={72} animated traceId="br-2" pathDistance={calculatePathDistance("110,72 98,72 98,96", 98, 72)} />
        <Dot cx={98} cy={96} animated traceId="br-2" pathDistance={calculatePathDistance("110,72 98,72 98,96", 98, 96)} />
      </svg>
    </div>
  );
}
