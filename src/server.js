import express from "express";
import http from "http";
import { parse } from "path";
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
// import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

// protocol : http(views, static files, home, redirection), ws
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});

instrument(wsServer, {
    auth: false
});
// const wss = new WebSocket.Server({ server });


function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName).size;
}

// socket in server : Connected browser
// function handleConnection(socket) {
//     console.log(socket)
// }

// 연결된 connection .add()
const sockets = [];

// socketIO 와 비교하기 위해 주석
// wss.on("connection", (socket) => {
//     // chrome 연결 될 때 chrome을 add, socket 추가
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     // msg 보내기
//     console.log("Connencted to Browser ✅");
//     socket.on("close", () => {
//         console.log("Disconnected from the Browser ❌")
//     })
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`)
//                 );
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     })
// });

// socketIO 
wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done(countRoom(roomName));
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);
});

httpServer.listen(3000, handleListen);