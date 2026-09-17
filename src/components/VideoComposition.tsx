import { Component, useCurrentFrame, useVideoConfig } from 'remotion';

const PARTICLE_COUNT = 40;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100),
  y: ((i * 97.31) % 100),
  size: 1 + (i % 4) * 0.5,
  speed: 0.3 + (i % 5) * 0.15,
  phase: (i / PARTICLE_COUNT) * Math.PI * 2,
}));

export const VideoComposition = ({ script, style }: { script: string; style: string }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const breathe = Math.sin(frame * 0.03) * 0.1 + 1;
  const gradientAngle = (frame * 0.5) % 360;
  const hueShift = Math.sin(frame * 0.02) * 20;
  const textScale = Math.min(1, frame / 15);
  const textOpacity = Math.min(1, frame / 20);
  const textY = Math.max(0, 30 - frame * 0.8);
  const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  const particles = PARTICLES.map((p) => {
    const px = p.x + Math.sin(frame * p.speed * 0.05 + p.phase) * 5;
    const py = (p.y - frame * p.speed * 0.02 + 100) % 110 - 5;
    const particleOpacity = Math.max(0, Math.sin(frame * 0.05 + p.phase) * 0.5 + 0.5);
    return { ...p, x: px, y: py, opacity: particleOpacity * textOpacity };
  });

  const speedLines = Array.from({ length: 8 }, (_, i) => ({
    lineX: width * 0.1 + i * width * 0.12,
    lineOpacity: 0.1 + Math.sin(frame * 0.08 + i * 0.5) * 0.05,
  }));

  const scanLineY = ((frame * 3) % (height + 100)) - 50;

  return (
    <div style={{
      width,
      height,
      background: 'linear-gradient(' + gradientAngle + 'deg, hsl(230+' + hueShift + ',60%,8%) 0%, hsl(250+' + hueShift + ',50%,12%) 50%, hsl(220+' + hueShift + ',70%,15%) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      transform: 'scale(' + breathe + ')',
    }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: 'absolute',
          left: (p.x / 100) * width,
          top: (p.y / 100) * height,
          width: p.size * (width / 1920),
          height: p.size * (width / 1920),
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,' + (p.opacity * 0.6).toFixed(2) + ') 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      ))}
      <div style={{
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        background: 'radial-gradient(ellipse at center, rgba(0,212,255,' + (0.08 * pulse).toFixed(2) + ') 0%, rgba(255,0,128,' + (0.04 * pulse).toFixed(2) + ') 40%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        width: width * 0.5,
        height: width * 0.5,
        background: 'radial-gradient(circle, rgba(255,0,128,0.1) 0%, transparent 60%)',
        bottom: '-10%',
        right: '-10%',
        filter: 'blur(60px)',
      }} />
      {speedLines.map((line, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: line.lineX,
          top: height * 0.7,
          width: 2,
          height: 60 + Math.sin(frame * 0.1 + i) * 30,
          background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.3), transparent)',
          transform: 'rotate(' + (Math.sin(frame * 0.05 + i) * 5) + 'deg)',
          opacity: line.lineOpacity,
        }} />
      ))}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: scanLineY,
        height: 2,
        background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.15), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.35,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,212,255,0.03) 100%)',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent ' + (width * 0.08) + 'px, rgba(0,212,255,0.05) ' + (width * 0.08) + 'px, rgba(0,212,255,0.05) ' + (width * 0.081) + 'px), repeating-linear-gradient(0deg, transparent, transparent ' + (height * 0.05) + 'px, rgba(0,212,255,0.05) ' + (height * 0.05) + 'px, rgba(0,212,255,0.05) ' + (height * 0.051) + 'px)',
        transform: 'perspective(500px) rotateX(60deg) translateY(' + (frame * 0.5) + 'px)',
        transformOrigin: 'bottom center',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: width * 0.05,
        opacity: textOpacity,
        transform: 'translateY(' + textY + 'px) scale(' + textScale + ')',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: width * 0.8,
          height: height * 0.3,
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />
        <p style={{
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          fontSize: Math.min(width * 0.035, 56),
          color: '#ffffff',
          textShadow: '0 0 10px rgba(0,212,255,' + pulse.toFixed(2) + '), 0 0 30px rgba(0,212,255,' + (pulse * 0.5).toFixed(2) + '), 0 0 60px rgba(0,212,255,' + (pulse * 0.3).toFixed(2) + '), 0 2px 4px rgba(0,0,0,0.8)',
          lineHeight: 1.5,
          letterSpacing: '0.05em',
          margin: 0,
          fontWeight: 300,
        }}>{script}</p>
        <div style={{
          width: width * 0.3,
          height: 2,
          background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.8), transparent)',
          margin: '0 auto ' + (height * 0.02) + 'px',
          opacity: pulse,
        }} />
        <span style={{
          display: 'block',
          marginTop: height * 0.02,
          fontSize: Math.min(width * 0.018, 24),
          color: 'rgba(255,0,128,0.9)',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          textShadow: '0 0 20px rgba(255,0,128,0.5)',
          fontWeight: 400,
        }}>{style}</span>
      </div>
      <div style={{ position: 'absolute', top: 20, left: 20, opacity: 0.4 }}>
        <div style={{ width: 40, height: 40, borderLeft: '2px solid rgba(0,212,255,0.6)', borderTop: '2px solid rgba(0,212,255,0.6)' }} />
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.4 }}>
        <div style={{ width: 40, height: 40, borderRight: '2px solid rgba(0,212,255,0.6)', borderTop: '2px solid rgba(0,212,255,0.6)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, opacity: 0.4 }}>
        <div style={{ width: 40, height: 40, borderLeft: '2px solid rgba(0,212,255,0.6)', borderBottom: '2px solid rgba(0,212,255,0.6)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.4 }}>
        <div style={{ width: 40, height: 40, borderRight: '2px solid rgba(0,212,255,0.6)', borderBottom: '2px solid rgba(0,212,255,0.6)' }} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6), rgba(255,0,128,0.6), transparent)',
      }} />
    </div>
  );
};
