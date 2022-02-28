import React, { useState} from 'react'
import { requests } from '../Requests/Requests'
/**
 * 
 * Takes the split array of pdfs
 * maps them to the names in the array
 * returns the renamed pdfs as blobs for
 * download
 */
export const useReturnArrayOfPdfs = () => {
    const [arrayOfPdfs, setArrayOfPdfs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const pdfTrigger = (arrayOfSplitPdfs, objectForDownload) => {
        setIsLoading(true)
        const arrayForZip = [];
        async function loopData(arrayOfSplitPdfs, objectForDownload) {
            const localArrayOfNames = []

            // Extract the stringified rows of the document
            for (const key in objectForDownload) {
                localArrayOfNames.push(`${key} ${objectForDownload[key]}`);
            }

            console.log("localArray: ", arrayOfSplitPdfs)

            // Map the strigified rows to downloadable urls of the pdfs
            const finalArray = await Promise.all(arrayOfSplitPdfs.forEach((pdfLocal, pdfLocalId) => {
                return requests.getBlobsOfUrls(pdfLocal.Url).then((response) => {
                    let interestingBlob = URL.createObjectURL(response);
        
                        return (
                            <a
                                href={interestingBlob}
                                download={localArrayOfNames[pdfLocalId]}
                                className="hyperLinkStyle"
                            >
                                {pdfLocalId}: {localArrayOfNames[pdfLocalId]}
                            </a>
                        );
                    });
                })
            );

            // Set the array for return
            setArrayOfPdfs(finalArray)
            setIsLoading(false)

            // Attempt to zip the file
            setTimeout(() => {

                // Make them alphanumerically sorted
                finalArray.sort((a, b) =>
                    a.props.children[0] > b.props.children[0] ? 1 : -1
                );

                // https://arcane-brook-64097.herokuapp.com -> production backend
                requests.post("http://localhost:3001/zip/", {
                    files: arrayForZip,
                    names: localArrayOfNames,
                }).then((response) => {
                    window.open("http://localhost:3001/tester/");
                });
            }, 7000);
            return finalArray;
        }

        // Fetch the data
        loopData(arrayOfSplitPdfs, objectForDownload)
    }

    return [pdfTrigger, {arrayOfPdfs, isLoading}]
}