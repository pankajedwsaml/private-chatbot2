window.onload = function(){

    const oldChats = localStorage.getItem("chat_history");

    if(oldChats){
        document.getElementById("chat-box").innerHTML = oldChats;
    }

};


async function sendMessage() {

    const input = document.getElementById("message-input");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (!message) return;

    // User message
    chatBox.innerHTML += `
        <div class="message user">${message}</div>
    `;

    input.value = "";

    // Create bot bubble
    const botId = "bot-" + Date.now();

    chatBox.innerHTML += `
        <div class="message bot" id="${botId}"></div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    // Save current chat
    localStorage.setItem(
        "chat_history",
        chatBox.innerHTML
    );

    // Ask AI
    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

    const data = await response.json();

    // Typing effect
    const botBox = document.getElementById(botId);

    let text = data.reply;
    let i = 0;

    const typing = setInterval(() => {

        if(i < text.length){

            botBox.innerHTML += text.charAt(i);

            i++;

            chatBox.scrollTop = chatBox.scrollHeight;

            // Save while typing
            localStorage.setItem(
                "chat_history",
                chatBox.innerHTML
            );

        }
        else{
            clearInterval(typing);
        }

    }, 30);

}


// Enter key send
document.getElementById("message-input")
.addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        event.preventDefault();
        sendMessage();
    }

});