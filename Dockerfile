FROM node:8-alpine
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata && yarn config set registry https://registry.npm.taobao.org/
WORKDIR /app
COPY package.json /app/
RUN yarn
COPY . /app
ENTRYPOINT ["yarn","run","serve"]