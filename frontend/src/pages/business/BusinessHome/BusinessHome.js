import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessHome.css';
import Swal from 'sweetalert2';

const predefinedVenues = [
  { id: '1', name: '제비다방' },
  { id: '2', name: '뮤지스땅스' },
];

const handleViewResume = (performerId) => {
  const allResumes = JSON.parse(localStorage.getItem('performerResumes') || '{}');
  const resume = allResumes[performerId];

  if (resume) {
    Swal.fire({
      title: resume.venue || '팀명 없음',
      html: `
        <p><strong>장르:</strong> ${resume.genre || '-'}</p>
        <p><strong>인원:</strong> ${resume.members || '-'}</p>
        <p><strong>연락처:</strong> ${resume.contact || '-'}</p>
        <p><strong>인스타그램:</strong> <a href="${resume.instagram}" target="_blank">${resume.instagram}</a></p>
        <p><strong>유튜브:</strong> <a href="${resume.youtube}" target="_blank">${resume.youtube}</a></p>
        <p><strong>소개글:</strong><br>${resume.description || '-'}</p>
      `,
      confirmButtonText: '닫기'
    });
  } else {
    Swal.fire('이력서가 없습니다.', '', 'warning');
  }
};

const BusinessHome = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTab, setSelectedTab] = useState('전체');
  const [isEditing, setIsEditing] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(storedUser.companyName || '');
  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('businessUserVenues');
    return saved ? JSON.parse(saved) : [];
  });
  const [newVenue, setNewVenue] = useState('');
  const [reservations, setReservations] = useState([]);
  const [venueLinks, setVenueLinks] = useState(() => {
    const saved = localStorage.getItem('businessVenueLinks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('reservations') || '[]');
    const myVenueIds = venues.map(v => String(v.id));
    const venueReservations = all.filter(r => myVenueIds.includes(String(r.venueId)));
    setReservations(venueReservations);
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('userType', 'business');
  }, []);

  // 처음 로그인 시 venueName 기반 venue 자동 추가
  useEffect(() => {
    if (venues.length === 0 && storedUser.venueName) {
      const matched = predefinedVenues.find(v => v.name === storedUser.venueName);
      if (matched) {
        setVenues([matched]);
        localStorage.setItem('businessUserVenues', JSON.stringify([matched]));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/select-user');
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem('businessUserName', name);
    localStorage.setItem('businessUserVenues', JSON.stringify(venues));
    localStorage.setItem('businessVenueLinks', JSON.stringify(venueLinks));

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      companyName: name,
      venueName: venues[0]?.name || '',
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    const allBusinessUsers = JSON.parse(localStorage.getItem('businessUsers') || '[]');
    const updatedBusinessUsers = allBusinessUsers.map(user =>
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('businessUsers', JSON.stringify(updatedBusinessUsers));
  };


  const handleAddVenue = () => {
    const trimmed = newVenue.trim();
    const matched = predefinedVenues.find(v => v.name === trimmed);
    if (!matched) return alert('정확한 공연장 이름을 입력해주세요.');
    if (venues.some(v => v.id === matched.id)) return alert('이미 추가된 공연장입니다.');
    const updated = [...venues, matched];
    setVenues(updated);
    setNewVenue('');
    localStorage.setItem('businessUserVenues', JSON.stringify(updated));
  };

  const handleConfirm = (reservation) => {
    const all = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updated = all.map(r => {
      if (
        r.performerId === reservation.performerId &&
        r.venueId === reservation.venueId &&
        r.date === reservation.date &&
        r.time === reservation.time
      ) {
        return {
          ...r,
          status: '예약확정',
          performerId: r.performerId || reservation.performerId, // 혹시 null이면 보완
          venueId: r.venueId || reservation.venueId,
          date: r.date || reservation.date,
          time: r.time || reservation.time,
          venueName: r.venueName || reservation.venueName,
        };
      }
      return r;
    });

    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated.filter(r => venues.some(v => String(v.id) === String(r.venueId))));
    localStorage.setItem('reservationConfirmed', 'true');

    Swal.fire({
      icon: 'success',
      title: '예약이 확정되었습니다!',
      confirmButtonText: '확인'
    });
  };

  const getDaysInMonth = (year, month) => {
    const startDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startDay + lastDate) / 7) * 7;
    const days = [];
    for (let i = 0; i < totalCells; i++) {
      if (i < startDay || i >= startDay + lastDate) days.push(null);
      else days.push(i - startDay + 1);
    }
    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  const filteredReservations = reservations.filter(item => {
    if (selectedTab === '전체') return true;
    return item.status === selectedTab;
  });

  const selectedDateReservations = selectedDate
    ? filteredReservations.filter(r => r.date === selectedDate)
    : [];

  const handleReject = (reservation) => {
    const all = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updated = all.filter(r => {
      return !(
        r.performerId === reservation.performerId &&
        r.venueId === reservation.venueId &&
        r.date === reservation.date &&
        r.time === reservation.time
      );
    });

    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated.filter(r => venues.some(v => String(v.id) === String(r.venueId))));

    Swal.fire({
      icon: 'info',
      title: '지원이 거절되었습니다.',
      confirmButtonText: '확인'
    });
  };

  return (
    <div className="business-calendar-container">
      <img src="/images/icons/logout.png" alt="로그아웃" className="logout-icon" onClick={handleLogout} />

      <div className="business-profile-header">
        <img src="/images/business/business_profile.png" alt="프로필" className="profile-image" />
        <div className="profile-info">
          {isEditing ? (
            <>
              <input className="profile-name-input" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="profile-venue-label">내 사업장</div>
              <div className="profile-venues">
                {venues.map((venue, idx) => (
                  <div key={venue.id} className="venue-tag-wrapper">
                    <span className="venue-item">{venue.name}</span>
                    <input
                      className="venue-link-input"
                      type="text"
                      placeholder="외부 예약 링크 입력"
                      value={venueLinks[venue.id] || ''}
                      onChange={(e) =>
                        setVenueLinks(prev => ({ ...prev, [venue.id]: e.target.value }))
                      }
                    />
                    <button
                      className="venue-delete-button"
                      onClick={() => setVenues(venues.filter((_, i) => i !== idx))}
                    >×</button>
                  </div>
                ))}
              </div>
              <input className="venue-input" placeholder="새 사업장 추가" value={newVenue} onChange={(e) => setNewVenue(e.target.value)} />
              <div className="profile-venue-actions">
                <button className="venue-add-button" onClick={handleAddVenue}>추가</button>
                <button className="edit-button" onClick={handleSave}>저장</button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-name">{name || '사업자'}님</div>
              <div className="profile-venue-label">내 사업장</div>
              <div className="profile-venues">
                {venues.map((venue) => (
                  <div key={venue.id} className="venue-inline-block">
                    <span className="venue-name">{venue.name}</span>
                    {venueLinks[venue.id] && (
                      <a
                        href={venueLinks[venue.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="venue-link"
                      >
                        {venueLinks[venue.id]}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="profile-buttons">
                <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
                {venues.length > 0 && (
                  <button
                    className="business-venue-intro-button"
                    onClick={() =>
                      navigate(`/venues/${venues[0].id}`, {
                        state: { readonly: true, from: '/business/home' }
                      })
                    }
                  >
                    소개보기
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="calendar-header">
        <span onClick={() => currentMonth === 0 ? (setCurrentYear(currentYear - 1), setCurrentMonth(11)) : setCurrentMonth(currentMonth - 1)}>&lt;</span>
        <span>{currentYear}년 {currentMonth + 1}월</span>
        <span onClick={() => currentMonth === 11 ? (setCurrentYear(currentYear + 1), setCurrentMonth(0)) : setCurrentMonth(currentMonth + 1)}>&gt;</span>
      </div>

      <div className="calendar-days-row">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div className="calendar-day-label" key={i}>{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} className="calendar-day empty"></div>;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const reservationsForThisDay = reservations.filter(r =>
            venues.some(v => String(v.id) === String(r.venueId)) && r.date === dateStr
          );
          const hasPending = reservationsForThisDay.some(r => r.status === '대기중');
          const hasConfirmed = reservationsForThisDay.some(r => r.status === '예약확정');
          return (
            <div className="calendar-day" key={idx} onClick={() => setSelectedDate(dateStr)}>
              <div className="calendar-day-content">
                <span>{day}</span>
                {hasPending && <span className="pending-dot"></span>}
                {hasConfirmed && <span className="confirmed-dot"></span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="calendar-info">
        {selectedDate || '날짜 선택 없음'} / {selectedDateReservations.length}개의 예약이 있습니다
      </div>

      <div className="resume-tabs">
        {['전체', '대기중', '예약확정'].map((tab) => (
          <button key={tab} className={`resume-tab-button ${selectedTab === tab ? 'active' : ''}`} onClick={() => setSelectedTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="resume-cards">
        {selectedDateReservations.map((res, index) => (
          <div key={index} className="resume-card">
            <div className="resume-header">
              <div className="resume-info">
                <div className="team">공연자 id: {res.performerId}</div>
                <div className="date">{res.date} {res.time}</div>
                <div className="venue">공연장: {res.venueName}</div>
              </div>
              <div className="status">{res.status}</div>
            </div>

            <div className="resume-actions">
              <button className="view-button" onClick={() => handleViewResume(res.performerId)}>지원서 보기</button>
              {res.status === '대기중' && (
                <>
                  <button className="confirm-button" onClick={() => handleConfirm(res)}>예약 확정</button>
                  <button className="reject-button" onClick={() => handleReject(res)}>거절하기</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHome;