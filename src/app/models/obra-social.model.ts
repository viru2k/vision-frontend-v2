export class ObraSocial {

    
    
    public nombre:string;
    public descripcion:string;
    public es_habilitada:string;
    public id:string;
    public entidad_factura_id:string;
    public entidad_nombre:string;
    public tiene_distribucion:string;
    public es_coseguro:string;    
    
    constructor(id:string, nombre:string, descripcion:string, es_habilitada:string, entidad_factura_id:string, entidad_nombre:string, tiene_distribucion:string, es_coseguro:string) {
        
       this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;     
        this.es_habilitada = es_habilitada;   
        this.entidad_factura_id = entidad_factura_id;   
        this.entidad_nombre = entidad_nombre; 
        this.tiene_distribucion = tiene_distribucion;
        this.es_coseguro = es_coseguro;
    }
}