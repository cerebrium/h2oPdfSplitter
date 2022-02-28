/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from "react";
import "./App.scss";
import XLSX from "xlsx";
import axios from "axios";
import { useReturnArray } from "./hooks/useReturnArray";
import { useReturnArrayOfPdfs } from "./hooks/useReturnArrayOfPdfs";

function App() {
  const [arrayOfSplitPdfs, setArrayOfSplitPdfs] = useState([]);
  const [trigger, {objectForDownload, loading}] = useReturnArray()
  const [pdfTrigger, {arrayOfPdfs, isLoading}] = useReturnArrayOfPdfs()

  // wake up the backend -> not needed for local
  useEffect(() => {
    axios.get("https://arcane-brook-64097.herokuapp.com/").then((response) => {
    });
  }, []);

  // Upload and split PDF's
  const handleUploadpdf = (e) => {
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
            setArrayOfSplitPdfs(response.data.Files);
          }
        });
    }
  };


  // handles grabbing the excel data and throws it into an array
  const handleUpload = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Convert to byte stream */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* If not csv, convert to csv */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      /* Split each item into an array based on last expected field */
      const arrayOfStringifiedSplitXcelData = data.split("Draft");

      // Call hook to get names from the split csv
      trigger(arrayOfStringifiedSplitXcelData)
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (objectForDownload) {
      if (Object.entries(objectForDownload).length > 0 && arrayOfSplitPdfs.length > 0) {
        pdfTrigger(arrayOfSplitPdfs, objectForDownload)
      }
    }
  }, [objectForDownload, arrayOfSplitPdfs])

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
      ) : arrayOfPdfs.length > 0 ? (
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
  }, [loading, arrayOfPdfs, isLoading])

  return (
    <>
      {render}
    </>
  );
}

export default App;
