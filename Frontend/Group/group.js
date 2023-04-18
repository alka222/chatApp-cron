const groupList = document.getElementById('group') 
const form = document.getElementById('group-form')

let token = localStorage.getItem('userToken')
let username = localStorage.getItem('name')
let groupId = localStorage.getItem('groupId')

localStorage.removeItem(`msg${groupId}`)

window.addEventListener("DOMContentLoaded" , (e)=>{
    loadScreen(e);
})

async function loadScreen(e){
    e.preventDefault();

    document.getElementById('welcomename').innerHTML = `${username.split(' ')[0]}`
    console.log(token)
    try {
        let response = await axios.get('http://localhost:3000/group/getgroups' , {headers:{'Authorization':token}});

        console.log(response.data.data)
        showOnScreen(response.data.data)
    } catch (err) {
        console.log(err);
    }
}

function showOnScreen(data){
    groupList.innerHTML = '';

    data.forEach(element => {
        const child = `<div class="group-name" id="group-name-btn" onClick="openGroup('${element.id}','${element.name}')">${element.name}</div>`

        groupList.innerHTML += child
    });

}

function openGroup(groupId,groupname){
    console.log(groupId)
    console.log(groupname)
    localStorage.setItem('groupId' , groupId)
    localStorage.setItem('groupName' , groupname)
    window.location.href = '../Chat/chat.html'
}

form.addEventListener('submit' , async(e)=>{
    e.preventDefault()
    // console.log(e.target.group.value)
    const group ={
        group:e.target.group.value
    }

    try {
        const response = await axios.post('http://localhost:3000/group/create-group' ,group , {headers:{'Authorization':token}});
        e.target.group.value = ""
        loadScreen(e)

    } catch (err) {
        console.log(err);
    }
})

document.getElementById('logout').onclick = function(e){
    e.preventDefault();
    localStorage.removeItem('userToken')
    window.location.href = '../login/login.html'
}