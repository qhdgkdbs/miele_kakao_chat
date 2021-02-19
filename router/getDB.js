const express = require('express');
const router = express.Router();
const { Tracking } = require("../models/Tracking"); 

router.get('/' , (req, res, next) => {

    Tracking.find({ name:"곽경진"}, (err, data) => {
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