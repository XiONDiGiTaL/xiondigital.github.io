#!/usr/bin/env node
/**
 * sync-visuals.mjs
 *
 * Refreshes the visualizer grid in visuals.html from the public playlist
 * https://www.youtube.com/playlist?list=PLtmEnXvzBCcl4tk0Uzir_DJd2evF42YAF
 *
 * Why this exists: the site is plain static HTML on GitHub Pages, so there is no
 * runtime API call and no secret in the browser. The verification result is
 * committed as normal markup, which means the grid keeps working if YouTube,
 * the network or an API key is unavailable.
 *
 * Usage:
 *   node tools/sync-visuals.mjs            # dry run: list what the playlist contains
 *   node tools/sync-visuals.mjs --write    # rewrite the grid + download thumbnails
 *
 * Requires Node 18+ (global fetch). No dependencies.
 */

import { writeFile, readFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";

const PLAYLIST = "PLtmEnXvzBCcl4tk0Uzir_DJd2evF42YAF";
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST}`;
const ROOT = process.cwd();
const PAGE = path.join(ROOT, "visuals.html");
const IMAGE_DIR = path.join(ROOT, "images", "visuals");
const SIZES = "(max-width: 720px) 92vw, (max-width: 1080px) 44vw, 360px";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36";

const write = process.argv.includes("--write");

const exists = async (p) => {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Pull the playlist entries out of ytInitialData. */
function parsePlaylist(html) {
  const match = html.match(/var ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/);
  if (!match) throw new Error("Could not find ytInitialData on the playlist page.");

  const data = JSON.parse(match[1]);
  const entries = [];

  const walk = (node) => {
    if (!node || typeof node !== "object") return;

    if (node.lockupViewModel) {
      const lockup = node.lockupViewModel;
      const meta = lockup.metadata?.lockupMetadataViewModel ?? {};
      const id = lockup.contentId;
      const title = meta.title?.content;
      if (id && title) {
        const row = meta.metadata?.contentMetadataViewModel?.metadataRows?.[0];
        const author = (row?.metadataParts ?? [])
          .map((part) => part.text?.content ?? "")
          .filter(Boolean)
          .join(" ");
        entries.push({ id, title, author });
      }
    }

    for (const value of Object.values(node)) walk(value);
  };

  walk(data);

  // De-duplicate while keeping playlist order.
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

/** oEmbed is a reliable public check that a video exists and allows embedding. */
async function verify(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`
  )}&format=json`;
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) return null;
  return res.json();
}

async function downloadThumb(id) {
  for (const name of ["maxresdefault", "sddefault", "hqdefault"]) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`, {
      headers: { "user-agent": UA },
    });
    if (!res.ok) continue;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 2000) continue; // YouTube's "not found" placeholder
    await writeFile(path.join(IMAGE_DIR, `${id}.jpg`), buffer);
    return `${name}.jpg (${Math.round(buffer.length / 1024)} KB)`;
  }
  return null;
}

function card({ id, title, author }, files = {}) {
  const watch = `https://www.youtube.com/watch?v=${id}`;
  const has640 = files.has640;
  const hasWebp = files.hasWebp;
  const hasWebp640 = files.hasWebp640;
  const img = `images/visuals/${id}`;

  const src = has640 ? `${img}-640.jpg` : `${img}.jpg`;
  const srcset = has640 ? `srcset="${img}-640.jpg 640w, ${img}.jpg 1280w"` : "";

  const picture =
    hasWebp && hasWebp640
      ? `                <picture>
                  <source type="image/webp" ${has640 ? `srcset="${img}-640.webp 640w, ${img}.webp 1280w"` : `srcset="${img}.webp 1280w"`} sizes="${SIZES}" />
                  <img src="${src}" ${srcset} sizes="${SIZES}" width="1280" height="720" alt="Video thumbnail: ${esc(
          title
        )}" loading="lazy" decoding="async" />
                </picture>`
      : `                <img src="${src}" ${srcset} sizes="${SIZES}" width="1280" height="720" alt="Video thumbnail: ${esc(
          title
        )}" loading="lazy" decoding="async" />`;

  return `            <li class="video spot">
              <div class="video__frame">
${picture}
                <div class="video__shade" aria-hidden="true"></div>
                <span class="video__badge">Visualizer</span>
                <a
                  class="video__play"
                  href="${watch}"
                  data-video-id="${id}"
                  data-video-title="${esc(title)}"
                >
                  <span>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                    <span class="sr-only">Play “${esc(title)}” on this page</span>
                  </span>
                </a>
              </div>
              <div class="video__body">
                <h2 class="video__title">${esc(title)}</h2>
                <p class="video__sub">${esc(author || "XiØN")}</p>
                <a class="video__ext" href="${watch}" target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </a>
              </div>
            </li>`;
}

async function main() {
  console.log(`Reading ${PLAYLIST_URL}`);
  const res = await fetch(PLAYLIST_URL, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`Playlist request failed: HTTP ${res.status}`);

  const entries = parsePlaylist(await res.text());
  console.log(`Found ${entries.length} videos in the playlist.`);

  const verified = [];
  for (const entry of entries) {
    const meta = await verify(entry.id);
    if (!meta) {
      console.warn(`  skipped ${entry.id}: not embeddable or unavailable`);
      continue;
    }
    verified.push({
      id: entry.id,
      title: meta.title || entry.title,
      author: entry.author || meta.author_name || "XiØN",
    });
    console.log(`  ok ${entry.id}: ${meta.title || entry.title}`);
  }

  if (!verified.length) throw new Error("No embeddable videos found; nothing changed.");

  if (!write) {
    console.log("\nDry run. Re-run with --write to update thumbnails and visuals.html.");
    return;
  }

  await mkdir(IMAGE_DIR, { recursive: true });

  const files = {};
  for (const video of verified) {
    const thumb = await downloadThumb(video.id);
    console.log(`  thumbnail ${video.id}: ${thumb ?? "reused existing file"}`);
    files[video.id] = {
      has640: await exists(path.join(IMAGE_DIR, `${video.id}-640.jpg`)),
      hasWebp: await exists(path.join(IMAGE_DIR, `${video.id}.webp`)),
      hasWebp640: await exists(path.join(IMAGE_DIR, `${video.id}-640.webp`)),
    };
  }

  const page = await readFile(PAGE, "utf8");
  const start = "<!-- visuals:start -->";
  const end = "<!-- visuals:end -->";
  const from = page.indexOf(start);
  const to = page.indexOf(end);

  if (from === -1 || to === -1) {
    throw new Error("Could not find the visuals:start / visuals:end markers in visuals.html.");
  }

  const block = `${start}\n${verified.map((video) => card(video, files[video.id])).join("\n\n")}\n            ${end}`;
  const updated = page.slice(0, from) + block + page.slice(to + end.length);

  await writeFile(PAGE, updated);
  console.log(`\nUpdated ${verified.length} cards in visuals.html.`);
  console.log("Tip: the home page teaser shows three fixed thumbnails and a “06 videos” count; update those by hand if the playlist length changes.");
}

main().catch((error) => {
  console.error(`\nSync failed: ${error.message}`);
  console.error("visuals.html was not modified.");
  process.exit(1);
});
