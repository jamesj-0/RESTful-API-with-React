function query(url, options, enforceStatus=false) {
    return fetch(url, options).then((res) => {
      if (enforceStatus && !res.ok) {
        const errMsg = "Error code is supposed to be " + enforceStatus + " but it is actually " + res.status
        console.log ("query.js:", errMsg);
        const error = new Error( errMsg );
        error.status = res.status;
        throw error;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("json")) {
          return res.json();
      } else {
          const error = new Error("Was expecting JSON!");
          console.log("Was expecting JSON payload but got", res);
          error.status = res.status;
          throw error;
      }
    });
}
  
export default query;
