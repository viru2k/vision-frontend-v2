export class AgendaMedico {

    id:string;
    agenda_dia_id:string;
    hora_desde:string;
    hora_hasta:string;
    hora_desde_hasta:string;
    usuario_id:string;
    nombreyapellido:string;
    dia_nombre:string;
    dia_nro:string;
    es_habilitado:string;

    constructor( 
        id:string,
        agenda_dia_id:string,
        hora_desde:string,
        hora_hasta:string,
        hora_desde_hasta:string,
        es_habilitado:string) {
       
        this.id = id;
        this.agenda_dia_id= agenda_dia_id;
        this.hora_desde=hora_desde;
        this.hora_hasta=hora_hasta;
        this.hora_desde_hasta=hora_desde_hasta;
        this.usuario_id = this.usuario_id;
        this.nombreyapellido = this.nombreyapellido;
        this.dia_nombre= this.dia_nombre;
        this.dia_nro= this.dia_nro;
        this.es_habilitado = es_habilitado;
   }
}