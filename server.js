const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});

// 서버가 살아있는지 확인하는 기본 페이지
app.get('/', (req, res) => {
    res.send('1mm Petcam Server is running!');
});

io.on('connection', (socket) => {
    console.log('새로운 기기 접속:', socket.id);

    socket.on('join', (roomId) => {
        socket.join(roomId);
        console.log(`${roomId}번 방에 기기 입장`);
    });

    socket.on('start-pet-care', (data) => {
        console.log(`${data.petType} 모드 자동화 신호 수신`);
        io.to(data.roomId).emit('auto-play', {
            type: data.petType
        });
    });

    socket.on('control', (data) => {
        io.to(data.roomId).emit('command', data.action);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`서버 가동 중: 포트 ${PORT}`));
