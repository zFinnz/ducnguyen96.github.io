---
title: "Docker Fundamentals"
date: 2021-07-08 08:45:15
draft: false
categories: [backend]
categories_weight: 10
tags: [backend, docker, deploy]
tags_weight: 9
---

Ở chương trước ta đã hoàn thành build một web server trên 1 máy chủ thuê của AWS với 1 phiên bản nginx cụ thể và mọi thứ vẫn hoạt động hoàn hảo.

Tuy nhiên, hiện tại thì nginx phụ thuộc hoàn toàn vào os mà máy chủ đang dùng. Nếu os có update lên phiên bản mới hoặc các ứng dụng khác trên os cập nhật hoặc bạn cài đặt thêm ứng dụng khác trên os gây xung đột với phiên bản nginx hiện tại thì sẽ ảnh hưởng đến sản phẩm của chúng ta. Docker giúp cho ta tạo các môi trường tách biệt để khỏi chạy và phát triển ứng dụng, có còn giúp chúng ta scale dễ hơn. Chi tiết về các ứng dụng của docker mình sẽ cập nhật ở 1 bài viết khác. Bài viêt này chỉ tập trung giúp các bạn có thể build được docker image, đẩy được lên repo, có thể thêm cả phần docker compose và docker stack để ploy ứng dụng.

## 1. Cài đặt docker cho [debian]([debian](https://docs.docker.com/engine/install/debian/))
Gỡ các phiên bản cũ
```sh
sudo apt-get remove docker docker-engine docker.io containerd runc
```

Ta sẽ cài đặt bằng cách sử dụng repository
```sh
# Update the apt package index and install packages to allow apt to use a repository over HTTPS:
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker’s official GPG key:
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Setup repository
echo \
"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Kiểm tra Docker Engine đã được cài đặt chưa
```sh
sudo docker run hello-world
```

## 2. Chạy docker với non-root user
```sh
# Create the docker group
sudo groupadd docker

# Add your user to the docker group
sudo usermod -aG docker $USER

# Active changes to groups
newgrp docker

# Verify that you can run docker commands without sudo
docker run hello-world
```

## 3. Tự động khởi chạy docker service khi boot
```sh
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

## 4. Build docker-image với dockerfile
Có rất nhiều docker image được built sẵn có nginx ở trên các docker repository khác nhau, nhưng chúng ta muốn 1 bản nginx được build from source và có cấu hình như chúng ta mong muốn. Vì thế ta sẽ viết 1 dockerfile mới từ dockerfile của 1 os và sau đó build nginx from source ngay trong dockerfile.

Có nhiều OS có thể chạy được nginx nhưng mình sẽ chọn debian vì OS mình đang sử dụng cho website này là debian buster 10.

```sh
# Base image to start the build process
From debian:buster

# Adds metadata to image
LABEL maintainer="ducnguyen96"

# Set the environment variables that is required to run the project
ENV PORT 10001

# Tell docker that the rest of the commands will be run in the context of the /app folder inside the image
# Tương tự với cd tới /home
WORKDIR /home

# RUN commands run within the container at build time
# RUN được chạy trong quá trình build image còn CMD chạy khi RUN image
# Sau khi cd tới /home thì tạo 1 thư mục app --> /home/app
RUN mkdir app

# ls trong home --> app
RUN ls

# RUN sh với lệnh echo $HOME --> echo /root
RUN /bin/bash -c 'echo $HOME'

# Copy toàn bộ code trong thư mục hiện tại vào /home
COPY . .

# Định nghĩa entry cho container, các commands sau này sẽ run với entry là sh --> cmd: hello.sh với entry là sh --> sh hello.sh
ENTRYPOINT ["sh"]

# CMD
CMD ["hello.sh"]
```
Các phần của bản của 1 dockerfile:
  1. FROM: image base để build image mới từ nó.
  2. LABEL: thêm metadata cho image.
  3. ENV: thêm các biến môi trường vào image.
  4. WORKDIR: tương tự như câu lệnh `cd`.
  5. RUN: sau run là 1 câu lệnh thông thường mà bạn hay gõ ở terminal, RUN sẽ được chạy ngay trong quá trình build image.
  6. COPY: source destination.
  7. ENTRYPOINT: gắn entry cho các CMD.
  8. CMD: thêm param vào cho ENTRYPOINT, nếu không có ENTRYPOINT, thì biến đầu tiên của CMD sẽ là 1 executable.

## 5. Dockerfile với nginx from source
```sh
# Base image to start the build process
From debian:buster

# Adds metadata to image
LABEL maintainer="ducnguyen96"

#################################################
## Building NGINX from source & Adding modules ##
#################################################

# Update apt-get
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install wget -y

# Download building tools
RUN apt-get install build-essential lbpcre3 \
    libpcre3-dev zliblg zliblg-dev libssl-dev -y

RUN mkdir /home/nginx
WORKDIR /home/nginx

# Download nginx
RUN wget http://nginx.org/download/nginx-1.21.0.tar.gz
RUN tar -zxvf nginx-1.21.0.tar.gz

# Configure Nginx
WORKDIR /home/nginx/nginx-1.21.0

RUN sh configure --sbin-path=/usr/bin/nginx   \
    --conf-path=/etc/nginx/nginx.conf         \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --with-pcre --pid-path=/var/run/nginx.pid \
    --with-http_ssl_module                    \
    --modules-path=/etc/nginx/modules --with-http_v2_module

# Compile nginx
RUN make

# Install nginx
RUN make install

# Remove nginx source
WORKDIR /home
RUN rm -rf nginx

# Testing nginx
RUN nginx -V
```
có thể xem Dockerfile cũng như nginx.conf [tại đây](https://github.com/ducnguyen96/nginx-conf)

## 6. Webapp với Docker Image vừa tạo
Sau khi build được Image debain chứa nginx được build from source, chúng ta sẽ build app của chúng ta với Image nginx kia

```sh
FROM ducnguyen96/nginx-debian:0.0.1

LABEL maintainer="ducnguyen96"

RUN mkdir -p /home/admin/my-app/roadmap

WORKDIR /home/admin/my-app/roadmap

COPY . .

RUN mkdir -p /etc/letsencrypt/live/roadmap.fun

RUN cp fullchain.pem /etc/letsencrypt/live/roadmap.fun

RUN cp privkey.pem /etc/letsencrypt/live/roadmap.fun

RUN cp nginx.conf /etc/nginx/

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
```
## 7. Deploy với Docker Image của web
Sau khi build xong image ta có thể đẩy lên 1 docker repo nào đấy, ở đây mình dùng [docker hub](https://hub.docker.com/).

1. docker login.
2. docker push image.
3. login vào server.
4. pull image về hoặc có thể chạy docker run luôn nó sẽ tự động tải image về cho bạn.
