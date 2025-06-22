// src/pages/business/BusinessSignup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessSignup.css';

const BusinessSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    password: '',
    companyName: '',
    venueName: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { id, password, companyName, venueName, phone } = form;

    if (!id || !password || !companyName || !venueName || !phone) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('businessUsers') || '[]');
    const isDuplicate = existingUsers.some(user => user.id === id);
    if (isDuplicate) {
      alert('이미 존재하는 아이디입니다.');
      return;
    }

    const updatedUsers = [...existingUsers, form];
    localStorage.setItem('businessUsers', JSON.stringify(updatedUsers));

    localStorage.setItem('user', JSON.stringify({ ...form, type: 'business' }));

    alert('회원가입이 완료되었습니다.');
    navigate('/login', { state: { type: 'business' } });
  };

  return (
    <div className="signup-container">

      <label className="signup-label">아이디</label>
      <input
        type="text"
        name="id"
        className="signup-input"
        value={form.id}
        onChange={handleChange}
        placeholder="아이디 입력"
      />

      <label className="signup-label">비밀번호</label>
      <input
        type="password"
        name="password"
        className="signup-input"
        value={form.password}
        onChange={handleChange}
        placeholder="비밀번호 입력"
      />

      <label className="signup-label">사업자명</label>
      <input
        type="text"
        name="companyName"
        className="signup-input"
        value={form.companyName}
        onChange={handleChange}
        placeholder="사업자명 입력"
      />

      <label className="signup-label">공연장 이름</label>
      <input
        type="text"
        name="venueName"
        className="signup-input"
        value={form.venueName}
        onChange={handleChange}
        placeholder="공연장 이름 입력"
      />

      <label className="signup-label">전화번호</label>
      <input
        type="tel"
        name="phone"
        className="signup-input"
        value={form.phone}
        onChange={handleChange}
        placeholder="전화번호 입력"
      />

      <button className="signup-button" onClick={handleSubmit}>
        회원가입
      </button>
    </div>
  );
};

export default BusinessSignup;