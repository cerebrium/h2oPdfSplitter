export async function renameAndZip(nameAttay, pdfArray) {
    var zip = new JSZip();
    var pdfZip = zip.folder("pdfs");

    let getData = async function (urlNum, url) {
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
    res.status(200).json(finalizedPdfArray);
  }