import React from "react";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-800 text-white">
      <div className="footer p-10 rounded-lg">
        <div className="flex flex-wrap justify-between items-start w-[90%] mx-auto gap-10">
          {/* Logo và Giới thiệu */}
          <div className="w-[15em]">
            <h1 className="text-2xl font-bold pb-4">
              <span className="text-blue-400">ITJOB</span>
              <span className="text-yellow-400">Search</span>
            </h1>
            <p className="text-sm opacity-70 leading-6">
              Chúng tôi kết nối các doanh nghiệp với những tài năng IT, giúp tạo
              ra cơ hội nghề nghiệp bền vững.
            </p>
          </div>

          {/* Danh mục */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Company",
                items: ["About us", "Features", "News", "FAQ"],
              },
              {
                title: "Resources",
                items: ["Account", "Support Center", "Feedback", "Headquarters"],
              },
              {
                title: "Support",
                items: ["Events", "Promo", "Request Demo", "Careers"],
              },
              {
                title: "Contact Info",
                items: ["itjobsearch@hcmut.edu.vn"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold pb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mạng xã hội */}
          <div className="flex gap-4">
            {[FaLinkedin, FaFacebook, FaTiktok].map((Icon, index) => (
              <Icon
                key={index}
                className="bg-white p-2 h-10 w-10 rounded-full text-black transition-transform transform hover:scale-110 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer dưới cùng */}
      <div className="text-center py-4 bg-gray-900 text-gray-400 text-sm">
        © 2025 IT Job Search. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
