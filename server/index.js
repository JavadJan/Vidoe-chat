const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const cors = require("cors");


const app = express();
const PORT = 3000;

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(cors())

// Define a route
app.get('/', (req, res) => {
    res.send('server is running');
});

io.on('connection', (socket) => {
    //this is going to give us our own id
    socket.emit('me', socket.id)

    
    // a broadcast message 
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    })

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name })
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal)
    })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});