let socket;

const testWebSocketConnection = (uri, closeOnMessageReceived) => {
    writeToScreen('Connecting', 'Connecting to WebSocket');

    try {
        socket = new WebSocket(uri);

        socket.onopen = () => {
            writeToScreen('open', 'WebSocket connection established');
        };

        socket.onclose = event => {
            writeToScreen('close', 'WebSocket connection closed');
        };

        socket.onmessage = event => {
            if (event.data + '' === '3') {
                writeToScreen('pong', new Date());

                return;
            }

            if (event.data.startsWith('0')) {
                const instructions = JSON.parse(event.data.substr(1));

                writeToScreen('instructions', `SID: ${instructions.sid}`);

                pingSocket(instructions.pingInterval);

                return;
            }

            writeToScreen('message', event.data);

            if (closeOnMessageReceived) {
                socket.close();

                return true;
            }

            return false;
        };

        socket.onerror = event => {
            writeToScreen('error', event.data || 'N/A');
        }
    } catch (error) {
        writeToScreen('error', error + '');
    }
};

const writeToScreen = (type, message) => {
    const rowElement = document.createElement('tr');

    const typeElement = document.createElement('td');
    typeElement.innerText = type;

    rowElement.appendChild(typeElement);

    const messageElement = document.createElement('td');
    messageElement.innerText = message;

    rowElement.appendChild(messageElement);

    document.getElementById('messages').appendChild(rowElement);
};

const pingSocket = interval => {
    setInterval(() => {
        writeToScreen('ping', new Date());

        socket.send(`2`);
    }, interval);
};
