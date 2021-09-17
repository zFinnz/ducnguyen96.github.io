---
title: "Microservices với NodeJS phần 11 - Code Sharing and Reuse Between Services"
date: 2021-09-16 00:00:00
draft: false
categories: [backend, devops]
categories_weight: 4
tags: [microservices, nodejs, monoliths, architecture, backend, devops]
tags_weight: 4
---

![microservice-dg-138](/images/microservices-dg-138.png)
Chúng ta thấy những phần như `Custom Error`, `Auth Middleware`, `Request Validation` là những thành phần chung giữa các server nên ta sẽ tạo ra 1 package `common` và cài đặt package này cho những services cần thiết.

## Options for Code Sharing

Có một số cách để share code giữa các services như sau:

### Copy Paste

![microservice-dg-139](/images/microservices-dg-139.png)
Cách này thì hẳn không ai muốn dùng rồi, vì khó có thể đồng bộ code mỗi khi cần thay đổi common.

### Git Module

![microservice-dg-140](/images/microservices-dg-140.png)
Cách này thì giải quyết được vấn đề trên rồi nhưng hơi phức tạp và khó sử dụng.

### Npm package

![microservice-dg-141](/images/microservices-dg-141.png)
Cách này đơn giản nhất, mỗi khi cần update common, ta chỉ cần đẩy lên npm repo với version mới và chạy `npm update @ducnguyen96/ticketing-common` chẳng hạn .

## NPM Organizations

![microservice-dg-142](/images/microservices-dg-142.png)
Vì private registry mất phí và lại project này cũng open nên mình dùng public registry với organization. Bạn nào muốn sử dụng private registry hoặc tự host thì tự tìm hiểu nhé 😄

## Publising NPM Modules

![microservice-dg-143](/images/microservices-dg-143.png)

### 1. Init package

```sh
mkdir common
npm init -y
```

### 2. Install dependencies

```sh
tsc --init
npm i typescript del-cli --save-dev
```

### 3. Update package.json

```json
// package.json
{
  "name": "@ducnguyen96/ticketing-common",
  "scripts": {
    "clean": "del ./build/*",
    "build": "npm run clean && tsc",
    "pub": "git add . && git commit -m \"Updates\" && npm version patch && npm run build && npm publish"
  },
  "main": "build/index.js",
  "types": "build/index.d.ts",
  "files": ["build/**/*"]
}
```

### 4. Update tsconfig

in `tsconfig.json` uncomment `declaration`; change `outDir` to `./build`

### 5. Write some code

Copy thư mục `errors` và `middlewares` từ auth service

```ts
// index.ts
export * from "./errors/bad-request-error";
export * from "./errors/custom-error";
export * from "./errors/database-connection-error";
export * from "./errors/not-authorized-error";
export * from "./errors/not-found-error";
export * from "./errors/request-validation-error";

export * from "./middlewares/current-user";
export * from "./middlewares/error-handler";
export * from "./middlewares/require-auth";
export * from "./middlewares/validate-request";
```

Install dependencies

```sh
npm i express express-validator cookie-session jsonwebtoken @types/cookie-session @types/express @types/jsonwebtoken
```

### 6. Build and Publish

Build

```sh
tsc
```

Publish

```sh
npm login
npm publish --access public
```

## Install và Update common

Install

```sh
npm i @ducnguyen96/ticketing-common
```

Update

```sh
npm update @ducnguyen96/ticketing-common
```
