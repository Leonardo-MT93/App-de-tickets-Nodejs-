const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  //Todos estos eventos se disparan cuando un nuevo cliente se conecta
  socket.emit("ultimo-ticket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);
  socket.emit("tickets-pendientes", ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);

    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length); //NOTIFICA A TODOS LA COLA ACTUAL AL EMITIR EL TICKET
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }
    const ticket = ticketControl.atenderTicket(escritorio);
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4); //Ahora los ultimos 4 cambiaron y tengo que notificar
    socket.emit("tickets-pendientes", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length); //NOTIFICA A TODOS LA COLA ACTUAL AL CUMPLIR EL TICKET
  if(!ticket){
    callback({
        ok: false,
        msg: 'Ya no hay tickets pendientes'
    })
  }else{
    callback({
        ok: true,
        ticket
    })
  }
  });
  

};

module.exports = {
  socketController,
};
