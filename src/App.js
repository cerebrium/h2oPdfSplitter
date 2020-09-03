import React, { useState, useEffect } from 'react';
import './App.css';
import XLSX from 'xlsx';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from 'axios'

var objectForDownload = null
var arrayForDownload = []
var finalArrayDownload = []
var outsideArrayOfUrl = []

// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1
// ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1

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
  const [ arrayOfUrl, setArrayOfUrl ] = useState([])
  const [ displayArrayOfUrl, SetDisplayArrayOfUrl ] = useState([])

  // pdf part
  const handleUploadpdf = (e) => {
    if (e.target.files[0].size > 0) {
      // create form data
      const data = new FormData()
      data.append('file', e.target.files[0])

      // split it via the api
      axios.post('https://v2.convertapi.com/convert/pdf/to/split?Secret=LWvPUHAaYjdklEQ7&StoreFile=true', data).then( response => {
        if (response.status === 200) {
          setArrayForDownloading(response.data.Files)
          arrayForDownload = response.data.Files
        }
      }) 
      // setPdfFile(e.target.files[0])
    }
  }

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

  useEffect( () => {
    console.log(arrayOfUrl)
  }, [arrayOfUrl])

  // get the pdf after they are split
  useEffect( () => {
    async function getData(url = '') {
      const bloby = await fetch(url).then(r => r.blob());
      return bloby ? bloby : console.log('no reponse')
    };
    if (arrayForDownloading.length > 0) {
      async function loopData(localArray) {
        let finalArray = []
        let localArrayOfNames = []
        for (const key in objectForDownload) {
          localArrayOfNames.push(`${key} ${objectForDownload[key]}`)
        }
        localArray.forEach( (pdfLocal, pdfLocalId) => {
          getData(pdfLocal.Url).then( response => {
            let interestingBlob = URL.createObjectURL(response)

            console.log(interestingBlob)
              finalArray.push(
                <a 
                  href={interestingBlob}
                  download={localArrayOfNames[pdfLocalId]}
                >
                  {localArrayOfNames[pdfLocalId]}
                </a>
              )
          })
        })
        console.log(localArrayOfNames, finalArray)
        setTimeout(() => {
          SetDisplayArrayOfUrl(finalArray)
        }, 4000);
        return finalArray
      }
      loopData(arrayForDownloading).then( response => {
        console.log(response)
      })
    }
  }, [arrayForDownloading])

  return (
    <div className="App">
      <div className='container'>
        <div>
          <form className='form_on_document_page'>
              <div className='enter_information_documents'>
                <input type="file" name="file" placeholder="Upload an image" className='document_input_forms_top' onChange={(e) => handleUpload(e)}/>
              </div>
          </form>
        </div>
        <form className='form_on_document_page'>
            <div className='enter_information_documents'>
              <input type="file" name="file" placeholder="Upload an image" className='document_input_forms_top' onChange={(e) => handleUploadpdf(e)}/>
            </div>
        </form>
        <div className='pdfDownloadContainer'>
          {displayArrayOfUrl}

        </div>
      </div>
    </div>
  );
}

export default App;
