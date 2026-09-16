#!/usr/bin/env python3
"""
AI 音乐视频生成流水线
使用 Agnes AI 视频生成 + sherpa-onnx TTS + FFmpeg 合成
"""

import os
import json
import subprocess
import time
import urllib.request
import urllib.error
from pathlib import Path

# 配置
API_KEY = os.environ.get("AGNES_API_KEY", "sk-8NAzUySONK3VDZUY1A0XczmXrXqh62wCsxVo76gR4StMjL6x")
BASE_URL = "https://apihub.agnes-ai.com"
TTS_BINARY = r"C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\runtime\bin\sherpa-onnx-offline-tts.exe"
TTS_MODEL_DIR = r"C:\Users\Administrator\.openclaw\tools\sherpa-onnx-tts\models\vits-piper-en_US-lessac-high"
FFMPEG_CMD = "ffmpeg"
OUTPUT_DIR = Path(__file__).parent / "output"

def ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return OUTPUT_DIR

def generate_video(prompt, width=480, height=480, num_frames=81, frame_rate=24):
    payload = {
        "model": "agnes-video-v2.0",
        "prompt": prompt,
        "width": width,
        "height": height,
        "num_frames": num_frames,
        "frame_rate": frame_rate
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/v1/videos",
        data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))

def poll_video_status(video_id, timeout=300):
    url = f"{BASE_URL}/agnesapi?video_id={video_id}&model_name=agnes-video-v2.0"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {API_KEY}"})
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                status = result.get("status", "unknown")
                print(f"Video status: {status}")
                if status in ["completed", "failed"]:
                    return result
        except:
            pass
        time.sleep(10)
    raise Exception(f"Timeout ({timeout}s)")

def generate_tts(text, output_path, speed=0.9):
    args = [
        TTS_BINARY,
        f"--vits-model={TTS_MODEL_DIR}/en_US-lessac-high.onnx",
        f"--vits-tokens={TTS_MODEL_DIR}/tokens.txt",
        f"--vits-data-dir={TTS_MODEL_DIR}/espeak-ng-data",
        f"--output-filename={output_path}",
        f"--vits-length-scale={speed}",
        text
    ]
    proc = subprocess.run(args, capture_output=True, text=True, shell=False)
    if proc.returncode != 0:
        raise Exception(f"TTS failed: {proc.stderr}")
    print(f"TTS generated: {output_path}")
    return output_path

def download_video(video_url, output_path):
    req = urllib.request.Request(video_url)
    with urllib.request.urlopen(req, timeout=120) as resp:
        with open(output_path, "wb") as f:
            f.write(resp.read())
    print(f"Video downloaded: {output_path}")
    return output_path

def combine_video_audio(video_path, audio_path, output_path):
    cmd = [FFMPEG_CMD, "-y", "-i", video_path, "-i", audio_path, "-c:v", "copy", "-c:a", "aac", "-shortest", output_path]
    subprocess.run(cmd, capture_output=True)
    print(f"Final video: {output_path}")
    return output_path

def generate_music_video(script, style="cinematic", width=480, height=480, duration_seconds=10, tts_speed=0.9):
    out_dir = ensure_output_dir()
    try:
        print("=" * 50)
        print("Step 1/4: Generate Video")
        print("=" * 50)
        prompt = f"{script}, {style}, high quality, smooth motion"
        video_result = generate_video(prompt, width, height)
        video_id = video_result.get("video_id") or video_result.get("task_id")
        print(f"Video task ID: {video_id}")
        
        print("\nStep 2/4: Wait for completion...")
        video_data = poll_video_status(video_id)
        video_url = video_data.get("video_url") or video_data.get("url")
        print(f"Video URL: {video_url}")
        
        print("\nStep 3/4: Download video and generate audio")
        video_path = str(out_dir / "input_video.mp4")
        audio_path = str(out_dir / "tts_audio.wav")
        download_video(video_url, video_path)
        generate_tts(script, audio_path, tts_speed)
        
        print("\nStep 4/4: Combine video and audio")
        final_path = str(out_dir / "music_video.mp4")
        combine_video_audio(video_path, audio_path, final_path)
        
        return {"success": True, "video_path": final_path, "video_url": video_url, "script": script}
    except Exception as e:
        return {"success": False, "error": str(e), "video_id": video_id}

if __name__ == "__main__":
    script_text = """Welcome to Neon City, where the future never sleeps and the rain always falls upward. Neon lights reflect on wet streets as flying cars glide between towering skyscrapers."""
    
    result = generate_music_video(
        script=script_text,
        style="cyberpunk, neon lights, cinematic, 4k",
        width=480, height=480,
        duration_seconds=10, tts_speed=0.9
    )
    
    if result["success"]:
        print(f"\nSuccess! Output: {result['video_path']}")
    else:
        print(f"\nFailed: {result.get('error')}")