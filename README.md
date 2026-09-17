# Liangsatan Video

Remotion-based video generation project.

## Setup

```bash
npm install
```

## Usage

### Preview locally
```bash
npm start
```

### Render video
```bash
npm run build
```

## Tech Stack
- [Remotion](https://remotion.dev) - React-based video generation
- TypeScript
- Emotion (CSS-in-JS)

## Original Python Pipeline
The original video generation uses:
- Agnes AI API for video generation
- sherpa-onnx TTS for audio
- FFmpeg for combining

See `music_video_pipeline.py` for details.
