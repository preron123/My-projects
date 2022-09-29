const ShorturlModel = require('../models/ShorturlModel')

const createUrl = async function (req, res) {
    try {
         data = req.body
         
    } catch (error) {
        res.status(500).send({ status: false, msg:error.message })
    }
}

module.exports = {createUrl}
