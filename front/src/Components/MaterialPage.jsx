import React from "react";
import VideoPlayer from "./VideoPlayer";

const MaterijalPage = () => {
  const videoId = 226; 

  return (
    <div>
      <h1>Materijal - Video</h1>
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

export default MaterijalPage;
