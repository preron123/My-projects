const ShorturlModel = require('../models/ShorturlModel')
const shortid = require('shortid')
const ValidUrl = require('valid-url')

const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    15207,
    "redis-15207.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("YhqhQbKeONPvek3OQDMh30jaBgLnntwY", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


// ========================================createUrl==============================================

const createUrl = async function (req, res) {
    try {
        let cahcedUrlData = await GET_ASYNC(`${req.body.longUrl}`)
        if (cahcedUrlData) {
            res.status(200).send({ status: true, data: cahcedUrlData })
        } else {
            let body = req.body
            if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "plzz give some data" });

            let longUrl = body.longUrl
            if (!ValidUrl.isWebUri(longUrl)) return res.status(400).send({ status: false, message: "Enter valid URL" })

            let urlCode = shortid.generate(longUrl)
            let shortUrl = `http://localhost:3000/${urlCode}`

            let finalData = {
                urlCode: urlCode,
                longUrl: longUrl,
                shortUrl: shortUrl
            }

            let urlCreated = await ShorturlModel.create(finalData)

            await SET_ASYNC(`${longUrl}`, JSON.stringify(urlCreated))
            res.status(201).send({ status: true, data: urlCreated })
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
// ========================================getUrl==============================================
const getUri = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        if (!urlCode) return res.status(400).send({ status: false, msg: "Enter urlCode" });

        let cahcedUrlData = await GET_ASYNC(`${urlCode}`) 
        console.log(typeof cahcedUrlData)
        if (cahcedUrlData) {
            res.status(200).send({ status: true, data: cahcedUrlData })
        } else {

            const isUrlCodePresent = await ShorturlModel.findOne({ urlCode: urlCode })
            if (!isUrlCodePresent) return res.status(404).send({ status: false, message: "invalid urlCode" })

            await SET_ASYNC(`${urlCode}`, JSON.stringify(isUrlCodePresent))
            
            let url = isUrlCodePresent.longUrl
            return res.redirect(302, url)
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createUrl, getUri }

