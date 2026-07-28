import { circuitTracesEnabled } from "@/src/config";

const SW = 1.5;
const DR = 2.5;

function Dot({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={DR} fill="var(--circuit-dot)" />;
}

export default function CircuitTraces() {
  if (!circuitTracesEnabled) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Top-left: two traces, main goes right→down→right, accent is a short stub up top */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="210" height="170" viewBox="0 0 210 170" fill="none">
        <line x1="0" y1="22" x2="48" y2="22" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <polyline points="0,44 95,44 95,102 148,102" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <Dot cx={95} cy={44} />
        <Dot cx={95} cy={102} />
        <polyline points="0,68 62,68 62,130" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={62} cy={68} />
      </svg>

      {/* Top-right: offset 30px lower than top-left */}
      <svg style={{ position: "absolute", top: 30, right: 0 }} width="240" height="180" viewBox="0 0 240 180" fill="none">
        <polyline points="240,32 158,32 158,115 108,115" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <Dot cx={158} cy={32} />
        <Dot cx={158} cy={115} />
        <polyline points="240,18 210,18 210,52" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={210} cy={18} />
        <polyline points="240,58 182,58 182,90" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={182} cy={58} />
      </svg>

      {/* Left-middle: asymmetric bracket — top arm longer, chevron shifted */}
      <svg style={{ position: "absolute", top: "35%", left: 0 }} width="135" height="115" viewBox="0 0 135 115" fill="none">
        <polyline points="0,22 82,22 82,58" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <polyline points="0,88 82,88 82,58" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <Dot cx={82} cy={22} />
        <Dot cx={82} cy={88} />
        <polyline points="100,10 124,55 100,100" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      </svg>

      {/* Bottom-left: main goes right→up, with a branch stub going further right */}
      <svg style={{ position: "absolute", bottom: 0, left: 0 }} width="210" height="155" viewBox="0 0 210 155" fill="none">
        <polyline points="0,120 72,120 72,62 125,62" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <Dot cx={72} cy={120} />
        <Dot cx={72} cy={62} />
        <line x1="125" y1="62" x2="168" y2="62" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={125} cy={62} />
        <polyline points="0,140 48,140 48,98" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={48} cy={140} />
      </svg>

      {/* Bottom-right: offset 40px higher than bottom-left */}
      <svg style={{ position: "absolute", bottom: 40, right: 0 }} width="200" height="145" viewBox="0 0 200 145" fill="none">
        <polyline points="200,105 138,105 138,70 178,70 178,48 148,48" stroke="var(--circuit-stroke)" strokeWidth={SW} />
        <Dot cx={138} cy={105} />
        <Dot cx={138} cy={70} />
        <Dot cx={178} cy={70} />
        <Dot cx={178} cy={48} />
        <polyline points="200,128 162,128 162,95" stroke="var(--circuit-stroke-dim)" strokeWidth={SW} />
        <Dot cx={162} cy={128} />
      </svg>
    </div>
  );
}
