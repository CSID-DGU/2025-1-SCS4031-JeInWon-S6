// src/pages/viewer/ViewerSearch.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ViewerSearch.css';
import { FaSearch, FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';

import { artistList as initialData } from '../../../data/artistData';

const ViewerSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState('전체');
  const [favorites, setFavorites] = useState(['2', '5', '10']);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('viewer-favorites') || '[]');
    setFavorites(stored);
  }, [location]);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem('viewer-favorites', JSON.stringify(updated));
  };

  const filteredData = initialData.filter(item => {
    const matchSearch = item.name.includes(search);
    const isFavorite = favorites.includes(item.id);
    if (editMode) return matchSearch && isFavorite;
    return selectedTab === '전체' ? matchSearch : (matchSearch && isFavorite);
  });

  return (
    <div className="viewer-container">
      <div className="viewer-search-row">
        <FaSearch className="viewer-search-icon" />
        <input
          className="viewer-search-input"
          type="text"
          placeholder="공연자 이름"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="viewer-search-button">검색</button>
      </div>

      <div className="viewer-tab-row">
        <button
          className={`viewer-tab-button ${selectedTab === '전체' && !editMode ? 'viewer-tab-selected' : ''}`}
          onClick={() => { setSelectedTab('전체'); setEditMode(false); }}
        >전체</button>
        <button
          className={`viewer-tab-button ${selectedTab === '찜' && !editMode ? 'viewer-tab-selected' : ''}`}
          onClick={() => { setSelectedTab('찜'); setEditMode(false); }}
        >관심 아티스트</button>
      </div>

      <div className="viewer-list-container">
        {filteredData.map(item => {
          const isFavorite = favorites.includes(item.id);
          return (
            <div
              key={item.id}
              className="viewer-item"
              onClick={() => navigate('/viewer/artist', { state: { artist: item } })}
              style={{ cursor: 'pointer' }}
            >
              <div className="viewer-image-box">
                <div className="viewer-image-wrapper">
                  <img src={item.image} alt={item.name} className="viewer-profile-image" />
                </div>

                {!editMode && (
                  <button
                    className="viewer-favorite-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {isFavorite ? <FaHeart color="red" size={14} /> : <FaRegHeart color="#fff" size={14} />}
                  </button>
                )}

                {editMode && isFavorite && (
                  <button
                    className="viewer-delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <FaTimes size={12} color="#fff" />
                  </button>
                )}
              </div>

              <p className="viewer-artist-name">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewerSearch;