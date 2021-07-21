export class CirugiaFichaListadoQuirofano {
    id:string;
    medico_deriva:string;
    cirugia_medico_grupo_id:string;
    cirugia_ficha_id:string;
    paciente_id:string;
    medico_deriva_id:string;
    fecha_derivacion:string;
    estado_cirugia_id:string;
    paciente_apellido:string;
    paciente_nombre:string;
    paciente_dni:string;
    paciente_fecha_nacimiento:string;
    estado:string;    
    obra_social_nombre:string;
    obra_social_id:String;
    ojo:string;
    cirugia_practica:string;
    cirugia_ficha_usuario_modifico:string;
    usuario_modifico_id:string;
    cirugia_ficha_usuario_audito:string;
    usuario_audito:string;
    orden:string;
    usuario_crea_id:string;
    usuario_listado_creo_nombre:string;
    usuario_modifica_id:string;
    usuario_listado_modifico_nombre:string;
    dioptria:string;
    lente_vencimiento:string;
    lote:string;
    lente_estado:String;
    lente_tipo:String;
    quirofano_observacion:string;
    tiene_observacion:string;



    constructor( 
    id:string,
    medico_deriva:string,
    cirugia_medico_grupo_id:string,
    cirugia_ficha_id:string,
    paciente_id:string,
    medico_deriva_id:string,
    fecha_derivacion:string,
    estado_cirugia_id:string,
    paciente_apellido:string,
    paciente_nombre:string,
    paciente_dni:string,
    paciente_fecha_nacimiento:string,
    estado:string,
    obra_social_nombre:string,
    obra_social_id:String,
    ojo:string,
    cirugia_practica:string,
    cirugia_ficha_usuario_modifico:string,
    usuario_modifico_id:string,
    cirugia_ficha_usuario_audito:string,
    usuario_audito:string,
    orden:string,
    usuario_crea_id:string,
    usuario_listado_creo_nombre:string,
    usuario_modifica_id:string,
    usuario_listado_modifico_nombre:string,
    dioptria:string,
    lente_vencimiento:string,
    lote:string,
    lente_estado:String,
    lente_tipo:String,
    quirofano_observacion:string,
    tiene_observacion:string
        ) {

    this.id = id;
    this.medico_deriva = medico_deriva;
    this.cirugia_medico_grupo_id = cirugia_medico_grupo_id;
    this.cirugia_ficha_id = cirugia_ficha_id;
    this.paciente_id = paciente_id;
    this.medico_deriva_id = medico_deriva_id;
    this.fecha_derivacion = fecha_derivacion;
    this.estado_cirugia_id = estado_cirugia_id;
    this.paciente_apellido = paciente_apellido;
    this.paciente_nombre = paciente_nombre;
    this.paciente_dni = paciente_dni;
    this.paciente_fecha_nacimiento = paciente_fecha_nacimiento;
    this.estado = estado;
    this.obra_social_nombre = obra_social_nombre;
    this.obra_social_id = obra_social_id;
    this.ojo = ojo;
    this.cirugia_practica = cirugia_practica;
    this.cirugia_ficha_usuario_modifico = cirugia_ficha_usuario_modifico;
    this.usuario_modifico_id = usuario_modifico_id;
    this.cirugia_ficha_usuario_audito = cirugia_ficha_usuario_audito;
    this.usuario_audito = usuario_audito;
    this.orden = orden;
    this.usuario_crea_id = usuario_crea_id;
    this.usuario_listado_creo_nombre = usuario_listado_creo_nombre;
    this.usuario_modifica_id = usuario_modifica_id;
    this.usuario_listado_modifico_nombre = usuario_listado_modifico_nombre;
    this.dioptria = dioptria;
    this.lente_vencimiento = lente_vencimiento;
    this.lote = lote;
    this.lente_estado = lente_estado;
    this.lente_tipo = lente_tipo;
    this.quirofano_observacion = quirofano_observacion;
    this.tiene_observacion = tiene_observacion;
       
   }
}