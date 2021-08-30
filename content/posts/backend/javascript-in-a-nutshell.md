---
title: "Javascript in a nutshell"
date: 2021-08-30
draft: false
categories: [backend]
categories_weight: 6
tags: [javascript, js, backend]
tags_weight: 6
---
Do bài viết có rất nhiều mục và dài nên bạn đọc nhìn vào Table Of Content (TOC) ở side-bar bên phải để đọc mục mình quan tâm nhé.
## Variables
### var
**"var" không có block scope**
```javascript
if (true) {
  var test = true; // dùng "var" thay "let"
}

alert(test); // true, var không có block scope nên nó được kéo ra khỏi block scope.
```
Nếu một block nằm trong 1 function thì `var` sẽ trở thành biến `function-level`
```javascript
function sayHi() {
  if (true) {
    var phrase = "Hello";
  }

  alert(phrase); // works
}

sayHi();
alert(phrase); // ReferenceError: phrase is not defined
```
**"var" chấp nhận khai báo lại**
Nếu chúng ta khai báo 1 biến với `let` 2 lần trong cùng 1 scope thì sẽ lỗi
```javascript
let user;
let user; // SyntaxError: 'user' has already been declared
```
Với var, chúng ta có thể khai báo lại bao nhiêu lần tùy ý.
```javascript
var user = "Pete";

var user = "John"; // this "var" does nothing (already declared)
// ...it doesn't trigger an error

alert(user); // John
```
**"var" có thể khai báo sau khi sử dụng**
```javascript
function sayHi() {
  phrase = "Hello";

  alert(phrase);

  var phrase;
}
sayHi();
```
Đoạn code trên tương đương với
```javascript
function sayHi() {
  var phrase;

  phrase = "Hello";

  alert(phrase);
}
sayHi();
```
Đây được gọi là `hoisting` (kéo lên), vì tất cả `var` đều được kéo lên đầu của 1 hàm.
**Khai báo thì được kéo lên còn gán giá trị thì không**
```javascript
function sayHi() {
  alert(phrase);

  var phrase = "Hello";
}

sayHi();
```
Đoạn code trên tương đương với
```javascript
function sayHi() {
  var phrase; // declaration works at the start...

  alert(phrase); // undefined

  phrase = "Hello"; // ...assignment - when the execution reaches it.
}

sayHi();
```

### let
**"let" có block scoped chứ không phải global scope hay local scope**
```javascript
let greeting = "say Hi";
let times = 4;
if (times > 3) {
   let hello = "say Hello instead";
   console.log(hello); // "say Hello instead"
   }
console.log(hello); // hello is not defined
```

**"let" cho phép gán lại giá trị, không cho phép khai báo lại**
```javascript
let greeting = "say Hi";
console.log(greeting); //"say Hi"

greeting = "say Hello instead";
console.log(greeting); //"say Hello instead"
-----------------------------------------------------
let greeting = "say Hi";
let greeting = "say Hello instead"; // error: Identifier 'greeting' has been declared
```

**"let" có hoisted không ?**
Tham khảo ở [đây](/posts/backend/javascript-in-a-nutshell/#hoisted)

### const
`const` thì giống với `let` ở chỗ nó cũng có block scope và hoisting, tuy nhiên nó không thể gán lại giá trị của biến. Tuy nhiên đối với biến dạng reference (object, array, function) thì ta vẫn có thể cập nhật được giá trị thuộc tính của biến đó.
```javascript
const greeting = {
  message : "Hello",
  number : "five"
}
greeting.message = "say Hello instead";
console.log(greeting); // {message:"say Hello instead",number:"five"}
```

## Hoisted
Tất cả các khai báo trong javascript (var, let, const, function, function*, class) đều được `hoisted`. Có nghĩa là nếu một biến được khai báo trong 1  scope, thì trong scope đó, định danh của nó sẽ luôn trỏ đến biến đó. Xem ví dụ dưới đây:
```javascript
x = "global";
// function scope:
(function() {
    x; // not "global"

    var/let/… x;
}());
// block scope (not for `var`s):
{
    x; // not "global"

    let/const/… x;
}
```
Ở trên ta có x được khai báo ở global scope, tuy nhiên ở trong function và block kia đều khai báo lại biến đó ở dưới cùng của block và nó được neo lên đầu, chính vì thế mà x không có giá trị là "global".

## Loops
### Labels for break/continue
Đôi khi ta muốn break khỉ nhiều vòng lặp lồng nhau cùng lúc.
```javascript
for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // what if we want to exit from here to Done (below)?
  }
}

alert('Done!');
```
Ví dụ chúng ta cần 1 cách để dừng xử lý khi người dùng cancel input. Break thông thường sẽ chỉ dừng 1 vòng lặp. Khi đó chúng ta sẽ cần đến label.
```
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) break outer; // (*)

    // do something with the value...
  }
}
alert('Done!');
```
Ở đoạn code trên, `break outer` đã tìm lên và thấy 1 label với tên `outer` và break vòng lặp đó.

Chúng ta cũng có thể sử dụng label cho cả `continue`, lúc đó thì code sẽ thực hiện nhảy đến vòng lặp tiếp theo của loop đã được đánh nhãn.

## Functions
### A Function Declaration can be called earlier than it is defined.
```javascript
sayHi("John"); // Hello, John

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

```javascript
sayHi("John"); // error!

let sayHi = function(name) {  // (*) no magic any more
  alert( `Hello, ${name}` );
};
```
### Khi nào sử dụng Function Declaration vs Function Expression.
Như một quy luật, khi khai báo 1 function thì đầu tiên ta cân nhắc sử dụng Function Declaration. Nó giúp chúng ta sắp xếp code dễ dàng hơn vì chúng ta có thể gọi nó trước khi nó được khai báo.

Nhưng nếu Function Declaration không phù hợp vì 1 số lý do hoặc chúng ta cần 1 khai báo có điều kiện thì khi đó nên sử dụng Function Expression.

```javascript
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  function() { alert("Hello!"); } :
  function() { alert("Greetings!"); };

welcome(); // ok now
```

## The JavaScript "this" keyword
- In a method, this refers to the owner object.
- Alone, this refers to the global object.
- In a function, this refers to the global object.
- In a function, in strict mode, this is undefined.
- In an event, this refers to the element that received the event.
- Methods like call(), and apply() can refer this to any object.

## Object references and copying
### Khi một biến được gán vào 1 object thì nó không lưu trữ object đó mà là "địa chỉ bộ nhớ" - nói cách khác là "1 reference" tới object.
```javascript
let user = {
  name: "John"
};
```
Object được lưu ở đâu đấy trong bộ nhớ và biến user có 1 reference tới nó.

Chúng ta có thể xem user như 1 tờ giấy có địa chỉ có object trên đó. Khi chúng ta thực hiện action lên object chẳng hạn như `user.name` thì JavaScript engine sẽ nhìn lên địa chỉ đó và tìm đến object thực sự trong bộ nhớ và thực hiện hành động lên đó.
### Khi một biến object được cope thì địa chỉ được copy chứ không phải cái object mà địa chỉ trỏ đến, vì vậy object sẽ không được nhân bản lên.
```javascript
let user = { name: 'John' };

let admin = user;

admin.name = 'Pete'; // changed by the "admin" reference

alert(user.name); // 'Pete', changes are seen from the "user" reference
```
### Cloning and merging, Object.assign
```javascript
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

// copies all properties from permissions1 and permissions2 into user
Object.assign(user, permissions1, permissions2);

// now user = { name: "John", canView: true, canEdit: true }
```

## Rest parameters and spread syntax
### Rest parameters ...
```javascript
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) ); // 3
```

```javascript
function sumAll(...args) { // args is the name for the array
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```
### The “arguments” variable
```javascript
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // it's iterable
  // for(let arg of arguments) alert(arg);
}

// shows: 2, Julius, Caesar
showName("Julius", "Caesar");

// shows: 1, Ilya, undefined (no second argument)
showName("Ilya");
```
### Spread syntax
```javascript
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (spread turns array into a list of arguments)
```
## Lexical Environment
Trong JavaScript, tất cả các function, code block {...}, và cả file script đều có 1 internal object liên kết với chúng được ẩn đi là *Lexial Environment*

Object Lexical Environment thì chứa 2 phần:
- Environment Record - là một object lưu trữ tất cả các biến local và các thuộc tính của nó.
- Một reference đến outer lexical environment để kết nối với các code bên ngoài block hoặc function.

![search-lexical-environment](/images/search-lexical-environment)
Khi một đoạn code muốn truy cập vào biến thì inner Lexical Environment sẽ được tìm kiếm đầu tiên -> outer -> outer .... -> global one.

### Closure
![closure](/images/closure.png)
Closure là một function mà có thể nhớ các biến bên ngoài của nó và có thể truy cập chúng. Ở một số ngôn ngữ thì điều này là không thể  hoặc là function đó phải được viết một cách đặc biệt. Nhưng với JavaScript thì mọi functions đều là closures.

Hầu hết thì một Lexical Environment sẽ được loại khỏi bộ nhớ cùng với tất cả các biến sau khi function đã thực hiện xong vì không có references nào tới nó nữa.

Tuy nhiên, nếu có một function lồng nhau và nó vẫn reachable thì sau khi function kết thúc, thì nó vẫn có các property mà trỏ đến lexical environment.

Như ví dụ ở trên, counter() sau khi được gọi lần 1 nó thực hiện makeCounter() và trả về 0, tuy nhiên thì counter vẫn reachable và do đó các biến trong makeCounter vẫn được dữ lại, vì thế nếu bạn gọi counter() 1 lần nữa thì nó sẽ trả về 1, tiếp theo là 2, 3, ...

## The "new Function" syntax
```javascript
function getFunc() {
  let value = "test";

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```
Tất cả function đều nhớ nó được tạo ra ở đâu nhờ vào 1 thuộc tính đặc biệt là `[[Environment]]`. Nó trỏ đến Lexical Environment nơi nó được tạo ra.

Nhưng nếu function được tạo sử dụng synxtax `new Function` thì `[[Environment]]` của nó sẽ được set để trỏ đến glocal Lexical Environment chứ không phải Lexical Environment. So với hàm được tạo 1 cách thông thường:
```javascript
function getFunc() {
  let value = "test";

  let func = function() { alert(value); };

  return func;
}

getFunc()(); // "test", from the Lexical Environment of getFunc
```
