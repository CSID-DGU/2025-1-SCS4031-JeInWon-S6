import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PerformerRentList.css';

const venueList = [
  {
    id: 1,
    name: '강남라이브홀',
    city: '서울',
    district: '강남구',
    category: '대관',
    capacity: '100명',
    image: '/images/halls/hall1.png'
  },
  {
    id: 2,
    name: '역삼뮤직스테이지',
    city: '서울',
    district: '강남구',
    category: '대관',
    capacity: '80명',
    image: '/images/halls/hall2.png'
  }
];

const PerformerRentList = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/performer/venues/${id}`);
  };

  return (
    <div className="list-container">
      <button className="list-back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={16} color="#fff" />
        <span>뒤로가기</span>
      </button>
      <h2 className="list-title">🏢 서울 강남구 대관 공연장</h2>
      <div className="list-grid">
        {venueList.map((venue) => (
          <div key={venue.id} className="list-card" onClick={() => handleClick(venue.id)}>
            <img src={venue.image} alt={venue.name} className="list-image" />
            <div className="list-info">
              <h3>{venue.name}</h3>
              <p>📍 {venue.city} {venue.district}</p>
              <p>👥 수용 인원: {venue.capacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformerRentList;