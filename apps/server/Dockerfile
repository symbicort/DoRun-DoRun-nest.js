# Node.js 20 기반 이미지 사용
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app/server

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# server 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 실행 권한 부여
RUN chmod +x ./dist/main.js

# 포트 설정
EXPOSE 3000

# 서버 실행
CMD ["node", "./dist/main.js"]
