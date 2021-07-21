export class CirugiaLente {

    id:string;
    tipo_lente_id:string;
    dioptria:string;
    lote:string;
    fecha_vencimiento:string;
    ubicacion:string;
    estado: string;
    es_baja: string;
    usuario_modifico: string;
    remito: string;
    factura: string;
    

    constructor(   id:string,
        tipo_lente_id,
        dioptria:string,
        lote:string,
        fecha_vencimiento:string,
        ubicacion:string,
        estado:string,
        es_baja:string,
        usuario_modifico:string,
        remito: string,
        factura: string){
        this.id = id;
        this.tipo_lente_id = tipo_lente_id;
        this.dioptria = dioptria;
        this.lote = lote;
        this.ubicacion = ubicacion;
        this.estado = estado;
        this.fecha_vencimiento = fecha_vencimiento;
        this.es_baja = es_baja;
        this.usuario_modifico = usuario_modifico;
    }
}