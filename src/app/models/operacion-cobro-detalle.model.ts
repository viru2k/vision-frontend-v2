export class  OperacionCobroDetalle {
    public id:string;
    public operacion_cobro_id:string;
    public valor_facturado:number;
    public valor_original:number;
    public categorizacion:number;
    public observacion:string;
    public user_medico_id:string;
    public fecha_cobro:string;
    public apellido:string;
    public nombre:string;
    public dni:string;
    public medico_nombre:string;
    public obra_social_nombre:string;
    public codigo:string;
    public descripcion:string;
    public complejidad:string;    
    public cantidad:number;    
    public usuario_audita_id:number;
    public distribucion:number;
    public tiene_observacion:string;
    public motivo_observacion:string;
    public gravado_adherente:string;
    public valor_final:number;
    constructor(
        id:string,
        operacion_cobro_id:string,        
        valor_facturado:number,
        valor_original:number,
        categorizacion:number,
        observacion:string,
        user_medico_id:string,
        fecha_cobro:string,
        apellido:string,
        nombre:string,
        dni:string,
        medico_nombre:string,
        obra_social_nombre:string,
        codigo:string,
        descripcion:string,
        complejidad:string,
        cantidad:number,
        usuario_audita_id:number,
        distribucion:number,
        tiene_observacion:string,
        motivo_observacion:string,
        gravado_adherente:string,
        valor_final:number
         ) {
        this.id = id;
        this.operacion_cobro_id = operacion_cobro_id;
        this.valor_facturado = valor_facturado;
        this.valor_original = valor_original;
        this.categorizacion = categorizacion;
        this.observacion = observacion;
        this.user_medico_id = user_medico_id;
        this.fecha_cobro = fecha_cobro;
        this.apellido = apellido;
        this.nombre  = nombre;
        this.dni = dni;
        this.medico_nombre = medico_nombre;
        this.obra_social_nombre = obra_social_nombre;
        this.codigo = codigo;
        this.complejidad = complejidad;
        this.cantidad = cantidad;
        this.usuario_audita_id = usuario_audita_id;
        this.distribucion = distribucion;
        this.tiene_observacion = tiene_observacion;
        this.motivo_observacion = motivo_observacion;
        this.gravado_adherente = gravado_adherente;
        this.valor_final = valor_final;
}

}