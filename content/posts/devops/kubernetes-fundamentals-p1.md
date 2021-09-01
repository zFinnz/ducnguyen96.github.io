---
title: "Kubernetes fundamentals phần 1 - Overview"
date: 2021-09-01
draft: true
categories: [devops, backend]
categories_weight: 4
tags: [microservices, monoliths, architecture, backend, devops, kubernetes]
tags_weight: 4
---
## Kubernetes là gì ?
Kubernetes là một nền tảng open-source để quản lý các services và workloads đã được container hóa, nó giúp việc khai báo, cấu hình và tự động hóa một cách dễ hàng hơn.

Cái tên kubernetes có nguồn gốc từ Hy Lạp, có nghĩa là thuyền trưởng hoặc là hoa tiêu. K8s là viêt tắt của K, số lượng ký tự giữa K và s, s.

**Quay ngược lại quá khứ**
![container-evolution](/images/container_evolution.svg)
**- Deployment truyền thống**: Thời kỳ đầu, các tổ chức chạy apps trên các servers vật lý. Lúc đó thì không có cách nào để định rõ giới hạn về resource của 1 app trên server vật lý, và điều này gây nên vấn đề về phân phối tài nguyên. Ví dụ, nếu có nhiều ứng dụng chạy cùng lúc trên cùng 1 server vật lý, thì có thể có 1 app sẽ chiếm hầu hết result khiến các app còn lại kém hiệu quả. Một giải pháp cho vấn đề này là chỉ chạy 1 app trên 1 server vật lý, nhưng cách này khiến chúng ta không scale được vì sử dụng resource kém hiệu quả hơn nữa thì việc duy trì nhiều server vật lý cùng lúc cũng rất đắt đỏ.

**- Deployment với ảo hóa**: Như một kết quả thì ảo hóa được ra đời. Nó cho phép bạn chạy nhiều máy ảo trên 1 server vật lý. Ảo hóa cho phép các app được cô lập giữa các máy ảo và cung cấp nhiều tầng bảo mật vì các thông tin của 1 app không thể bị truy cập một cách dễ dàng bởi các app khác.

Ảo hóa cho phép sử dụng resource tốt hơn trên 1 server vật lý và giúp việc scale tốt hơn vì một app có thể được thêm và update một cách dễ dàng, giảm chi phí phần cứng,... 

Mỗi máy ảo là một machine chạy tất cả các components bao gồm cả hệ điều hành trên các phần cứng ảo.

**- Deployment với container**: Containers tương tự với máy ảo, nhưng chúng có các thuộc tính thoải mái hơn để chia sẻ OS giữa các app.
![container](/images/WhatIsALinuxContainer_Image.webp)
Như hình ở trên ta có thể thấy thì các container có cùng 1 host OS.

Containers ngày càng phổ biến vì chúng mang tới những lợi ích sau:
- Tạo và triển khai các app nhanh hơn
- CICD: việc build và deploy container image nhanh chóng và đáng tin cậy hơn, với khả năng rollbacks hiệu quả (do tính bất biến của image).
- Phân tách Dev với Ops: tạo container images ở build/release time thay vì deployment time ==> tách app ra khỏi infrastructure.
- Khả năng quan sát: không chỉ hiện thị thông tin và số liệu ở OS-level mà còn hiển thị tình trạng ứng dụng và các tín hiệu khác.
- Tính nhất quán về môi trường xuyên suốt quá trình developement, testing, production: chạy trên laptop cũng giống như chạy trên cloud.
- Chạy trên tất cả các distro, tất cả nền tảng cloud.
- Micro-services: app được tách ra làm các service nhỏ độc lập có thể deploy và quản lý 1 cách linh hoạt.
- Resource được cô lập => hiệu suất app có thể dự đoán được.
- Hiệu quả sử dụng resource được tăng cao.

### Tại sao lại cần đến Kubernetes ?
Containers là một cách tốt để đóng gói và chạy app của bạn. Trong một môi trường production, bạn cần quản lý các containers để chạy các app và đảm bảo không có downtime. Ví dụ, nếu 1 container down thì 1 container khác cần phải chạy thay thế. Và sẽ dễ dàng hơn nếu có 1 hệ thống có thể quản lý việc này.

Và đây là lúc Kubernetes ra đời. Kubernetes cung cấp co bạn 1 framework để chạy các hệ thống phân tán (distributed systems) một cách đảm bảo hơn. Nó đảm nhận việc scale và chuyển đổi container cho app của bạn, nó cung cấp các pattern về deployment,... Ví dụ kubernetes có thể dễ dàng quản lý một [canary deployment](/posts/devops/deployment-strategies/).

Kubernetes cung cấp cho bạn:
- **Service discovery and load balancing**: Kubernetes có thể expose container sử dụng DNS hoặc là IP. Nếu mà traffice quá tới container quá lớn nó có thể cân bằng tải và phân phối lại traffic để deployment ổn định hơn.
- **Storage orchestration**: Cho phép bạn tự động mount 1 hệ thống lưu trữ tùy vào lựa chọn của bạn, chẳng hạn như local storages, cloud providers,...
- **Tự động hóa rollouts và rollbacks**: Thay đổi trạng thái đối 1 trạng thái mong muốn, chẳng hạn như có thể tự động hóa việc tạo containers mới, xóa containers và chuyển resources đến container mới.
- **Automatic bin packing**: Điều khiển resource cho từng container để tối ưu hóa resource.
- **Self-healing**: Restart những container failed, thay thế containers, kill containers mà không responed, không để client sử dụng cho đến khi container đã sẵn sàng.
- **Secret and configuration management**: Giúp quản lý các thông tin nhạy cảm như passwords, OAuth tokens và SSH keys.
## Kubernetes components ?
Khi bạn deploy Kubernetes, bạn có 1 cluster.

Kubernetes cluster chứa các máy chủ, được gọi là các nodes, mỗi node thì chạy các containerized apps (app được container hóa). Mọi cluster đều có ít nhất 1 node.

Mỗi node lại host các Pods, là các components của một app workload. Control plane (bộ điều khiển) quản lý các nodes và các pods trong cluster.
![components-of-kubernetes.svg](/images/components-of-kubernetes.svg)
### Control Plane Components
Các components của contrl plane đưa ra các global decisions (ví dụ như scheduling), cũng như phát hiện và phản hồi đến các cluster events (ví dụ, start new pod khi)