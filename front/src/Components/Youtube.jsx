import React, { useState } from 'react';
import './Youtube.css';
import Navigation from './Navigation';

const Youtube = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Kasnije ćeš ovde dodati funkcionalnost povezivanja sa YouTube API-jem
    // Na trenutnom mestu možemo staviti mock podatke za prikaz
    const mockVideos = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Never Gonna Give You Up',
        description: 'Official music video by Rick Astley',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        views: '1B',
      },
      {
        id: '3JZ_D3ELwOQ',
        title: 'Despacito',
        description: 'Luis Fonsi ft. Daddy Yankee - Despacito',
        thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/0.jpg',
        views: '7.8B',
      },
      {
        id: 'YQHsXMglC9A',
        title: 'Hello',
        description: 'Adele - Hello',
        thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/0.jpg',
        views: '2.8B',
      },
    ];
    setVideos(mockVideos);
  };

  return (
    <div className="app">
        <Navigation/>
      <h1>YouTube Video Search</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for videos..."
        />
        <button type="submit">Search</button>
      </form>
      
      <div className="video-list">
        {videos.length === 0 ? (
          <p>No videos found. Try searching something!</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="video-item">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
              />
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <span>{video.views} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Youtube;
