export class MedicoObraSocial {

    
    
    public medico_id:string;
    public obra_social_id:string;
    public nombre:string;
    public id:string;
    public apellido:string;
    public usuario_id:string;
    public fecha_matricula:Date;
    public es_habilitada:string;
    public obra_social_nombre:string;
    public codigo_old:string;
    constructor(id:string, nombre:string, obra_social_id:string, medico_id:string, apellido:string, usuario_id:string, fecha_matricula:Date, es_habilitada:string, obra_social_nombre:string,codigo_old:string) {
        
       this.id = id;
        
        this.medico_id = medico_id;     
        this.obra_social_id = obra_social_id;   
        this.nombre = nombre;
        this.apellido = apellido;   
        this.usuario_id = usuario_id;
        this.fecha_matricula = fecha_matricula;
        this.es_habilitada = es_habilitada;
        this.obra_social_nombre = obra_social_nombre;
        this.codigo_old = codigo_old;
    }
}