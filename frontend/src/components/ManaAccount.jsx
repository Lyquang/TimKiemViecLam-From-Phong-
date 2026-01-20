import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import deleteIcon from "../assets/Vector.svg";
import { useNavigate } from "react-router-dom";

const ManaAccount = () => {
    const navigate = useNavigate();
    const [roleFilter, setRoleFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [listAccount, setListAccount] = useState([]);
    const token = localStorage.getItem("TOKEN");
    const API_URL = 'https://it-job-search-be.vercel.app';

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim().toLowerCase());
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchListAccount = async () => {
            try {
                Swal.fire({
                    title: 'Đang tải dữ liệu...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                const response = await axios.get(`${API_URL}/admin/viewAllUser`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {
                    const data = response.data.data;
                    setListAccount(data);
                    Swal.close();
                } else {
                    Swal.fire("Lỗi", "Không thể tải dữ liệu người dùng", "error");
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi kết nối máy chủ", "error");
            }
        };

        fetchListAccount();
    }, []);

    const filteredRows = listAccount.filter((listAccount) => {
        const matchesRole =
            roleFilter === "all" ? true : listAccount.role === roleFilter;

        const matchesSearch =
            listAccount.userName.toLowerCase().includes(debouncedSearch) ||
            listAccount.email.toLowerCase().includes(debouncedSearch);

        return matchesRole && matchesSearch;
    });

    const handleRole = (role) => {
        switch (role) {
            case "jobseeker":
                return "Ứng viên";
            case "recruiter":
                return "Nhà tuyển dụng";
            case "admin":
                return "Quản trị viên";
            default:
                return role;
        }
    };

    const handleNaviAddRecuiter = () => {
        navigate("/admin/addRecuiter");
    };

    const handleDelete = async (email) => {
        const data = {
            userEmail: email
        };
        const result = await Swal.fire({
            title: "Bạn có chắc muốn xóa?",
            text: "Thao tác này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${API_URL}/admin/deleteUser`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {
                    Swal.fire("Thành công", "Xóa người dùng thành công", "success");
                    setListAccount((prevList) => prevList.filter((user) => user.userEmail !== email));
                } else {
                    Swal.fire("Lỗi", "Không thể xóa người dùng", "error");
                }
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa người dùng", "error");
            }
        }
    };

    return (
        <div className="py-6 px-[40px] mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[40px] font-bold mb-4">Quản lý người dùng</h1>
                <button onClick={handleNaviAddRecuiter} className="text-[20px] ">Thêm nhà tuyển dụng</button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md mr-4"
                />
            </div>

            <div className="flex items-center mb-6 gap-[30px]">
                <div className="text-[32px]">Tìm kiếm theo</div>
                <div className="flex items-center space-x-4">
                    <label className="text-[32px] flex items-center">
                        <input
                            type="radio"
                            name="role"
                            value="jobseeker"
                            checked={roleFilter === "jobseeker"}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="mr-2"
                        />
                        Ứng viên
                    </label>
                    <label className="text-[32px] flex items-center">
                        <input
                            type="radio"
                            name="role"
                            value="recruiter"
                            checked={roleFilter === "recruiter"}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="mr-2"
                        />
                        Nhà tuyển dụng
                    </label>
                    <label className="text-[32px] flex items-center">
                        <input
                            type="radio"
                            name="role"
                            value="all"
                            checked={roleFilter === "all"}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="mr-2"
                        />
                        Tất cả
                    </label>
                </div>
            </div>

            {/* Table */}
            <div className=" max-h-[500px] overflow-y-auto  border border-gray-300">
                <table className="min-w-full ">
                    <thead className="sticky top-0 border-y border-gray-500">
                        <tr className="bg-gray-100  ">
                            <th className="h-[50px] ">TÊN</th>
                            <th className="h-[50px] ">EMAIL</th>
                            <th className="h-[50px] ">VAI TRÒ</th>
                            <th className="h-[50px] ">ĐỊA CHỈ</th>
                            <th className="h-[50px] ">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.length === 0 ? (
                            <tr className="">
                                <td colSpan="7" className="h-[45px] text-center p-4 text-gray-500">
                                    Không tìm thấy người dùng phù hợp.
                                </td>
                            </tr>
                        ) : (
                            filteredRows.map((row, index) => (
                                <tr key={index} className="  border-y border-gray-300 hover:bg-gray-50">
                                    <td className="h-[45px] text-center">
                                        {row.userName}
                                    </td>
                                    <td className="h-[45px] text-center">{row.userEmail}</td>
                                    <td className="h-[45px] text-center">{handleRole(row.role)}</td>
                                    <td className="h-[45px] text-center">{row.address}</td>
                                    <td onClick={() => handleDelete(row.userEmail)} className="h-[45px] flex justify-center items-center cursor-pointer">
                                        <img className="h-[30px] " src={deleteIcon} alt="delete" />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManaAccount;