# ==========================================
# STAGE 1: Build React App
# ==========================================
FROM node:18-alpine as builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json trước để tận dụng Docker Cache
# (Nếu code đổi nhưng thư viện ko đổi, bước npm install sẽ được bỏ qua -> Build siêu nhanh)
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code vào
COPY . .

# Thực hiện Build
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================

# Copy file build từ Stage 1 sang thư mục Nginx của container
COPY --from=builder /app/build /usr/share/nginx/html

# Copy file cấu hình nginx custom (để fix lỗi React Router 404)
# Bạn cần tạo file nginx.conf ở mục 3 bên dưới
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]