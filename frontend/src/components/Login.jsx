import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hideEye from "../assets/hideEye.svg";
import Eye from "../assets/eye.svg";
import { UserContext } from "../userContext/userContext";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(UserContext);
  const API_URL = 'https://it-job-search-be.vercel.app';

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu!");
      return;
    }

    if (role === "") {
      setError("Vui lòng chọn vai trò của bạn!");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    try {
      // Hiển thị loading
      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${API_URL}/auth/login`, {
        userEmail: email,
        password: password,
        role: role,
      });

      if (response.data.success) {
        const { accessToken, user } = response.data.data;

        // Gọi hàm login từ context
        login(user, accessToken);

        const rolene = JSON.parse(localStorage.getItem("USER"));
        if (rolene.role.includes('admin')) {
          localStorage.setItem("ROLE", 'admin');
          navigate('/admin');
        } else if (rolene.role.includes('recruiter')) {
          localStorage.setItem("ROLE", 'recruiter');
          navigate('/recruiter');
        } else if (rolene.role.includes('jobseeker')) {
          localStorage.setItem("ROLE", 'jobseeker');
          navigate('/jobseeker');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi! Vui lòng thử lại sau.',
            timer: 3000,
            position: 'top-right',
          });
        }
      }
      // Đóng loading khi hoàn thành (thành công hoặc lỗi)
      Swal.close();
    } catch (err) {
      Swal.close(); // Đóng loading khi có lỗi
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-3xl shadow-lg flex w-[900px] h-[500px]">
          <div className="flex-1 pr-8">
            <h1 className="text-5xl font-bold text-white mb-2" style={{ WebkitTextStroke: "0.25px black" }}>Tìm việc</h1>
            <p className="text-xl mb-6">đi bé ơi, sắp ra trường tới nơi</p>
            <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                name="email"
                placeholder="Email (xxxxx@gmail.com)"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  className="w-full p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img
                  className="absolute top-[30%] right-[10px]"
                  src={showPassword ? Eye : hideEye}
                  onClick={handleShowPassword}
                  alt=""
                />
              </div>
              <select
                className="w-full p-2 border rounded bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Chọn vai trò</option>
                <option value="jobseeker">Người tìm việc</option>
                <option value="recruiter">Nhà tuyển dụng</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <button type="submit" className="w-full bg-black text-white py-2 rounded">Đăng nhập</button>
            </form>
          </div>
          <div className="flex-1">
            <img src="./login.jpg" alt="Đăng nhập" className="w-full h-full object-cover rounded-3xl border" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;