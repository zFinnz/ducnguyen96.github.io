---
title: "Những vấn đề mình mắc phải trong quá trình học tập và làm việc"
date: 2021-06-09 08:23:27
draft: false
categories: [others]
categories_weight: 9
tags: [notes, questions, others]
tags_weight: 1
---
## 1. Gắn alias cho 1 địa chỉ IP
Có 1 vấn đề khi mình thuê nhiều server trên AWS là mình phải nhớ nhiều địa chỉ IP để SSH. Cách giải quyết là mình sẽ gắn tên cho từng địa chỉ bằng cách map name với ip trong file /etc/hosts.

## 2. Giao tiếp giữa 2 AWS instances
Phiên bản roadmap.fun hiện tại mình đang sử dụng 2 instances riêng biệt để xử lý front-end và back-end riêng, 1 instance cho nginx cùng webapp và 1 instance cho nodejs và postgres.

Lúc khởi tạo 1 instance trên AWS EC2, thì nó được gắn vào 1 security group. Ví dụ webapp thuộc group wizard-1 và nodejs thuộc group wizard-2:
  1. Click vào instance nodejs
  2. Click vào tab security
  3. Click vào wizard-2
  4. Ở tab inbound click edit inbound rule
  5. Thêm rule vào. Ví dụ nodejs lắng nghe ở port 3000, bạn thêm type là Custom TCP, port range là 3000, source thì bạn có thể thêm là ip của instance webapp hoặc security zone của webapp.
  6. Save rule

## 3. Lưu biến vào shell của bạn
Mình đang dùng ohmyzsh nên mình sẽ edit ~/.zshrc bạn nào dùng bash thì edit ~/.bashrc nhé
```sh
nano ~/.zshrc
```
```sh
export MY_AWS_REGION=your-aws-region
```
Save lại và load lại file config
```sh
source ~/.zshrc
```

## 4. Download 1 thư mục trên github với subversion
Cài đặt
```sh
sudo apt-get install subversion
```

Ví dụ với thư mục `sample/28-sse` trong  repo nest của `nestjs` trên [github](https://github.com/nestjs/nest/tree/master/sample/28-sse)

https://github.com/nestjs/nest/tree/master/sample/28-sse

```sh
svn checkout https://github.com/nestjs/nest/tree/trunk/sample/28-sse
```

Ở đường link trên thì `trunk` thay thế cho `master` là tên của branch
Đối với branch khác thì ta thay thế `trunk` bằng `branches/branch-name`.

Tham khảo thêm ở [đây](https://stackoverflow.com/questions/7106012/download-a-single-folder-or-directory-from-a-github-repo).