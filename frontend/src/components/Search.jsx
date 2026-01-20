import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import AdvSearch from './AdvSearch';

const jobs = [
  { id: 1, name: "Kỹ sư phần mềm" },
  { id: 2, name: "Nhân viên kinh doanh" },
  { id: 3, name: "Thiết kế đồ họa" },
  { id: 4, name: "Quản lý dự án" },
  { id: 5, name: "Chuyên viên marketing" }
];

const Search = () => {
  const [inputValue, setInputValue] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Lọc công việc theo inputValue
  const filteredJobs = jobs.filter(job =>
    job.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className='searchDiv grid gp-10 bg-greyIsh rounded-[30px] p-[1rem] w-[90%] m-auto'>
      <div className='firstDiv flex justify-between items-center rounded-[30px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700'>
        {/* Tìm kiếm nâng cao */}
        <div className="advancedSearch flex flex-col items-center justify-center bg-black rounded-[30px] text-center text-white p-2 w-[130px] cursor-pointer hover:bg-gray-500">
          <button onClick={toggleModal}>Tìm kiếm nâng cao</button>
        </div>

        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleModal}></div>
            <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 opacity-100">
              <AdvSearch setIsModalOpen={setIsModalOpen} />
            </div>
          </>
        )}

        {/* Line dọc ngăn cách */}
        <div className='border-l-2 border-black h-[40px] mx-2'></div>

        {/* Ô nhập tìm kiếm */}
        <div className='inputDiv flex items-center w-full border-2 border-black rounded-[20px]'>
          <input 
            type='text' 
            className='bg-transparent focus:outline-none w-full p-2' 
            placeholder='Tìm kiếm công việc'
            value={inputValue}
            onChange={handleChange}
          />
          {inputValue && (
            <AiOutlineCloseCircle 
              className='text-[30px] flex-grow mr-[0.5rem] text-[#a5a6a6] hover:text-textColor cursor-pointer'
              onClick={handleClear}
            />
          )}
        </div>

        {/* Nút tìm kiếm */}
        <div className='iconDiv flex items-center justify-center w-[50px] h-[40px] bg-black rounded-full cursor-pointer hover:bg-gray-500'>
          <AiOutlineSearch className='text-white text-[20px]' />
        </div>
      </div>

      {/* Kết quả tìm kiếm */}
      {inputValue && (
        <div className="results bg-white mt-3 p-3 rounded-[10px] shadow-lg">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-200">
                {job.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không tìm thấy công việc phù hợp</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
