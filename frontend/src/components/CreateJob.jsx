import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/userContext";
import Swal from 'sweetalert2'

const filterOptions = {
  "Mức lương": ["Dưới 10 triệu", "10 - 20 triệu", "20 - 50 triệu", "Trên 50 triệu"],
  "Địa điểm": ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"],
  "Kinh nghiệm": ["Intern", "Fresher", "Junior", "Senior", "Leader", "Manager"],
  "Lĩnh vực": ["Software Engineer", "AI", "DevOps", "An ninh mạng", "Tester", "IOT", "Quản trị hệ thống và mạng", "Business Analyst"],
  "Phương thức làm việc": ["On-site", "Remote", "Hybrid", "Online", "Offline"],
  "Hình thức làm việc": ["Full-time", "Part-time", "Freelance", "Contract", "Project"]
};

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    salary: "",
    address: "",
    category: {}
  });

  const [errors, setErrors] = useState({});
  //const { userInfo, token } = useContext(UserContext);
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const API_URL = 'https://it-job-search-be.vercel.app';

  // Xử lý thay đổi input
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updatedCategory = { ...prev.category, [field]: value };

      let updatedData = { ...prev, category: updatedCategory };

      // Nếu là mức lương -> lưu vào salary
      if (field === "Mức lương") {
        updatedData.salary = value;
      }

      // Nếu là địa điểm -> lưu vào address
      if (field === "Địa điểm") {
        updatedData.address = value;
      }

      return updatedData;
    });

    // Xóa lỗi khi nhập đúng
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? "" : prevErrors[field]
    }));
  };

  // Kiểm tra lỗi
  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.content.trim()) newErrors.content = "Nội dung không được để trống";

    // Kiểm tra xem có đủ tất cả danh mục trong category không
    Object.keys(filterOptions).forEach((key) => {
      if (!formData.category[key]) {
        newErrors[key] = `Vui lòng chọn ${key.toLowerCase()}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        category: Object.values(formData.category), // Lấy danh sách các giá trị trong category
        user_id: userInfo._id
      };
  
      const response = await axios.post(`${API_URL}/recruiter/createPost`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đăng công việc thành công!",
          showConfirmButton: false,
          timer: 1500
        });
  
        navigate("/recruiter");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Có lỗi xảy ra, vui lòng thử lại!",
        showConfirmButton: true
      });
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div className="w-[90%] m-auto mb-10">
      <h1 className="text-2xl font-bold mt-5">Chi tiết công việc</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5 p-5 border-2 border-black rounded-lg">
        
        {/* Tiêu đề */}
        <input
          type="text"
          placeholder="Tiêu đề công việc"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        {/* Nội dung */}
        <textarea
          placeholder="Nhập nội dung chi tiết công việc"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="border p-2 rounded"
        />
        {errors.content && <p className="text-red-500">{errors.content}</p>}

        {/* Các lựa chọn */}
        {Object.entries(filterOptions).map(([category, options]) => (
          <div key={category} className="flex flex-col gap-2">
            <label className="font-bold">{category}:</label>
            <select
              value={formData.category[category] || ""}
              onChange={(e) => handleChange(category, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Chọn {category.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors[category] && <p className="text-red-500">{errors[category]}</p>}
          </div>
        ))}

        {/* Nút Submit */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Đăng công việc</button>
      </form>
    </div>
  );
};

export default CreateJob;
