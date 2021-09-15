---
title: "Microservices với NodeJS phần 3 - Running Services With Docker"
date: 2021-09-08
draft: false
categories: [backend, devops]
categories_weight: 4
tags: [microservices, nodejs, monoliths, architecture, backend, devops]
tags_weight: 4
---

Vậy là mini app của chúng ta đã hoàn tất, bây giờ chúng ta bắt đầu nghĩ đến việc deploy nó online để người khác có thể truy cập vào.

Trước tên hay xem lại app của chúng ta đang được thực thi như thế nào trên local.
![microservices-dg-57](/images/microservices-dg-57.png)

Hiện tại thì mỗi service đều chạy trên 1 port cụ thể và có thể giao tiếp với nhau qua axios. Vậy làm sao ta có thể thay đổi 1 chút và deploy toàn bộ app này? Cách dễ nhất là lên aws thuê 1 instance EC2 sau đó clone toàn bộ project về chạy từng service một như chạy trên local. Cách này thì hoàn toàn giúp chúng ta deploy và user có thể truy cập được nhưng hãy thử nghĩ xem nếu app có nhiều lượng truy cập thì sẽ như thế nao ?

## Deployment Issues

Lấy ví dụ chẳng hạn sẽ có 1 lượng lớn user tạo comment, lúc này chúng ta cần phải tạo thêm instance cho comments để có thể handle lượng requests và cách đơn giản nhất là tạo thêm 2 comment service nữa chẳng hạn ở port 4006 và 4007. Vậy ta có 3 comment service ở port 4001, 4006 và 4007, lúc user tạo comment mới ta sẽ cân bằng tải 3 service này (cân bằng lượng request đến 3 service, điều chỉnh xem request mới nên gửi tới service nào cho cân bằng).

### Issues

Có một vài thách thức với cách tiếp cận trên:
![microservices-dg-58](/images/microservices-dg-58.png)

- Mỗi service mới sẽ được gắn 1 port mới. Và nhớ là eventbus cần biết được chính xác port của service để gửi event, nên nếu chúng ta muốn update port hoặc tăng giảm số lượng instance của service thì phải thay đổi trực tiếp vào code và deploy lại.
  ![microservices-dg-59](/images/microservices-dg-59.png)

- Trường hợp xấu hơn khi số lượng service tăng nhiều và máy ảo bạn thuê không còn đủ đáp ứng nữa, bạn sẽ phải thuê thêm 1 máy ảo và phân bố bớt lượng service sang máy ảo mới. Lúc này EventBus không chỉ phải theo dõi port của service mới mà còn phải biết cách giao tiếp với máy ảo thứ 2, tức là bạn phải update địa chỉ ip của máy ảo thứ 2 đó trong code và việc này rất là phiền phức.

- Một trường hợp nữa là chẳng hạn vào ban ngày lượng user vào app của bạn cực kỳ nhiều và bạn thuê thêm máy ảo, nhưng lúc về đêm thì user giảm sâu, lúc này bạn muốn tiếp kiệm chi phí nên tạm thời ngừng thuê máy ảo mới, bạn sẽ phải thêm điều kiện check thời gian cho phần code gửi request đến máy ảo mới.

### Conclusion

- Kết luận là cách tiếp cận trên chưa biết có sử dụng tốt hay không nhưng thực sự là quá phức tạp và rắc rối, chúng ta cần giải pháp thay thế tốt hơn.
- Chúng ta cần một giải pháp có thể theo dõi toàn bộ các services chạy trong app, có khả năng tạo copies của 1 service lúc cần thiết,... và docker, kubernetes có thể giúp bạn điều này.

## Why Docker ?

📔 Bạn đọc có thể tham khảo thêm [ở đây](/posts/backend/docker-fundamentals/)
![microservices-dg-60](/images/microservices-dg-60.png)
Sử dụng docker ta sẽ đóng gói các services lại thành các containers.

**Tại sao lại sử dụng docker ?**

- Hiện tại cách chạy app của chúng ta thì ta đang giả định là môi trường chạy app sẽ giống với môi trường local. Chẳng hạn với `yarn start` thì ta đang giả định là môi trường production của app cũng đã cài đặt yarn và nodejs.
- Thứ 2 là chúng ta cũng cần biết câu lệnh chính xác để có thể chạy app của mình (yarn start)
- Docker giải quyết cả 2 vấn đề trên, nó đóng gói toàn bộ package cùng code mà app cần để chạy, nó cũng cung cấp cho ta config cách run ứng dụng.

**Tại sao lại sử dụng kubernetes ?**
Đầu tiên kubernetes là gì ?
![microservices-dg-61](/images/microservices-dg-61.png)

- Nói một cách đơn giản, kubernetes là một công cụ để chạy các containers một cách đơn giản và dễ hiểu.
- Ta cung cấp cho nó 1 config file miêu tả cách ta muốn containers chạy và tương tác với nhau.

![microservices-dg-62](/images/microservices-dg-62.png)
Sử dụng Kubernetes ta sẽ tạo 1 Kubernetes Cluster - một bộ các máy ảo khác nhau, có thể là một hoặc hàng trăm ngàn máy. Mỗi máy thì được xem là 1 `Node` và được quản lý bởi Master - là chương trình sẽ quản lý tất cả mọi thứ trong cluster.

Ta sẽ sử dụng Kubernetes để chạy ứng dụng, ứng dụng của chúng ta được đóng gói thành container sau đó thì được cân bằng tải assign vào 1 trong các node. Cụ thể như sau:

![microservices-dg-63](/images/microservices-dg-63.png)
Ta sẽ tạo ra một số config files cung cấp những chi tiết cụ thể mà ta muốn Kubernetes thực hiện. Chẳng hạn như chạy 2 copies của PostService và cho phép truy cập vào 2 copies đấy. Master sẽ đọc config files và implement tất cả các bước mà ta viết trong đấy.

Issue về vấn đề giao tiếp giữa các service khi mỗi service có nhiều copies cũng được giải quyết bởi Kubernetes, lúc này Event Bus chỉ việc gửi request đến kênh giao tiếp chung và chúng sẽ được forwarded đến service cần thiết.

## Dockerizing Posts Service

![microservices-dg-64](/images/microservices-dg-64.png)

```Dockerfile
FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
```

Build image

```sh
docker build -t ducnguyen96/mini-microservice-postservice:0.0.1 .
```

Run container

```sh
docker run -it --name mini-microservice-postservice -p 4000:4000 ducnguyen96/mini-microservice-postservice:0.0.1
```

## Review Some Basic Commands

![microservices-dg-65](/images/microservices-dg-65.png)
