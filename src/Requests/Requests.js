export const requests = {
    post: postData,
    getBlobsOfUrls: getBlobsOfUrls
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", 
      mode: "cors", 
      cache: "no-cache", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // return response.json(); // parses JSON response into native JavaScript objects
}

async function getBlobsOfUrls(url = "") {
  return await fetch(url).then((r) => r.blob());
}