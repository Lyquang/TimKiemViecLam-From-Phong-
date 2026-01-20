import React, { useState, useEffect, useContext } from 'react';
import { IoHeartCircleOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { IoHeartCircle } from "react-icons/io5";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import axios from 'axios';
import logo1 from '/company/vnglogo.png';

const SingleJob = ({ id, title, salary, address, category, user_id, companyName }) => {
  const [isHoveredLove, setIsHoveredLove] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");

  const handleJobClick = (id) => {
    if (userInfo.role === "jobseeker") {
      navigate(`/jobseeker/jobDetail/${id}`);
    } else {
      navigate(`/recruiter/jobDetail/${id}`);
    }
  };

  return (
    <div
      className="singleJob w-[280px] h-auto p-[15px] bg-white rounded-[20px] border border-black cursor-pointer shadow-[4px_4px_6px_rgba(0,_0,_0,_0.3)]"
      onClick={() => handleJobClick(id)}
    >
      <div className="com_top flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span
          className="text-xl"
          onMouseEnter={() => setIsHoveredLove(true)}
          onMouseLeave={() => setIsHoveredLove(false)}
        >
          {isHoveredLove ? <IoHeartCircle /> : <IoHeartCircleOutline />}
        </span>
      </div>

      <div className="com_bot flex items-center">
        <div className="w-[60px] h-[60px] mr-2">
          <img src={logo1} alt="Company Logo" className="w-full h-full object-contain" />
        </div>
        <div className="border-l-2 border-gray-500 h-[60px] mx-2"></div>
        <div className="com_right ml-2">
          <div className='text-left'> 
            <p className='text-sm font-medium mb-1 text-gray-500'>{companyName}</p>
          </div> 
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium"><RiMoneyDollarCircleLine /></span>
            <p className="text-sm ml-2">{salary}</p>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium"><IoLocationOutline /></span>
            <p className="text-sm ml-2"> {address} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobHome = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");
  const API_URL = 'https://it-job-search-be.vercel.app';
  const location = useLocation();

  const filters = ["Kinh nghiệm", "Địa điểm", "Mức lương", "Lĩnh vực", "Phương thức làm việc", "Hình thức làm việc"];

  const filterOptions = {
    "Kinh nghiệm": ["Intern", "Fresher", "Junior", "Senior", "Leader", "Manager"],
    "Địa điểm": ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"],
    "Mức lương": ["Dưới 10 triệu", "10 - 20 triệu", "20 - 50 triệu", "Trên 50 triệu"],
    "Lĩnh vực": ["Software Engineer", "AI", "DevOps", "An ninh mạng", "Tester", "IOT", "Quản trị hệ thống và mạng", "Business Analyst"],
    "Phương thức làm việc": ["On-site", "Remote", "Hybrid", "Online", "Offline"],
    "Hình thức làm việc": ["Full-time", "Part-time", "Freelance", "Contract", "Project"]
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowOptions(true);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => {
      let newSelected;
      if (prev.includes(option)) {
        newSelected = prev.filter((item) => item !== option);
      } else {
        newSelected = [...prev, option];
      }
      setCurrentPage(1); // Reset về trang 1 khi thay đổi lựa chọn
      return newSelected;
    });
  };

  const handleCloseFilter = () => {
    setSelectedFilter('');
    setShowOptions(false);
    setSelectedOptions([]);
    setCurrentPage(1); // Reset về trang 1 khi đóng bộ lọc
  };

  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  const fetchJobsByCategory = async (categories) => {
    try {
      if (!userInfo) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      if (categories.length === 0) {
        fetchJobs();
        return;
      }

      setLoading(true);
      const endpoint =
        userInfo.role === "jobseeker"
          ? `${API_URL}/jobseeker/viewPostsByCategory/${categories.join(",")}`
          : `${API_URL}/recruiter/viewPostsByCategory/${categories.join(",")}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data?.data || []);
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      if (!userInfo) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await axios.get(
        userInfo.role === "jobseeker"
          ? `${API_URL}/jobseeker/viewAllPosts`
          : `${API_URL}/recruiter/viewAllPosts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data?.data || []);
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedOptions || selectedOptions.length === 0) {
      fetchJobs();
    } else {
      fetchJobsByCategory(selectedOptions);
    }
  }, [selectedOptions]);

  // Tính toán phân trang
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className='w-[90%] m-auto'>
      <div className='TitleJobsection text-[30px] flex mt-5 justify-between items-center'>
        <span>Các công việc hiện tại</span>
        <span className='Dieuhuong flex items-center gap-3'>
          <div
            className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseEnter={() => currentPage !== 1 && setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
            onClick={handlePrevPage}
          >
            {hoverLeft && currentPage !== 1 ? <IoIosArrowDropleftCircle /> : <IoIosArrowDropleft />}
          </div>
          <span className="text-lg">
            Trang {currentPage}/{totalPages}
          </span>
          <div
            className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseEnter={() => currentPage !== totalPages && setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
            onClick={handleNextPage}
          >
            {hoverRight && currentPage !== totalPages ? <IoIosArrowDroprightCircle /> : <IoIosArrowDropright />}
          </div>
        </span>
      </div>

      <div className="Filter-Total">
        <div className="filter-container text-[30px] flex mt-5 justify-between items-center w-full border-2 border-black rounded-[20px] p-3">
          <li className="filter-list p-2 text-[25px]">Lọc theo:</li>
          {filters.map((filter, index) => (
            <li
              key={index}
              className="filter-list hover:text-blue-500 p-2 text-[25px] cursor-pointer"
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </li>
          ))}
        </div>

        {showOptions && selectedFilter && (
          <div className="filter-container flex items-center justify-between mt-3">
            <div className="flex items-center">
              <li className="filter-list p-2 text-[25px]">Lọc theo:</li>
              <li className="filter-list p-2 text-[25px]">{selectedFilter}</li>
              <AiOutlineCloseCircle
                className="cursor-pointer text-red-500 text-[15px]"
                onClick={handleCloseFilter}
              />
            </div>
            <div className="overflow-x-auto flex space-x-3 py-2">
              {filterOptions[selectedFilter].map((option, index) => (
                <div
                  key={index}
                  className={`filter-option p-2 cursor-pointer text-[19px] rounded-[20px] border-2 ${selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='jobContainer flex gap-10 justify-center flex-wrap items-center py-5'>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          error === "No posts found in these categories" ? (
            <div>Không có công việc phù hợp</div>
          ) : (
            <div className="text-red-500">Có lỗi khi lấy dữ liệu</div>
          )
        ) : currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <SingleJob
              key={job._id}
              id={job._id}
              title={job.title}
              content={job.content}
              salary={job.salary}
              address={job.address}
              category={job.category}
              user_id={job.user_id}
              companyName={job.companyName}
            />
          ))
        ) : (
          <div>Không có công việc phù hợp</div>
        )}
      </div>
    </div>
  );
};

export default JobHome;
export { SingleJob };