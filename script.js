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

let user = sessionStorage.getItem("auth") ?? "unknown"

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
function checkAuth(auth=user){
    if(auth==="editor"){
        authBox.style.display="none";
        inputBox.style.display="block";
        headerBox.style.display="flex";
    } else if(auth==="visitor"){
        inputBox.style.display="none";
        deleteButton.style.display="none";
        authBox.style.display="none" 
        headerBox.style.display="flex";
    } else if(auth==="unknown"){
        inputBox.style.display="none";
        headerBox.style.display="none";
        authBox.style.display="block";
    }
    if(auth=="editor"||auth=="visitor"){
        history.pushState({page:"home"},'',"#/home")
        document.body.style.justifyContent = "flex-start";
    }
    sessionStorage.setItem("auth",auth)
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
    fetch(`${server}/auth`,{
        method:"POST",
        body:JSON.stringify({userInput:key.value})
    })
        .then(response=>response.text())
        .then(data=>{
            user = data;
            checkAuth()
            refreshButton.click()
        })
    key.value =""
})

history.replaceState({page:"auth"},'',"#/auth")
checkAuth()
refreshButton.click()
