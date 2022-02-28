/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from "react";
import "./App.scss";
import XLSX from "xlsx";
import axios from "axios";
import { requests } from './Requests/Requests'
import { useReturnArray } from "./hooks/useReturnArray";
import { useReturnArrayOfPdfs } from "./hooks/useReturnArrayOfPdfs";

function App() {
  const [arrayOfSplitPdfs, setArrayOfSplitPdfs] = useState([]);
  const [blockerDivGate, setBlockerDivGate] = useState(true);

  const [trigger, {objectForDownload, loading}] = useReturnArray()
  const [pdfTrigger, {arrayOfPdfs, isLoading}] = useReturnArrayOfPdfs()

  // wake up the backend -> not needed for local
  // useEffect(() => {
  //   axios.get("https://arcane-brook-64097.herokuapp.com/").then((response) => {
  //   });
  // }, []);

  // pdf part
  const handleUploadpdf = (e) => {
    console.log("inside here")
    if (e.target.files[0].size > 0) {
      // Create form data
      const data = new FormData();
      data.append("file", e.target.files[0]);

      // Split it via the api
      axios
        .post(
          "https://v2.convertapi.com/convert/pdf/to/split?Secret=Ho2xAPDeKwuiTNH7&StoreFile=true",
          data
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("200 resolved: ", response.data.Files)
            setArrayOfSplitPdfs(response.data.Files);
          }
        });
    }
  };

  useEffect( () => {
    console.log("object for download: ", objectForDownload)
  }, [objectForDownload])


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
      const arrayOfStringifiedSplitXcelData = data.split("Draft");
      trigger(arrayOfStringifiedSplitXcelData)
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    console.log("objectForDownload: ", objectForDownload)
    if (objectForDownload) {

      if (Object.entries(objectForDownload).length > 0 && arrayOfSplitPdfs.length > 0) {
        console.log("Array of split pdfs: ", arrayOfSplitPdfs, "object for download: ", objectForDownload)
        pdfTrigger(arrayOfSplitPdfs, objectForDownload)
      }
    }

  }, [objectForDownload])

  const render = useMemo( () => {
    // Block entry of pdf before csv
    const blocker = Object.entries(objectForDownload).length === 0? null : (
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
    )

    const loader = loading === 1  && isLoading ? (
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
      ) : loading === 1 && arrayOfPdfs.length > 0 ? (
        <div className="pdfDownloadContainer">
          <h3 className="innerLabel">Renamed Pdfs</h3>
          {arrayOfPdfs}
        </div>
      ) : null

    return (
    <div className="App">
      <div className="whiteOverlay">
        <div className="containerOne">
          <h1 className="mainTitle">H2O Pdf Splitter</h1>
          <div className="inputContainer">
            <form className="forms">
              <h3 className="innerLabel">{loading === 1  ? "Select a Spreadsheet" : "Select Pdfs"}</h3>
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
            {blocker}
          </div>
          {loader}
        </div>
      </div>
    </div>
    )
  }, [blockerDivGate, loading])

  return (
    <>
      {render}
    </>
  );
}

export default App;
