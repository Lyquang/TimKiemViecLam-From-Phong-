import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [CVProfile, setCVProfile] = useState([]);
  const API_URL = 'https://it-job-search-be.vercel.app';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn một tệp CV để tải lên.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("cv", selectedFile);
    handleUploadSuccess(formData);
  };

  const handleUploadSuccess = async (formData) => {
    try {
      const token = localStorage.getItem("TOKEN");

      // Hiển thị loading
      Swal.fire({
        title: "Đang tải lên CV...",
        text: "Vui lòng đợi trong giây lát.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${API_URL}/jobseeker/addCV`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.statusText === "OK") {
        Swal.fire({
          icon: "success",
          title: "Thêm CV thành công!",
          showConfirmButton: false,
          timer: 3000,
        });
        // Làm mới danh sách CV
        await fetchCV();
        setSelectedFile(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Upload thất bại.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err?.response?.data?.message || "Có lỗi xảy ra khi thêm CV.",
      });
    }
  };

  const fetchCV = async () => {
    const token = localStorage.getItem("TOKEN");

    try {
      const response = await axios.get(`${API_URL}/jobseeker/getAllCV`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const cvData = Array.isArray(response.data.data) ? response.data.data : [];
        setCVProfile(cvData);
      } else {
        setCVProfile([]);
        setError("Không thể tải danh sách CV.");
      }
    } catch (err) {
      setCVProfile([]);
      setError(err.response?.data?.message || "Truy cập dữ liệu thất bại!");
    }
  };

  useEffect(() => {
    if (userInfo?.role === "jobseeker") {
      fetchCV();
    }
  }, []);

  const handleDeleteCV = (cvId) => {
    Swal.fire({
      title: "Bạn muốn xóa CV này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, xóa nó!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("TOKEN");
          const response = await axios.post(
            `${API_URL}/jobseeker/removeCV`,
            { cvId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            Swal.fire({
              title: "Đã xóa!",
              text: "CV của bạn đã được xóa.",
              icon: "success",
            });
            // Làm mới danh sách CV
            await fetchCV();
          } else {
            throw new Error("Xóa không thành công");
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: err?.response?.data?.message || "Có lỗi xảy ra khi xóa CV.",
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col w-full items-center text-[#3C3C3C] border-[#00000000] gap-10 mb-10">
      <h1 className="text-[32px] font-bold mt-8 text-center">
        Thông Tin Tài Khoản
      </h1>
      <div className="flex flex-col w-[600px] gap-4">
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Họ và tên:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.userName || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Email:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.userEmail || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Vai trò:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.role || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Địa chỉ:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.address || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Ngày sinh:</label>
          <div className="p-4 border-2 rounded-md">
            {userInfo.BoD ? new Date(userInfo.BoD).toLocaleDateString() : "Chưa cập nhật"}
          </div>
        </div>
      </div>

      {userInfo?.role === "jobseeker" && (
        <>
          {/* CV Profile */}
          <div className="flex flex-col w-[600px] gap-4">
            <h2 className="font-bold text-[20px]">Thông tin CV:</h2>
            {CVProfile && CVProfile.length > 0 ? (
              CVProfile.map((cv) => (
                <div key={cv._id} className="flex flex-col gap-2 border p-4 rounded-md">
                  <p className="font-semibold">Tên CV: {cv?.cvName || "Chưa có tên CV"}</p>
                  <p className="font-semibold">ID: {cv?._id}</p>
                  <div className="flex gap-4">
                    <a
                      className="text-blue-500 underline"
                      href={cv.cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem CV
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteCV(cv._id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Xóa CV
                  </button>
                </div>
              ))
            ) : (
              <p>Chưa có CV nào được tải lên.</p>
            )}
          </div>

          {/* Upload CV */}
          <div className="flex flex-col w-[600px] gap-4">
            <h2 className="font-bold text-[20px]">Tải lên CV mới:</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-2 border rounded-md p-2"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Tải lên
            </button>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="text-red-500 mt-4">
              Lỗi: {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;