const ShorturlModel = require('../models/ShorturlModel')
const ValidUrl = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/

const createUrl = async function (req, res) {
    try {
        let body = req.body
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "plzz give some data" });

        let longUrl = body.longUrl
        if(!longUrl.match(ValidUrl)) return res.status(400).send({status:false,message:"Enter valid URL"})



        res.status(201).send({ status: true, data: longUrl })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createUrl }
