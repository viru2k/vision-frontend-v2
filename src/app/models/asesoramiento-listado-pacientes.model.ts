export class AsesoramientoListadoPaciente {

    id:string;
    paciente_id:string;
    fecha_derivacion:string;
    es_atendido:string;
    usuario_atendio_id:string;
    fecha_atencion:string;

    constructor( 
        id:string,
        paciente_id:string,
        fecha_derivacion:string,
        es_atendido:string,
        usuario_atendio_id:string,
        fecha_atencion:string) {
       
            this.id = id;
            this.paciente_id = paciente_id;
            this.fecha_derivacion = fecha_derivacion;
            this.es_atendido = es_atendido;
            this.usuario_atendio_id = usuario_atendio_id;
            this.fecha_atencion = fecha_atencion;

   }
}