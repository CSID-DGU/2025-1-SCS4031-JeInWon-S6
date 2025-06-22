import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './PerformerEventDetail.css';

const eventList = [
  {
    id: 1,
    name: '강남페스티벌',
    city: '서울',
    district: '강남구',
    category: '축제',
    date: '2025.05.24 ~ 2025.05.25',
    image: '/images/events/event_000.png'
  },
  {
    id: 2,
    name: '강남신한뮤직쇼',
    city: '서울',
    district: '강남구',
    category: '축제',
    date: '2025.05.26 ~ 2025.05.27',
    image: '/images/events/event_001.png'
  },
  {
    id: 3,
    name: '강남나이트페스티벌',
    city: '서울',
    district: '강남구',
    category: '축제',
    date: '2025.06.01 ~ 2025.06.02',
    image: '/images/events/event_002.png'
  },
  {
    id: 4,
    name: '강남거리문화축제',
    city: '서울',
    district: '강남구',
    category: '축제',
    date: '2025.06.05 ~ 2025.06.06',
    image: '/images/events/event_003.png'
  }
];

const PerformerEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = eventList.find(e => String(e.id) === id);

  if (!event) {
    return <div className="event-detail-container">이벤트를 찾을 수 없습니다.</div>;
  }

  const handleReserve = () => {
    const newReservation = {
      id: event.id,
      name: event.name,
      city: event.city,
      district: event.district,
      category: event.category,
      date: event.date,
    };

    const existing = JSON.parse(localStorage.getItem('eventReservations') || '[]');
    const already = existing.some(r => r.id === event.id);

    if (already) {
      Swal.fire({
        icon: 'warning',
        title: '이미 예약됨',
        text: '해당 축제는 이미 예약하셨습니다.',
        confirmButtonColor: '#f85151'
      });
      return;
    }

    localStorage.setItem('eventReservations', JSON.stringify([...existing, newReservation]));
    Swal.fire({
      icon: 'success',
      title: '예약 완료!',
      text: `${event.name} 축제가 예약되었습니다.`,
      confirmButtonColor: '#495BFB'
    });
  };

  return (
    <div className="event-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={16} color="#fff" />
        <span>뒤로가기</span>
      </button>
      <div className="event-detail-card">
        <img src={event.image} alt={event.name} className="event-detail-image" />
        <h2 className="event-detail-title">{event.name}</h2>
        <p className="event-detail-sub">📍 {event.city} {event.district}</p>
        <p className="event-detail-sub">🎉 {event.category}</p>
        <p className="event-detail-sub">🗓️ {event.date}</p>
        <button className="reserve-button" onClick={handleReserve}>지원하기</button>
      </div>
    </div>
  );
};

export default PerformerEventDetail;
