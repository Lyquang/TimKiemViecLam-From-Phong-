import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { SingleJob } from './JobHome';
import axios from 'axios';

const Job = () => {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");
  const API_URL = 'https://it-job-search-be.vercel.app';

  const fetchJobs = async () => {
    try {
      if (!userInfo || !token) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      if (userInfo.role !== "recruiter") {
        setError({ message: "Bạn không có quyền truy cập trang này." });
        setLoading(false);
        navigate('/');
        return;
      }

      setLoading(true);
      const response = await axios.get(`${API_URL}/recruiter/viewOwnPost`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setJobs(response.data.posts);
      } else {
        setError({ message: response.data.message || "Không tìm thấy bài đăng." });
      }
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSort = (criteria) => {
    setSelectedSort(criteria);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
    let sortedJobs = [...jobs];

    switch (criteria) {
      case 'salary':
        sortedJobs.sort((a, b) => {
          const salaryOrder = {
            "Dưới 10 triệu": 1,
            "10 - 20 triệu": 2,
            "20 - 50 triệu": 3,
            "Trên 50 triệu": 4
          };
          return salaryOrder[b.salary] - salaryOrder[a.salary];
        });
        break;
      case 'title':
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setJobs(sortedJobs);
  };

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
      <Search jobs={jobs} />
      <div className='TitleJobsection text-[30px] flex mt-5 mb-3 justify-between items-center'>
        <span>Công việc của bạn</span>
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

      <div className="sortjob flex gap-10 mt-5">
        <span className="text-2xl">Ưu tiên hiển thị theo:</span>
        {['salary', 'title'].map((criteria) => (
          <div
            key={criteria}
            className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${selectedSort === criteria ? 'bg-blue-100' : ''}`}
            onClick={() => handleSort(criteria)}
          >
            <div className={`w-4 h-4 border-2 rounded-full mr-2 ${selectedSort === criteria ? 'bg-blue-600' : 'bg-white border-gray-400'}`}></div>
            <span> {criteria === 'salary' ? 'Lương' : 'Tên công việc'} </span>
          </div>
        ))}
      </div>

      <div className='jobContainer flex gap-10 justify-center flex-wrap items-center py-5'>
        {loading ? (
          <p>Đang tải công việc...</p>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : Array.isArray(currentJobs) && currentJobs.length > 0 ? (
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
          <p>Không có công việc nào.</p>
        )}
      </div>
    </div>
  );
};

export default Job;