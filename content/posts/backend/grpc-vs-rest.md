---
title: "gRPC, REST, OpenAPI và khi nào sử dụng chúng khi thiết kế API"
date: 2021-10-03 00:00:00
draft: true
categories: [backend]
categories_weight: 10
tags: [backend]
tags_weight: 9
---

Như hầu hết các software developers đều biết, có 2 models chính cho thiết kế API: RPC và REST. Bất kể model nào, hầu hết các API ngày nay đều được triển khai bằng cách map chúng theo cách này hay cách khác với cùng một giao thức HTTP. Việc thiết kế RPC API cũng trở nên phổ biến khi áp dụng một trong hai ý tưởng từ HTTP trong khi vẫn ở trong mô hình RPC, điều này đã làm tăng phạm vi lựa chọn cho developers. Bài này sẽ cố gắng giải thích các lựa chọn và đưa ra hướng dẫn để lựa chọn phù hợp.

gRPC là công nghệ triển khai các RPC APIs sử dụng HTTP 2.0 làm giao thức truyền tải.
Bạn có thể cho răng gRPc và HTTP loại bỏ lẫn nhau vì chúng dựa trên các mô hình đối lập. gRPC dựa trên Remote Procedure Call (RPC) model, trong đó các addressable entities là các thủ tục và dữ liệu được ẩn đằng sau các thủ tục. HTTP hoạt động theo cách ngược lại. Trong HTTP các addressable entities là các "thực thể dữ liệu" (được gọi là tài nguyên trong HTTP) và các behaviors được ẩn sau dữ liệu - behavior của hệ thống là kết quả của việc tạo, sửa đổi và xóa tài nguyên.

Trên thực tế, nhiều API được tạo ở Google và các nơi khác kết hợp RPC với một vài ý tưởng từ HTTP theo một cách thú vị. Các APIs này áp dụng mô hình hướng thực thể (entity-oriented) cũng như HTTP, nhưng được xác định và triển khai bằng gRPC và các API kết quả có thể được gọi bằng cách sử dụng các công nghệ HTTP tiêu chuẩn. Ta sẽ cố gắng miêu tả cách hoạt động của nó cũng như giải thích tại sao nó có thể tốt và không tốt cho bạn.

Trước tiên, hãy xem xét kỹ hơn cách HTTP thường được sử dụng cho các API.

## Ba cách chính để sử dụng HTTP cho APIs

Hầu hết các public APIs và nhiều private APIs phân tán (private distributed APIs) sử dụng HTTP làm phương tiện truyền tải, ít nhất một phần là do các tổ chức đã quen với việc xử lý các vấn đề bảo mật khi cho phép HTTP traffic trên các cổng 80 và 443

Theo ý kiến của tôi, có 3 cách tiếp cận chính để build APIs sử dụng HTTP:

- REST
- gRPC (Apache Thrift và một vài công nghệ khác)
- OpenAPI (và các đối thủ cạnh tranh)

## REST

Model ít được sử dụng nhất là REST - chỉ một số ít API được thiết kế theo cách này, mặc dù từ REST được sử dụng (hoặc lạm dụng) rộng rãi hơn. Đặc điểm nổi bật của API kiểu này là các clients không tạo URL từ các thông tin khác - chúng chỉ sử dụng các URL của server. Đây là cách browsers hoạt động - nó không xây dựng các URL và nó không hiểu được các định dạng dành riêng cho trang web của các URL mà nó sử dụng; nó chỉ theo dõi một cách mù quáng các URL mà nó tìm thấy trong trang hiện tại nhận được từ server, hoặc được bookmarked từ các trang trước đó hoặc được nhập bởi người dùng. Việc phân tích cú pháp URL duy nhất mà trình duyệt thực hiện là trích xuất thông tin cần thiết để gửi một HTTP request và cấu trúc HTTP duy nhất mà browsers thực hiện là tạo một URL tuyệt đối từ URL tương đối và URL cơ sở. Nếu API của bạn là REST API, thì client của bạn không bao giờ phải hiểu định dạng URL của bạn và các định dạng đó không phải là một phần của đặc tả API được cung cấp cho clients

REST APIs có thể rất đơn giản. Rất nhiều công nghệ bổ sung đã được phát minh để sử dụng với các REST API - ví dụ: JSON API, ODATA, HAL, Siren hoặc JSON Hyper-Schema và những công nghệ khác - nhưng bạn không cần bất kỳ công nghệ nào trong đó để làm tốt REST.

## gRPC

Model thứ hai sử dụng HTTP cho API được minh họa bởi gRPC. gRPC sử dụng HTTP/2 nhưng HTTP không được exposed tới developers. Các `stubs`(client side object) and `skeletons`(server side object) do gRPC tạo ra cũng ẩn HTTP khỏi client và server, vì vậy không ai phải lo lắng về cách các khái niệm RPC được map với HTTP, chúng ta chỉ cần học về gRPC.

- Cách một client sử dụng gRPC API là làm theo 3 bước sau:
  - Quyết định thủ tục (procedure) nào để call.
  - Tính toán các giá trị tham số cần sử dụng nếu có.
  - Sử dụng stub được gen ra để call, chuyển các giá trị tham số

## OpenAPI

Có lẽ là cách phổ biến nhất để thiết kế các RPC APIs sử dụng HTTP là sử dụng các ngôn ngữ đặc tả (specification languages) như OpenAPI (trước đây gọi là Swagger specification)

Đặc điểm nhận dạng của OpenAPI là client sử dụng API bằng cách xây dụng các URLs từ thông tin khác. Cách client sử dụng OpenAPI API:

- Quyết định URL path template để sử dụng
- Tính toán các tham số cần sử dụng nếu có
- Gắn các giá trị tham số vào đường dẫn và gửi HTTP request.

Rõ ràng một API hoạt động theo cách này không phải là một REST API. Phương pháp OpenAPI sử dụng HTTP yêu cầu client phải có kiến thức chi tiết về định dạng của URL mà chúng sử dụng trong các request và để tạo URL phù hợp với định dạng đó từ thông tin khác. Điều này trái ngược với cách hoạt động của REST API, nơi client hoàn toàn không biết các định dạng của URL mà chúng sử dụng và không bao giờ phải xây dụng chúng. Mô hình được OpenAPI hỗ trợ rất phổ biến và thành công và là một trong những lựa chọn quan trọng nhất dành cho các developers - thực tế là mô hình OpemAPI không phải là REST không làm giảm tính hữu dụng hoặc tầm quan trọng của nó.

Điều thứ hai mà bạn có thấy nhận thấy là client model sử dụng OpenAPI rất giống với mô hình gRPC. Trong trường hợp ứng dụng client gRPC chọn một thủ tục để gọi thì OpenAPI client chọn URL path template để sử dụng. gRPC và OpenAPI đều tính toán các giá trị tham số. Trong trường hợp gRPC client sử dụng một thủ tục`stub` để kết hợp các tham số với `procedure signature` để call thì OpenAPI client sẽ chèn các giá trị tham số vào mẫu đường dẫn URL và đưa ra HTTP request. Các chi tiết là khác nhau nhưng mô hình tổng thể là rất giống nhau.

## RPC rất đơn giản và trực quan

```
createAccount(username, contact_email, password) -> account_id
addSubscription(account_id, subscription_type) -> subscription_id
sendActivationReminderEmail(account_id) -> null
cancelSubscription(subscription_id, reason, immediate=True) -> null
getAccountDetails(account_id) -> {full data tree}
```

REST

```
POST /accounts <headers> (username, contact_email, password)> -> account_URL
POST /subscriptions <headers> (account_URL, subscription_type) -> subscription_URL
POST /activation-reminder-outbox <headers> (account_URL) -> email_URL
POST /cancellations <headers> (subscription_URL, reason, immediate=True) -> cancellaton_URL
GET {account_URL} ->  {full data tree}
```

## Các lợi thế của REST

Những lợi thế đã được khẳng định của REST về cơ bản là những lợi thế của chính www, như tính ổn định, tính đồng nhát và tính phổ quát. Chúng được ghi lại ở những nơi khác, và REST dù sao cũng là lợi ích thiểu số, vì vậy ta sẽ không tập trung vào chúng quá nhiều. Một ngoại lệ là hướng thực thể vốn có trong HTTP/REST model. Tính năng này được quan tâm đặc biệt vì nó được thảo luận rộng rãi và được chấp nhận bởi những người đề xuất các non-REST models như gRPC và OpenAPI.

Theo kinh nghiệm của tôi, các entity-oriented models đơn giản hơn, dễ hiểu hơn và ổn định hơn theo thời gian so với các mô hình RPC đơn giản. Các RPC APIs có xu hướng phát triển một cách hữu cơ khi quy trình sau khi thủ tục khác được thêm vào, mỗi thủ tục thực hiện một hành động mà hệ thống có thể thực hiện.

Model hướng thực thể cung cấp một tổ chức tổng thể cho các hành vi của hệ thống. Ví dụ: tất cả chúng ta đều quen thuộc với mô hình thực thể của mua sắp trực tuyến, với các sản phẩm, giỏ hàng, đơn đặt hàng, tài khoản, ... Nếu khả năng đó được thể hiện chỉ bằng các thủ tục RPC, nó sẽ dẫn đến một danh sách dài, không có cấu trúc các thủ tục để duyệt danh mục sản phẩm, thêm chúng vào giỏ hàng, thanh toán, theo dõi việc giao hàng và trả lại sản phẩm.

Danh sách nhanh chóng trở nên quá tải và rất khó để đạt được sự nhất quán giữa các định nghĩa thủ tục. Một cách để đưa cấu trúc và trật tự vào danh sách là mô hình hóa tất cả các hành vi bằng cách sử dụng một bộ thủ tục tiêu chuẩn cho từng lọai thực thể. HTTp vốn có hướng thực thể, nhưng bạn cũng có thể thêm hướng thực thể vào RPC, nhưu sẽ thảo luận ở phần sau. Nhóm các thủ tục theo kiểu thực thể cũng là một trong những ý tưởng quan trọng của ngôn ngữ hướng đối tượng.

## Sử dụng OpenAPI như thế nào

Trong OpenAPI, bạn xác định những thế được gọi là paths. OpenAPI path trông giống thế này trong YAML:

```yaml
paths:
  /pets/{petId}:
    get:
      operationId: getPetById
      parameters:
        - name: petId
          in: path
          required: true
          description: The id of the pet to retrieve
          schema:
            type: string
```

## OpenAPI advantages and disadvantages

Theo ý kiến của tôi, OpenAPi có hai điểm cơ bản tạo nên sự thành công của nó. Đầu tiên là mô hình OpenAPI tương tự như mô hình RPC truyền thống mà hầu hết các developers đều quen thuộc và thoải mái. Mô hình cũng phù hợp với các khái niệm về ngôn ngữ lập trình mà chúng sử dụng. Lý do thứ hai là nó cho phép các lập trình viên xác định tùy chỉnh cách map của các khái niệm RPC tới HTTP request.
