import { FacturaElectronicaRenglon } from "./factura-electronica-renglon.model";
import { FacturaAlicuotaAsociada } from "./factura_alicuota_asociada.model";
export class FacturaElectronica {
  id: string;
  factura_pto_vta_id: string;
  factura_comprobante_id: string;
  factura_concepto_id: string;
  factura_documento_comprador_id: string;
  factura_documento: string;
  factura_cliente: string;
  factura_numero: string;
  fecha: string;
  fecha_desde: string;
  fecha_hasta: string;
  importe_total: number;
  importe_total_neto_no_gravado: number;
  importe_neto: number;
  importe_op_exenta: number;
  importe_iva: number;
  facturaAlicuotaAsociada: FacturaAlicuotaAsociada[];
  facturaElectronicaRenglon: FacturaElectronicaRenglon[];
  cae: string;
  cae_vto: string;
  medico_id: string;
  factura_obra_social: string;
  elementoCondicionIva: string;
  es_afip: string;
  usuario_id: string;
  categoria_iva: string;
  es_credito: boolean;
  comprobante_credito: string;
  factura_comprobante_id_credito: string;
  factura_pto_vta_id_credito: string;
  factura_comprobante_numero_credito: string;

  constructor(
    id: string,
    factura_pto_vta_id: string,
    factura_comprobante_id: string,
    factura_concepto_id: string,
    factura_documento_comprador_id: string,
    factura_documento: string,
    factura_cliente: string,
    factura_numero: string,
    fecha: string,
    fecha_desde: string,
    fecha_hasta: string,
    importe_total: number,
    importe_total_neto_no_gravado: number,
    importe_neto: number,
    importe_op_exenta: number,
    importe_iva: number,
    facturaAlicuotaAsociada: FacturaAlicuotaAsociada[],
    facturaElectronicaRenglon: FacturaElectronicaRenglon[],
    cae: string,
    cae_vto: string,
    medico_id: string,
    factura_obra_social: string,
    elementoCondicionIva: string,
    es_afip: string,
    usuario_id: string,
    es_credito: boolean,
    factura_comprobante_id_credito: string,
    factura_pto_vta_id_credito: string,
    factura_comprobante_numero_credito: string
  ) {
    this.id = id;
    this.factura_pto_vta_id = factura_pto_vta_id;
    this.factura_comprobante_id = factura_comprobante_id;
    this.factura_concepto_id = factura_concepto_id;
    this.factura_documento_comprador_id = factura_documento_comprador_id;
    this.factura_documento = factura_documento;
    this.factura_cliente = factura_cliente;
    this.factura_numero = factura_numero;
    this.fecha = fecha;
    this.fecha_desde = fecha_desde;
    this.fecha_hasta = fecha_hasta;
    this.importe_total = importe_total;
    this.importe_total_neto_no_gravado = importe_total_neto_no_gravado;
    this.importe_neto = importe_neto;
    this.importe_op_exenta = importe_op_exenta;
    this.importe_iva = importe_iva;
    this.facturaAlicuotaAsociada = facturaAlicuotaAsociada;
    this.facturaElectronicaRenglon = facturaElectronicaRenglon;
    this.cae = cae;
    this.cae_vto = cae_vto;
    this.medico_id = medico_id;
    this.factura_obra_social = factura_obra_social;
    this.elementoCondicionIva = elementoCondicionIva;
    this.es_afip = es_afip;
    this.usuario_id = usuario_id;
    this.es_credito = es_credito;
    this.factura_comprobante_id_credito = factura_comprobante_id_credito;
    this.factura_pto_vta_id_credito = factura_pto_vta_id_credito;
    this.factura_comprobante_numero_credito =
      factura_comprobante_numero_credito;
  }
}
