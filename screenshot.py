#!/opt/data/price-compare/.venv/bin/python3
import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/data/price-compare/.pw-browsers"
from playwright.sync_api import sync_playwright

url = "http://localhost:5173/"
out = "/opt/data/soumly/home.png"
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1280, "height": 1600})
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(1800)
    page.screenshot(path=out, full_page=True)
    browser.close()
print("saved", out, os.path.getsize(out), "bytes")
