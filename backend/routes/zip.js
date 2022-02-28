var express = require("express");
var router = express.Router();
var JSZip = require("jszip");
var fetch = require("node-fetch");
var fs = require("fs");

// basic get route that tells you what to do
router.get("/", function (req, res) {
  res.status(200).send("Hello World")
});

// post route that does the zippingl
router.post("/", function (req, res) {
  if (!Array.isArray(req.body.files)) {
    res.status(400).json({
      error: "Please be sure that the type is []Array",
    });
  }
  if (req.body.files.length === 0) {
    res.status(400).json({
      error: "There is no data in your array",
    });
  } 
  try {
    renameAndZip(req.body.names, req.body.files);
  } catch (e) {
    res.status(299).json({e});
  }

  // Function call
  async function renameAndZip(nameAttay, pdfArray) {
    var zip = new JSZip();
    var pdfZip = zip.folder("pdfs");

    const getData = async function (urlNum, url) {
      await fetch(url)
        .then((response) => response.blob())
        .then((response) => response.arrayBuffer())
        .then((response) => {
          pdfZip.file(`${nameAttay[urlNum]}.pdf`, response, {
            base64: true,
          });
          try {
            pdfZip
              .generateNodeStream({
                type: "nodebuffer",
                streamFiles: true,
              })
              .pipe(fs.createWriteStream("pdfs.zip"))
              .on("finish", function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
              });
          } catch (error) {
            console.error(error);
          }
        });
    };

    const finalizedPdfArray = await Promise.all(pdfArray.map((pdf, pdfnum) => {
      getData(pdfnum, pdf);
    }));
    res.status(200).send("ready for fetching");
  }
});

module.exports = router;
