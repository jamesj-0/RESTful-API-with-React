function router(){
let routes = {};

function get(path, callback){
    routes[path] = callback;
} 

function redirect(path){
    const url = window.location.origin + path; 
    window.history.pushState(null, null, url);
    navigate(url); 
}

function navigate(url){
    console.log("THE URL IS:", url)
    const parsedUrl = new URL(url); 
    const basePath = parsedUrl.pathname.split("?")[0];
    const callback = routes[basePath] ||  routes.default;
    callback({ url: parsedUrl, redirect });
}

function redirect(path){
    const url = window.location.origin + path; 
    window.history.pushState(null, null, url);
    navigate(url); 
}

function handleClick(event){
    if("external" in event.target.dataset ||
    event.button !== 0 ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey ||
    event.ctrlKey
  )
  return; 
  if(event.target.tagName === "A"){
      event.preventDefault(); 
      window.history.pushState(null, null, event.target.href); 
      navigate(event.target.href);
    }
    if(event.target.tagName === "BUTTON"){
        const buttonName = event.target.textContent;
        if(buttonName === "Delete" || buttonName === "Edit"){
            event.preventDefault();
            window.history.pushState(null, null, event.target.href); 
            const postId = Number(event.target.dataset.postid);
            if(isNaN(postId)) throw new Error ("That's not a post ID chump!");
            if(buttonName === "Edit"){ redirect(`/post?edit=${postId}`); }
            if(buttonName === "Delete"){
            }
        }
    }
}

function handlePop(){
    navigate(window.location); 
}

function listen(){
    window.addEventListener("click", handleClick); 
    window.addEventListener("popstate", handlePop);
    navigate(window.location); 
}

function close(){
    window.removeEventListener("click", handleClick);
    window.removeEventListener("popstate", handlePop);
}

return { get, listen, close }; 
}
export default router;