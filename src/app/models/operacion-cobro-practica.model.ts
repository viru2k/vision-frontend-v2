import { PracticaDistribucion } from './practica-distribucion.model';


export class  OperacionCobroPractica {
    public id:string;
    public convenio_os_pmo_id:string;  
    public pmo_descripcion:string;
    public obra_social_nombre:string;
    public obra_social_id:string;
    public valor_original:number;
    public valor_facturado:number;
    public operacion_cobro_id:string;
    public observacion:string;
    public pmo_id:string;
    public pmo_nivel:string;
    public categorizacion:number;
    public cantidad:number;
    public es_coseguro:string;
    public tiene_distribucion:string;
    public total_honorario_obra_social:number;
    public total_honorario_coseguro:number;
    public forma_pago:string;
    public usuario_realiza_id:string;
    public estado_facturacion:string;
    public usuario_cobro_nombre:string;
    public tiene_observacion:string;
    public motivo_observacion:string;
    public gravado_adherente:string;
    public es_anulado:string;    
    public internacion_tipo:string;
    public facturacion_nro:string;
    public distribuido:string;

    
    constructor(
        id:string,
        convenio_os_pmo_id:string, 
        pmo_descripcion:string,
        obra_social_nombre:string, 
        obra_social_id:string,
        valor_original:number,
        valor_facturado:number,
        operacion_cobro_id:string,
        observacion:string,
        pmo_id:string,
        pmo_nivel:string,
        categorizacion:number,
        cantidad:number,
        es_coseguro:string,
        tiene_distribucion:string,
        total_honorario_obra_social:number,
        total_honorario_coseguro:number,
        forma_pago:string,
        usuario_realiza_id:string,
        estado_facturacion:string,
        usuario_cobro_nombre:string,
        tiene_observacion:string,
        motivo_observacion:string,
        gravado_adherente:string,
        es_anulado:string,
        internacion_tipo:string,
        facturacion_nro:string,
        distribuido:string
        
         ) {
        this.id = id;
        this.convenio_os_pmo_id = convenio_os_pmo_id;
        this.pmo_descripcion = pmo_descripcion;
        this.obra_social_nombre = obra_social_nombre;
        this.obra_social_id = obra_social_id;
        this.valor_original = valor_original;
         this.valor_facturado= valor_facturado;
         this.operacion_cobro_id = operacion_cobro_id;
         this.observacion = observacion;
         this.pmo_id = pmo_id;
         this.pmo_nivel = pmo_nivel;
         this.categorizacion = categorizacion;
         this.cantidad = cantidad;
         this.es_coseguro = es_coseguro;
         this.tiene_distribucion = tiene_distribucion;
         this.total_honorario_obra_social = total_honorario_obra_social;
         this.total_honorario_coseguro = total_honorario_coseguro;
         this.forma_pago = forma_pago;
         this.usuario_realiza_id = usuario_realiza_id;
         this.estado_facturacion = estado_facturacion;
         this.usuario_cobro_nombre = usuario_cobro_nombre;
         this.tiene_observacion = tiene_observacion;
         this.motivo_observacion = motivo_observacion;
         this.gravado_adherente = gravado_adherente;
         this.es_anulado = es_anulado;
         this.internacion_tipo = internacion_tipo;
         this.facturacion_nro = facturacion_nro;
         this.distribuido = distribuido;
    }
}
