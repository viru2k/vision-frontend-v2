export class AgendaHorario {

    id:string;
    minutos:string;
    rango:string; 

    constructor( 
        id:string,
        minutos:string,
        rango:string) {
       
        this.id = id;
        this.minutos= minutos;
        this.rango=rango;
       
   }
}