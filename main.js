//https://b1messenger.imatrythis.com/api
const content = document.querySelector('.content')

let token = ""

function login() {
    let username = document.querySelector('#username')
    let password = document.querySelector('#password')

    let body = {
        username: username.value,
        password: password.value
    }
    let params = {
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(body),
        method: "POST"
    }

    fetch("https://b1messenger.imatrythis.com/login", params)
        .then(response => response.json())
        .then(data => {
            if (data.message == "Invalid JWT Token") {
                renderLoginForm()
            } else {
                token = data.token
                run()
            }
        })
}

function renderLoginForm() {
    let loginTemplate = `
    <div class="row">
        <input class="form-control" type="text" placeholder="username" id="username" aria-label="default input example">
        <input class="form-control" type="password" placeholder="password" id="password" aria-label="default input example">
     <button type="button" class="btn" id="loginButton">LogIn</button>
</div>`
    render(loginTemplate)
    const loginButton =document.querySelector("#loginButton")
    loginButton.addEventListener("click",() => {
        login()
    })
}
function generateMessageForm() {
    let messageFormTemplate = `<div class="form-control">
          <input class="form-control" type="text" name="" id="postMessage" placeholder="your message">
          <button class="btn btn-success form-control" id="postMessageButton">Envoyer</button>
        </div>`
    return messageFormTemplate
}
function generateMessage(message) {
    let messageTemplate = `<div class="row">
    <hr>
    <p><strong>${message.author.username}:</strong>${message.content}</p>
</div>`
    return messageTemplate
}
async function fetchMessage() {
    let params = {
        headers: {"Content-type": "application.json", "Authorization": `Bearer ${token}`},
        method: "GET"
    }
    return await fetch("https://b1messenger.imatrythis.com/api/messages", params)
        .then(response => response.json())
        .then(data => {
            if (data.message == "Invalid JWT Token") {
                renderLoginForm()
            } else {
                return data
            }
        })
}
function renderMessages(tableauMessages) {
    let contentMessage = ""
    tableauMessages.forEach(message => {
        contentMessage += generateMessage(message)
    })
    let messageAndMessageForm =contentMessage +generateMessageForm()
    render(messageAndMessageForm)
    const postMessage = document.querySelector("#postMessage")
    const postMessageButton = document.querySelector("#postMessageButton")

    postMessageButton.addEventListener("click", () => {
        sendMessage(postMessage.value)
    })
}
function render(pageContent) {
    content.innerHTML = ""
    content.innerHTML = pageContent
}
function sendMessage(messageToSend){
    let body = {
        content: messageToSend
    }
    let params = {
        headers: {"Content-type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(body),
        method: "POST"
    }
    fetch("https://b1messenger.imatrythis.com/api/messages/new", params)
        .then(response=> response.json())
        .then(data=>{
            if (data.message == "Invalid JWT Token"  | "Invalid credentials."){
                renderLoginForm()
            } else {
                if (data == "OK"){
                    run()
                }else {
                    alert("tu te fou de moi")
                    run()}
            }
        })
}
function run() {
    if (!token) {
        renderLoginForm()
    } else  {
        fetchMessage().then(message=> {
            renderMessages(message)
        })
    }
}
run()