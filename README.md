<h1>
  <div>
  expense-tracker2022(<a href="https://pure-thicket-75563.herokuapp.com/users/login">Live Demo</a>)
  </div>
  <div>
  <img src="https://img.shields.io/badge/release-v2.3-yellow" >
  
  <img src="https://img.shields.io/badge/express-4.17.1-green.svg" >
  
  <img src="https://img.shields.io/badge/Database-MongoDB-yellowgreen.svg">

  <img src="https://img.shields.io/github/last-commit/SheonXJ/expense-tracker2022" >
  
  <img src="https://img.shields.io/docker/image-size/sheonzeng/expense-tracker2022/latest">
  </div>
</h1>

運用 `Bootstrap` 搭配 `Express` 框架，使用 `MongoDB` 資料庫打造的記帳程式。

使用者可以註冊成為會員，或是用 Facebook 帳號進行第三方登入，紀錄生活中的每一筆開銷，開銷可以再進行項目的分類，同時依照消費時間及開銷項目等方式提供分析功能。

提供`Repo`及`Docker`兩種測試方式。


# 目錄<!-- omit in toc -->
- [功能介紹](#功能介紹)
- [安裝流程](#安裝流程)
    - [`Github-Repo`](#github-repo)
    - [`Docker-Image`](#docker-image)
- [種子資料](#種子資料)


# 功能介紹
  * 提供使用者登入、登出及註冊帳號功能
    * 可使用Facebook等第三方認證登入
  * 人性化操作介面
    * 主要透過日曆直接選擇日期的方式直接紀錄支出
  * 提供支出分析圖表與數據追蹤
    * 消費Top3、消費類別、每月平均支出追蹤...等等


# 安裝流程
提供兩種安裝方式，可以透過`Github`下載專案在本地測試，也可以透過`Docker`直接下載`image`進行測試。
### `Github-Repo`
  * 利用終端機(Terminal)，Clone專案至目標位置
    ```
    git clone https://github.com/SheonXJ/expense-tracker2022.git
    ```

  * 進入專案資料夾後，安裝 npm packages
    ```
    npm install
    ```
  
  * 在專案根目錄建立檔案`.env`，並設定MongoDB及Facebook環境變數
    ```
    PORT=3000
    MONGODB_URI="skip"
    FACEBOOK_ID='skip'
    FACEBOOK_SECRET='skip'
    FACEBOOK_CALLBACK='skip'
    ```
    * 如要使用本地資料庫，`MONGODB_URI`可直接輸入`mongodb://localhost/<project_name>`
    * 如不需使用Facebook登入，`ID` `SECRET` `CALLBACK`可以不用設定
  
  * 載入種子資料
    ```
    npm run seed
    ```

  * 開啟伺服器
    ```
    npm run dev
    ```


### `Docker-Image`
  * 下載Docker image
    ```
    docker pull sheonzeng/expense-tracker2022
    ```
  * 建立Container
    ```
    docker run -dp 3000:3000 sheonzeng/expense-tracker2022
    ```


# 種子資料
  ```
  name: User1
  email: user1@example.com
  password: 12345678
  ```

  ```
  name: User2
  email: user2@example.com
  password: 12345678
  ```
  