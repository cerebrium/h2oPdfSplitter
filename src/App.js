/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import './App.scss';
import XLSX from 'xlsx';
import axios from 'axios'

var objectForDownload = null
var arrayForDownload = []
let testerArray = [
  'https://v2.convertapi.com/d/9d91fc82461cb21c1411d628c226faa0/Invoices%2002Sep2020.pdf',
  'https://v2.convertapi.com/d/e595e319016222eba117730056c80160/Invoices%2002Sep2020-2.pdf',
  'https://v2.convertapi.com/d/5418cd94dc218f8eaea7eeb0fdb01cd5/Invoices%2002Sep2020-3.pdf',
  'https://v2.convertapi.com/d/bf72518c913878840a13523b860c2e10/Invoices%2002Sep2020-4.pdf',
  'https://v2.convertapi.com/d/6081985d13b35fa5b0f44ac4b21ac174/Invoices%2002Sep2020-5.pdf',
  'https://v2.convertapi.com/d/2bffb9ae50a090bef0a2acdbd39d7595/Invoices%2002Sep2020-6.pdf',
  'https://v2.convertapi.com/d/bf6c6fa9078dad6895750f87849cf218/Invoices%2002Sep2020-7.pdf',
  'https://v2.convertapi.com/d/ac66771f2591e39b237691e4cab26ad8/Invoices%2002Sep2020-8.pdf',
  'https://v2.convertapi.com/d/a9767dd986f3f3b727f1efa992a7ebcf/Invoices%2002Sep2020-9.pdf',
  'https://v2.convertapi.com/d/a8766073c1531b064f9f2ee207185278/Invoices%2002Sep2020-10.pdf',
  'https://v2.convertapi.com/d/a09d032bbfde0e90c9556ced65772abe/Invoices%2002Sep2020-11.pdf',
  'https://v2.convertapi.com/d/d9eaaa2018c77f76dbb971ecbe752e8f/Invoices%2002Sep2020-12.pdf',
  'https://v2.convertapi.com/d/7d1e85f5116bff6948dc84faac2a4b5b/Invoices%2002Sep2020-13.pdf',
  'https://v2.convertapi.com/d/031f157b19cd48cfb0c6065849ceff59/Invoices%2002Sep2020-14.pdf',
  'https://v2.convertapi.com/d/ef266f2a2ee74066113cda28c86ef1a6/Invoices%2002Sep2020-15.pdf',
  'https://v2.convertapi.com/d/c837f0ace485ddf088d75fde60ba1340/Invoices%2002Sep2020-16.pdf',
]





let namesArray = [
  "ALEKSANDAR TOTEV WEEK 35 INV 6438 DSN1",
  "BRUNO CROSCATO WEEK 35 INV 6423 DSN1",
  "BRUNO KURSCHAT WEEK 35 INV 6424 DSN1",
  "CARLOS CONCEICAO WEEK 35 INV 6425 DSN1",
  "EVELYN RIBEIRO WEEK 35 INV 6426 DSN1",
  "FABIO USTULIN WEEK 35 INV 6427 DSN1",
  "IOLANDA DE LIMA WEEK 35 INV 6428 DSN1",
  "LEONARDO LUGLI WEEK 35 INV 6429 DSN1",
  "MARCELO BARBOSA WEEK 35 INV 6430 DSN1",
  "MARCOS CORDEIRO WEEK 35 INV 6433 DSN1",
  "MARCUS SIMPLICIO WEEK 35 INV 6431 DSN1",
  "MARIN KOSTOV WEEK 35 INV 6432 DSN1",
  "NIKOLAY KEHAYOV WEEK 35 INV 6434 DSN1",
  "PAULO MARCHESI WEEK 35 INV 6435",
  "PEDRO JESUS PAULOS WEEK 35 INV 6436 DSN1",
  "STANIMIR GEORGIEV WEEK 35 INV 6437 DSN1"
]


function App() {
  const [ arrayOfData, setArrayOfData ] = useState([])
  const [ displayArray, setDisplayArray ] = useState([])
  const [ arrayForDownloading, setArrayForDownloading ] = useState([])
  const [ objectForDownloading, setObjectForDownloading ] = useState(null)
  const [ downloadGate, setDownloadGate ] = useState(false)
  const [ arrayOfUrl, setArrayOfUrl ] = useState([])
  const [ displayArrayOfUrl, SetDisplayArrayOfUrl ] = useState([])
  const [ blockerDiv, setBlockerDiv ] = useState(null)
  const [ blockerDivGate, setBlockerDivGate ] = useState(true)
  const [ loader, setLoader ] = useState(null)
  const [ loadGate, setLoadGate ] = useState(0)
  const [ inputLabel, setInputLabel ] = useState('Select a Spreadsheet')

  // wake up the backend
  useEffect( () => {
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
          // 'Content-Type': 'application/form-data',
        },
        body: JSON.stringify(data)
      });
      // return response.json(); // parses JSON response into native JavaScript objects
    }
    postData('http://localhost:3001/zip', {
      files: testerArray,
      names: namesArray
    }).then( response => {
      window.open('http://localhost:3001/zip')
    })
  }, [])

  // useEffect( () => {
  //   SetDisplayArrayOfUrl(arrayMock)
  // }, [])

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
    }
  }

  useEffect( () => {
    if (blockerDivGate) {
      setBlockerDiv(
        null
      )
    } else {
      setBlockerDiv(
        <form className='forms'>
          <h3 className='innerLabel'>
            Input Pdf
          </h3>
          <div>
            <input type="file" name="file" placeholder="Upload an image" className='inputButton' onChange={(e) => handleUploadpdf(e)}/>
          </div>
        </form>
      )
    }
  }, [blockerDivGate])

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
    if (Object.keys(finishedObject).length > 0) {
      setInputLabel('Spreadsheet Selected')
      setBlockerDivGate(false)
      setDownloadGate(true)
    }
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

  // get the pdf after they are split
  useEffect( () => {
    async function getData(url = '') {
      console.log(url)
      const bloby = await fetch(url).then(r => r.blob());
      return bloby ? bloby : console.log('no reponse')
    };
    if (arrayForDownloading.length > 0) {
      setLoadGate(2)
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
                  className='hyperLinkStyle'
                >
                  {pdfLocalId+1}: {localArrayOfNames[pdfLocalId]}
                </a>
              )
          })
        })
        console.log(localArrayOfNames, finalArray)
        setTimeout(() => {
          setLoadGate(1)
          SetDisplayArrayOfUrl(finalArray)
        }, 4000);
        return finalArray
      }
      loopData(arrayForDownloading).then( response => {
        console.log(response)
      })
    }
  }, [arrayForDownloading])

  useEffect( () => {
    if (loadGate === 2) {
      setLoader(
        <div className='loadContainer'>
          <div id="container">
            <div className="divider" aria-hidden="true"></div>
            <p className="loading-text" aria-label="Loading">
              <span className="letter" aria-hidden="true">L</span>
              <span className="letter" aria-hidden="true">o</span>
              <span className="letter" aria-hidden="true">a</span>
              <span className="letter" aria-hidden="true">d</span>
              <span className="letter" aria-hidden="true">i</span>
              <span className="letter" aria-hidden="true">n</span>
              <span className="letter" aria-hidden="true">g</span>
            </p>
          </div>
        </div>
      )
    } else if (loadGate === 1) {
      setLoader(
        <div className='pdfDownloadContainer'>
          <h3 className='innerLabel'>
            Renamed Pdfs
          </h3>
          {displayArrayOfUrl}
        </div>
      )
    } else {
      setLoader(null)
    }
  }, [displayArrayOfUrl, loadGate])

  return (
    <div className="App">
      <div className='whiteOverlay'>
        <div className='containerOne'>
          <h1 className='mainTitle'>H2O Pdf Splitter</h1>
          <div className='inputContainer'>
            <form className='forms'>
              <h3 className='innerLabel'>
                {inputLabel}
              </h3>
              <div>
                <input 
                  type="file" 
                  name="file" 
                  placeholder="Upload Spreadsheet" 
                  className='inputButton' 
                  onChange={(e) => handleUpload(e)}
                />
              </div>
            </form>
            {blockerDiv}
          </div>
          {loader}
        </div>
      </div>
    </div>
  );
}

export default App;
