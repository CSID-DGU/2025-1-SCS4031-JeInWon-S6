import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerformerHome.css';
import { FaMusic, FaHome, FaStreetView } from 'react-icons/fa';
import { IoStar, IoStarOutline } from 'react-icons/io5';

const PerformerHome = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('서울');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const cities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  const districtsByCity = {
    서울: [
      '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'
    ]
  };

  const categories = ['축제', '대관', '무료'];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/select-user');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    // ✅ 조건이 맞으면 직접 이동
    if (category === '대관' && selectedCity === '서울' && selectedDistrict === '강남구') {
      navigate('/performer/rent/seoul/gangnam');
      return; // 여기서 더 진행할 필요 없음
    }

    // ✅ 그 외 일반 검색 로직
    if (selectedCity && selectedDistrict) {
      handleSearch(category, selectedCity, selectedDistrict);
    } else {
      alert('지역(시/구)을 모두 선택해주세요.');
    }
  };

  const handleSearch = (category = selectedCategory, city = selectedCity, district = selectedDistrict) => {
    if (!city || !district || !category) {
      alert('모든 항목을 선택해주세요.');
      return;
    }

    if (category === '축제') {
      navigate(`/performer/events?city=${city}&district=${district}&category=${category}`);
    } else {
      navigate(`/performer/venues?city=${city}&district=${district}&category=${category}`);
    }
  };

  const handleCommunityMorePress = () => {
    navigate('/community');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <button className="logout-btn" onClick={handleLogout}>
          <img src="/images/icons/logout.png" alt="로그아웃" className="logout-icon" />
        </button>
      </div>
      <section className="banner-section">
        <div className="banner-text">
          <p className="label">공연비 지원</p>
          <h2>여름이 온다,<br />무대를 준비하자!</h2>
          <p className="sub">전국 페스티벌부터 지역 공연까지,<br />지금 바로 참여하세요</p>
          <button className="banner-btn">자세히 보기</button>
        </div>
        <img src="/images/home/banner_right.png" className="banner-image" alt="배너" />
      </section>

      <section className="category-section">
        <h3 className="section-title">🎯 맞춤 공연장 찾기</h3>
        <div className="category-grid">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const icon = cat === '축제' ? <FaMusic /> : cat === '대관' ? <FaHome /> : <FaStreetView />;
            return (
              <button
                key={cat}
                className={`category-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="category-icon">{icon}</div>
                <div className="category-label">{cat}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="location-section">
        <div className="city-scroll">
          {cities.map(city => (
            <button
              key={city}
              className={`city-btn ${selectedCity === city ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCity(city);
                setSelectedDistrict('');
              }}>
              {city}
            </button>
          ))}
        </div>
        <div className="district-scroll-wrapper">
          {Array.from({ length: Math.ceil((districtsByCity[selectedCity] || []).length / 8) }, (_, i) => {
            const pageItems = districtsByCity[selectedCity].slice(i * 8, (i + 1) * 8);
            const rows = [pageItems.slice(0, 4), pageItems.slice(4, 8)];
            return (
              <div className="district-page" key={i}>
                {rows.map((row, rowIndex) => (
                  <div className="district-row" key={rowIndex}>
                    {row.map(district => (
                      <button
                        key={district}
                        className={`district-btn ${selectedDistrict === district ? 'selected' : ''}`}
                        onClick={() => setSelectedDistrict(district)}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <section className="community-section">
        <div className="section-header">
          <h3 className="section-title">커뮤니티</h3>
          <button className="more-btn" onClick={handleCommunityMorePress}>더보기</button>
        </div>
        <ul className="post-list">
          <li onClick={() => navigate('/popular')}>[인기게시판] 제목입니다</li>
          <li onClick={() => navigate('/free')}>[자유게시판] 제목입니다</li>
          <li onClick={() => navigate('/notice')}>[공지사항] 제목입니다</li>
        </ul>
      </section>

      <section className="recommend-section">
        <h3>추천 공연장</h3>
        <p className="recommend-sub">○○님 취향 저격! 공연장</p>
        <div className="venue-scroll">
          {[{ img: '/images/home/recom_00.png', title: 'musinsa garage' }, { img: '/images/home/recom_01.png', title: '제비다방' }, { img: '/images/home/recom_02.png', title: 'A.O.R' }].map((venue, idx) => (
            <div key={idx} className="venue-card">
              <img src={venue.img} alt={venue.title} className="venue-image" />
              <p className="venue-name">{venue.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PerformerHome;