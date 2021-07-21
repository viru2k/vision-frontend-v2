export class Convenio {

    
    public id:string;

    public valor:number;
    public obra_social_id:string;
    public obra_social_nombre:string;
    public coseguro_id:string;
    public coseguro_nombre:string;
    public coseguro_valor:number;
    public es_habilitada:string;
    public pmo_id:string;
    public codigo:string;
    public pmo_descripcion:string;
    public complejidad:string;
    public es_habilitado:string;
    public es_coseguro:string;
    public tiene_distribucion:string;
    constructor( id:string,

         valor:number,
         obra_social_id:string,
         obra_social_nombre:string,
         coseguro_id:string,
         coseguro_nombre:string,
         coseguro_valor:number,
         es_habilitada:string,
         pmo_id:string,
         codigo:string,
         pmo_descripcion:string,
         complejidad:string,
         es_habilitado:string,
         es_coseguro:string,
         tiene_distribucion:string) {
        
         this.id = id;         
         this.valor=valor;
         this.obra_social_id=obra_social_id;
         this.obra_social_nombre=obra_social_nombre;
         this.coseguro_id = coseguro_id;
         this.coseguro_nombre = coseguro_nombre;
         this.coseguro_valor = valor;
         this.es_habilitada=es_habilitada;
         this.pmo_id=pmo_id;
         this.codigo=codigo;
         this.pmo_descripcion=pmo_descripcion;
         this.complejidad=complejidad;  
         this.es_habilitado=es_habilitado;
         this.es_coseguro = es_coseguro;
         this.tiene_distribucion = tiene_distribucion;
    }
}