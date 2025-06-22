import React, { useEffect, useState } from 'react';
import './PerformerCalendar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PerformerCalendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [performerReservations, setPerformerReservations] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false); // 추가: 상태 강제 갱신용

  const extractEventDates = (dateRange) => {
    const [startStr, endStr] = dateRange.split('~').map(str => str.trim());
    const start = new Date(startStr.replace(/\./g, '-'));
    const end = new Date(endStr.replace(/\./g, '-'));
    const dates = [];
    let cur = new Date(start);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const loadReservations = () => {
    const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const performerId = user?.id || '';

    const myVenueReservations = allReservations
      .filter(r => r.performerId === performerId)
      .map(r => ({
        id: r.id,
        name: r.venueName || r.name || '공연장 예약',
        region: r.region || '',
        size: r.size || r.count || '',
        date: r.date,
        status: r.status || '대기중',
        type: 'venue'
      }));

    const events = JSON.parse(localStorage.getItem('eventReservations') || '[]');
    const expandedEvents = events.flatMap(ev =>
      extractEventDates(ev.date).map(date => ({
        id: ev.id,
        name: ev.name,
        region: ev.city + ' ' + ev.district,
        size: '축제',
        date: date,
        status: '예약확정',
        type: 'event'
      }))
    );

    setPerformerReservations([...myVenueReservations, ...expandedEvents]);

    console.log('내 공연자 ID:', performerId);
    console.log('모든 예약:', allReservations);
    console.log('필터링된 내 예약:', myVenueReservations);

  };

  useEffect(() => {
    loadReservations();
  }, [refreshFlag]); // 상태 변화시 재로드

  useEffect(() => {
    const confirmed = localStorage.getItem('reservationConfirmed') === 'true';
    const requested = localStorage.getItem('reservationRequested') === 'true';

    if (confirmed) {
      Swal.fire({
        icon: 'success',
        title: '예약이 확정되었습니다!',
        text: '공연장 측에서 예약을 수락했습니다.',
        confirmButtonColor: '#495BFB'
      });
      localStorage.removeItem('reservationConfirmed');
    }

    if (requested) {
      localStorage.removeItem('reservationRequested');
    }

    if (confirmed || requested) {
      setRefreshFlag(prev => !prev);
    }
  }, []);

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
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, dateString: null, reservationStatus: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const reservations = performerReservations.filter(ev => ev.date === dateString);
      const hasConfirmed = reservations.some(r => r.status === '예약확정');
      const hasPending = reservations.some(r => r.status === '대기중');
      days.push({ day: i, dateString, hasConfirmed, hasPending });
    }

    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const filteredEvents = performerReservations.filter(e => e.date === selectedDate);
  const pendingCount = filteredEvents.filter(e => e.status === '대기중').length;
  const confirmedCount = filteredEvents.filter(e => e.status === '예약확정').length;

  const handleCancel = (id, type) => {
    Swal.fire({
      title: '대기를 취소하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f85151',
      cancelButtonColor: '#666',
      confirmButtonText: '네, 취소합니다',
      cancelButtonText: '아니오'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'venue') {
          const updated = JSON.parse(localStorage.getItem('reservations') || '[]')
            .filter(r => r.id !== id);
          localStorage.setItem('reservations', JSON.stringify(updated));
        } else if (type === 'event') {
                 const updated = JSON.parse(localStorage.getItem('eventReservations') || '[]')
                   .filter(r => r.id !== id);
                 localStorage.setItem('eventReservations', JSON.stringify(updated));
               }

               setRefreshFlag(prev => !prev);

        Swal.fire({
          title: '취소 완료',
          text: '대기가 성공적으로 취소되었습니다.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <FaChevronLeft onClick={handlePrevMonth} style={{ cursor: 'pointer' }} />
        <span className="calendar-month">{currentYear}년 {currentMonth + 1}월</span>
        <FaChevronRight onClick={handleNextMonth} style={{ cursor: 'pointer' }} />
      </div>

      <div className="calendar-days-row">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div key={i} className="calendar-day-label">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, i) => (
          <div
            key={i}
            className="calendar-day"
            onClick={() => day.dateString && setSelectedDate(day.dateString)}
          >
            {day.dateString ? (
              <div className="calendar-day-content">
                <div>{day.day}</div>
                {day.hasPending && <span className="pending-dot"></span>}
                {day.hasConfirmed && <span className="confirmed-dot"></span>}
              </div>
            ) : (
              <div className="empty-day"></div>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-info">
        <span>{selectedDate.replace(/-/g, '.')} ({new Date(selectedDate).toLocaleDateString('ko-KR', { weekday: 'short' })})</span>
        <span>{pendingCount}개 대기중, {confirmedCount}개 예약확정</span>
      </div>

      <div className="calendar-event-list">
        {filteredEvents.map(event => (
          <div key={event.id + event.date} className="performer-calendar-event-card">
            <p className="calendar-event-title">{event.name}</p>
            <p className="calendar-event-sub">지역: {event.region}</p>
            <p className="calendar-event-sub">
              {event.size === '축제' ? '종류: 축제' : `규모: ${event.size}명`}
            </p>
            {event.status === '대기중' && (
              <button
                className="cancel-button"
                onClick={() => handleCancel(event.id, event.type)}
              >
                대기 취소
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformerCalendar;