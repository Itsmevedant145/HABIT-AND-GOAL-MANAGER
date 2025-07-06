import React from 'react';

export default function ProgressRing({
  radius = 70,
  stroke = 14,
  progress = 65,
  showTipDot = false, // Optional debug
}) {
  const center = radius;
  const normalizedRadius = radius - stroke / 2;
  const startAngle = 180; // 6 o'clock
  const endAngle = 450;   // 3 o'clock (sweep 270°)
  const progressAngle = startAngle + (progress / 100) * 270;

  // Converts angle in degrees to x,y coordinates on a circle
  function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Describes an SVG arc between two angles
  function describeArc(cx, cy, r, start, end) {
    const startPt = polarToCartesian(cx, cy, r, end);
    const endPt = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M', startPt.x, startPt.y,
      'A', r, r, 0, largeArcFlag, 0, endPt.x, endPt.y
    ].join(' ');
  }

  const needleEnd = polarToCartesian(center, center, normalizedRadius, progressAngle);
  const digitalPos = polarToCartesian(center, center, normalizedRadius + stroke + 18, endAngle);

  return (
    <div
      className="relative"
      style={{ width: radius * 2, height: radius * 2 + 40 }}
    >
      <svg width={radius * 2} height={radius * 2}>
        {/* Background arc */}
        <path
          d={describeArc(center, center, normalizedRadius, startAngle, endAngle)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d={describeArc(center, center, normalizedRadius, startAngle, progressAngle)}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))',
          }}
        />

        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#2563eb" // Tailwind blue-600
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
          }}
        />

        {/* Optional needle tip dot (for debugging or style) */}
        {showTipDot && (
          <circle
            cx={needleEnd.x}
            cy={needleEnd.y}
            r="4"
            fill="#facc15" // Tailwind yellow-400
            stroke="#fff"
            strokeWidth="1"
          />
        )}
      </svg>

      {/* Digital readout at 3 o'clock */}
      <div
        style={{
          position: 'absolute',
          left: digitalPos.x - 38,
          top: digitalPos.y - 20,
          width: 76,
          height: 36,
          background: '#22c55e',
          color: '#fff',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '0.08em',
          boxShadow: '0 2px 12px rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
          textShadow: '0 1px 2px #0002',
          userSelect: 'none',
        }}
      >
        {progress}%
      </div>
    </div>
  );
}
