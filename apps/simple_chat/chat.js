const ChatComponent = (channel, historyLength) => {

  const chatEl = document.createElement('div');
  chatEl.classList.add('chat');

  let nickname = "Default Nickname";
  const nickEl = document.createElement('div');
  const nickLabelEl = document.createElement('span');
  nickLabelEl.innerText = "Nickname:";
  nickEl.appendChild(nickLabelEl);

  const nickInputEl = document.createElement('input');
  nickInputEl.classList.add('nickname-input');
  nickInputEl.value = nickname;
  nickInputEl.addEventListener('keyup', (e) => {
    nickname = e.target.value;
  });
  nickEl.appendChild(nickInputEl);

  chatEl.appendChild(nickEl);

  const messageList = document.createElement('div');
  messageList.classList.add('message-list');
  chatEl.appendChild(messageList);

  const evtSource = new EventSource(channel + "?mime=text%2Fevent-stream&persist=true");
  evtSource.onmessage = function(event) {
    console.log(event.data);
    const message = JSON.parse(event.data);

    const ts = new Date();

    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageList.appendChild(messageEl);

    const authorEl = document.createElement('div');
    authorEl.classList.add('author');
    authorEl.innerText = `${message.author} | ${ts.toISOString()}`;
    messageEl.appendChild(authorEl);

    const textEl = document.createElement('div');
    textEl.classList.add('text');
    textEl.innerText = message.text;
    messageEl.appendChild(textEl);

    if (messageList.childNodes.length > historyLength) {
      messageList.removeChild(messageList.childNodes[0]);
    }

    messageList.scrollTop = messageList.scrollHeight;
  };
  evtSource.onerror = function(err) {
    console.error("EventSource failed:", err);
  };

  const sendMessage = async () => {

    if (textInput.value == "") {
      return;
    }

    const message = JSON.stringify({
      author: nickname,
      text: textInput.value,
    });

    const response = await fetch(channel, {
      method: 'POST',
      body: `data: ${message}\n\n`,
    });

    await response.text();

    textInput.value = "";
  };

  const textInput = document.createElement('textarea');
  textInput.classList.add('text-input');
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        textInput.value += '';
      }
      else {
        sendMessage();
      }
    }

    textAreaAdjust(textInput);
  });

  chatEl.appendChild(textInput);

  const sendBtn = document.createElement('button');
  sendBtn.classList.add('send-btn');
  sendBtn.innerText = "Send";
  sendBtn.addEventListener('click', sendMessage);
  chatEl.appendChild(sendBtn);

  function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
  }

  return chatEl;
}

export default ChatComponent;
