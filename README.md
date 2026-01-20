# IT Job Search Platform

## Công nghệ sử dụng

- **Front-end**: ReactJS và Vite
- **Back-end**: Node.js và Express

## Hướng dẫn cài đặt hệ thống

### 1. Clone repository

```bash
git clone https://github.com/ClearWind9u/Website_TKVL.git
```

### 2. Cài đặt dependencies

Di chuyển vào từng thư mục `frontend` và `backend` để cài đặt dependencies:

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 3. Chạy ứng dụng

Mở hai terminal riêng biệt và chạy frontend và backend đồng thời:

#### Chạy Backend:
```bash
cd backend
npm run dev
```

#### Chạy Frontend:
```bash
cd frontend
npm run dev
```

### 4. Thông tin hệ thống

- **Frontend** chạy trên **port 5173**.
- **Backend** chạy trên **port 5000**.
- **Tài khoản giả lập (fakeUser):**
  - **Người tìm việc**
    - **Email:** test@gmail.com
    - **Password:** 123
    - **Role:** jobseeker
  - **Nhà tuyển dụng**
    - **Email:** testRecruiter@gmail.com
    - **Password:** 123456
    - **Role:** recruiter
  - **Quản trị viên**
    - **Email:** testadmin@gmail.com
    - **Password:** 123456
    - **Role:** admin