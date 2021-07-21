
export class  OperacionCobroMedico {
    public id:string;
    public operacion_cobro_id:string;
    public medico_factura_id:string;
    public practica_nivel:string;
    
    constructor(
        id:string,
        operacion_cobro_id:string,
        medico_factura_id:string,
        practica_nivel:string
    
         ) {
        this.id = id;
        this.operacion_cobro_id = operacion_cobro_id;
        this.medico_factura_id = medico_factura_id;
        this.practica_nivel = practica_nivel;
}

}