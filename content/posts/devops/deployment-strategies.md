---
title: "Deployment strategies: Blue-Green, Canary and more"
date: 2021-09-01
draft: false
categories: [devops]
categories_weight: 4
tags: [deploy, strategies, canary, blue-green, devops, kubernetes]
tags_weight: 4
---
Dù cố ý hay không thì việc deployment software thì khác nhau giữa các công ty, team và giữa các app. Điều này khiến việc deploy như chơi 1 trò chơi: tung con xúc xắc và cố để sống sót. May mắn là, có một vài cách để hạn chế các biến thể trong việc thành công deploy app. Bài này sẽ thảo luận về các strategies và các practices giúp bạn có thể thành công trong việc deploy ứng dụng của bạn.

Các deployment strategies là các practices được sử dụng để thay đổi cũng như upgrade một instance của app. Dưới đây sẽ giải thích 6 deployment strategies. Bắt đầu với Basic Deployment.

## The Basic Deployment
Trong basic deployment, tất cả các nodes trong một môi trường được update cùng lúc với 1 version service mới hoặc artifact mới. Vì điều này, thì hệ thống với basic deployment không thể tránh việc sập toàn bộ hệ thống(outage-proof) và quá trình rollbacks cũng mất nhiều thời gian hơn. Đây là strategies rủi ro nhất.
![basic-deployment](/images/basic_deployment.png)
**Pros:**
- Điểm lợi đầu tiên có thể thấy đó là nó đơn giản, nhanh và chi phí thấp.

**Cons:**
- Không outage-proof, rủi ro, roolbacks khó khăn.

## Multi-Service Deployment
Trong Multi-Service Deployment, tất cả các nodes trong một môi trường được update với nhiều services cùng lúc. Strategy này được sử dụng cho các services của app mà có depend vào service khác hoặc depend vào version.
![multi-service_deployment](/images/multi-service_deployment.png)
**Pros:**
- Đơn giản, nhanh, chi phí thấp và rủi ro không cao như basic deployment.

**Cons:**
- Rollbacks lâu và không outage-proof. Sử dụng strategy này cũng khiến việc quản lý, testing và xác minh dependencies khó khăn.
## Rolling Deployment
Là một strategy mà update các instances của 1 app với new release. Tất cả các node trong một môi trường được update cùng với version của service hoặc artifact theo `batches`.
![rolling_deployment](/images/rolling_deployment.png)

**Pros:**
- Tương đối đơn giản để rollback, ít rủi ro hơn so với basic deployment và việc triển khai cũng khá đơn giản.

**Cons:**
- Vì các nodes được update theo batches nên rolling deployment yêu cầu các service phải support cả version mới và cũ của 1 artifact. Việc xác minh mỗi batch cũng làm việc deploy chậm đi.

## Blue-Green Deployment
Đầu tiên strategy này đảm bảo chất lượng cũng như test độ chấp nhận của người dùng trong môi trường staging host version mới hoặc phiên bản có thay đổi. Sau khi test thì traffic được đổ từ môi trường production sang môi trường staging.
**Pros:**
- Đơn giản, nhanh, dễ hiểu và dễ implement. Rollbacks không phức tạp vì bạn có thể đơn giản là đổ traffic ngược lại đến môi trường trước đó. Vì vậy mà strategy này cũng ít rủi ro hơn.
**Cons:**
- Chi phí là một điểm trừ đối với strategy này. Việc nhân đôi môi trường production là phức tạp và tốn kém, đặc biệt đối với các app sử dụng kiến trúc microservices. Việc testing trước khi đổ traffic có thể không phát hiện được tất cả các điểm dị thường nên tồn tại rủi ro ở đây. Một sự cố xảy ra có thể ảnh hưởng lớn trước khi rollback xảy ra và tùy việc vào việc implement thì các transaction đang xảy xa cố thể bị mất khi thực hiện việc đổ traffic.

## Canary Deployment
Release app hoặc service theo từng set user tăng dần (ví dụ: 2%, 25%, 75%, 100%) vì thế nên có rủi ro thấp nhất so với các strategy ở trên.
![canary_deployment](/images/canary_deployment.png)
**Pros:**
- Cho phép test ở production với user thật với các trường hợp và so sánh sự khác nhau giữa các version. Chi phí thấp hơn so với Blue-Green vì nó không yêu cầu 2 môi trường production. Nhanh và an toàn hơn khi rollback.
**Cons:**
- Implement phức tạp, kiểm tra và test có thể mất nhiều thời gian.

## A/B Testing
Các version khác nhau của cùng 1 service có thể chạy đồng thời trong cùng 1 môi trường như là để thử nhiệm. Các thí nhiệm thì hoặc là được điều khiển bởi các thay đổi flags của feature, hoặc các tools cho A/B testing hoặc thông qua việc deployments riêng biệt. Thông thường thì user traffic được đổ dựa vào các quy luật riêng biệt hoặc dựa và các nhóm user để có thể đo đạc và so sánh giữa các versions của service. Môi trường muốn update có thể được update với phiên bản service tối ưu nhất.
![a-b-testing](/images/ab-testing.png)
Điểm khác biệt lớn nhất giữa A/B testing và các deployment strategies là nó chỉ tập trung chủ yếu vào việc đánh giá và thử nghiệm trong khi các strategies khác thì deploy với mục đích là update tất cả các nodes với 1 phiên bản xác định.
**Pros:**
- Là một phương pháp tiêu chuẩn, dễ dàng và chi phí thấp để test các tính năng mới trong production. Và may mắn là có nhiều tools hỗ trợ A/B testing.
**Cons:**
- Thử nhiệm thỉnh thoảng có thể làm sập cả app hoặc 1 service, cũng có thể ảnh hưởng đến trải nhiệm của người dùng. Và việc scripting cho AB tests cũng có thể phức tạp.

## Nên sử dụng deployment strategy nào ?
Còn tùy thuộc vào ứng dụng của bạn nhưng hầu hết các teams sẽ sử dụng blue-green hoặc canary. Việc kết hợp các strategy với nhau cũng khá phổ biến.
