# AI 音乐视频生成流水线

## 系统状态

### 已就绪
- `agnes-2.5-flash` 文本生成 — 通过 Codex 网关可用
- `sherpa-onnx-tts` 语音合成 — 本地可用
- `FFmpeg` — 待安装

### 待解决
- `FFmpeg` 安装（需管理员权限）
- 视频生成 API 网络访问（沙箱限制）

## 运行步骤

### 1. 安装 FFmpeg
```bash
winget install Gyan.FFmpeg
```
或手动下载 https://www.gyan.dev/ffmpeg/builds/

### 2. 设置 API Key
已在系统中配置 `AGNES_API_KEY`

### 3. 运行流水线
```bash
python music_video_pipeline.py
```

## 架构说明

```
用户输入 → Agnes AI (文本生成脚本) → sherpa-onnx (TTS语音) → Agnes AI (视频生成) → FFmpeg (合成)
```

## 组件详情

| 组件 | 状态 | 说明 |
|------|------|------|
| Codex 网关 (57321) | 正常 | 代理 Agnes 文本 API |
| sherpa-onnx TTS | 正常 | 本地语音合成 |
| Agnes 视频 API | 受限 | 需要网络权限 |
| FFmpeg | 未安装 | 需要 winget 安装 |

## 测试命令

```bash
# 测试 TTS
& "C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\runtime\bin\sherpa-onnx-offline-tts.exe" \
  --vits-model="C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\models\vits-piper-en_US-lessac-high\en_US-lessac-high.onnx" \
  --vits-tokens="C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\models\vits-piper-en_US-lessac-high\tokens.txt" \
  --vits-data-dir="C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\models\vits-piper-en_US-lessac-high\espeak-ng-data" \
  --output-filename="%TEMP%\test.wav" \
  --vits-length-scale=0.9 "Hello world"

# 测试 Agnes 文本
curl http://127.0.0.1:57321/v1/chat/completions -X POST \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-2.5-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":50}'
```