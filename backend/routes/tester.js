var express = require('express');
var router = express.Router();
var path = require('path');

// This route returns the zipped pdfs
router.get('/', function(req, res) {
    // Find the locally stored pdf
    let pathToPdf = path.join(__dirname, '/../pdfs.zip')

    // Send The File
    res.sendFile(pathToPdf)
})

module.exports = router;