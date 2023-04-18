const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const sequelize = require('./Backend/util/database')

const User = require('./Backend/models/user')
const Chat = require('./Backend/models/chat')
const Group= require('./Backend/models/group')
const UserGroup = require('./Backend/models/usergroup');
const userRoutes = require('./Backend/routes/user')
const groupRoutes = require('./Backend/routes/group')
const messageRoutes = require('./Backend/routes/message')

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

const app = express();

app.use(cors({
    origin:"*",
    credentials:true,

}))

app.use(bodyParser.json({extended:false}))

io.on("connection", socket => {
    console.log(socket.id);
    
    socket.on('generategroup', (room) => {
        console.log(room + "hi");
        socket.join(room)
    })

    socket.on("chatMessage", (msg,id,userId,loggedUserId,name) => {
        console.log(msg+"here"+id);
        let obj={
            msg:msg,
            id:id,
            userId:userId,
            loggedUserId:loggedUserId,
            name:name
        }
        io.emit("message",obj);
    });
})

var CronJob = require('cron').CronJob;
var job = new CronJob(
    '* * * * * *',
    function() {
        console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
);


Chat.belongsTo(User);
User.hasMany(Chat);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group , {through: UserGroup} )
Group.belongsToMany(User , {through: UserGroup} )

app.use('/user',userRoutes)
app.use('/group',groupRoutes)
app.use('/message',messageRoutes)

sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log('running now')
    })
})

.catch(err=>{
    console.log(err)
})
