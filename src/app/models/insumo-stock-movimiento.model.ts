export class InsumoStockMovimiento {

    public id: string;
    public insumo_id: string;
    public lote: string;
    public fecha_vencimiento: Date;
    public fecha_ingreso: Date;
    public fecha_modificacion: Date;
    public usuario_id: string;
    public cantidad_original: number;
    public cantidad_usada: number;
    public cantidad_existente: number;
    public usuario_modifica: string;
    public insumo_descripcion: string;
    public cantidad: number;
    public nombreyapellido: string;
    public cirugia_id: string;
    public insumo_stock_movimieno_fecha_ingreso: Date;
    public insumo_stock_movimieno_cantidad_usada: number;
    public insumo_stock_movimieno_cantidad_existente: number;

    constructor(
     id: string,
     insumo_id: string,
     lote: string,
     fecha_vencimiento: Date,
     fecha_ingreso: Date,
     fecha_modificacion: Date,
     usuario_id: string,
     cantidad_original: number,
     cantidad_usada: number,
     cantidad_existente: number,
     usuario_modifica: string,
     insumo_descripcion: string,
     cantidad: number,
     nombreyapellido: string,
     cirugia_id: string,
     insumo_stock_movimieno_fecha_ingreso: Date,
     insumo_stock_movimieno_cantidad_usada: number,
     insumo_stock_movimieno_cantidad_existente: number
          ) {

    }
}