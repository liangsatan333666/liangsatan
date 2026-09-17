import { Component, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, spring } from 'remotion/transitions';

export const VideoComposition = ({ script, style }: { script: string; style: string }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const opacity = spring({ frame, from: 0, to: 1, config: { damping: 10 } });
  const translateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });

  const containerStyle: React.CSSProperties = {
    width,
    height,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  const glowStyle1: React.CSSProperties = {
    position: 'absolute',
    width: width * 0.6,
    height: height * 0.6,
    background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
    top: height * 0.2,
    left: width * 0.2,
  };

  const glowStyle2: React.CSSProperties = {
    position: 'absolute',
    width: width * 0.4,
    height: height * 0.4,
    background: 'radial-gradient(circle, rgba(255,0,128,0.1) 0%, transparent 70%)',
    bottom: height * 0.1,
    right: width * 0.1,
  };

  const textWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: width * 0.05,
    opacity: opacity,
    transform: 'translateY(' + translateY + 'px)',
    textAlign: 'center',
  };

  const scriptStyle: React.CSSProperties = {
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    fontSize: width * 0.04,
    color: '#00d4ff',
    textShadow: '0 0 20px rgba(0,212,255,0.5)',
    lineHeight: 1.6,
    letterSpacing: '0.02em',
    margin: 0,
  };

  const styleTextStyle: React.CSSProperties = {
    marginTop: height * 0.03,
    fontSize: width * 0.02,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
  };

  return (
    <div style={containerStyle}>
      <div style={glowStyle1} />
      <div style={glowStyle2} />
      <div style={textWrapperStyle}>
        <p style={scriptStyle}>{script}</p>
        <span style={styleTextStyle}>{style}</span>
      </div>
    </div>
  );
};
