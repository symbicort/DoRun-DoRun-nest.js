# Node.js 20 기반 이미지 사용
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

# 의존성 설치
RUN npm ci

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

EXPOSE 3050

# Google Cloud SDK 및 인증 파일 환경변수 설정
ENV GOOGLE_APPLICATION_CREDENTIALS="/run/secrets/application_default_credentials.json"

CMD ["node", "--max-old-space-size=512", "./dist/main.js"]
