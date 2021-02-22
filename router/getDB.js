const express = require('express');
const router = express.Router();
const { Tracking } = require("../models/Tracking"); 
const { UserReq } = require("../models/userReq"); 


router.get('/' , (req, res, next) => {

    UserReq.find({ 
        reqCreated : { $gte :  '20210219', $lte: '20210222' },
        name : "봉승우",
        call : "010",
        mieleRes : { $exists: true },
        // mieleMemo : { $exists: false },
    }, (err, data) => {
        if(err) return res.json(err)

        if (data) {
            return res.json(data)
        }else{
            return res.json({
                success: false,
                message: "해당 데이터를 찾지 못했습니다.",
                data : data
            });
        }
    })

})


module.exports = router;