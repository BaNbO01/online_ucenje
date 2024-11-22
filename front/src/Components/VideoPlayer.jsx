import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Preuzmi video kao Blob
        const response = await axios.get(`http://localhost:8000/api/materijali/video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("auth_token")}`,
          },
          responseType: "blob", // Preuzmi kao Blob za podršku Range zaglavljima
        });

        // Kreiraj URL za Blob
        const videoUrl = URL.createObjectURL(response.data);
        setVideoSrc(videoUrl);
      } catch (error) {
        console.error("Greška prilikom učitavanja videa:", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <div>
      {videoSrc ? (
        <video
          controls
          width="1920"
          height="1080"
          src={videoSrc}
          type="video/mp4"
        />
      ) : (
        <p>Učitavanje videa...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
