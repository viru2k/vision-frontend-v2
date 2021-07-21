export class FacturaArticulo {

    
    public id:string;
    public descripcion:string;
    public factura_alicuota_id:string;
    public importe:number;
    public cantidad:number;
    public unidad:string;
    public tipo_articulo:string;
    public tipo_movimiento:string;
    
    
    constructor(
        id:string,
        descripcion:string,
        factura_alicuota_id:string,
        importe:number,
        cantidad:number,
        unidad:string,
        tipo_articulo:string,
        tipo_movimiento:string
    ) {
        this.id = id;
        this.descripcion = descripcion;
        this.factura_alicuota_id = factura_alicuota_id;
        this.importe = importe;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.tipo_articulo = tipo_articulo;
        this.tipo_movimiento = tipo_movimiento;
    }
}