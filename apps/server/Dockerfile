# Node.js 20 기반 이미지 사용
FROM node:lts-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

COPY ./application_default_credentials.json /run/secrets/
ENV GOOGLE_APPLICATION_CREDENTIAL=/run/secrets/application_default_credentials.json

RUN npm i

# 의존성 설치
RUN npm ci

# server 코드 복사
COPY . .

#빌드 실행
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


# # 실행 권한 부여
# RUN chmod +x ./dist/main.js

# 포트 설정
EXPOSE 3050

# 서버 실행
CMD ["node", "--max-old-space-size=512", "./dist/main.js"]
