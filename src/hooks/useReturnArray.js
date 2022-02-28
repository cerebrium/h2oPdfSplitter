import React, { useState} from 'react'

export const useReturnArray = () => {
    const [objectForDownload, setObjectForDownload ] = useState({})
    const [loading, setLoading] = useState(0)

    // Trigger the hook
    const trigger = (arrayOfData) => {
        // const finalDisplayArray = []
        
        // Incoming array of stringified csv
        if (arrayOfData) {
            const finishedObject = {};
            arrayOfData.forEach((row, rowId) => {
                if (rowId !== 0) {
                    let tempArray = row.match(/\S[^,]+/g);
                    if (tempArray) {
                        finishedObject[tempArray[0]] = tempArray[1].replace(/,/, "");
                    }
                }
            });


            setObjectForDownload(finishedObject)
            setLoading(1)
        }

    
        // Hashmap of stringified csv sorted by driver name
        // if (finishedObject !== null) {
            
        //     for (const key in finishedObject) {
        //         finalDisplayArray.push(
        //             <h3 className="nameInList">
        //                 {key}: {finishedObject[key]}
        //             </h3>
        //         )
        //     }
        // }
        console.log("obecjt: ", objectForDownload)
    }

    return [trigger, {objectForDownload, loading}]
}