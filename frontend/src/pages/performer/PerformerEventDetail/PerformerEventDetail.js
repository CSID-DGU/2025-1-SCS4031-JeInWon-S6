import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './PerformerEventDetail.css';

const dummyEvents = [
  {
    id: '1',
    name: '강남페스티벌',
    city: '서울',
    district: '강남구',
    category: '축제',
    date: '2025.04.25 ~ 2025.04.26',
    image: '/images/events/event_000.png',
  },
  {
    id: '2',
    name: '영등포불꽃축제',
    city: '서울',
    district: '영등포구',
    category: '축제',
    date: '2025.05.10 ~ 2025.05.11',
    image: '/images/events/event_001.png',
  },
];

const PerformerEventDetail = () => {
  const { id } = useParams();
  const event = dummyEvents.find(e => String(e.id) === id);
  const navigate = useNavigate();

  if (!event) return <div className="event-detail-container">이벤트를 찾을 수 없습니다.</div>;

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
        <button className="reserve-button" onClick={handleReserve}>예약하기</button>
      </div>
    </div>
  );
};

export default PerformerEventDetail;
