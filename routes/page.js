const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {renderTitle, renderMain, renderUpload, renderLogin,renderMyPage, renderModify,renderPost ,renderPostAll, renderViewPage} = require('../controllers/page');

const router = express.Router();

router.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
    // 아래의 모든 페이지 라우터에서 user를 공통으로 쓸 수 있도록 함. (미들웨어 변수)
});

// 페이지 라우터들

router.get('/',renderTitle);
router.get('/main',renderMain);
router.get('/upload',isLoggedIn,renderUpload);
router.get('/login',isNotLoggedIn,renderLogin);
router.get('/mypage',isLoggedIn ,renderMyPage);
router.get('/modify-post/:id',isLoggedIn,renderModify);
router.get('/viewPost/:id',renderPost);
router.get('/postAll', renderPostAll);
router.get('/viewPage/:id',renderViewPage);

module.exports = router; 

// 최종적으로 router 를 외부에서 사용하기 위한 exports 


