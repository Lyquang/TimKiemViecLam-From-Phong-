import React, { useState, useEffect } from "react";
import axios from "axios";

const State = () => {
  const [appliedArticles, setAppliedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://it-job-search-be.vercel.app';

  const statusStates = [
    { text: "Đã xem", bgColor: "bg-yellow-400", textColor: "text-white" },
    { text: "Chưa xem", bgColor: "bg-white", textColor: "text-black" },
    { text: "Bị từ chối", bgColor: "bg-red-500", textColor: "text-white" },
    { text: "Được chấp nhận", bgColor: "bg-green-500", textColor: "text-white" },
  ];

  useEffect(() => {
    const fetchAppliedArticles = async () => {
      try {
        const token = localStorage.getItem("TOKEN");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${API_URL}/jobseeker/viewAllJobApplications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.data) {
          const statusMap = {
            pending: "Chưa xem",
            viewed: "Đã xem",
            rejected: "Bị từ chối",
            accepted: "Được chấp nhận",
          };

          const transformedApplications = response.data.data.map((app) => ({
            title: app.job_name || "Công việc không xác định",
            cvName: app.cv ? app.cv.split("/").pop() : "Không có CV",
            cvLink: app.cv || null,
            cvStatus: statusMap[app.status] || "Chưa xem",
          }));
          setAppliedArticles(transformedApplications);
        } else {
          setAppliedArticles([]);
        }
      } catch (error) {
        console.error("Error fetching applied articles:", error.message);
        setAppliedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedArticles();
  }, []);

  const handleCVClick = (cvLink) => {
    if (cvLink) {
      window.open(cvLink, "_blank", "noopener,noreferrer");
    } else {
      alert("Không có CV để xem!");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center dark:bg-white transition-colors duration-200 flex-col p-4 gap-[32px] border-[#00000000] border-0 bg-[rgb(255,_255,_255)]"
      data-oid="wmvt:.1"
    >
      <div
        className="w-full grid-cols-[repeat(2,_1fr)] justify-start items-center bg-[#00000000] border-[#00000000] flex pl-[100px] pr-[100px] h-[50px]"
        data-oid="q8gv0rx"
        key="olk-R5iO"
      >
        <div
          className="w-full h-full text-[#000000] text-[32px] font-bold flex items-center justify-start border-[#00000000] bg-[#00000000]"
          data-oid="xu6cr-a"
          key="olk-sg_y"
        >
          TRẠNG THÁI ỨNG TUYỂN
        </div>
      </div>

      <div
        className="px-[100px] items-center gap-[10px] grid-rows-[repeat(2,_1fr)] grid-cols-[repeat(1,_1fr)] flex flex-col justify-start w-full h-[fit-content] bg-[#FFFFFF] pt-[10px] pb-[10px] border-[#00000000] border-0 rounded-none"
        data-oid="a6hn.b3"
        key="olk-0Xvc"
      >
        <div
          className="w-full flex justify-start items-center border-[#000000] rounded-[30px] border-2 gap-[10px] bg-[rgba(0,_0,_0,_0)] h-[60px]"
          data-oid="_ghrroo"
          key="olk-qaHF"
        >
          <div
            className="w-[45%] text-[#000000] text-[24px] font-bold text-center flex justify-center items-center h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="glal7h9"
          >
            Công việc ứng tuyển
          </div>
          <div
            className="w-[35%] text-[#000000] text-[24px] font-bold text-center flex justify-center items-center h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="cj9xlx_"
          >
            CV đã gửi
          </div>
          <div
            className="w-[20%] text-[24px] font-bold text-center flex justify-center items-center text-[#000000] h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="r20v9.:"
          >
            Tình trạng
          </div>
        </div>

        {appliedArticles.length === 0 ? (
          <div className="w-full text-center text-[24px] text-gray-500 mt-4">
            Chưa có đơn ứng tuyển nào
          </div>
        ) : (
          appliedArticles.map((article, index) => (
            <div
              key={`row-${index}`}
              className="h-[100px] w-full flex justify-start items-center gap-[10px] bg-[#00000000] border-[#00000000]"
              data-oid="hox-ts9"
            >
              <button
                className="h-[100px] w-[45%] text-[#000000] text-[20px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#474B53] border-2 bg-cover bg-center hover:opacity-90 transition-opacity duration-200 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop')",
                }}
                onClick={() => console.log("Job button clicked")}
                data-oid="9a1e6_l"
              >
                <span
                  className="z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2"
                  style={{
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  data-oid="q:a61__"
                >
                  {article.title}
                </span>
              </button>

              <button
                className="h-[100px] w-[35%] text-[#000000] text-[18px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#474B53] border-2 bg-cover bg-center hover:opacity-90 transition-opacity duration-200 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop')",
                }}
                onClick={() => handleCVClick(article.cvLink)}
                data-oid="cpzujuc"
              >
                <span
                  className="z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2"
                  style={{
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  data-oid="t9ihipq"
                >
                  {article.cvName}
                </span>
              </button>

              <div
                className={`h-[100px] w-[20%] text-[20px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#000000] border-2 ${
                  statusStates.find((s) => s.text === article.cvStatus)?.bgColor || "bg-gray-200"
                }`}
                data-oid="quv..k:"
              >
                <span
                  className={
                    statusStates.find((s) => s.text === article.cvStatus)?.textColor ||
                    "text-black"
                  }
                  data-oid="t81gbqv"
                >
                  {article.cvStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default State;