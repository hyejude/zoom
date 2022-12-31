import express from "express";
import http from "http";
import { parse } from "path";
// import { Server } from 'socket.io';
import SocketIO from "socket.io";
import { instrument } from '@socket.io/admin-ui';
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen);