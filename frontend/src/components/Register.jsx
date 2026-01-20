import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dayofBirth: "",
    address: "",
    role: "jobseeker",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = 'https://it-job-search-be.vercel.app';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra các trường bắt buộc
    if (Object.values(formData).some((value) => value === "" || (typeof value === "boolean" && !value))) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Mật khẩu xác nhận không khớp!",
      });
      return;
    }

    // Kiểm tra điều khoản dịch vụ
    if (!formData.agree) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bạn phải đồng ý với điều khoản dịch vụ trước khi đăng ký!",
      });
      return;
    }

    // Kiểm tra CAPTCHA
    if (captchaInput !== captcha) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "CAPTCHA không hợp lệ, vui lòng thử lại!",
      });
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        userName: formData.name,
        userEmail: formData.email,
        address: formData.address,
        dayofBirth: formData.dayofBirth,
        password: formData.password,
        role: "jobseeker"
      });

      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đăng ký thành công! Vui lòng đăng nhập",
          showConfirmButton: false,
          timer: 1500
        });
        navigate("/login");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex w-[900px] m-10">
        {/* Phần Form */}
        <div className="flex-1 pr-8">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ WebkitTextStroke: "0.25px black" }}>Tìm việc</h1>
          <p className="text-xl mb-6">đi bé ơi, sắp ra trường tới nơi</p>
          <h2 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email (xxxxx@gmail.com)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="dayofBirth"
              placeholder="Ngày tháng năm sinh (DD/MM/YYYY)"
              value={formData.dayofBirth}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
              />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-600">
                Tôi đã đọc và đồng ý với
                <a href="/terms" className="text-blue-500 hover:underline mx-1" target="_blank" rel="noopener noreferrer">
                  Điều khoản dịch vụ
                </a>
                và
                <a href="/privacy" className="text-blue-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  Chính sách bảo mật
                </a>
                của ITJOBSearch.
              </label>
            </div>
            {/* CAPTCHA Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-between bg-gray-200 rounded-md px-4 py-2 w-full">
                <span className="font-mono text-xl font-bold tracking-widest text-gray-800 select-none">{captcha}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(generateCaptcha());
                    setCaptchaInput("");
                  }}
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all"
                  title="Refresh CAPTCHA"
                >
                  ↻
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Nhập CAPTCHA"
                className="w-full rounded-md border px-3 py-2 text-center text-lg font-semibold tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Đăng ký
            </button>
          </form>
        </div>
        {/* Phần Ảnh */}
        <div className="flex-1 flex items-center justify-center">
          <img src="./register.png" alt="Đăng ký" className="max-w-full max-h-full object-contain rounded-3xl border" />
        </div>
      </div>
    </div>
  );
};

export default Register;