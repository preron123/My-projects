const mongoose = require("mongoose");
const ShortUrlSchema = new mongoose.Schema(
  {
    urlCode: { mandatory, unique, lowercase, trim },
    longUrl: { mandatory, validurl },
    shortUrl: { mandatory, unique }
  }

);

module.exports = mongoose.model("ShortUrl", ShortUrlSchema);
