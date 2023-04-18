let socket = io()

const token = localStorage.getItem('userToken');

const chatContainer = document.querySelector('.chat-history');
const userParent = document.getElementById('group');
const file = document.getElementById('uploadFileInput');

const User = localStorage.getItem('name');
const groupId = localStorage.getItem('groupId');
const groupName = localStorage.getItem('groupName');
const admin = JSON.parse(localStorage.getItem('isAdmin'));

socket.emit("generategroup", 'room');

let lastId;
let chatArray = []

window.addEventListener('DOMContentLoaded', loadScreen)


async function loadScreen(e){
    e.preventDefault();

    document.getElementById('username').innerHTML = groupName
    isAdmin(groupId)
    getMessage(groupId)
    getUsers(groupId);
    // setTimeout(()=>{
    //     document.location.reload()
    // },1000)
    // const admi = JSON.parse(localStorage.getItem('isAdmin'));
    if(admin){
        document.getElementById('add-user').classList.add('admin')
        console.log("im admin")
        
    }

    }

    async function isAdmin(groupId){
        try {
            let response = await axios.get(`http://localhost:3000/group/isAdmin/${groupId}`  , {headers:{"Authorization" : token}})
            // console.log(response.data)
            localStorage.setItem('isAdmin' , response.data)
    
            if(JSON.parse(localStorage.getItem('isAdmin'))){
                document.getElementById('add-user').classList.add('admin') 
            }
        } catch (err) {
            console.log(err);
        }
    }


    document.getElementById('chat-form').onsubmit = async function(e){

        e.preventDefault();
        
        const message = {
            message : e.target.message.value,
            file: e.target.uploadFileInput.value
        }
        try {

            const response =  await axios.post(`http://localhost:3000/message/postMessage/${groupId}` , message  , {headers:{"Authorization" : token}})
            console.log(response.data.arr);
    
            e.target.message.value = ""
            e.target.uploadFileInput.value = ""
            
            saveToLocal(response.data.arr);
            
        } catch (err) {
            console.log(err);
        }
    }


async function getMessage(groupId){

    const messages = JSON.parse(localStorage.getItem(`msg${groupId}`));
        // console.log(messages[messages.length-1].id);
        if(messages == undefined || messages.length == 0) {
            lastId = 0;
        }
        else {
            lastId = messages[messages.length-1].id;
        }

    console.log(lastId)
    // setInterval(async () => {
        try {
            console.log(groupId)
            const response =  await axios.get(`http://localhost:3000/message/getMessage/${groupId}?msg=${lastId}`  , {headers:{"Authorization" : token}})
            // console.log(response.data.arr)
            console.log(data);
            console.log(socket.emit("chatMessage", text1, response.data.data.id, response.data.data.userId, response.data.data1.id, response.data.data1.name));
            var newArr = response.data.arr
            saveToLocal(newArr);
            
        } catch (err) {
            console.log(err);
        }
    // },1000)
}

socket.on("message", (obj) => {
    console.log(obj);
    retrieveTexts(obj)
})



function saveToLocal(arr){

    let oldMessages = JSON.parse(localStorage.getItem(`msg${groupId}`));
    
    if(oldMessages == undefined || oldMessages.length == 0){
        chatArray = chatArray.concat(arr)
    }else{
        chatArray =[]
        chatArray = chatArray.concat(oldMessages,arr);
    }
    localStorage.setItem(`msg${groupId}` , JSON.stringify(chatArray))

    // console.log((JSON.parse(localStorage.getItem(`msg${groupId}`))).length)

    showChatsOnScreen()
}

function showChatsOnScreen(){

    chatContainer.innerHTML = ""
    console.log(chatArray)

    chatArray.forEach(chat =>{
        console.log(chat.imageUrl)
        if(User == chat.name){

            if(chat.imageUrl == ""){
                let child = `<ul class="m-b-0">
            <li class="clearfix" id=${chat.id}>
            <div class="message-data text-right">
                <span class="message-data-time">${chat.name}</span>
                <span class="message-data-time">${chat.createdAt.split('T')[1].slice(0,5)}</span>
                
            </div>
                <div class="message other-message float-right">${chat.message}</div>
            </li>
        </ul>`
            chatContainer.innerHTML += child

            }
            
            if(chat.message == ""){
                let child = `<ul class="m-b-0">
            <li class="clearfix" id=${chat.id}>
            <div class="message-data text-right">
                <span class="message-data-time">${chat.name}</span>
                <span class="message-data-time">${chat.createdAt.split('T')[1].slice(0,5)}</span>
                
            </div>
                <div class="message other-message float-right"><a href="${chat.imageUrl}">download file</a></div>
            </li>
        </ul>`
            chatContainer.innerHTML += child
            }
    

          
        }
        else{
            if(chat.imageUrl == ""){
                let child = `<ul class="m-b-0">
            <li class="clearfix" id=${chat.id}>
            <div class="message-data">
            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                <span class="message-data-time">${chat.name}</span>
                <span class="message-data-time">${chat.createdAt.split('T')[1].slice(0,5)}</span>
                
            </div>
                <div class="message my-message">${chat.message}</div>
            </li>
        </ul>`

          chatContainer.innerHTML += child
            }
            
            if(chat.message == ""){
                let child = `<ul class="m-b-0">
            <li class="clearfix" id=${chat.id}>
            <div class="message-data">
            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                <span class="message-data-time">${chat.name}</span>
                <span class="message-data-time">${chat.createdAt.split('T')[1].slice(0,5)}</span>
                
            </div>
                <div class="message my-message"><a href="${chat.imageUrl}">download file</a></div>
            </li>
        </ul>`

          chatContainer.innerHTML += child
            }


        }
    })


    document.getElementById(`${lastId}`).scrollIntoView()
    console.log(lastId)

}

async function getUsers(groupId){
    try {
        console.log('sdfsdfsdfsdfsdfsdf')
        let response =  await axios.get(`http://localhost:3000/group/fetch-users/${groupId}`  , {headers:{"Authorization" : token}})
        console.log(response.data);

        let admin = JSON.parse(localStorage.getItem('isAdmin'));

        if(admin){

            response.data.forEach( data => addGroupUsersToScreen(data))
        }
        else{

            response.data.forEach( data => addGroupUsersToScreenNotAdmin(data))
        }
    }
    
    catch (err) {
        console.log(err)
    }
}

function addGroupUsersToScreen(data){
    let child = `<div style="width:100%;color:white" class="group-style" id=${data.id}>
    <button class="user-btn">${data.name}</button>
    <div class="admin-buttons">
    <button class="add-user" onclick="makeAdmin('${data.id}')">+</button>
    <button class="remove-user" onclick="removeAdmin('${data.id}')">-</button>
    <button class="delete-group" onclick="removeUser('${data.id}')" >r</button>
    </div>
  </div>`

  userParent.innerHTML += child
  
}

function addGroupUsersToScreenNotAdmin(data){
    let child = `<div style="width:100%;color:white" class="group-style" id=${data.id}>
    <button class="user-btn">${data.name}</button>
  </div>`

  userParent.innerHTML += child
}

async function removeUser(userId){
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:3000/group/remove-user` ,details  , {headers:{"Authorization" : token}})
        // console.log(response.data.user);
        alert('removed user succesfully');
        removeUserFromScreen(response.data.user)
    } catch (err) {
        if(err.response.status == 402){
            alert('Only admin can delete')
        }if(err.response.status == 404){
            alert('no group or user found')
        }
    }
}

async function makeAdmin(userId){
    console.log('make   adminnnnnnnnnn')
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:3000/group/makeAdmin` ,details  , {headers:{"Authorization" : token}})
        console.log(response);
        alert('user is admin now');
    } catch (err) {
        console.log(err)
    }
}

async function removeAdmin(userId){
    console.log('make   adminnnnnnnnnn')
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:3000/group/removeAdmin` ,details  , {headers:{"Authorization" : token}})
        console.log(response);
        alert('removed admin');
    } catch (err) {
        console.log(err)
    }
}

function removeUserFromScreen(user){

    const child = document.getElementById(`${user.id}`)
    userParent.removeChild(child)
}

document.getElementById('form-group').onsubmit = async function(e){
    e.preventDefault();
    const details = {
        email : e.target.email.value,
        groupId : groupId
    }
    // console.log(details)

    try {
        let response = await axios.post(`http://localhost:3000/group/addUser`  ,details ,  {headers:{"Authorization" : token}})
        
        addGroupUsersToScreen(response.data.user)
        alert('user added successfully')
        document.querySelector('.groupName').value =" "

    } catch (err) {
        if(err.response.status == 401){
            alert("user already in group")
        }if(err.response.status == 400){
            alert("enter email")
        }if(err.response.status == 404){
            alert("user not found")
        }

    }
}

document.getElementById('logout').onclick = function(e){
    localStorage.removeItem('userToken')
    localStorage.removeItem(`msg${groupId}`)
    localStorage.removeItem('username')
    window.location.href = '../Login/login.html'
}