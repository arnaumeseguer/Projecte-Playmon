import { getVideoById } from "@/api/videosApi";

/** @returns {import("../domini/repositoriVideo.port").RepositoriVideoPort} */
export function creaRepositoriVideoApi() {
  return {
    async obtenirPerId(id) {
      const dadaVideo = await getVideoById(id);

      if (!dadaVideo) {
        const e = new Error("No s'ha trobat el vídeo.");
        e.code = "VIDEO_NOT_FOUND";
        throw e;
      }

      const idNormalitzat = dadaVideo.id != null ? String(dadaVideo.id) : String(id);

      const titol =
        dadaVideo.title ??
        dadaVideo.titol ??
        dadaVideo.nombre ??
        "Sense títol";

      const descripcio =
        dadaVideo.description ??
        dadaVideo.descripcio ??
        dadaVideo.sinopsis ??
        "";

      const poster =
        dadaVideo.poster_path ??
        dadaVideo.poster ??
        dadaVideo.image ??
        "";

      const hls =
        dadaVideo.hls_url ??
        dadaVideo.hls ??
        dadaVideo.m3u8_url ??
        null;

      const mp4 =
        dadaVideo.video_url ??
        dadaVideo.url ??
        dadaVideo.mp4_url ??
        null;

      if (!hls && !mp4) {
        const e = new Error("El vídeo no té cap font reproduïble.");
        e.code = "VIDEO_SOURCE_MISSING";
        throw e;
      }

      let any = null;
      const dataEstreno =
        dadaVideo.fecha_estreno ??
        dadaVideo.data_estrena ??
        dadaVideo.release_date ??
        null;

      if (typeof dataEstreno === "string" && dataEstreno.includes("-")) {
        any = dataEstreno.split("-")[0];
      } else if (typeof dadaVideo.any === "string" || typeof dadaVideo.any === "number") {
        any = String(dadaVideo.any);
      }

      const genere =
        dadaVideo.categoria ??
        dadaVideo.genre ??
        dadaVideo.genere ??
        "N/A";

      const duracioText =
        dadaVideo.durada ??
        dadaVideo.duration_text ??
        dadaVideo.duration ??
        "N/A";

      return {
        id: idNormalitzat,
        titol,
        descripcio,
        poster,
        fonts: {
          hls,
          mp4,
        },
        any,
        genere,
        duracioText,
      };
    },
  };
}