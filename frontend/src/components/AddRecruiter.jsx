import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import hideEye from "../assets/hideEye.svg";
import Eye from "../assets/eye.svg";

const AddRecuiter = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('USER'));
  const token = localStorage.getItem('TOKEN');
  const API_URL = 'https://it-job-search-be.vercel.app';

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    password: '',
    passwordAgain: '',
    dayofBirth: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin' || !token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Bạn không có quyền truy cập trang này.',
      }).then(() => {
        navigate('/');
      });
    }
  }, [userInfo, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPasswordAgain = () => {
    setShowPasswordAgain(!showPasswordAgain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formData.userName || !formData.userEmail || !formData.password || !formData.passwordAgain || !formData.dayofBirth || !formData.address) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.passwordAgain) {
      setError('Mật khẩu và mật khẩu nhập lại không khớp.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      setError('Email không hợp lệ.');
      return;
    }

    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dobRegex.test(formData.dayofBirth)) {
      setError('Ngày sinh phải có định dạng DD/MM/YYYY.');
      return;
    }

    try {
      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${API_URL}/admin/addRecruiter`,
        {
          userName: formData.userName,
          userEmail: formData.userEmail,
          password: formData.password,
          dayofBirth: formData.dayofBirth,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201 && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm nhà tuyển dụng thành công!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/admin/homepage');
        });
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhà tuyển dụng:', error);
      const message =
        error.response?.status === 400
          ? error.response.data.message || 'Email đã tồn tại.'
          : 'Đã xảy ra lỗi khi thêm nhà tuyển dụng.';
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: message,
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/homepage');
  };

  return (
    <div className="py-6 px-[40px] mt-2 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[40px] font-bold text-center flex-1">Đăng ký tài khoản cho nhà tuyển dụng</h1>
        <button
          onClick={handleCancel}
          className="text-[18px] text-blue-500 hover:text-blue-700"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {error && <p className="text-red-500 text-center mb-4 text-[20px]">{error}</p>}

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Tên công ty</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Nhập tên công ty"
            className="flex-1 p-3 border border-gray-300 rounded-md text-[16px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Email</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="Nhập email"
            className="flex-1 p-3 border border-gray-300 rounded-md text-[16px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Mật khẩu</label>
          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md text-[16px]"
            />
            <img
              className="absolute top-[30%] right-[10px]"
              src={showPassword ? Eye : hideEye}
              onClick={handleShowPassword}
              alt=""
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Nhập lại mật khẩu</label>
          <div className="relative flex-1">
            <input
              type={showPasswordAgain ? "text" : "password"}
              name="passwordAgain"
              value={formData.passwordAgain}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-md text-[16px]"
            />
            <img
              className="absolute top-[30%] right-[10px]"
              src={showPasswordAgain ? Eye : hideEye}
              onClick={handleShowPasswordAgain}
              alt=""
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Ngày sinh</label>
          <input
            type="text"
            name="dayofBirth"
            value={formData.dayofBirth}
            onChange={handleChange}
            placeholder="DD/MM/YYYY"
            className="flex-1 p-3 border border-gray-300 rounded-md text-[16px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-[20px] w-1/4 text-right">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ (huyện, tỉnh)"
            className="flex-1 p-3 border border-gray-300 rounded-md text-[16px]"
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-md text-[18px] hover:bg-gray-800"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecuiter;