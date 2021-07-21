export class  OperacionCobroRegistro {

 
public operacion_cobro_id:string;
public operacion_cobro_estado:string;
public operacion_cobro_fecha_cobro:string;
public operacion_cobro_liquidacion_numero:string;
public operacion_cobro_numero_bono:string;
public operacion_cobro_obra_social_id:string;
public operacion_cobro_obra_social_nombre:string;
public operacion_cobro_total_coseguro:string;
public operacion_cobro_total_facturado:number;
public operacion_cobro_total_honorarios_medicos:number;
public operacion_cobro_total_operacion_cobro:number;
public operacion_cobro_total_otros:number;
public paciente_id:string;
public operacion_cobro_paciente_nombre:string;
public tiene_observacion:string;
public motivo_observacion:string;
public gravado_adherente:string;
public es_anulado:string;

    constructor(
        operacion_cobro_id:string,
        operacion_cobro_estado:string,
        operacion_cobro_fecha_cobro:string,
        operacion_cobro_liquidacion_numero:string,
        operacion_cobro_numero_bono:string,
        operacion_cobro_obra_social_id:string,
        operacion_cobro_obra_social_nombre:string,
        operacion_cobro_total_coseguro:string,
        operacion_cobro_total_facturado:number,
        operacion_cobro_total_honorarios_medicos:number,
        operacion_cobro_total_operacion_cobro:number,
        operacion_cobro_total_otros:number,
        operacion_cobro_paciente_nombre:string,
        paciente_id:string,
        tiene_observacion:string,
        motivo_observacion:string,
        gravado_adherente:string,
        es_anulado:string
         ) {
            this.operacion_cobro_id = operacion_cobro_id;
            this.operacion_cobro_estado = operacion_cobro_estado;
            this.operacion_cobro_fecha_cobro = operacion_cobro_fecha_cobro;
            this.operacion_cobro_liquidacion_numero = operacion_cobro_liquidacion_numero;
            this.operacion_cobro_numero_bono = operacion_cobro_numero_bono;
            this.operacion_cobro_obra_social_id = operacion_cobro_obra_social_id;
            this.operacion_cobro_obra_social_nombre = operacion_cobro_obra_social_nombre;
            this.operacion_cobro_total_coseguro = operacion_cobro_total_coseguro;
            this.operacion_cobro_total_facturado = operacion_cobro_total_facturado;
            this.operacion_cobro_total_honorarios_medicos = operacion_cobro_total_honorarios_medicos;
            this.operacion_cobro_total_operacion_cobro = operacion_cobro_total_operacion_cobro;
            this.operacion_cobro_total_otros = operacion_cobro_total_otros;
            this.paciente_id = paciente_id;
            this.operacion_cobro_paciente_nombre = operacion_cobro_paciente_nombre;
            this.tiene_observacion = tiene_observacion;
            this.motivo_observacion = motivo_observacion;
            this.gravado_adherente = gravado_adherente;
            this.es_anulado = es_anulado;
}           

}

