# Print Ware

A multi-platform software project using React.js, React Native, and Node.js for printing services.

## Structure

- **web/**: React web application.
- **mobile/**: React Native mobile application.
- **server/**: Node.js backend server.

## Installation

### Web Application
1. Navigate to `web` directory:
    ```sh
    cd web-app
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

### Mobile Application
1. Navigate to `mobile` directory:
    ```sh
    cd moble
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

### Backend Server
1. Navigate to `server` directory:
    ```sh
    cd server
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

### Web Application
To start the web application:
```sh
cd web
npm start
```

## Workflow

### New feature
To start working a new feature, create a new `feature` branch from `develop`
```sh
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```
When it's done, merge the feature into `develop`
```sh
git checkout develop
git pull origin develop
git merge feature/my-new-feature
git push origin develop
```
You can alse delete that feature branch after it's merged
1. Delete local
```sh
git branch -d feature/my-new-feature
```
2. Delete remote
```sh
git push origin --delete feature/my-new-feature
```

### Release new version
To release a new version, create a new `release` branch from `develop`
```sh
git checkout develop
git pull origin develop
git checkout -b release/my-new-version
```

When it's done, merge the release into `develop` and `main`
```sh
git checkout develop
git pull origin develop
git merge release/my-new-version
git push origin develop

git checkout main
git pull origin main
git merge release/my-new-version
git push origin main
```

### Hotfix
When there is a bug or an issue, create a new `hotfix` branch from `develop`
```sh
git checkout develop
git pull origin develop
git checkout -b hotfix/my-new-hotfix
```

http://localhost:3000/spso/printerList -> lấy danh sách máy in

http://localhost:3000/spso/printer/printer1 -> thông tin máy in 1( tương tự cho các máy khác) 

http://localhost:3000/spso/roomlist -> lấy danh sách phòng chứa máy in

http://localhost:3000/spso/historyLog -> lấy lịch sử

http://localhost:3000/spso/config -> lấy cấu hình

Đã thêm các phương thức update,delete.

Các phương thức update(pageSizes,pageUnitPrice,defaultConfig khi dùng postman thì cần có id của config để tiến hành update ví dụ

{

    "configId": "config1",
    
    "pageSizes": ["A4", "A3"]
    
}

 Khi addPrinter thì cần đầy đủ các thông số 
 
                printerId,
                
                roomId,
                
                detail,
                
                config,
                
                jobQueue = [],
                
                historyDocRepo = []

Khi xóa máy in thì /removePrinter/:printerId ví dụ /removePrinter/printer2
 