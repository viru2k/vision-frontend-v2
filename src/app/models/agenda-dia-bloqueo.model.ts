export class AgendaDiaBloqueo {

    id:string;
    fecha:string;
    usuario_id:string;
  

    constructor( 
        id:string,
        fecha:string,
        usuario_id:string,
        ) {
       
        this.id = id;
        this.fecha= fecha;
        this.usuario_id=usuario_id;
       

   }
}