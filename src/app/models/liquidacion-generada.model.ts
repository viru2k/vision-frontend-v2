export class LiquidacionGenerada {

    public numero: string;
    public detalle: string;
    public fecha_liquidacion: string;
    public estado: string;

    constructor(
        numero: string,
        detalle: string,
        fecha_liquidacion: string,
        estado: string
        ) {

            this.numero = numero;
            this.detalle = detalle;
            this.fecha_liquidacion = fecha_liquidacion;
            this.estado = estado;
    }
}