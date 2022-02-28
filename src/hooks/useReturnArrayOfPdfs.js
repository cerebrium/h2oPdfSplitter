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

    // Takes array of split pdfs, and object of names (Driver: Title)
    const pdfTrigger = async (arrayOfSplitPdfs, objectForDownload) => {
        setIsLoading(true)
        const arrayForZip = [];
        const localArrayOfNames = []

        // Extract the stringified rows of the document
        for (const key in objectForDownload) {
            localArrayOfNames.push(`${key} ${objectForDownload[key]}`);
        }

        // Map the strigified rows to downloadable urls of the pdfs
        const finalArray = await Promise.all(arrayOfSplitPdfs.map((pdfLocal, pdfLocalId) => {

            // Request for url blob 
            return requests.getBlobsOfUrls(pdfLocal.Url).then((response) => {

                // Append blob to array
                arrayForZip.push(response)

                // Create downloadable link and make it clickable
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

        // Make them alphanumerically sorted
        const sortedFinalArray = finalArray.sort((a, b) =>
            a.props.children[0] > b.props.children[0] ? 1 : -1
        );

        // Set the array for return
        setArrayOfPdfs(sortedFinalArray)
        setIsLoading(false)

        // https://arcane-brook-64097.herokuapp.com -> production backend
        // Attempt to zip the file --> local
        requests.post("http://localhost:3001/zip/", {
            files: arrayForZip,
            names: localArrayOfNames,
        }).then((response) => {
            console.log("response: ", response)
            window.open("http://localhost:3001/tester/");
        });

        // Attempt to access zip prod be
        // requests.post('https://arcane-brook-64097.herokuapp.com', {
        //     files: arrayForZip,
        //     names: localArrayOfNames,
        // }).
    }

    return [pdfTrigger, {arrayOfPdfs, isLoading}]
}