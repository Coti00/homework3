const express = require('express');
const dbConnect = require("./config/dbConnect");
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',  // 허용할 출처
    methods: 'GET,POST',              // 허용할 메소드
    allowedHeaders: 'Content-Type,Authorization', // 허용할 헤더
}));

dbConnect();


// EJS 설정
app.set('view engine', 'ejs'); // EJS를 뷰 엔진으로 설정
app.set('views', 'views'); //

app.get("/",(req,res) => {
    res.render('users/login');
});

app.get("/register",(req,res) => {
    res.render('users/register');
});
app.get('/main', (req, res) => {
    res.render('layouts/main');  
});

app.get('/profile',(req,res) => {
    res.render('users/profile');
});
app.get('/editprofile', (req,res) => {
    res.render('users/editprofile');
});
app.get('/companyinfo',(req,res)=>{
    res.render('company/companyinfo');
});
app.get('/companyreview',(req,res) => {
    res.render('company/review');
});
app.get('/companyappend',(req,res)=>{
    res.render('company/companyappend');
});
app.get('/jobappend',(req,res)=>{
    res.render('job/jobappend');
});


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/company", require("./routes/CompanyRoutes"));
app.use("/auth", require("./routes/UserRoutes"));
app.use("/jobs", require("./routes/JobRoutes"));
app.use("/applications",require("./routes/ApplicationRoutes"));
app.use("/review",require("./routes/CompanyReviewRoutes"));

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log("서버 실행 중");
})


