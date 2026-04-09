import Hls from "hls.js";
import { creaEngineNatiu } from "./engineNatiu";

export function creaEngineHlsJs() {
  /** @type {Hls | null} */
  let hls = null;

  return {
    nom: "hls.js",
    async carrega({ videoEl, url }) {
      hls = new Hls({
        // opcional: pots afinar buffers aquí
        // maxBufferLength: 30,
        // backBufferLength: 90,
      });

      await new Promise((resolve, reject) => {
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data?.fatal) {
            reject(new Error(`HLS fatal: ${data.type ?? "unknown"}`));
          }
        });

        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(url);
          hls.on(Hls.Events.MANIFEST_PARSED, () => resolve());
        });
      });
    },
    destrueix() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    },
  };
}

export function creaEnginePerFont({ videoEl, font }) {
  if (font.tipus === "hls" && Hls.isSupported()) {
    return creaEngineHlsJs();
  }
  // Fallback o per defecte per MP4 o HLS natiu
  return creaEngineNatiu();
}
