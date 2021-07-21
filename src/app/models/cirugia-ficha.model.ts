export class CirugiaFicha {
    id:string;
    paciente_id:string;
    medico_deriva_id:string;
    fecha_derivacion:string;
    cirugia_medico_grupo_id:string;
    estudios_id:string;
    fecha_cirugia:string;
    operacion_cobro_id:string;
    ojo:String;
    observacion:string;
    obra_social_id:string;
    cirugia_practica:string;
    cirugia_lente_id:string;
    cirugia_ficha_anestesia_id:string;
    protocolo_quirurgico_id:string;
    estado_cirugia_id:string;
    fecha_internacion:string;
    fecha_inicio_acto_quirurgico:string;
    fecha_fin_acto_quirurgico:string;
    fecha_alta:string;        
    usuario_modifico_id:string;
    usuario_audito:String;


    constructor( 
        id:string,
        paciente_id:string,
        medico_deriva_id:string,
        fecha_derivacion:string,
        cirugia_medico_grupo_id:string,
        estudios_id:string,
        fecha_cirugia:string,
        operacion_cobro_id:string,
        ojo:String,
        observacion:string,
        obra_social_id:string,
        cirugia_practica:string,
        cirugia_lente_id:string,
        cirugia_ficha_anestesia_id:string,
        protocolo_quirurgico_id:string,
        estado_cirugia_id:string,
        fecha_internacion:string,
        fecha_inicio_acto_quirurgico:string,
        fecha_fin_acto_quirurgico:string,
        fecha_alta:string,
        usuario_modifico_id:string,
        usuario_audito:String
        ) {

this.id = id;
this.paciente_id = paciente_id;
this.medico_deriva_id = medico_deriva_id;
this.fecha_derivacion = fecha_derivacion;
this.cirugia_medico_grupo_id = cirugia_medico_grupo_id;
this.estudios_id = estudios_id;
this.fecha_cirugia = fecha_cirugia;
this.operacion_cobro_id = operacion_cobro_id;
this.ojo = ojo;
this.observacion = observacion;
this.obra_social_id = obra_social_id;
this.cirugia_practica = cirugia_practica;
this.cirugia_lente_id = cirugia_lente_id;
this.cirugia_ficha_anestesia_id = cirugia_ficha_anestesia_id;
this.protocolo_quirurgico_id = protocolo_quirurgico_id ;
this.estado_cirugia_id = estado_cirugia_id;
this.fecha_internacion = fecha_internacion;
this.fecha_inicio_acto_quirurgico = fecha_inicio_acto_quirurgico;
this.fecha_fin_acto_quirurgico = fecha_fin_acto_quirurgico;
this.fecha_alta = fecha_alta;
this.usuario_modifico_id = usuario_modifico_id;
this.usuario_audito = usuario_audito;
 
       
   }
}