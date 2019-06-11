export function connect(address, topic) {
// Create WebSocket connection.
  const socket = new WebSocket(address + "/" + topic);

  let message = {clientMsgId: 1, message: "Hello world!", sender: "Your grandma"}

// Connection opened
  socket.addEventListener('open', (event) => {
    socket.send(JSON.stringify(message));
  });

// Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server: ', event.data );
  });
}
