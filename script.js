//SUPER COMMEMMEMEMENEMENT


console.log("chaching");

const server = "https://nogbook.onrender.com";
const headerBox = document.getElementById("header-box");
const inputBox = document.getElementById("input-box")
const submitButton = document.getElementById("submit-button");
const refreshButton = document.querySelector(".refresh-button");
const deleteButton = document.getElementById("delete-note-button");
const headBox = document.getElementById("head");
const bodyBox = document.getElementById("body");
const noteDisplay = document.getElementById("note-view");
const noteHead = document.getElementById("note-head");
const noteBody = document.getElementById("note-body");
const loadingText = document.getElementById("twyw")

let authkey = sessionStorage.getItem("authkey") ?? "unset"
let preloaded = sessionStorage.getItem("preloaded") ?? false
const divDisplay ={
    editor:{write:"block",read:"flex",auth:"none",deleteBtn:"block"},
    visitor:{write:"none",read:"flex",auth:"none",deleteBtn:"none"},
    unknown:{write:"none",read:"none",auth:"block",deleteBtn:"none"}
}

function updateHeaderBox(obj){
    headerBox.innerHTML = '';
    if(Object.keys(obj).length===0){
        headerBox.innerHTML = "Nothing here.."
        return
    }
    Object.keys(obj).forEach(entryNum=>{
        headerBox.innerHTML+=`<div class="note-preview" id="note-${entryNum}">${obj[entryNum].head}</div>`
    })
}
function checkAuth(keyValue=authkey){
    console.log(keyValue)
    inputBox.style.display="none";
    headerBox.style.display="none";
    authBox.style.display=(preloaded) ? "none":"block";
    if(!preloaded){sessionStorage.setItem("preloaded",true)}
    let access = "unknown";
    fetch(`${server}/auth`,{
        method:"POST",
        body:JSON.stringify({userInput:keyValue})
    })
        .then(response=>response.text())
        .then(access=>{
            authBox.style.display=divDisplay[access].auth;
            inputBox.style.display=divDisplay[access].write;
            headerBox.style.display=divDisplay[access].read;
            deleteButton.style.display=divDisplay[access].deleteBtn;
            if (access!="unknown"){
                sessionStorage.setItem("authkey",keyValue)
                history.pushState({page:"home"},'',"#/home")
            }
        })
}
async function ping(){
    try{
        const response = await fetch(server)
        return (response.ok)
    } catch(err){
        console.log(err)
    }
    return false
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function wyWait(){
    let serverUp = false;
    let n=0;
    while(!serverUp){
        if(n==0){loadingText.innerText="Connecting"}
        else if(n>0){loadingText.innerText+="."}
        if(n==2){n=-1}
        serverUp = await ping();
        n++;
        await sleep(500)
    }
    loadingText.innerText="Connected!"
}


headerBox.addEventListener("click",(e)=>{
    console.log('clicked')
    if (event.target===event.currentTarget){
        return
    }
    e.preventDefault();
    noteId = event.target.id.slice(5);
    fetch(`${server}/notes/${noteId}`)
        .then(response=>response.json())
        .then(data=>{
            noteHead.innerText=data.head;
            noteBody.innerText = data.body;
        })
    noteDisplay.style.display="block";
    headerBox.style.display="none";
    inputBox.style.display="none";
    history.pushState({page:"note-display",note:noteId},'',`#/notes/${noteId}`);
})
window.addEventListener('popstate', (event) => {
    if (event.state.page==="home") {
        inputBox.style.display = "block";
        headerBox.style.display="flex";
        noteDisplay.style.display = "none";
        refreshButton.click()
    } else if(event.state.page==="note-display"){
        inputBox.style.display="none";
        headerBox.style.display="none";
        noteDisplay.style.display="";
    } else{
        console.log(event.state)
    }
    checkAuth()
});
submitButton.addEventListener("click",()=>{
    if(headBox.value===""){
        return
    }
    const load = {
                    head:headBox.value,
                    body:bodyBox.value
                };
    fetch(server,{
        method:"POST",
        body:JSON.stringify(load)
    })
        .then(refreshButton.click())
    headBox.value = "";
    bodyBox.value = "";
    
})
refreshButton.addEventListener("click",()=>{
    fetch(server)
        .then(response=>response.json())
        .then(data=>updateHeaderBox(data))
})
deleteButton.addEventListener("click",()=>{
    fetch(`${server}/notes/${history.state.note}`,{method:"DELETE"})
        .then(refreshButton.click())
    history.back()
})

const authBox = document.getElementById("auth-box");
const key = document.getElementById("key-input")
const submitKey= document.getElementById("key-submit")
submitKey.addEventListener("click",()=>{
    checkAuth(key.value)
    key.value =""
})

history.replaceState({page:"auth"},'',"#/auth")
refreshButton.click()
checkAuth()
wyWait()

