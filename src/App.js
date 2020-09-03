import React, { useState, useEffect } from 'react';
import './App.css';
import XLSX from 'xlsx';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from 'axios'

var objectForDownload = null
var arrayForDownload = []

let devArray = [
  {FileName: "Invoices 02Sep2020.pdf", FileExt: "pdf", FileSize: 39013, FileId: "1a8e6ca3890cd7ae3b748ab6ecad329c", Url: "https://v2.convertapi.com/d/1a8e6ca3890cd7ae3b748ab6ecad329c/Invoices%2002Sep2020.pdf"},
  {FileName: "Invoices 02Sep2020-2.pdf", FileExt: "pdf", FileSize: 38767, FileId: "5720f85f93e03d4c7122fdd8c9587446", Url: "https://v2.convertapi.com/d/5720f85f93e03d4c7122fdd8c9587446/Invoices%2002Sep2020-2.pdf"},
  {FileName: "Invoices 02Sep2020-3.pdf", FileExt: "pdf", FileSize: 39030, FileId: "7f186be43ca875953c9b937e19f4dc17", Url: "https://v2.convertapi.com/d/7f186be43ca875953c9b937e19f4dc17/Invoices%2002Sep2020-3.pdf"},
  {FileName: "Invoices 02Sep2020-4.pdf", FileExt: "pdf", FileSize: 39030, FileId: "5773cb045d7b7b6c918e901d57d0256a", Url: "https://v2.convertapi.com/d/5773cb045d7b7b6c918e901d57d0256a/Invoices%2002Sep2020-4.pdf"},
  {FileName: "Invoices 02Sep2020-5.pdf", FileExt: "pdf", FileSize: 39009, FileId: "547320a2e73f35621daf82cdfeaa7e2e", Url: "https://v2.convertapi.com/d/547320a2e73f35621daf82cdfeaa7e2e/Invoices%2002Sep2020-5.pdf"},
  {FileName: "Invoices 02Sep2020-6.pdf", FileExt: "pdf", FileSize: 39020, FileId: "9f7d2d08d831e51c85b2fa8ce378e1b2", Url: "https://v2.convertapi.com/d/9f7d2d08d831e51c85b2fa8ce378e1b2/Invoices%2002Sep2020-6.pdf"},
  {FileName: "Invoices 02Sep2020-7.pdf", FileExt: "pdf", FileSize: 39011, FileId: "5bddd09d82190c0566470cfe93153060", Url: "https://v2.convertapi.com/d/5bddd09d82190c0566470cfe93153060/Invoices%2002Sep2020-7.pdf"},
  {FileName: "Invoices 02Sep2020-8.pdf", FileExt: "pdf", FileSize: 38770, FileId: "b954fb6850e16dc8735b45cafb387a29", Url: "https://v2.convertapi.com/d/b954fb6850e16dc8735b45cafb387a29/Invoices%2002Sep2020-8.pdf"},
  {FileName: "Invoices 02Sep2020-9.pdf", FileExt: "pdf", FileSize: 38785, FileId: "ccf4ddeff348e1004a3ee396ecf7b6e3", Url: "https://v2.convertapi.com/d/ccf4ddeff348e1004a3ee396ecf7b6e3/Invoices%2002Sep2020-9.pdf"},
  {FileName: "Invoices 02Sep2020-10.pdf", FileExt: "pdf", FileSize: 38778, FileId: "5787aba034641c60bcc9293f2dcd1e05", Url: "https://v2.convertapi.com/d/5787aba034641c60bcc9293f2dcd1e05/Invoices%2002Sep2020-10.pdf"},
  {FileName: "Invoices 02Sep2020-11.pdf", FileExt: "pdf", FileSize: 38767, FileId: "0067b92523218842439753a3fbb47a2d", Url: "https://v2.convertapi.com/d/0067b92523218842439753a3fbb47a2d/Invoices%2002Sep2020-11.pdf"},
  {FileName: "Invoices 02Sep2020-12.pdf", FileExt: "pdf", FileSize: 39015, FileId: "9341c6d89b77da97f0736124e400a1c3", Url: "https://v2.convertapi.com/d/9341c6d89b77da97f0736124e400a1c3/Invoices%2002Sep2020-12.pdf"},
  {FileName: "Invoices 02Sep2020-13.pdf", FileExt: "pdf", FileSize: 39267, FileId: "48fb16c81dc1228b65fa6098b4138e86", Url: "https://v2.convertapi.com/d/48fb16c81dc1228b65fa6098b4138e86/Invoices%2002Sep2020-13.pdf"},
  {FileName: "Invoices 02Sep2020-14.pdf", FileExt: "pdf", FileSize: 38653, FileId: "5bc6b1decb11471b4e694d4ac7a443a8", Url: "https://v2.convertapi.com/d/5bc6b1decb11471b4e694d4ac7a443a8/Invoices%2002Sep2020-14.pdf"},
  {FileName: "Invoices 02Sep2020-15.pdf", FileExt: "pdf", FileSize: 39218, FileId: "7c2ff4f2496eabcc7aa33078cf10f24d", Url: "https://v2.convertapi.com/d/7c2ff4f2496eabcc7aa33078cf10f24d/Invoices%2002Sep2020-15.pdf"},
  {FileName: "Invoices 02Sep2020-15.pdf", FileExt: "pdf", FileSize: 39218, FileId: "7c2ff4f2496eabcc7aa33078cf10f24d", Url: "https://v2.convertapi.com/d/7c2ff4f2496eabcc7aa33078cf10f24d/Invoices%2002Sep2020-15.pdf"}
]

let devObject = {
  'ALEKSANDAR TOTEV': "WEEK 35 INV 6438 DSN1",
  'BRUNO CROSCATO': "WEEK 35 INV 6423 DSN1",
  'BRUNO KURSCHAT': "WEEK 35 INV 6424 DSN1",
 'CARLOS CONCEICAO': "WEEK 35 INV 6425 DSN1",
  'EVELYN RIBEIRO': "WEEK 35 INV 6426 DSN1",
  'FABIO USTULIN': "WEEK 35 INV 6427 DSN1",
  'IOLANDA DE LIMA': "WEEK 35 INV 6428 DSN1",
  'LEONARDO LUGLI': "WEEK 35 INV 6429 DSN1",
  'MARCELO BARBOSA': "WEEK 35 INV 6430 DSN1",
  'MARCOS CORDEIRO': "WEEK 35 INV 6433 DSN1",
  'MARCUS SIMPLICIO': "WEEK 35 INV 6431 DSN1",
  'MARIN KOSTOV': "WEEK 35 INV 6432 DSN1",
  'NIKOLAY KEHAYOV': "WEEK 35 INV 6434 DSN1",
  'PAULO MARCHESI': "WEEK 35 INV 6435",
  'PEDRO JESUS PAULOS': "WEEK 35 INV 6436 DSN1",
  'STANIMIR GEORGIEV': "WEEK 35 INV 6437 DSN1"
}

const handleTests = () => {
  let finalArray = []
  let localArrayOfNames = []
  for (const key in devObject) {
    localArrayOfNames.push(`${key} ${devObject[key]}`)
  }
  devArray.forEach( (ele, eleId) => {
    ele.FileName = localArrayOfNames[eleId]
    finalArray.push(ele)
  })
  console.log(finalArray)
  
}
handleTests()

function App() {
  const [ arrayOfData, setArrayOfData ] = useState([])
  const [ displayArray, setDisplayArray ] = useState([])
  const [ numPages, setNumPages ] = useState(null);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pdfFile, setPdfFile ] = useState(null)
  const [ downloadButton, setDownloadButton ] = useState(null)
  const [ arrayForDownloading, setArrayForDownloading ] = useState([])
  const [ objectForDownloading, setObjectForDownloading ] = useState(null)
  const [ downloadGate, setDownloadGate ] = useState(false)
  const [ secondDownloadGate, setSecondDownloadGate ] = useState(false)

  // pdf part
  const handleUploadpdf = (e) => {
    if (e.target.files[0].size > 0) {
      // create form data
      const data = new FormData()
      data.append('file', e.target.files[0])

      // split it via the api
      axios.post('https://v2.convertapi.com/convert/pdf/to/split?Secret=LWvPUHAaYjdklEQ7&StoreFile=true', data).then( response => {
        if (response.status === 200) {
          console.log(response.data.Files)
          setArrayForDownloading(response.data.Files)
          arrayForDownload = response.data.Files
          setSecondDownloadGate(true)
        }
      }) 
      // setPdfFile(e.target.files[0])
    }
  }

  // load success
  const onDocumentLoadSuccess = ({ numPages}) => {
    console.log(numPages)
    setNumPages(numPages);
  }

  // handle changing the page
  const handleChangePage = () => {
    if (pageNumber < numPages) {
      let currentPage = pageNumber
      setPageNumber(currentPage+1)
    }
  }

  // handle downloading the files
  useEffect( () => {
    console.log(downloadGate, secondDownloadGate)
    let finalArray = []
    if (downloadGate === true && secondDownloadGate === true) {
      if (arrayForDownload.length > 0 && objectForDownload !== null) {
        console.log('array for downloading: ', arrayForDownload, '\n', 'object for downloading: ', objectForDownload)
        let localArrayOfNames = []
        for (const key in objectForDownload) {
          localArrayOfNames.push(`${key} ${objectForDownload[key]}`)
        }
        arrayForDownload.forEach( (ele, eleId) => {
          ele.FileName = localArrayOfNames[eleId]
          finalArray.push(ele)
        })
      }
    }
    console.log(finalArray)
  }, [downloadGate, secondDownloadGate])

  // spreadsheet part
  useEffect( () => {
    let finishedObject = {}
    let displayArray = []
    if (arrayOfData) {
      arrayOfData.forEach( (row, rowId) => {
        if (rowId !== 0) {
          let tempArray = row.match(/\S[^,]+/g)
          if (tempArray) {
            finishedObject[tempArray[0]] = tempArray[1].replace(/,/, '')
          }
        }
      })
    }
    if (finishedObject !== null) {
      for (const key in finishedObject) {
        displayArray.push(
          <h3 className='nameInList'>
            {key}: {finishedObject[key]}
          </h3>
        )
      }
    }
    setDisplayArray(displayArray)
    setObjectForDownloading(finishedObject)
    objectForDownload = finishedObject
    if (finishedObject !== null) {
      setDownloadGate(true)
    }
    console.log(finishedObject)
  }, [arrayOfData])

  // handles grabbing the excel data and throws it into an array
  const handleUpload = (e) => {
    e.preventDefault()
    let file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = (evt) => { 
      // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, {header:1});
        /* Update state */
        // console.log(typeof data)
        // console.log("Data>>>"+data);
        let myArray = data.split('Draft')
        setArrayOfData(myArray)
    };
    reader.readAsBinaryString(file);
  }

  return (
    <div className="App">
      <div className='container'>
        <div>
          <form className='form_on_document_page'>
              <div className='enter_information_documents'>
                <input type="file" name="file" placeholder="Upload an image" className='document_input_forms_top' onChange={(e) => handleUpload(e)}/>
              </div>
          </form>
          {/* <div className='listOfPeople'>
            {displayArray}
          </div> */}
        </div>
        <form className='form_on_document_page'>
            <div className='enter_information_documents'>
              <input type="file" name="file" placeholder="Upload an image" className='document_input_forms_top' onChange={(e) => handleUploadpdf(e)}/>
            </div>
        </form>
      </div>
      {/* <div>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <div className='pageTurn' onClick={handleChangePage}>

        </div>
        <p>Page {pageNumber} of {numPages}</p>
      </div> */}
    </div>
  );
}

export default App;
