---
title: "ACID trong cơ sở dữ liệu"
date: 2021-08-24 10:00:27
draft: false
categories: [backend]
categories_weight: 9
tags: [backend, acid, database, db]
tags_weight: 9
---
**Transaction là một đơn vị logic nó thực hiện việc truy xuất và chỉnh sửa nội dung của database. Để duy trì tính thống nhất cả database trước và sau khi thực hiện transaction thì cần tuân theo một số tính chất và được viết tắt là ACID**

## Atomicity (/æt.əˈmɪs.ɪ.ti/) và Consistency
Yêu cầu transaction phải thực hiện 1 cách hoàn chỉnh hoặc là không thực hiện, chứ không có việc chỉ thực hiện 1 phần. 

Nó liên quan đến 2 thứ:
- **Abort**: Nếu 1 transaction bị hủy bỏ thì những thay đổi đã được thực hiện sẽ không còn nữa.
- **Commit**: Nếu 1 transaction được commit thì những thay đổi sẽ được ghi lại.

2 tính chất này nó liên quan chặt chẽ đến nhau.

Ví dụ bạn có 2 table: `product_templates` và `products` với relation là `One-To-Many` 1 product template có nhiều products con. product_template có 1 trường là `min_price` là giá trị thấp nhất trong tất cả các `price` là thuộc tính của products.

Ta thực hiện 1 transaction thực hiện 2 việc là `delete product` và `update min_price`. Nếu transaction đó sau khi thực hiện việc delete product và bị lỗi thì data sẽ không còn đúng nữa.

## Isolation
Thuộc tính này đảm bảo rằng có nhiều transaction có thể thực hiện đồng thời mà không dẫn đến database không còn nhất quán. Các transactions phải được thực thi một cách độc lập mà không có bất cứ sự can thiệp nào. Những thay đổi từ 1 transaction thì sẽ không được thấy ở các transcations khác cho đến khi những thay đổi ấy được ghi vào bộ nhớ hoặc đã được commited.

Ví dụ: ta có X = 10, Y = 5 và 2 transaction T và T'

|T|T'|
|:-:|:-:|
|Read(X)| Read(X)|
|X:= X*10| Read(Y)|
|Write(X)| Z:=X+Y|
|Read(Y)| Write(Z)|
|Y:=Y-2|
|Write(Y)

Ở ví dụ trên nếu transaction T thực hiện xong bước Write(X) và transaction T' bắt đầu, nếu không đảm bảo tính cô lập của các transaction thì X ở T' sẽ có giá trị là 100 dẫn tới Z = 100 + 5 = 105. Trường hợp T không commit mà rollback thì sẽ dẫn đến X quay lại là 10 và Z sẽ sai.

1. Can my inflight transaction see changes made by other transactions ?
Điều này còn tùy thuộc vào developer, chẳng hạn như ví dụ ở trên nếu không có isolation nào thì T' sẽ Read(X) với giá trị không mong muốn.
2. Read phenomena: khi thiếu isolation như ví dụ ở trên thì sẽ dẫn tới việc Read 1 giá trị nào đấy không đúng nữa.
3. Isolation Levels: Để tránh Read phenomena thì ta sẽ thực hiện isolation cho transaction.

## Durability
Tính chất này đảm bảo rằng 1 khi mà transaction đã thực thi xong thì những thay đổi đến database sẽ được ghi vào ổ đĩa và chúng vẫn sẽ được dữ ngay cả khi có 1 lỗi hệ thống xảy ra chẳng hạn như lỗi phần mềm hoặc là mất điện 😢. (Committed Data is never lost)