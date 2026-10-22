"""영상 프레임으로 스토리보드 시트를 만든다.

사용법:
    python make_storyboard_sheet.py <영상.mp4> <패널.csv> <출력.jpg> [--title "제목"] [--cols 7]

패널 CSV (헤더 포함, UTF-8):
    번호,시간,원본초,라벨
    1,0:00,2.2,사업 고백
    3,0:04,,앤써 '에?' / 두리번      <- 원본초가 비면 회색 빈 칸으로 표시

필요한 것: ffmpeg, Pillow. 한글 폰트는 FONT 경로를 시스템에 맞게 바꾼다
(macOS 예: /System/Library/Fonts/AppleSDGothicNeo.ttc).
"""
import argparse
import csv
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
    "C:/Windows/Fonts/malgun.ttf",
]
W, H = 216, 384
PAD, LABEL = 12, 56
ACCENT = (255, 122, 0)


def font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def grab(video, sec, out):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(sec), "-i", video,
                    "-frames:v", "1", out], check=True)
    return Image.open(out).convert("RGB").resize((W, H))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("panels")
    ap.add_argument("out")
    ap.add_argument("--title", default="스토리보드")
    ap.add_argument("--cols", type=int, default=7)
    args = ap.parse_args()

    with open(args.panels, encoding="utf-8") as f:
        panels = list(csv.DictReader(f))

    rows = (len(panels) + args.cols - 1) // args.cols
    sheet = Image.new("RGB", (args.cols * (W + PAD) + PAD, rows * (H + LABEL + PAD) + PAD + 40), "white")
    d = ImageDraw.Draw(sheet)
    f_title, f_num, f_lbl = font(22), font(18), font(15)
    d.text((PAD, 10), args.title, fill="black", font=f_title)

    with tempfile.TemporaryDirectory() as tmp:
        frame = os.path.join(tmp, "f.png")
        for i, p in enumerate(panels):
            x = PAD + (i % args.cols) * (W + PAD)
            y = 48 + (i // args.cols) * (H + LABEL + PAD)
            if p["원본초"].strip():
                im = grab(args.video, float(p["원본초"]), frame)
            else:
                im = Image.new("RGB", (W, H), (235, 235, 235))
                ImageDraw.Draw(im).text((14, H // 2 - 10), "편집본 미사용 컷", fill=(90, 90, 90), font=f_lbl)
            sheet.paste(im, (x, y))
            d.rectangle([x, y, x + 30, y + 26], fill=ACCENT)
            d.text((x + 5, y + 3), p["번호"], fill="white", font=f_num)
            d.text((x, y + H + 6), f'{p["시간"]}  {p["라벨"]}', fill="black", font=f_lbl)

    sheet.save(args.out, quality=88)
    print(args.out, sheet.size)


if __name__ == "__main__":
    main()
