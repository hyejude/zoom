import express from "express";
import http from "http";
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
function handleConnection(socket) {
    console.log(socket)
}
wss.on("connection", handleConnection);

server.listen(3000, handleListen);