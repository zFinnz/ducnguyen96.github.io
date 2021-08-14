---
title: "Hướng dẫn thuê Aws"
date: 2021-07-07 08:23:27
draft: true
categories: [devops]
categories_weight: 10
tags: [tutorial, backend, aws, web server, nginx]
tags_weight: 10
---

## 1. Login EC2 With .pem file

```sh
 chmod 400 myfile.pem
 ssh -i "myfile.pem" my_user@instance_public_dbn
```

## 2. Web server là gì ?

Web server là một phần mềm máy tính hoạt động trên 1 phần cứng và chấp nhật các requests thông qua [giao thức HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) để phân phối các trang webs, biến thể an toàn hơn của HTTP là [HTTPS](https://en.wikipedia.org/wiki/HTTPS).

![Web Server](https://roadmap.fun/public/images/web-server-send-http.png)
Để publish 1 website thì bạn cần hoặc 1 web server tĩnh (chỉ bao gồm 1 máy tính và 1 HTTP server, gọi là tĩnh vì server gửi những files được hosted trên server đến browers) hoặc động (có thêm 1 số phần mềm như [ứng dụng server](https://www.nginx.com/resources/glossary/application-server-vs-web-server/) và 1 database, gọi là động vì ứng dụng server sẽ cập nhật hosted files trước khi gửi đến browser thông qua HTTP server).

## 3.Những web servers phổ biến nhất

1. [Apache HTTP Server](https://httpd.apache.org/): Được phát trển bởi [Apache Software Foundation](https://en.wikipedia.org/wiki/The_Apache_Software_Foundation), free và [mã nguồn mở](https://en.wikipedia.org/wiki/Open_source) có thể hoạt động trên cả Windows MacOS Unix Linux Solaris và các OS khác.
2. [Microsoft Internet Information Services (IIS)](https://www.iis.net/): Phát triển bởi Microsoft cho các nền tảng của Microsoft, không open-sourced nhưng được sử dụng rộng rãi.
3. [Nginx](https://www.nginx.com/): Open-sourced, phổ biến vì nó sử dụng ít tài nguyên cũng như khả năng scale mạnh, có thể xử lý nhiều sessions đồng thời nhờ vào [kiến trúc hướng sự kiện (event-driven architecture)](https://en.wikipedia.org/wiki/Event-driven_architecture), ngoài ra thì Nginx còn được sử dụng như 1 [proxy server](https://en.wikipedia.org/wiki/Proxy_server), [load balancer](https://en.wikipedia.org/wiki/Load_balancing_(computing)).
4. [Lighttpd](https://www.lighttpd.net/): free và chạy trên FREEBSD OS, nhanh và bảo mật, tốn ít tài nguyên CPU.
5. [Sun Java System Web Server](https://docs.oracle.com/cd/E19146-01/819-2629/gbrne/index.html).