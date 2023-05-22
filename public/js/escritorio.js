//referencias html

const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerHTML = escritorio;
divAlert.style.display = 'none'
// console.log({escritorio})

const socket = io();

socket.on("connect", () => {
  // console.log('Conectado');

  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if( pendientes === 0){ 
    lblPendientes.style.display = 'none'
  }else{
    lblPendientes.style.display = ''
    lblPendientes.innerText = pendientes;
  }
  
})

btnAtender.addEventListener("click", () => {
    //que el backen este escuchando el evento
    
    socket.emit('atender-ticket', {escritorio}, ( {ok, ticket, msg} ) => {
        if(!ok){
            lblTicket.innerText = 'Nadie'
           return divAlert.style.display = '';
        }
        lblTicket.innerText = `Ticket ${ticket.numero}`
        
    })
    
});
