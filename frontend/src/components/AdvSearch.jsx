import React, { useState } from "react";
import { FaArrowsLeftRight } from "react-icons/fa6";

const FieldsSection = () => (
  <>
    <h2 className="text-2xl font-bold">Lĩnh vực:</h2>
    {/* Line dọc ngăn cách giữa tìm kiếm và advanced search */}
    <div className="border-t-2 border-black w-[60px] my-2 mb-4"></div>

    <div className="grid grid-cols-4 gap-4 items-center">
      <label><input type="checkbox" /> Phát triển Phần mềm</label>
      <label><input type="checkbox" /> Khoa học Dữ liệu và AI</label>
      <label><input type="checkbox" /> An ninh mạng</label>
      <label><input type="checkbox" /> Kiểm thử Phần mềm</label>
      <label><input type="checkbox" /> Thiết kế Trải nghiệm và Giao diện</label>
      <label><input type="checkbox" /> DevOps và Quản lý Hạ tầng</label>
      <label><input type="checkbox" /> Quản trị Hệ thống và Mạng</label>
      <label><input type="checkbox" /> Phân tích và Tư vấn Kinh doanh</label>
      <label><input type="checkbox" /> Quản lý Dự án</label>
      <label><input type="checkbox" /> Phát triển Web</label>
      <label><input type="checkbox" /> Thực tế ảo và Tăng cường</label>
      <label><input type="checkbox" /> IoT và Kỹ thuật Điều khiển</label>
    </div>
  </>
);

const WorkMethodSection = () => (
  <>
    <h2 className="text-2xl font-bold mt-4">Phương thức làm việc:</h2>
    <div className="border-t-2 border-black w-[60px] my-2 mb-4"></div>
    <div className="grid grid-cols-5 gap-4">
      <label><input type="checkbox" name="workMethod" /> Full time</label>
      <label><input type="checkbox" name="workMethod" /> Part time</label>
      <label><input type="checkbox" name="workMethod" /> Intern</label>
      <label><input type="checkbox" name="workMethod" /> Contract</label>
      <label><input type="checkbox" name="workMethod" /> Project</label>
    </div>
  </>
);

const WorkFormSection = () => (
  <>
    <h2 className="text-2xl font-bold mt-4">Hình thức làm việc:</h2>
    <div className="border-t-2 border-black w-[60px] my-2 mb-4"></div>
    <div className="grid grid-cols-4 gap-4">
      <label><input type="checkbox" name="workForm" /> Online</label>
      <label><input type="checkbox" name="workForm" /> Offline</label>
      <label><input type="checkbox" name="workForm" /> Hybrid</label>
      <label><input type="checkbox" name="workForm" /> Onsite</label>
    </div>
  </>
);

const SalarySection = () => {
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100);

  const handleMinSalaryChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value <= maxSalary) {
      setMinSalary(value);
    }
  };

  const handleMaxSalaryChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= minSalary) {
      setMaxSalary(value);
    }
  };

  return (
    <>
      <div className="flex-column"> 
      <h2 className="text-2xl font-bold mt-4">Mức lương:</h2>
      <div className="border-t-2 border-black w-[60px] my-2 mb-4"></div>
      <div className="flex items-center gap-4">
        {/* Min Salary Input */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold">Lương tối thiểu</label>
          <input
            type="number"
            min="0"
            max="100"
            value={minSalary}
            onChange={handleMinSalaryChange}
            className="p-2 border-2 border-gray-300 rounded-lg text-center"
          />
          <span className="text-sm mt-1">
            {minSalary === 0 ? "Không lương" : `${minSalary} triệu đồng`}
          </span>
        </div>  

        <div> <FaArrowsLeftRight className="text-2xl"/> </div>        

        {/* Max Salary Input */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold">Lương tối đa</label>
          <input
            type="number"
            min="0"
            max="100"
            value={maxSalary}
            onChange={handleMaxSalaryChange}
            className="p-2 border-2 border-gray-300 rounded-lg text-center"
          />
          <span className="text-sm mt-1">
            {maxSalary === 100 ? "> 100 triệu đồng" : `${maxSalary} triệu đồng`}
          </span>
        </div>
      </div>
      </div>
    </>
  );
};

const ProvinceSelection = () => {
  const provinces = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", 
    "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", 
    "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", 
    "Hà Nam", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", 
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", 
    "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", 
    "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", 
    "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];

  // State to store selected province
  const [selectedProvince, setSelectedProvince] = useState("");

  const handleChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4">Địa điểm làm việc:</h2>
      <div className="border-t-2 border-black w-[60px] my-2 mb-4"></div>
      <select
        value={selectedProvince}
        onChange={handleChange}
        className="p-4 border-2 border-[#000000] bg-white rounded-[20px] focus:outline-none hover:bg-gray-100 transition-colors w-[200px] text-center"
      >
        <option value="">--- Chọn địa điểm ---</option>
        {provinces.map((province, index) => (
          <option key={index} value={province}>
            {province}
          </option>
        ))}
      </select>
    </div>
  );
};

const AdvSearch = ({setIsModalOpen}) => { 
  // State để kiểm tra có hiển thị component hay không

  const handleExit = () => {
    setIsModalOpen(false); 
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Tìm kiếm nâng cao</h1>
      <FieldsSection />
      <WorkMethodSection />
      <WorkFormSection />
      <div className="flex justify-center gap-[200px]"> <SalarySection /> <ProvinceSelection /> </div>
      
      
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tìm kiếm
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          onClick={handleExit}
        >
          Thoát
        </button>
      </div>
    </div>
  );
};

export default AdvSearch;
export { FieldsSection };