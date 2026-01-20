import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const Candidate = () => {
  const [items, setItems] = useState([]);
  const [inputValues, setInputValues] = useState({ name: "", cv: "" });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const API_URL = 'https://it-job-search-be.vercel.app';

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        const response = await axios.get(
          `${API_URL}/recruiter/viewAllCV`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedItems = response.data.data.map((app) => ({
          _id: app._id,
          name: app.applicant_id?.userName || "N/A",
          cv: app.cv,
          job_id: app.job_id || null,
          job_name: app.job_name || "N/A",
          status: app.status === "accepted"
            ? "Đã chấp nhận"
            : app.status === "rejected"
            ? "Đã từ chối"
            : "Chưa xem",
        }));
        setItems(fetchedItems);
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách CV!",
        });
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const addItem = () => {
    if (inputValues.name.trim() !== "" && inputValues.cv.trim() !== "") {
      setItems([...items, { ...inputValues, status: "Chưa xem" }]);
      setInputValues({ name: "", cv: "" });
    }
  };

  const removeItem = async (index) => {
    const item = items[index];
    if (item._id) {
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        await axios.post(
          `${API_URL}/recruiter/deleteCVRec/${item._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(items.filter((_, i) => i !== index));
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đơn ứng tuyển đã được xóa!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Có lỗi xảy ra khi xóa đơn ứng tuyển!",
        });
      }
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleStatusChange = async (index, newStatus) => {
    const item = items[index];
    const updatedItems = [...items];
    
    if (item._id) {
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        const endpoint =
          newStatus === "Đồng ý"
            ? `/recruiter/acceptApplication/${item._id}`
            : `/recruiter/rejectApplication/${item._id}`;
        await axios.post(
          `${API_URL}${endpoint}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updatedItems[index].status = newStatus === "Đồng ý" ? "Đã chấp nhận" : "Đã từ chối";
        setItems(updatedItems);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Ứng viên đã được ${newStatus === "Đồng ý" ? "chấp nhận" : "từ chối"}!`,
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!",
        });
      }
    } else {
      updatedItems[index].status = newStatus;
      setItems(updatedItems);
    }
  };

  const handleViewCV = (index, cv) => {
    if (cv) {
      window.open(cv, "_blank"); // Open CV URL in new tab
      const updatedItems = [...items];
      if (updatedItems[index].status === "Chưa xem") {
        updatedItems[index].status = "Đã xem";
        setItems(updatedItems);
      }
    }
  };

  const handleJobClick = (job_id) => {
    if (job_id) {
      navigate(`/jobDetail/${job_id}`);
    }
  };

  const columns = [
    { label: "Tên người ứng tuyển", key: "name" },
    { label: "Công việc ứng tuyển", key: "job_name" },
    { label: "CV người ứng tuyển", key: "cv" },
    { label: "Trạng thái", key: "status" },
    { label: "Quyết định", key: "action" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 shadow-md rounded-lg p-8 w-full max-w-7xl m-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Danh Sách</h1>
        {loading ? (
          <p className="text-center text-lg">Đang tải...</p>
        ) : (
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="border border-gray-300 px-8 py-4 text-lg"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="border border-gray-300 px-8 py-4 text-lg">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="odd:bg-gray-100 even:bg-white"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="border border-gray-300 px-8 py-4 text-lg"
                    >
                      {column.key === "job_name" ? (
                        item.job_id ? (
                          <button
                            onClick={() => handleJobClick(item.job_id)}
                            className="text-blue-600 hover:underline"
                            title={item.job_name}
                          >
                            {item.job_name}
                          </button>
                        ) : (
                          item.job_name
                        )
                      ) : column.key === "cv" ? (
                        <button
                          onClick={() => handleViewCV(index, item.cv)}
                          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                          disabled={!item.cv}
                        >
                          Xem CV
                        </button>
                      ) : column.key === "action" ? (
                        item.status !== "Đã chấp nhận" &&
                        item.status !== "Đã từ chối" ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(index, "Đồng ý")}
                              className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 ml-4"
                            >
                              Đồng ý
                            </button>
                            <button
                              onClick={() => handleStatusChange(index, "Từ chối")}
                              className="bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 ml-4"
                            >
                              Từ chối
                            </button>
                          </>
                        ) : null
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-8 py-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Candidate;