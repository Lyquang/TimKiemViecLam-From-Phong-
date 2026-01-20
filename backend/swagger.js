// 👇 QUAN TRỌNG: Thêm {openapi: '3.0.0'} để bật chế độ mới
const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});

const doc = {
  info: {
    title: "TKVL API Documentation",
    description: "Tài liệu API tự động (Chuẩn OpenAPI 3.0)",
  },
  // 👇 Thay 'host' bằng 'servers' trong chuẩn 3.0
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http", // 👈 Chọn type http
        scheme: "bearer", // 👈 Chọn scheme bearer
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Đã tạo Swagger chuẩn OpenAPI 3.0 (Tự động thêm Bearer)!");
});
