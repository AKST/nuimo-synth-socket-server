import withNuimo from "nuimo-client";
import socketIO from "socket.io";
import express from "express";
import http from "http";


const serialiser = {
  serialise (update) {
    return ({
      type: update.type,
      time: update.time,
      repr: update.accept(this)
    });
  },

  withTurn (turn) {
    return { offset: turn.offset };
  },

  withSwipe (swipe) {
    return { direction: swipe.direction };
  },

  withClick (click) {
    return { down: click.down };
  },
};


const app = express();
const server = http.Server(app);
const io = socketIO(server);


withNuimo().then(numio => {
  numio.listen(data => {
    const update = serialiser.serialise(data);
    io.emit('update', update);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('now serving on 3000');
});
