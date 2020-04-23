function throwIfNot200(res){
    if (!res.ok){
        console.log("throwIfNot200 is having an error!", res);
        const error = new Error(res);
        error.status = res.status;
        throw error;
    }
    return res;
}

function decodeJSONOrDie(res){
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("json")) {
      return res.json();
    } else {
        const error = new Error("Was expecting JSON!");
        console.log("Was expecting JSON payload but got", res);
        error.status = res.status;
        throw error;
    }
}

function deleteExample(req) {
    let del = req.url.searchParams.get("delete")
    const token = localStorage.getItem("access-token")
    
    const fetchParams = {
        "headers": {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
        "method": "DELETE"
    }
    
    const endpoint = `/examples/${del}`;

    fetch(endpoint, fetchParams)
    .then( throwIfNot200 )
    .then( decodeJSONOrDie )
    .then(() => {
        req.redirect('/')
    })
    .catch((error) => {
        console.error(error)
    })
}

export default deleteExample;
