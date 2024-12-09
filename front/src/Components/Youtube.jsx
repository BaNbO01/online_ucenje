import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Youtube.css'; // Obavezno dodati ispravan put do CSS fajla
import Navigation from './Navigation';

const YouTube = () => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || null);
  const [channels, setChannels] = useState([
    { id: process.env.REACT_APP_YOUTUBE_API_1_ID, name: '3 Blue 1 Brown' },
    { id: process.env.REACT_APP_YOUTUBE_API_2_ID, name: 'Sinisa Vlajic' },
  ]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Tvoj YouTube API ključ
  const VIDEOS_PER_PAGE = 5; // Broj video klipova po stranici

  const fetchVideos = async (channelId, pageToken = '') => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          channelId,
          maxResults: VIDEOS_PER_PAGE,
          order: 'date',
          type: 'video',
          pageToken: pageToken,
          key: API_KEY,
        },
      });
      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken || '');
      setPrevPageToken(response.data.prevPageToken || '');
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage(1); // Resetovanje na prvu stranicu
    fetchVideos(channelId);
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchVideos(selectedChannelId, nextPageToken);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      fetchVideos(selectedChannelId, prevPageToken);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navigation role={sessionStorage.getItem('role')} />
      <div className="app">
        <h1>YouTube Kanali</h1>

        {/* Kartice sa kanalima */}
        <div className="video-list">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="video-item"
              onClick={() => handleChannelClick(channel.id)}
            >
              <h3>{channel.name}</h3>
            </div>
          ))}
        </div>

        {/* Prikaz videa za odabrani kanal */}
        <div className="video-list">
          {loading ? (
            <p>Učitavanje...</p>
          ) : (
            videos.map((video) => (
              <div key={video.id.videoId} className="video-item">
                <h4>{video.snippet.title}</h4>
                <iframe
                  title={video.snippet.title}
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))
          )}
        </div>

        {/* Paginacija */}
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={!prevPageToken}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-number">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={!nextPageToken}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default YouTube;
