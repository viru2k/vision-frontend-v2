
import { OperacionCobroDetalle } from './operacion-cobro-detalle.model';
export class Liquidacion {

    
    
    public obra_social_id:string;
    public numero:string;
    public nivel:string;
    public fecha_desde :string;
    public fecha_hasta :string;
    public liquidacion_generada_id :string;    
    public cant_orden :number;
    public total :number;
    public usuario_audito :string;
    public estado :string;
    public registros:OperacionCobroDetalle[];
    public medico_id :string;
    public honorarios:string;
    public gastos:string;
    public total_factura:number;
    constructor(
        obra_social_id:string,
        numero:string,
        nivel:string,
        fecha_desde :string,
        fecha_hasta :string,
        liquidacion_generada_id :string,
        liquidacion_id :string,
        cant_orden :number,
        total :number,
        usuario_audito :string,
        estado :string,
        registros:OperacionCobroDetalle[],
        medico_id:string,
        honorarios:string,
        gastos:string,
        total_factura:number
    ) {
        
       
        this.obra_social_id = obra_social_id;
        this.numero = numero;
        this.nivel=  nivel;
        this.fecha_desde = fecha_desde;
        this.fecha_hasta = fecha_hasta;
        this.liquidacion_generada_id= liquidacion_generada_id;
        this.cant_orden = cant_orden;
        this.total = total;
        this.usuario_audito= usuario_audito;
        this.estado= estado;
        this.registros = registros;
        this.medico_id = medico_id;
        this.honorarios = honorarios;
        this.gastos = gastos;
        this,total_factura = total_factura;
    }
}