---
title: "Mạng máy tính"
date: 2021-07-10 08:23:27
draft: false
categories: [others]
categories_weight: 10
tags: [others, networking, computer network]
tags_weight: 10
---
# Phần 1 - The TCP/IP Five-Layer Network Model
![7 layers](https://roadmap.fun/public/images/five-layers.png)
The protocols at each layer carry the ones above them in order to get data from one place to the next.

## 1. Physical Layer
Đại diện cho những thiết bị vật lý kết nối với máy tính. Liên quan đến những thứ như cáp, thiết bị kết nối, gửi tín hiệu.

## 2. Data Link Layer
- The network interface or the network access layer.
- Lớp này chịu trách nhiệm định nghĩa các cách để diễn dịch (interpreting) các  tín hiếu để cho các thiết bị có thể giao tiếp với nhau.
- Có rất nhiều giao thức (protocols) xuất hiện ở layer này nhưng phổ biến nhất là Ethernet.
- Các tiêu chuẩn của Ethernet cũng định nghĩa 1 giao thức chịu trách nhiệm cho việc nhận dữ liệu từ các node trên cùng 1 network.

## 3. Internet Layer
- Layer này cho phép các network khác nhau có thể giao tiếp được với nhau thông qua các routers.
- Giao thức phổ biến nhất ở layer này là IP (Internet Protocol).
- Một node riêng rẽ có thể chạy nhiều ứng dụng clients hoặc servers. Bạn có thể chạy 1 chương trình client email và web browser cùng lúc. Email và webserver cũng có thể chạy trên cùng 1 server.

## 4. Transport Layer
- Emails và Web pages có thể được gửi đến ứng dụng của bạn là nhờ transport layer.
- Khi Internet Layer chuyển dữ liệu giữa các node độc lập. Transport Layer phân loại ứng dụng client hoặc server nào thì nên nhận được data từ Internet layer.
- Giao thức phổ biến nhất ở layer này là TCP (Transmission Control Protocol). 1 số giao thức khác có sử dụng đến IP có thể kể đến như UDP (User Datagram Protocol).

**Lưu ý**: IP chịu trách nhiệm nhận dữ liệu từ node này sang node khác, trong khi TCP hoặc UDP thì chịu trách nhiệm phân loại dữ liệu nhận được từ IP đến ứng dụng cần thiết (applications or programs)