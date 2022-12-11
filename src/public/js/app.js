// socket in app.js : Connection from server
const socket = new WebSocket(`ws://${window.location.host}`);

// hello send msg 받기
socket.addEventListener("open", () => {
    console.log("Connencted to Server ✅");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnencted to Server ❌");
});

setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000)