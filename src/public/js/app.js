const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

// socket in app.js : Connection from server
const socket = new WebSocket(`ws://${window.location.host}`);

// json.stringify func.
function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

// hello send msg 받기
socket.addEventListener("open", () => {
    console.log("Connencted to Server ✅");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnencted to Server ❌");
});

// setTimeout(() => {
//     socket.send("hello from the browser!");
// }, 10000)

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li)
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);  