const path = require('path');
const fs = require('fs');

class Ticket {
    constructor( numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio
    }
}

class TicketControl {
    constructor(){
        this.ultimo = 500;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init()
    }

    get toJSON() {
        return {
           ultimo: this.ultimo,
           hoy: this.hoy,
           tickets: this.tickets,
           ultimos4: this.ultimos4
        }
    }

    init(){ //INICIALIZAR EL SERVIDOR -- leer el archivo json -- atajo
        const {hoy, ultimo, tickets, ultimos4} = require('../db/data.json');
        if(hoy === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            //es otro dia - tengo que reiniciar todo 
            this.guardarDB();
        }
    }

    guardarDB(){ //guardar todo en db
        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync (dbPath, JSON.stringify (this.toJSON)); //parseo a string mi objeto obtenido por el getter toJson
    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push (ticket)
        this.guardarDB();

        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ){
        //No tenemos tickets
        if( this.tickets.length === 0){
            return null;
        }

        const ticket = this.tickets.shift() //remueve el primer elemento delñ array y lo retorna
        ticket.escritorio = escritorio;
        this.ultimos4.unshift( ticket ) // para añadir un elemnto nuevo al arreglo pero al inicio
        
        if( this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1)
        }

        this.guardarDB();
        return ticket;

    }

}

module.exports = TicketControl