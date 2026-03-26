/** @returns {import("../domini/repositoriVideo.port").RepositoriVideoPort} */
export function creaRepositoriVideoApi() {
  return {
    async obtenirPerId(id) {
      // 1. AQUI HAURIES DE FER EL FETCH AL TEU SERVIDOR PER OBTENIR EL TÍTOL I LA DESCRIPCIÓ
      // const resposta = await fetch(`http://EL_TEU_BACKEND/api/videos/${id}`);
      // const dadesBackend = await resposta.json();
      
      // Simulem el que et tornaria la base de dades (sense el vídeo, només dades)
      const dadesBackend = {
        id: id, // Aquest ID ha de ser el 'public_id' de Cloudinary (ex: "arxiu_video_1")
        titol: "Vídeo des de Cloudinary", 
        descripcio: "Aquest vídeo s'està carregant directament des del teu núvol de Cloudinary.",
        poster: `https://res.cloudinary.com/dm5tr3lwj/video/upload/${id}.jpg`, // Cloudinary pot generar la miniatura automàticament
        any: "2026",
        genere: "Acció",
        duracioText: "Desconeguda"
      };

      // 2. CONSTRUÏM LES URLS DE CLOUDINARY DIRECTAMENT AL FRONTEND (Segur, sense secrets)
      // Substituïm el núvol pel teu: 'dm5tr3lwj'
      return {
        id: dadesBackend.id,
        titol: dadesBackend.titol,
        descripcio: dadesBackend.descripcio,
        poster: dadesBackend.poster,
        fonts: {
          // Format MP4 universal des de Cloudinary
          mp4: `https://res.cloudinary.com/dm5tr3lwj/video/upload/${id}.mp4`,
          
          // Si tens HLS confgurat a Cloudinary, és així (utilitzant el perfil sp_auto)
          // hls: `https://res.cloudinary.com/dm5tr3lwj/video/upload/sp_auto/${id}.m3u8`
        },
        any: dadesBackend.any,
        genere: dadesBackend.genere,
        duracioText: dadesBackend.duracioText
      };
    },
  };
}