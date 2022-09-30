const ShorturlModel = require('../models/ShorturlModel')
const shortid = require('shortid')
const ValidUrl = require('valid-url')
// ========================================createUrl==============================================

const createUrl = async function (req, res) {
    try {
        let body = req.body
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "plzz give some data" });

        let longUrl = body.longUrl
        if (!ValidUrl.isWebUri(longUrl)) return res.status(400).send({ status: false, message: "Enter valid URL" })
      
        const islongUrlPresent = await ShorturlModel.findOne({longUrl:longUrl })
        if (islongUrlPresent) return res.status(201).send({ status: true, message:"ShortId Is Already Generated",data: islongUrlPresent })

        let urlCode = shortid.generate(longUrl)
        let shortUrl = `http://localhost:3000/${urlCode}`

        let finalData = {
            urlCode: urlCode,
            longUrl: longUrl,
            shortUrl: shortUrl
        }

        let urlCreated = await ShorturlModel.create(finalData)
        res.status(201).send({ status: true, data: urlCreated })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
// ========================================getUrl==============================================
const getUri = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        if (!urlCode) return res.status(400).send({ status: false, msg: "Enter urlCode" });

        const isUrlCodePresent = await ShorturlModel.findOne({ urlCode: urlCode })
        if (!isUrlCodePresent) return res.status(404).send({ status: false, message: "invalid urlCode" })

        let url = isUrlCodePresent.longUrl
        return res.redirect(302, url)
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createUrl, getUri }
