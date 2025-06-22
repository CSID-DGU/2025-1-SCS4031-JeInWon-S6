import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewerAI.css';

const allRecommendations = [
  { id: '1', venueName: '별밤홀', tags: ['발라드', '~100명 규모', '홍대'] },
  { id: '2', venueName: '라루즈홀', tags: ['재즈', '~50명 규모', '이태원'] },
  { id: '3', venueName: '하모니홀', tags: ['클래식', '~200명 규모', '강남'] },
  { id: '4', venueName: '비트박스홀', tags: ['힙합', '~70명 규모', '건대'] },
  { id: '5', venueName: '뮤직포레스트', tags: ['인디', '~150명 규모', '망원'] },
  { id: '6', venueName: '펑키타운', tags: ['펑크', '~90명 규모', '신촌'] },
];

const ViewerAI = () => {
  const navigate = useNavigate();
  const userName = '회원';

  const randomRecommendations = [...allRecommendations]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const handleCardClick = (venue) => {
    navigate(`/viewer/venues/${venue.id}`);
  };

  return (
    <div className="viewer-ai-container">
      <h2 className="viewer-ai-title">AI가 {userName}님 취향의 공연을 추천했어요</h2>

      <div className="viewer-ai-card-list">
        {randomRecommendations.map((venue) => (
          <div
            key={venue.id}
            className="viewer-ai-card"
            onClick={() => handleCardClick(venue)}
          >
            <h3 className="viewer-ai-card-title">{venue.venueName}</h3>
            <p className="viewer-ai-subtitle">추천 태그 :</p>
            <div className="viewer-ai-tags">
              {venue.tags.map((tag, index) => (
                <span key={index} className="viewer-ai-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerAI;