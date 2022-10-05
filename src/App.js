/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./App.scss";
import XLSX from "xlsx";
import axios from "axios";

var objectForDownload = null;
var arrayForDownload = [];

function App() {
  const [arrayOfData, setArrayOfData] = useState([]);
  const [displayArray, setDisplayArray] = useState([]);
  const [arrayForDownloading, setArrayForDownloading] = useState([]);
  const [objectForDownloading, setObjectForDownloading] = useState(null);
  const [downloadGate, setDownloadGate] = useState(false);
  const [arrayOfUrl, setArrayOfUrl] = useState([]);
  const [displayArrayOfUrl, SetDisplayArrayOfUrl] = useState([]);
  const [blockerDiv, setBlockerDiv] = useState(null);
  const [blockerDivGate, setBlockerDivGate] = useState(true);
  const [loader, setLoader] = useState(null);
  const [loadGate, setLoadGate] = useState(0);
  const [inputLabel, setInputLabel] = useState("Select a Spreadsheet");

  // wake up the backend
  useEffect(() => {
    axios.get("https://arcane-brook-64097.herokuapp.com/").then((response) => {
      if (response.data) {
        console.log(response.data);
      }
    });
  }, []);

  // pdf part
  const handleUploadpdf = (e) => {
    if (e.target.files[0].size > 0) {
      // create form data
      const data = new FormData();
      data.append("file", e.target.files[0]);

      // split it via the api
      axios
        .post(
          "https://v2.convertapi.com/convert/pdf/to/split?Secret=j5xfxIhJ05DzvKoR&StoreFile=true",
          data
        )
        .then((response) => {
          if (response.status === 200) {
            setArrayForDownloading(response.data.Files);
            arrayForDownload = response.data.Files;
          }
        });
    }
  };

  useEffect(() => {
    if (blockerDivGate) {
      setBlockerDiv(null);
    } else {
      setBlockerDiv(
        <form className="forms">
          <h3 className="innerLabel">Input Pdf</h3>
          <div>
            <input
              type="file"
              name="file"
              placeholder="Upload an image"
              className="inputButton"
              onChange={(e) => handleUploadpdf(e)}
            />
          </div>
        </form>
      );
    }
  }, [blockerDivGate]);

  // spreadsheet part
  useEffect(() => {
    let finishedObject = {};
    let displayArray = [];
    if (arrayOfData) {
      arrayOfData.forEach((row, rowId) => {
        if (rowId !== 0) {
          let tempArray = row.match(/\S[^,]+/g);
          console.log(tempArray);
          if (tempArray) {
            finishedObject[tempArray[0]] = tempArray[1].replace(/,/, "");
          }
        }
      });
    }
    if (finishedObject !== null) {
      for (const key in finishedObject) {
        displayArray.push(
          <h3 className="nameInList">
            {key}: {finishedObject[key]}
          </h3>
        );
      }
    }
    setDisplayArray(displayArray);
    setObjectForDownloading(finishedObject);
    objectForDownload = finishedObject;
    if (Object.keys(finishedObject).length > 0) {
      setInputLabel("Spreadsheet Selected");
      setBlockerDivGate(false);
      setDownloadGate(true);
    }
  }, [arrayOfData]);

  // handles grabbing the excel data and throws it into an array
  const handleUpload = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      let myArray = data.split("Draft");
      console.log(myArray);
      setArrayOfData(myArray);
    };
    reader.readAsBinaryString(file);
  };

  // get the pdf after they are split
  useEffect(() => {
    let arrayForZip = [];
    async function getData(url = "") {
      arrayForZip.push(url);
      const bloby = await fetch(url).then((r) => r.blob());
      return bloby ? bloby : console.log("no reponse");
    }
    if (arrayForDownloading.length > 0) {
      setLoadGate(2);
      async function loopData(localArray) {
        let finalArray = [];
        let localArrayOfNames = [];
        for (const key in objectForDownload) {
          localArrayOfNames.push(`${key} ${objectForDownload[key]}`);
        }
        localArray.forEach((pdfLocal, pdfLocalId) => {
          getData(pdfLocal.Url).then((response) => {
            let interestingBlob = URL.createObjectURL(response);

            console.log(interestingBlob);
            finalArray.push(
              <a
                href={interestingBlob}
                download={localArrayOfNames[pdfLocalId]}
                className="hyperLinkStyle"
              >
                {pdfLocalId}: {localArrayOfNames[pdfLocalId]}
              </a>
            );
          });
        });
        console.log(localArrayOfNames, finalArray);
        setTimeout(() => {
          setLoadGate(1);
          finalArray.sort((a, b) =>
            a.props.children[0] > b.props.children[0] ? 1 : -1
          );
          SetDisplayArrayOfUrl(finalArray);
          // get the zip
          async function postData(url = "", data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            // return response.json(); // parses JSON response into native JavaScript objects
          }
          // https://arcane-brook-64097.herokuapp.com
          console.log("arrayForZip: ", arrayForZip);
          console.log("arrayOfNames: ", localArrayOfNames);
          postData("http://localhost:3001/zip/", {
            files: arrayForZip,
            names: localArrayOfNames,
          }).then((response) => {
            window.open("http://localhost:3001/tester/");
          });
        }, 7000);
        return finalArray;
      }
      loopData(arrayForDownloading).then((response) => {
        console.log(response);
      });
    }
  }, [arrayForDownloading]);

  useEffect(() => {
    if (loadGate === 2) {
      setLoader(
        <div className="loadContainer">
          <div id="container">
            <div className="divider" aria-hidden="true"></div>
            <p className="loading-text" aria-label="Loading">
              <span className="letter" aria-hidden="true">
                L
              </span>
              <span className="letter" aria-hidden="true">
                o
              </span>
              <span className="letter" aria-hidden="true">
                a
              </span>
              <span className="letter" aria-hidden="true">
                d
              </span>
              <span className="letter" aria-hidden="true">
                i
              </span>
              <span className="letter" aria-hidden="true">
                n
              </span>
              <span className="letter" aria-hidden="true">
                g
              </span>
            </p>
          </div>
        </div>
      );
    } else if (loadGate === 1) {
      setLoader(
        <div className="pdfDownloadContainer">
          <h3 className="innerLabel">Renamed Pdfs</h3>
          {displayArrayOfUrl}
        </div>
      );
    } else {
      setLoader(null);
    }
  }, [displayArrayOfUrl, loadGate]);

  return (
    <div className="App">
      <div className="whiteOverlay">
        <div className="containerOne">
          <h1 className="mainTitle">H2O Pdf Splitter</h1>
          <div className="inputContainer">
            <form className="forms">
              <h3 className="innerLabel">{inputLabel}</h3>
              <div>
                <input
                  type="file"
                  name="file"
                  placeholder="Upload Spreadsheet"
                  className="inputButton"
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
