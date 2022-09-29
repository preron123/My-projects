const ShorturlModel = require('../models/ShorturlModel')
const validUrl = require("valid-url")
const shortid = require("shortid")


// ### POST /url/shorten
// - Create a short URL for an original url recieved in the request body.
// - The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
// - Return the shortened unique url. Refer [this](#url-shorten-response) for the response
// - Ensure the same response is returned for an original url everytime
// - Return HTTP status 400 for an invalid request

const isValidUrl = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/



const createUrl = async function (req, res) {
    try {
        let longUrl = req.body.longUrl

        //  if( validUrl.isUri(longUrl) &&( validUrl.isHttpUri(longUrl) || validUrl.isHttpsUri(longUrl))){
        //     console.log(longUrl," ..")
        //     // res.send(longUrl)
        //  }
        //  if(validUrl.isUri(longUrl) && validUrl.isWebUri(longUrl)){
        //     console.log(longUrl)
        //     res.send(longUrl)
        //  }

        // //  res.send("hi")

        if (!longUrl.match(isValidUrl)) return res.status(400).send({ status: false, message: "enter valid URL" })

        //   https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143

        let isPresentUrl = await ShorturlModel.findOne({ longUrl: longUrl })

        if (isPresentUrl) return res.status(200).send({ status: true, message: "success", data: isPresentUrl })


        let urlCode = shortid.generate(longUrl)

        let shortUrl = `http://localhost:3000/${urlCode}`

        let finalData = {
            urlCode: urlCode,
            longUrl: longUrl,
            shortUrl: shortUrl
        }

        let urlCreated = await ShorturlModel.create(finalData)

        res.status(201).send({ status: true, message: "success", data: urlCreated })


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createUrl }
