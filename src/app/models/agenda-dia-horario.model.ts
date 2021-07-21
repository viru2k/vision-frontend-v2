export class AgendaDiaHora {

    id:string;
    agenda_horaria_nro:string;
    hora_desde:string;
    hora_hasta:string;
    hora_desde_hasta:string;

    constructor( 
        id:string,
        agenda_horaria_nro:string,
        hora_desde:string,
        hora_hasta:string,
        hora_desde_hasta:string) {
       
        this.id = id;
        this.agenda_horaria_nro= agenda_horaria_nro;
        this.hora_desde=hora_desde;
        this.hora_hasta=hora_hasta;
        this.hora_desde_hasta=hora_desde_hasta;

   }
}