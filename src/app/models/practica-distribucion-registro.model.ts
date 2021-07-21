
export class  PracticaDistribucionRegistro {
    public id:string;
    public convenio_os_pmo_id:string;
    public practica_distribucion_id:string;
    public porcentaje:number;
    public valor:number;
    public total:number;
    public codigo:string;
    public complejidad:string;
    public es_habilitada:string;
    public obra_social_id:string;
    public obra_social_nombre:string;
    public pmo_descripcion:string;
    public pmo_id:string;
    
    constructor(
        id:string,
        convenio_os_pmo_id:string,
        practica_distribucion_id:string,
        porcentaje:number,
        valor:number,
        total:number,
        codigo:string,
        complejidad:string,
        es_habilitada:string,
        obra_social_id:string,
        obra_social_nombre:string,
        pmo_descripcion:string,
        pmo_id:string
         ) {
        this.id = id;
        this.convenio_os_pmo_id = convenio_os_pmo_id;
        this.practica_distribucion_id = practica_distribucion_id;
        this.porcentaje = porcentaje;
         this.total= total;       
         this.valor = valor;
         this.codigo = codigo;
         this.complejidad = complejidad;
         this.es_habilitada = es_habilitada;
         this.obra_social_id = obra_social_id;
         this.obra_social_nombre = obra_social_nombre;
         this.pmo_descripcion = pmo_descripcion;
         this.pmo_id = pmo_id;
    }
}

