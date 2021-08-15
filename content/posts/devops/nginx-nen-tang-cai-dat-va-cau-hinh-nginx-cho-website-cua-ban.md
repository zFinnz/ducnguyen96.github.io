---
title: "Nginx nền tảng: Cài đặt và cấu hình nginx cho website của bạn"
date: 2021-07-07 08:37:14
draft: false
categories: [devops]
categories_weight: 9
tags: [devops, nginx, web server]
tags_weight: 9
---

## 1. NGINX vs Apache
![Nginx vs Apache](/images/nginx.png)
Phần xử lý dynamic content không được nhúng hẳn vào nginx mà cần 1 process riêng để xử lý (chẳng hạn FPM), vì thế mà không giống như Apache thì phần server side sẽ không cần phải chạy khi có 1 request bất kỳ đến hệ thống. Nginx sẽ xử lý các static content mà không cần tới server side.

1. Apache được cấu hình prefork: sinh ra 1 vài processes, mỗi process có thể xử lý duy nhất 1 request dừ request đấy dành cho script hay file ảnh.
2. Nginx thì ngược lại: 1 process xử lý đồng thời nhiều requests, con số thì tùy thuộc vào tài nguyên của máy. Chính vì được cấu hình xử lý đồng thời nên nó không thể nhúng được ngôn ngữ lập trình server side vào các processes của nó, nghĩa là với tất cả các requests yêu cầu nội dung động(dynamic) content) thì đều phải được xử lý với một process khác như FPM và sau đó [reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/) ngược tới client.  
3. Nginx: URI locations vs Apache: filesystem locations.

## 2. Cài đặt Nginx với Package manager
```sh
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nginx
```
Kiểm tra nginx hoạt động hay chưa

```sh
ps aux | grep nginx
```
Với ps là list các processes, au là all-user, x là root processes

## 3. Remove Nginx and it's dependencies
```sh
sudo apt --purge autoremove nginx
```

## 4. Bulding Nginx from Source & Adding Modules

1. Lợi ích của việc build Nginx from Source là khả năng có thể thêm modules mở rộng những function của Nginx, điều mà bạn không thể làm khi cài đặt Nginx từ package manager.
2. Nginx modules có 2 dạng (1 là đã đóng gói - bundled modules, 2 là các modules bên thứ 3 - third party modules). Bundled modules là những mô đun từ Nginx, chẳng hạn như HTTPS.

Download [source](https://nginx.org/en/download.html)
```sh
wget http://nginx.org/download/nginx-1.21.0.tar.gz
```

Extract
```sh
tar -zxvf nginx-1.21.0.tar.gz
```

Get building tools
```sh
sudo apt-get install build-essential
```

Configure
```sh
./configure
```
![Missing PCRE](/images/configure-nginx-error.png)
Missing PCRE and how to install

Install missing libs and SSL lib
```sh
sudo apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev
```
Configure with configuration flags
```sh
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module

```
Compile
```sh
make
```
Install
```sh
make install
```
Run Nginx
```sh
sudo nginx
```

## 5. Adding an NGINX service as a systemd service
Để Nginx có thể active ngay sau khi reboot thì ta thêm 1 systemd service vào máy.
Thêm service file
```sh
sudo touch /lib/systemd/system/nginx.service
```
Dùng nano để edit file vừa tạo
```sh
sudo nano /lib/systemd/system/nginx.service
```
Thêm vào file service vừa tạo như sau
```sh
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/bin/nginx -t
ExecStart=/usr/bin/nginx
ExecReload=/usr/bin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
Chạy Nginx service
```sh
sudo systemctl start nginx
```
Enable Nginx Service
```sh
sudo systemctl enable nginx
```

## 6.Configuration
1. Có 2 thuật ngữ chính được dùng trong nginx là context và directive.
2. Directive(server_name mydomain.com) chứa tên(server_name) và giá trị context(mydomain.com).
3. Context là những sections mà các directives được cài dặt trong đó (giống như scope), context lồng nhau và thừa kế từ parents.

## 7. Creating a Virtual Host
Mỗi virtual host là 1 server context hay server block chịu trách nhiệm lắng nghe trên 1 cổng (port, 80 cho http và 443 cho https).

## 8. Location Blocks
Là context được sử dụng nhiều nhất trong nginx. Nó được dùng để chứa những config nhất định đối với từng url.
![Location Blocks](/images/nginx--location_block.png)
Có 4 loại match để nginx match 1 url và ưu tiên như sau:
1. Exact Match =uri
2. Preferential Prefix Match ^~url
3. REGEX Match ~*uri
4. Prefix Match uri

## 9. Variables
Chú ý: Không nên sử dụng conditional trong location context.
![Variables](/images/nginx--variables.png)
Ở đây chúng ta có 2 loại biến: 1 là $mon được khai báo bằng tay, 2 là $date_local là biến được built in nginx.

## 10. Rewrites and Redirects.
![Rewrite](/images/nginx--redirects__rewrites.png)
1. Redirects đơn giản là bảo với client nên đi đến url này thay vì url kia và url trên thanh url của browser sẽ thay đổi.
2. Rewrites thì sẽ thay đổi url ngay bên trong nginx, kết quả là nginx sẽ trả về cho clients repsonse của 1 location block khác dù url trên thanh url của browser vẫn không thay đổi.
3. Lợi ích khi dùng rewrites là ta có thể capture url (line 14) và thay đổi url như mong muốn.

## 11. Try Files & Named Locations
![Try files](/images/nginx--try__files.png)
Giải thích line 15: thử serve uri trước (root/images/$uri): không tồn tại thư mục --> root/cat.png: không tồn tại --> root/greet: không tồn tại thư mục --> re-evaluate @friendly_404 (với @ để name 1 location);

## 12. Logging
Nginx hỗ trợ 2 loại log:
1. error log (log mọi thứ mà xảy ra không như mong muốn )
2. access log (log tất cả requests đến server)
![Logging](/images/nginx--logging.png)

## 13. Thừa kế và các loại directives
![inherite](/images/nginx--directive__types.png)
Có 3 loại directives và các tính chất như hình trên

## 14. PHP processing
![php](/images/nginx--php__processing.png)
1. line 1: define user cho process.
2. line 16: try to serve index.php first nếu không tồn tại --> index.html.
   
## 15. Worker processes
master process: chính là nginx.

worker process: là process lắng nghe client và response đến client.

![worker process](/images/nginx--worker__process.png)
line 3: định nghĩa số processes mà nginx dùng (auto chính là bằng số cpu mà hệ thống có, nếu số này lớn hơn số cpu thì mỗi process của nginx sẽ hoạt động không hết công suất).

line 6: số connections đồng thời mà hệ thống có thể xử lý.
Kiểm tra số connection như sau:
```sh
ulimit -n
```

## 16. Buffer and timeouts
![buffer](/images/nginx--buffer__timeouts.png)

## 17. Adding dynamic modules
![dynamic](/images/nginx--add__module--1.png)
Để thêm module thì chúng ta phải build lại nginx

## 18. Headers & Expires
![Headers](/images/nginx--headers.png)
Expires Headers thông báo với browsers nó có thể cache response này trong bao lâu.

## 19. Compressed Repsonses with gzip
![gzip](/images/nginx--compressed__responsed__gzip.png)
Có nhiều cấp độ nén nhưng kể từ cấp độ 3 trở lên thì mức độ nén không thay đổi nhiều mà tốn nhiều tài nguyên hơn nên thường set 3-4 là hợp lý

## 20. FastCGI Cache
![FastCGI](/images/nginx--fastcgi__cache.png)
Cache lại response từ back-end.

## 21. HTTP2
HTTP2 là Binary Protocol còn HTTP1 là Textual Protocol. HTTP2 giúp nén data cũng như giảm thiểu lỗi trong quá trình truyền tải dữ liệu.

Các tính chất của HTTP2:
  1. Binary Protocol
  2. Compressed Headers
  3. Persistent Connections
  4. Multiplex Streaming
  5. Server Push
Để enable HTTP2 thì ta cần phải rebuild lại cùng ssl module và http 2 module.
```sh
./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --modules-path=/etc/nginx/modules --with-http_v2_module
```
Tự reg ssl bằng openssl.
```sh
sudo mkdir /etc/nginx/ssl
sudo openssl req -x509 -days 10 -nodes -newkey rsa:2048 -keyout /etc/nginx/ssl/self.key -out /etc/nginx/ssl/self.crt
```
![http2](/images/nginx--http2.png)

## 22. Server Push
```sh
location = /index.html {
  http2_push /style.css;
  http2_push /images/thumb.png;
}
```

## 23. HTTPS(SSL)
![ssl](/images/nginx--https.png)
1. [SSL](https://www.ssl.com/faqs/faq-what-is-ssl/) được thay thế gần như hoàn toàn bằng [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security#SSL_1.0,_2.0,_and_3.0).
2. [SSl Cipher](https://en.wikipedia.org/wiki/Cipher_suite) là tổ hợp những thuật toán giúp kết nối mạng được an toàn hơn.
3. [Diffie-Hellman parameters](https://wiki.openssl.org/index.php/Diffie-Hellman_parameters). Để có dhparams thì ta gen nó bằng openssl. Lưu ý: 2048 là rsa:2048 lúc gen ssl.
4. [HSTS: HTTP Strict Transport Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).

## 24. Rate Limiting
```sh
http {
  include mime.types

  # Define limit zone
  limit_req_zone $request_uri zone=MYZONE:10m rate 1r/s;
}
```
line 14: Định nghĩa 1 zone giới hạn request đối với request uri, zone này có tên là MYZONE với kích thời là 10mb, giới hạn 1 request mỗi giây.

line 55: Với location / thì cài đặt giới hạn với vùng giới hạn là MYZONE, burst 5 nghĩa nếu trong 1 giây đầu tiên, có thêm 5 request đến thì 5 request này không bị reject ngay mà được đặt vào hàng chờ để sau đó cứ mỗi giây thì giải quyết 1 request ở hàng đợi này. param nodelay cho phép resolve các burst connection này nhanh nhất có thể và không chịu delay 1r/s.

## 25. Hardening Nginx
Giấu phiên bản nginx đang sử dụng
```sh
server_tokens off;
```
Rebuild nginx với tag --without các module không cần thiết, chẳng hạn: http_autoindex_module

## 26. Let's Encrypt - SSL: Certificates

Cài đặt Cerbot cho [Debian:buster](https://certbot.eff.org/lets-encrypt/debianbuster-nginx)
Revew Certs
```sh
certbot renew
```
Revew Certs khi chưa hết hạn
```sh
certbot renew --dry-run
```
Cronjob renew certs
```sh
crontab -e
```
Chọn edit với nano vào thêm job
```sh
@daily certbot renew
```