import { OperacionCobroMedico } from './operacion-cobro-medico.model';
import { OperacionCobroPractica } from './operacion-cobro-practica.model';
import { PracticaDistribucion } from './practica-distribucion.model';

export class  OperacionCobro {
    public id:string;
    public obra_social_id:string;
    public paciente_id:string;
    public total_operacion_cobro:number;
    public total_facturado:number;
    public total_coseguro:number;
    public total_honorarios_medicos:number;
    public total_otros:number;
    public usuario_cobro_id:string;
    public usuario_audita_id:string;
    public fecha_cobro:string;
    public estado:string;
    public operacionCobroMedico:OperacionCobroMedico;
    public operacionCobroPractica:OperacionCobroPractica[];
    public observacion:string;
    public numero_bono:string;
    public operacion_cobro_es_anulado:string;
    public practica_distribucion:PracticaDistribucion[];
    constructor(
        id:string,
        obra_social_id:string,
        paciente_id:string,
        total_operacion_cobro:number,
        total_facturado:number, 
        total_coseguro:number,
        total_honorarios_medicos:number,
        total_otros:number,
        usuario_cobro_id:string,
        usuario_audita_id:string,
        fecha_cobro:string,
        estado:string,
        operacionCobroMedico:OperacionCobroMedico,
        operacionCobroPractica:OperacionCobroPractica[],
        observacion:string,
        numero_bono:string,
        operacion_cobro_es_anulado:string,
        practica_distribucion:PracticaDistribucion[]
         ) {
        this.id = id;
        this.obra_social_id = obra_social_id;
        this.paciente_id = paciente_id;
        this.total_operacion_cobro = total_operacion_cobro;
        this.total_facturado= total_facturado;    
        this.total_coseguro = total_coseguro;
        this.total_honorarios_medicos = total_honorarios_medicos;   
        this.total_otros = total_otros;
        this.usuario_cobro_id = usuario_cobro_id;
        this.usuario_audita_id = usuario_audita_id;
        this.fecha_cobro = fecha_cobro;
        this.estado = estado;
        this.operacionCobroMedico = operacionCobroMedico;
        this.operacionCobroPractica = operacionCobroPractica;
        this.observacion = observacion;
        this.numero_bono = numero_bono;
        this.operacion_cobro_es_anulado = operacion_cobro_es_anulado;
        this.practica_distribucion = practica_distribucion;
    }
}
