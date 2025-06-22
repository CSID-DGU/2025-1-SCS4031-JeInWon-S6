import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PerformerMypage.css';

const mockData = {
  recentVenues: [
    { id: 1, title: '제비다방', image: '/images/performancehall/hall_000.png' },
    { id: 2, title: '무브홀', image: '/images/performancehall/hall_001.png' },
    { id: 3, title: '브이홀', image: '/images/performancehall/hall_002.png' }
  ],
  likedVenues: [
    { id: 4, title: '스트레인지프룻', image: '/images/performancehall/hall_003.png' },
    { id: 5, title: '롤링홀', image: '/images/performancehall/hall_004.png' }
  ],
  likedPosts: [
    { id: 1, user: '사용자1', title: '공연 너무 좋았어요!', content: '분위기가 최고였어요~' },
    { id: 2, user: '사용자2', title: '추천 공연장 있어요?', content: '무브홀 어떤가요?' }
  ],
  myPosts: [
    { id: 1, title: '공연장 추천해주세요', content: '작은 무대 찾고 있어요.' },
    { id: 2, title: 'AI 추천 사용기', content: '정확하네요~' }
  ]
};

const PerformerMypage = () => {
  const navigate = useNavigate();
  return (
    <div className="performer-mypage-container">
      <header className="performer-header">
        <div className="performer-profile-circle" />
        <span className="performer-header-title">계정 정보</span>
      </header>
      <section className="performer-resume-section">
            <div className="performer-resume-box">
              <div className="performer-resume-text">
                <p className="performer-resume-title">이력서</p>
                <p className="performer-resume-description">소개, 활동 경력, 장르 등을 담은 이력서</p>
              </div>
              <button
                className="performer-resume-btn"
                onClick={() => navigate('/performer/resume')}
              >
              이력서 보기
               </button>
            </div>
      </section>
      <section className="performer-section">
        <h2 className="performer-section-title">최근 본 공연장</h2>
        <div className="performer-card-list">
          {mockData.recentVenues.map(venue => (
            <div className="performer-card" key={venue.id}>
              <img src={venue.image} alt={venue.title} />
              <span>{venue.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="performer-section">
        <h2 className="performer-section-title">찜한 공연장</h2>
        <div className="performer-card-list">
          {mockData.likedVenues.map(venue => (
            <div className="performer-card" key={venue.id}>
              <img src={venue.image} alt={venue.title} />
              <span>{venue.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="performer-section">
        <h2 className="performer-section-title">좋아요 누른 게시물</h2>
        {mockData.likedPosts.map(post => (
          <div className="performer-post" key={post.id}>
            <span className="performer-user">● {post.user}</span>
            <div className="performer-post-title">{post.title}</div>
            <div className="performer-post-body">{post.content}</div>
          </div>
        ))}
      </section>

      <section className="performer-section">
        <h2 className="performer-section-title">내가 쓴 글</h2>
        {mockData.myPosts.map(post => (
          <div className="performer-post" key={post.id}>
            <div className="performer-post-title">{post.title}</div>
            <div className="performer-post-body">{post.content}</div>
          </div>
        ))}
      </section>

      <section className="performer-recommendation">
        <p className="performer-recommend-title">A가 추천하는 공연이에요</p>
        <strong>Sunny Breeze in Busan - 시클 / 비제로</strong>
        <p className="performer-recommendation-info">
          장소: ~~ <br />
          일시: 2025.04.01 <br />
          가격: 25,000원
        </p>
      </section>
    </div>
  );
};

export default PerformerMypage;
