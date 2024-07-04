const ws = new WebSocket('ws://127.0.0.1:7860/queue/join')

ws.on('open', function open() {
  console.log("ws start")  
})

ws.on('message', function incoming(data) {
  console.log("msg: "+data)  
})

ws.on('close', function close() {
  console.log("kill ws")  
})