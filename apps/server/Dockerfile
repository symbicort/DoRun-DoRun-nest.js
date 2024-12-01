# Node.js 20 기반 이미지 사용
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

COPY application_default_credentials.json /app/application_default_credentials.json

# 환경 변수 설정
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/application_default_credentials.json"

RUN npm i

# 의존성 설치
RUN npm ci

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

EXPOSE 3050

CMD ["node", "--max-old-space-size=512", "./dist/main.js"]
