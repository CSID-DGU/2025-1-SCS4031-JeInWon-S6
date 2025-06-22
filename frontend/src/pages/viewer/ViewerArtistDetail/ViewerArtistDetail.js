import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './ViewerArtistDetail.css';

const mockConcerts = [
  {
    id: '1',
    image: '/images/concerts/concert_000.png',
    location: '홍대 인근',
    date: '2025.04.01',
    price: '25,000원',
  },
];

const ViewerArtistDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artist } = location.state || {};

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('viewer-favorites') || '[]');
    if (artist && storedFavorites.includes(artist.id)) {
      setLiked(true);
    }
  }, [artist]);

  const handleToggleFavorite = () => {
    const current = JSON.parse(localStorage.getItem('viewer-favorites') || '[]');
    let updated;
    if (liked) {
      updated = current.filter(id => id !== artist.id);
    } else {
      updated = [...current, artist.id];
    }
    localStorage.setItem('viewer-favorites', JSON.stringify(updated));
    setLiked(!liked);
  };

  const renderConcertCard = (concert) => (
    <div key={concert.id} className="artistdetail-card">
      <img src={concert.image} alt="concert" className="artistdetail-card-image" />
      <p className="artistdetail-card-text">장소: {concert.location}</p>
      <p className="artistdetail-card-text">일시: {concert.date}</p>
      <p className="artistdetail-card-text">가격: {concert.price}</p>
      <div className="artistdetail-zzim-btn">
        <p className="artistdetail-zzim-text">찜하기</p>
      </div>
    </div>
  );

  if (!artist) {
    return <div className="artistdetail-container">아티스트 정보가 없습니다.</div>;
  }

  return (
    <div className="artistdetail-container">
      <div className="artistdetail-back-button" onClick={() => navigate(-1)}>
        <AiOutlineArrowLeft size={24} color="#fff" />
      </div>

      <div className="artistdetail-profile-section">
        <img
          className="artistdetail-profile-image"
          src={artist.image || '/images/artists/artist_000.png'}
          alt="artist"
        />
        <div className="artistdetail-profile-text">
          <p className="artistdetail-intro-label">소개</p>
          <p className="artistdetail-intro-text">{artist.intro}</p>
        </div>
      </div>

      <div onClick={handleToggleFavorite} className="artistdetail-like-button">
        {liked ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="red" />}
      </div>

      <h2 className="artistdetail-name">{artist.name}</h2>
      <p className="artistdetail-section-title">{artist.name}님의 공연</p>

      <div className="artistdetail-card-container">
        {mockConcerts.map(renderConcertCard)}
      </div>
    </div>
  );
};

export default ViewerArtistDetail;