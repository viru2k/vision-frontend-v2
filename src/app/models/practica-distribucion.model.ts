
export class PracticaDistribucion {

    

    public id:string;
    public convenio_os_pmo_id:string;
    public practica_distribucion_id:string;
    public practica_distribucion_porcentaje:number;
    public practica_distribucion_valor:number;
    public practica_distribucion_total:number;
    public pmo_codigo:string;
    public pmo_descripcion:string;
    public registro_descripcion:string;
    public registro_codigo:string;

    constructor(id:string, convenio_os_pmo_id:string, 
        practica_distribucion_id:string, practica_distribucion_porcentaje:number, practica_distribucion_valor:number, practica_distribucion_total:number
        ,pmo_codigo:string,pmo_descripcion:string,registro_codigo:string) {
        
       
        this.id = id;
        this.convenio_os_pmo_id = convenio_os_pmo_id;
        this.practica_distribucion_id = practica_distribucion_id;
        this.practica_distribucion_porcentaje = practica_distribucion_porcentaje;
        this.practica_distribucion_valor = practica_distribucion_valor;
        this.practica_distribucion_total = practica_distribucion_total;
        this.pmo_codigo = pmo_codigo;
        this.pmo_descripcion = pmo_descripcion;
        this.registro_codigo = registro_codigo;
         
    }
}