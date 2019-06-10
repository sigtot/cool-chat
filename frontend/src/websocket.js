export function connect(address, topic) {
// Create WebSocket connection.
  const socket = new WebSocket(address + "/" + topic);


  let message = {message: "Hello world!", sender: "Your grandma"}

// Connection opened
  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify(message));
  });

// Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server: ', event.data );
  });
}
