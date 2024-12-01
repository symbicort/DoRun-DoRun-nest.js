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

CMD ["node", "--max-old-space-size=512", "./dist/main.js"]
