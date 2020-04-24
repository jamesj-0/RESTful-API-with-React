import query from "../query.js";

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

    query(endpoint, fetchParams, 200)
    .then(() => {
        req.redirect('/')
    })
    .catch((error) => {
        console.error(error)
    })
}

export default deleteExample;
