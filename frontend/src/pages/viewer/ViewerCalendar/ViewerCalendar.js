import React, { useState } from 'react';
import './ViewerCalendar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// 이건 컴포넌트 바깥에서 선언해도 됩니다 (상수 데이터)
const viewerReservations = [
  {
    id: 1,
    date: '2025-04-12',
    title: 'Sunny Breeze in Busan - 시쿤 / 비제로',
    location: 'OO공연장',
    time: '2025.04.12',
    price: '25,000원',
  },
  {
    id: 2,
    date: '2025-04-12',
    title: 'Another Performance - ABC 밴드',
    location: '□ □공연장',
    time: '2025.04.12',
    price: '30,000원',
  },
];

const ViewerCalendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0~11
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10)); // yyyy-mm-dd

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      const hasReservation = viewerReservations.some(ev => ev.date === dateString);
      return { day: i + 1, dateString, hasReservation };
    });
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const filteredEvents = viewerReservations.filter(e => e.date === selectedDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <FaChevronLeft onClick={handlePrevMonth} style={{ cursor: 'pointer' }} />
        <span className="calendar-month">{currentYear}년 {currentMonth + 1}월</span>
        <FaChevronRight onClick={handleNextMonth} style={{ cursor: 'pointer' }} />
      </div>

      <div className="calendar-days-row">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div key={i} className="calendar-day-label">{d}</div>
        ))}
      </div>

      <div className="viewer-calendar-grid">
        {days.map((day, i) => (
          <div
            key={i}
            className="calendar-day"
            onClick={() => setSelectedDate(day.dateString)}
          >
            {day.hasReservation ? (
              <div className="highlight">{day.day}</div>
            ) : (
              <div>{day.day}</div>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-info">
        <span>{selectedDate.replace(/-/g, '.')}({new Date(selectedDate).toLocaleDateString('ko-KR', { weekday: 'short' })})</span>
        <span>{filteredEvents.length}개의 공연이 있습니다</span>
      </div>

      <div className="calendar-event-list">
        {filteredEvents.map(event => (
          <div key={event.id} className="calendar-event-card">
            <p className="calendar-event-date">{event.date.slice(5).replace('-', '/')}</p>
            <p className="calendar-event-title">{event.title}</p>
            <p className="calendar-event-sub">장소: {event.location}</p>
            <p className="calendar-event-sub">일시: {event.time}</p>
            <p className="calendar-event-sub">가격: {event.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerCalendar;