const express= require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const pageRouter = require('./routes/page');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const nunjucks = require('nunjucks');
const passport = require('passport');


const {sequelize} = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();
passportConfig();

app.set('port', process.env.PORT || 3000);
app.set('view engine','html');

nunjucks.configure('views',{
    express : app,
    watch : true,

});
sequelize.sync({force : false})
    .then(()=>{
        console.log('데이터 베이스 연결 성공');
    })
    .catch((error)=>{
        console.error(error);
    })

app.use(express.static(path.join(__dirname,'public')));
app.use('/img',express.static(path.join(__dirname,'uploads')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    
    cookie : {
        httpOnly : true,
        secure : false,
    },
    
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/',pageRouter); // 페이지 이동 라우터
app.use('/auth',authRouter); // 로그인 인증 라우터
app.use('/post',postRouter); // 게시글 관리 라우터



app.use((req, res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})



app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})


app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 서버 대기 중');
});
































// 내가 구상하고 있는 어플리케이션 : 유튜브 (링크)혹은 자신이 mp3 파일을 올릴 수도 있다.

// 여러 사람들이 음악을 공유하고 별점 혹은 댓글을 달 수 있다.

// 좋아요 혹은 별점에 따른 순위를 볼 수 있도록 하는 것이 이 프로젝트의 목표