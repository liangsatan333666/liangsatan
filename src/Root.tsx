import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './components/VideoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MusicVideo"
        component={VideoComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          script: 'Welcome to Neon City, where the future never sleeps and the rain always falls upward.',
          style: 'cyberpunk • cinematic • 4k'
        }}
      />
    </>
  );
};
