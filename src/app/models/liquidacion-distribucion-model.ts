import { OperacionCobroPractica } from './operacion-cobro-practica.model';


export class  LiquidacionDistribucion {    
    public id:string;
    public medico_opera_id: string;
    public medico_opera_porcentaje: number;
    public medico_opera_valor: number;
    public medico_ayuda_id: string;
    public medico_ayuda_porcentaje: number;
    public medico_ayuda_valor: number;
    public medico_ayuda2_id: string;
    public medico_ayuda2_porcentaje: number;
    public medico_ayuda2_valor: number;
    public medico_clinica_id: string;
    public medico_clinica_porcentaje: number;
    public medico_clinica_valor: number;
    public valor_distribuido: number;
    public total: number;
    public fecha_liquidacion: string;
    public usuario_audito: string;
    public fecha_distribucion: string;
    public concepto_liquidacion_id: string;
    public operacion_cobro_practica: OperacionCobroPractica[];
    
    constructor(
        
         id:string,
         medico_opera_id: string,
         medico_opera_porcentaje: number,
         medico_opera_valor: number,
         medico_ayuda_id: string,
         medico_ayuda_porcentaje: number,
         medico_ayuda_valor: number,
         medico_ayuda2_id: string,
         medico_ayuda2_porcentaje: number,
         medico_ayuda2_valor: number,
         medico_clinica_id: string,
         medico_clinica_porcentaje: number,
         medico_clinica_valor: number,
         valor_distribuido: number,
         total: number,
         fecha_liquidacion: string,
         usuario_audito: string,
         fecha_distribucion: string,
         concepto_liquidacion_id: string,
         operacion_cobro_practica: OperacionCobroPractica[]

         ) {
            
            this.id = id;
            this.medico_opera_id = medico_opera_id;
            this.medico_opera_porcentaje = medico_opera_porcentaje;
            this.medico_opera_valor = medico_opera_valor;
            this.medico_ayuda_id = medico_ayuda_id;
            this.medico_ayuda_porcentaje = medico_ayuda_porcentaje;
            this.medico_ayuda_valor = medico_ayuda_valor;
            this.medico_ayuda2_id = medico_ayuda2_id;
            this.medico_ayuda2_porcentaje = medico_ayuda2_porcentaje;
            this.medico_ayuda2_valor = medico_ayuda2_valor;
            this.medico_clinica_id = medico_clinica_id;
            this.medico_clinica_porcentaje = medico_clinica_porcentaje;
            this.medico_clinica_valor = medico_clinica_valor;
            this.valor_distribuido = valor_distribuido;
            this.total = total;
            this.fecha_liquidacion = fecha_liquidacion;
            this.usuario_audito = usuario_audito;
            this.fecha_distribucion = fecha_distribucion;
            this.concepto_liquidacion_id = concepto_liquidacion_id;
            this.operacion_cobro_practica = operacion_cobro_practica;
    }
}
