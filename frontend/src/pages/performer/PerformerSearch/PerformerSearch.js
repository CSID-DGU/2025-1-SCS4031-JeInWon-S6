import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PerformerSearch.css';
import { FaSearch } from 'react-icons/fa';

const cities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

const venueImages = [
  '/images/performancehall/hall_000.png',
  '/images/performancehall/hall_001.png',
  '/images/performancehall/hall_002.png',
  '/images/performancehall/hall_003.png',
  '/images/performancehall/hall_004.png',
  '/images/performancehall/hall_005.png',
  '/images/performancehall/hall_006.png',
  '/images/performancehall/hall_007.png',
  '/images/performancehall/hall_008.png',
  '/images/performancehall/hall_009.png',
  '/images/performancehall/hall_010.png',
  '/images/performancehall/hall_011.png',
  '/images/performancehall/hall_012.png',
  '/images/performancehall/hall_013.png',
  '/images/performancehall/hall_014.png',
  '/images/performancehall/hall_015.png',
  '/images/performancehall/hall_016.png',
  '/images/performancehall/hall_017.png',
  '/images/performancehall/hall_018.png',
  '/images/performancehall/hall_019.png',
];

const venueNames = [
  '제비다방', '뮤지스땅스', '플랫폼창동61', '클럽FF', '웨스트브릿지',
  '롤링홀', '구름아래소극장', '브이홀', '살롱문보우', '무브홀',
  '스트레인지프룻', '마포아트센터', '예스24라이브홀', '고스트씬',
  '에반스라운지', '안녕하신가영홀', '서울숲인디라운지', '하이브아트홀',
  '피크닉스테이지', '왓에버라운지'
];

const seoulDistricts = [
  '전체', '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구',
  '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구',
  '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
];

const sizes = [
  { label: '전체', range: null },
  { label: '0~100명', range: [1, 100] },
  { label: '100~200명', range: [6, 200] },
  { label: '200명 이상', range: [201, Infinity] },
];

// venue 생성 (모두 서울 소속으로)
const venues = Array.from({ length: 20 }, (_, index) => {
  const name = venueNames[index];
  const district = seoulDistricts[(index + 1) % seoulDistricts.length];
  const size = [4, 6, 10, 12, 15][index % 5];
  const image = venueImages[index % venueImages.length];
  return { id: index + 1, name, city: '서울', district, size, image };
});

const PerformerSearch = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('서울');
  const [search, setSearch] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState(['전체']);
  const [selectedSizeRange, setSelectedSizeRange] = useState(null);
  const toggleDistrict = (district) => {
    if (district === '전체') {
      setSelectedDistricts(['전체']);
    } else {
      const updated = selectedDistricts.includes(district)
        ? selectedDistricts.filter(d => d !== district)
        : [...selectedDistricts.filter(d => d !== '전체'), district];

      setSelectedDistricts(updated.length === 0 ? ['전체'] : updated);
    }
  };

  const filteredData = venues.filter(item => {
    const matchName = item.name.includes(search);
    const matchCity = item.city === selectedCity;
    const matchDistrict = selectedCity !== '서울' || selectedDistricts.includes('전체') || selectedDistricts.includes(item.district);
    const matchSize = !selectedSizeRange || (item.size >= selectedSizeRange[0] && item.size <= selectedSizeRange[1]);
    return matchName && matchCity && matchDistrict && matchSize;
  });

  return (
    <div className="search-container">
      {/* 검색창 */}
      <div className="search-input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="공연장 이름"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-icon">
          <FaSearch />
        </span>
      </div>
      {/* 도시 선택 */}
      <div className="city-scroll">
        {cities.map(city => (
          <button
            key={city}
            className={`city-btn ${selectedCity === city ? 'selected' : ''}`}
            onClick={() => {
              setSelectedCity(city);
              setSelectedDistricts(['전체']);
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* 서울일 때만 구 필터 표시 */}
      {selectedCity === '서울' && (
        <div className="district-filter">
          {seoulDistricts.map(d => (
            <button
              key={d}
              className={`district-btn ${selectedDistricts.includes(d) ? 'active' : ''}`}
              onClick={() => toggleDistrict(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* 인원 수 필터 */}
      <div className="size-filter">
        {sizes.map(size => (
          <button
            key={size.label}
            className={`size-btn ${selectedSizeRange === size.range ? 'active' : ''}`}
            onClick={() => setSelectedSizeRange(size.range)}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* 공연장 목록 */}
      <div className="venue-grid">
        {filteredData.map(item => (
          <div
            key={item.id}
            className="venue-card"
            onClick={() => navigate(`/venues/${item.id}`, {
             state: { venue: item, readonly: false, from: '/performer/search' } })}
          >
            <img src={item.image} alt={item.name} />
            <div className="venue-name">{item.name}</div>
            <div className="venue-subtext">{item.district} · {item.size}인</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformerSearch;
