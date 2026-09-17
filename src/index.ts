import { registerRoot } from 'remotion/dom';
import React from 'react';
import { RemotionRoot } from './Root';

registerRoot(
  <React.StrictMode>
    <RemotionRoot />
  </React.StrictMode>
);
