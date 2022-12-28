import express from "express";
import http from "http";
import { parse } from "path";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

// protocol : http(views, static files, home, redirection), ws
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// socket in server : Connected browser
// function handleConnection(socket) {
//     console.log(socket)
// }

// 연결된 connection .add()
const sockets = [];

wss.on("connection", (socket) => {
    // chrome 연결 될 때 chrome을 add, socket 추가
    sockets.push(socket);
    socket["nickname"] = "Anon";
    // msg 보내기
    console.log("Connencted to Browser ✅");
    socket.on("close", () => {
        console.log("Disconnected from the Browser ❌")
    })
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket =>
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                );
            case "nickname":
                socket["nickname"] = message.payload;
        }
    })
});

server.listen(3000, handleListen);