const log = require('console')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/introduction page.html')
})
app.use(express.static('./public'))

let connectedUser = []
// let msgHis = []

//connect socket.io
io.on('connection',socket=>{
    console.log('a user connected');
    updateUserName()
    let userName = ''

    socket.on('login',(username,callback)=>{
         callback(true)
         userName=username
         connectedUser.push(userName)
        // console.log(connectedUser);
         updateUserName()
         newUserNotice()
    })

    socket.on('chatMessage',msg=>{
        io.emit('loadMessage',{
            name:userName,
            msg:msg
        })
    })

    socket.on('isTyping',()=>{
        // console.log('is typing')
        io.emit('Typing',userName)
    })

    socket.on('notTyping',()=>{
        // console.log('not typing');
        io.emit('stopTyping',userName)
    })

    socket.on('disconnect',()=>{
        console.log('a user is disconnected');
        connectedUser.splice(connectedUser.indexOf(userName),1)
        
        // console.log(connectedUser);
        updateUserName()
        userLeaveNotice()
    })

    function newUserNotice(){
        io.emit('someoneCome',userName)
    }

    function userLeaveNotice(){
        io.emit('someoneLeave',userName)
    }

    function updateUserName(){
        io.emit('loadUser',connectedUser)
    }
})

server.listen(5000,()=>{
    console.log('Server running on 5000');
})

