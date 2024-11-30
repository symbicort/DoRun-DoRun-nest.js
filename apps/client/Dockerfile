# Node.js 20 기반 이미지 사용
FROM node:lts-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app/client

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# client 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# Nginx 기반 이미지 사용
FROM nginx:alpine

# 빌드된 client 파일을 Nginx 기본 디렉토리에 복사
COPY --from=build /app/client/dist /usr/share/nginx/html

# Nginx 설정 파일 복사 (필요시)
RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
