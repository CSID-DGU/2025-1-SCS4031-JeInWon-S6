import React, { useState, useEffect } from 'react';
import './PerformerResumeForm.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PerformerResumeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    image: '',
    dateStart: '',
    dateEnd: '',
    scale: '',
    pay: '',
    description: '',
    instagram: '',
    youtube: '',
    genre: '',
    members: '',
    contact: '',
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const performerId = currentUser.id;

    if (performerId) {
      const allResumes = JSON.parse(localStorage.getItem('performerResumes') || '{}');
      if (allResumes[performerId]) {
        setFormData(allResumes[performerId]);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const performerId = currentUser.id;

      if (!performerId) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 기존 데이터 불러와서 병합
      const allResumes = JSON.parse(localStorage.getItem('performerResumes') || '{}');
      allResumes[performerId] = formData;

      localStorage.setItem('performerResumes', JSON.stringify(allResumes));
      alert('이력서가 저장되었습니다.');
  };

  return (
    <div className="resume-apply-container">
      <div className="resume-topbar">
        <button className="resume-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> 뒤로가기
        </button>
      </div>

      <div className="resume-header">
        <div className="resume-left">
          <input
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="팀명"
            className="resume-venue-input"
          />
        </div>

      </div>

      <div className="resume-details">

        <p><strong>장르:</strong>
          <input name="genre" value={formData.genre} onChange={handleChange} placeholder="락, 재즈 등" />
        </p>

        <p><strong>인원:</strong>
          <input name="members" value={formData.members} onChange={handleChange} placeholder="3명" />
        </p>

        <p><strong>연락처:</strong>
          <input name="contact" value={formData.contact} onChange={handleChange} placeholder="010-1234-5678" />
        </p>

        <p><strong>인스타그램:</strong>
          <input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
        </p>

        <p><strong>유튜브:</strong>
          <input name="youtube" value={formData.youtube} onChange={handleChange} placeholder="https://youtube.com/..." />
        </p>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="팀소개 및 이력서를 작성하세요."
          className="resume-description"
        />

        <button className="resume-save-button" onClick={handleSave}>이력서 저장</button>
      </div>

      <hr className="resume-divider" />
    </div>
  );
};

export default PerformerResumeForm;
