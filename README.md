# 채용정보 사이트

채용정보를 제공하는 웹 애플리케이션

## 📋 프로젝트 기본 정보

- **프로젝트명**: 알려잡!
- **목적**: Node.js,Express,MongoDB를 활용하여 채용정보 사이트를 개발하며 백엔드 개발 스킬 향상
- **주요 기능**:
  - 사용자 로그인 / 회원가입 / 회원정보 수정
  - 채용 정보 조회 / 필터링 / 추가 / 지원
  - 북마크 추가 / 삭제 / 조회
  - 회사 정보 추가 / 수정 / 삭제 / 리뷰 작성(작성자만 삭제 가능)
  
## 🛠 기술 스택

- **백엔드**: Node.js, Express
- **프런트엔드**: HTML, CSS, JavaScript
- **데이터베이스**: MongoDB(Atlas)
- **API**: RESTful API
- **기타** : Mongoose, JWT, dotenv

## 🚀 설치 및 실행 가이드

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

1. **레포지토리 클론**
    git clone https://github.com/Coti00/homework3.git
3. **패키지 설치**
    npm install
4. **환경 변수 설정**
    프로젝트 루트에 .env 파일을 생성하고, 아래와 같은 내용을 추가하세요
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>
    JWT_SECRET=your-secret-key
5. **데이터베이스 준비**
    MongoDB를 설정하고 연결 URL(MONGO_URI)을 .env 파일에 추가하세요.
    초기 데이터를 삽입하려면 MongoDB에 파일을 삽입하는 js코드 작성후 node 파일명을 통해 데이터를 저장하세요
6. **서버 실행**
    node app
    애플리케이션이 기본적으로 http://localhost:3000에서 실행됩니다.


## 📂 프로젝트 주요구조 설명
```bash
homework3/
├── config
│   └── dbConnect.js            
│   └── swagger.config.js  
├── controllers
│   ├── ApplicationController.js        
│   ├── ApplicationStatsController.js
│   ├── CompanyController.js 
│   ├── CompanyReviewController.js 
│   ├── JobController.js       
│   └── UserController.js  
├── middleware
│   └── authMiddleware.js    
├── models
│   ├── ApplicationModel.js              
│   ├── ApplicationStatsModel.js
│   ├── BookmarkModel.js  
│   ├── CompanyModel.js  
│   ├── CompanyReviewModel.js  
│   ├── JobModel.js  
│   ├── Userlog.js             
│   └── UserModel.js  
├── routes
│   ├── ApplicationRoutes.js             
│   ├── CompanyReviewRoutes.js  
│   ├── CompanyRoutesRoutes.js          
│   ├── JobRoutes.js          
│   └── UserRoutes.js                   
├── views
│   ├── company
│   │   ├── companyappend.ejs
│   │   └──  companyinfo.ejs  
│   ├── job
│   │   └──  jobappend.ejs     
│   ├── layouts
│   │   └──  main.ejs                
│   ├── partials
│   │   └──  jobCard.ejs  
│   ├── users
│   │   ├──  editprofile.ejs
│   │   ├──  login.ejs
│   │   ├──  profile.ejs
│   └── └──  register.ejs                          
├── app.js                   
└── README.md                    
```
## 📋 주요 기능 설명
1. 사용자 인증
    JWT를 사용한 로그인 및 회원가입
    사용자 활동 보호를 위한 인증 미들웨어

2. 채용정보
    채용정보 조회 및 필터링 (회사 이름, 연봉, 유형 등으로 필터링)
    회사 정보 관리 (CRUD)

3. 채용 지원
    특정 채용공고에 지원
    지원 내역 확인 및 취소

4. 활동 기록
    사용자가 수행한 활동(지원, 지원 취소 등)의 기록 조회

## 📝 참고 사항
이 프로젝트는 교육 목적으로 만들어졌으며 상업적 용도로 사용되지 않습니다.

