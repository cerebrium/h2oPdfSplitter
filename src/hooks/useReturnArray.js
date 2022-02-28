import React, { useState} from 'react'

export const useReturnArray = () => {
    const [objectForDownload, setObjectForDownload ] = useState({})
    const [loading, setLoading] = useState(0)

    // Trigger the hook
    const trigger = (arrayOfData) => {
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
    }

    return [trigger, {objectForDownload, loading}]
}