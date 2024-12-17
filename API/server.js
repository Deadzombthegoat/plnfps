// api/server.js
const { Server } = require('socket.io');

const ioHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
    } else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('A player connected: ' + socket.id);
            
            socket.on('disconnect', () => {
                console.log('Player disconnected: ' + socket.id);
            });

            socket.on('playerMove', (data) => {
                socket.broadcast.emit('playerMove', data);
            });

            socket.on('requestRandomMap', () => {
                const maps = ['map1.glb', 'map2.glb', 'map3.glb'];
                const randomMap = maps[Math.floor(Math.random() * maps.length)];
                socket.emit('mapSelected', randomMap);
            });
            
            socket.on('requestRandomSkin', () => {
                const skins = ['skin1.png', 'skin2.png', 'skin3.png'];
                const randomSkin = skins[Math.floor(Math.random() * skins.length)];
                socket.emit('skinSelected', randomSkin);
            });
        });
        console.log('Socket is initialized');
    }
    res.end();
};

export default ioHandler;
