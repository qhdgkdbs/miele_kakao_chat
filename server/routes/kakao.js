const express = require('express');
const router = express.Router();
const { Kakao } = require("../models/Kakao");

//=================================
//             User
//=================================

router.get("/hello", (req, res) => {
    res.status(200).json({
        name : "hello"
    })
})

// cat 0 추가 해주고, 데이터 저장 와료,
// 필요한 데이터는 이름, 전화번호, 문의 내용
router.post("/customerInq", (req, res) => {
    const kakao = new Kakao(req.body);
    kakao.cat = "0"; 

    kakao.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
})

// cat 1 추가 해주고, 데이터 저장 와료,
// 필요한 데이터는 이름, 전화번호, 바우처 번호
router.post("/boucher", (req, res) => {
    const kakao = new Kakao(req.body);
    console.log(kakao)
    // $.extend(user, {"cat": "0"} );
    kakao.cat = "1"; 
    console.log(kakao)

    kakao.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
})

router.get("/customerShipping", (req, res) => {
    res.status(200).json({
        name : "hello"
    })
})



// router.get("/auth", auth, (req, res) => {
//     res.status(200).json({
//         _id: req.user._id,
//         isAdmin: req.user.role === 0 ? false : true,
//         isAuth: true,
//         email: req.user.email,
//         name: req.user.name,
//         lastname: req.user.lastname,
//         role: req.user.role,
//         image: req.user.image,
//     });
// });

// router.post("/register", (req, res) => {

//     const user = new User(req.body);

//     user.save((err, doc) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).json({
//             success: true
//         });
//     });
// });

// router.post("/login", (req, res) => {
//     User.findOne({ email: req.body.email }, (err, user) => {
//         if (!user)
//             return res.json({
//                 loginSuccess: false,
//                 message: "Auth failed, email not found"
//             });

//         user.comparePassword(req.body.password, (err, isMatch) => {
//             if (!isMatch)
//                 return res.json({ loginSuccess: false, message: "Wrong password" });

//             user.generateToken((err, user) => {
//                 if (err) return res.status(400).send(err);
//                 res.cookie("w_authExp", user.tokenExp);
//                 res
//                     .cookie("w_auth", user.token)
//                     .status(200)
//                     .json({
//                         loginSuccess: true, userId: user._id
//                     });
//             });
//         });
//     });
// });

// router.get("/logout", auth, (req, res) => {
//     User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).send({
//             success: true
//         });
//     });
// });

module.exports = router;
