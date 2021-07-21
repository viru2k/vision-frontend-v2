export class FacturaElectronicaRenglon {
  id: string;
  factura_id: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  total_sin_iva: number;
  alicuota_id: string;
  alicuota: number;
  alicuota_descripcion: string;
  iva: number;
  total_renglon: number;
  tipo_concepto_iva: string;
  constructor(
    id: string,
    factura_id: string,
    descripcion: string,
    cantidad: number,
    precio_unitario: number,
    total_sin_iva: number,
    alicuota_id: string,
    alicuota: number,
    alicuota_descripcion: string,
    iva: number,
    total_renglon: number,
    tipo_concepto_iva: string
  ) {
    this.id = id;
    this.factura_id = factura_id;
    this.descripcion = descripcion;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
    this.total_sin_iva = total_sin_iva;
    this.alicuota_id = alicuota_id;
    this.alicuota = alicuota;
    this.alicuota_descripcion = alicuota_descripcion;
    this.iva = iva;
    this.total_renglon = total_renglon;
    this.tipo_concepto_iva = tipo_concepto_iva;
  }
}
