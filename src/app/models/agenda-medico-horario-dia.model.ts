export class AgendaMedicoHorarioDia {

    id:string;
    usuario_id:string;
    dia:string;
    agenda_horaria_id:string;
    

    constructor( 
        id:string,
        usuario_id:string,
        dia:string,
        agenda_horaria_id:string) {
       
        this.id = id;
        this.usuario_id= usuario_id;
        this.dia=dia;
        this.agenda_horaria_id=agenda_horaria_id;        

   }
}