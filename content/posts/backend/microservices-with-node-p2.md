---
title: "Microservices với NodeJS phần 2 - một mini-microservices app"
date: 2021-09-06
draft: true
categories: [backend, devops]
categories_weight: 4
tags: [microservices, nodejs, monoliths, architecture, backend, devops]
tags_weight: 4
---

Ở bài trước thì chúng ta đã thấy một vài notes về cách chúng ta xử lý vấn đề giao tiếp giữa các microservices, bây giờ thì hãy bắt đầu viết một vài dòng code nào 😄.

Giờ ta sẽ xem qua mock-up của app mà chúng ta sẽ build để có hiểu hơn về async communication. Dưới đây là một vài chú ý về project tiếp theo chúng ta sẽ build.

## App Overview

![microservices-dg-27](/images/microservices-dg-27.png)

- Mục tiêu đầu tiên của project là có cái nhìn qua về kiến trúc microservice. Ta sẽ build một project lớn hơn và toàn diện hơn sau, còn project thì chỉ với mục đích là làm quen với microservices.
- Mục tiêu thứ 2 là build mọi thứ từ đầu nhiều nhất có thể để hiểu được cách hoạt động của microservices.
- ℹ️ _Không nên sử dụng project này như một template nhé._

![microservices-dg-28](/images/microservices-dg-28.png)
Chúng ta sẽ build một web app đơn giản có tính năng như tạo post, và comment vào post. Post sẽ chỉ có title không có body, ảnh hay bất cứ thứ gì khác.

Khi user mới vào app thì sẽ hiện 1 form để cho user nhập title, sau đó user submit thì sẽ hiển thị post ở dưới, mỗi post sẽ có 1 ô input để user có thể comment, sau khi submit thì post sẽ update số comment cũng như chi tiết về comment ở dưới.

Nhìn qua thì có vẻ rất đơn giản đúng không, nhưng với microservices thì cũng không đơn giản cho lắm đâu 😄

Đầu tiên thì chúng ta phải nghĩ là cần những service nào cho app này.
![microservices-dg-28](/images/microservices-dg-29.png)
Với app này thì ta cần quản lý 2 resource đó là post và comment, trong một dự án thực tế thì không hẳn cứ phải tạo mỗi service riêng cho từng resource nhưng đối với project này thì ta sẽ làm như vậy để hiểu được cách giao tiếp giữa 2 services.
![microservices-dg-30](/images/microservices-dg-30.png)
Ta sẽ tạo 2 services là postservice có chức năng là tạo post là list tất cả các post, commentservice có chức năng là tạo comment và list tất cả comment của post. Nhìn qua thì thấy postservice có vẻ đơn giản, nó chỉ cần 1 database lưu tất cả các post thế là ổn, còn commentservice thì có phức tạp hơn 1 xíu, lúc tạo 1 comment thì ta sẽ gắn comment đó với 1 post, vì vậy có depend với postservice nên chúng ta sẽ phải sử dụng 1 trong 2 cách giao tiếp đó là sync hoặc async, tương tự thì lúc list comment cũng thế, ta không thể list toàn bộ comment trong database ra cùng lúc mà ta sẽ chỉ trả comments tương ứng với từng post cụ thể.

## Project setup

Sau một đống lý thuyết thì cuối cùng cũng đến lúc được viết code rồi 😄

Đầu tiên nhìn lại cấu trúc project mà chúng ta sẽ build nhé.
![microservices-dg-31](/images/microservices-dg-31.png)
Phía client thì ta sẽ dựng 1 web app với react, browser sẽ gửi request về các services, các service này được build với expressjs, hiện tại thì ta sẽ không sử dụng database cho project, chúng ta sẽ giải quyết vấn đề về database sau, project này ta sẽ lưu tất cả data trong bộ nhớ.

![microservices-dg-32](/images/microservices-dg-32.png)

```javascript
yarn create react-app client
```

```javascript
mkdir posts
yarn init -y
yarn add express cors axios nodemon
```

```javascript
mkdir comments
yarn init -y
yarn add express cors axios nodemon
```

## Posts Service

Đầu tiên thì ta sẽ implement posts service cơ bản với expressjs để thực hiện các features của nó là tạo post và list posts, tạm chưa quan tâm tới microservices.
![microservices-dg-33](/images/microservices-dg-33.png)
Vậy với post service thì ta sẽ tạo 1 route là /posts. Với method GET thì ta sẽ trả về tất cả các post và với method POST cùng với body chứa title thì ta sẽ tạo 1 post mới.

![microservices-dg-34](/images/microservices-dg-34.png)
Ở đây ta sẽ sử dụng biến `posts = {}` để lưu tất cả các posts, điểm trừ ở đây là mỗi khi reset lại service thì sẽ mất tất cả các posts. Ngoài ra thì chúng ta sử dụng randomBytes để tạo unique id cho từng post.

![microservices-dg-35](/images/microservices-dg-35.png)
Mình sử dụng [insomnia](https://insomnia.rest/) để test lại 2 api vừa code. Response trả về statuscode 200 và body như mong muốn 😄

## Comments Service

Tiếp theo ta sẽ code comments service nhưng trước hết điểm qua requirements.
![microservices-dg-36](/images/microservices-dg-36.png)
Comments serrvice cos 1 route là /posts/:id/comments/. Với method POST thì tạo 1 comment tương ứng với post id và với method GET thì trả về tất cả comments ứng với postid ấy.
![microservices-dg-37](/images/microservices-dg-37.png)
Tương tự như posts service thì ta có comments service như trên. Test qua nào
![microservices-dg-38](/images/microservices-dg-38.png)

## Client

![microservices-dg-39](/images/microservices-dg-39.png)
Trước khi implement client thì xem lại cấu trúc của phần này nhé. App sẽ có 2 component là PostList và PostCreate. PostCreate là form để user submit post và PostList là component chứa post title, CommnetList và form để user create comment
