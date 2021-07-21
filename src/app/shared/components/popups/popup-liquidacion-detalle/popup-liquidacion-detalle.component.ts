import { PopupOperacionCobroRegistroEditarComponent } from "../../../../shared/components/popups/popup-operacion-cobro-registro-editar/popup-operacion-cobro-registro-editar.component";
import { ObraSocial } from "src/app/models/obra-social.model";

import { ObraSocialService } from "../../../../services/obra-social.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  PipeTransform,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { ConvenioService } from "../../../../services/convenio.service";
import { Convenio } from "../../../../models/convenio.model";
import { FacturaElectronicaRenglon } from "./../../../../models/factura-electronica-renglon.model";
import { calendarioIdioma, logo_clinica } from "../../../../config/config";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import swal from "sweetalert2";
declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");
var JsBarcode = require("jsbarcode");
var Canvas = require("canvas");
import * as $ from "jquery";
import {
  MessageService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/api";
import { DialogService } from "primeng/components/common/api";
import { PracticaService } from "src/app/services/practica.service";
import { OperacionCobroDetalle } from "src/app/models/operacion-cobro-detalle.model";
import { formatDate, DecimalPipe, CurrencyPipe } from "@angular/common";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";
import { PopupObraSocialComponent } from "src/app/shared/components/popups/popup-obra-social/popup-obra-social.component";
import { Liquidacion } from "../../../../models/liquidacion.model";
import { LiquidacionService } from "../../../../services/liquidacion.service";

import { NumberToWordsPipe } from "../../../../shared/pipes/number-to-words.pipe";
import { PopupOperacionCobroPresentacionComponent } from "../../../../shared/components/popups/popup-operacion-cobro-presentacion/popup-operacion-cobro-presentacion.component";
import { PopupPresentacionEditarComponent } from "../../../../shared/components/popups/popup-presentacion-editar/popup-presentacion-editar.component";
//import { ExcelService } from '../../../../services/excel.service';
import { FacturacionService } from "../../../../services/facturacion.service";

@Component({
  selector: "app-popup-liquidacion-detalle",
  templateUrl: "./popup-liquidacion-detalle.component.html",
  styleUrls: ["./popup-liquidacion-detalle.component.scss"],
})
export class PopupLiquidacionDetalleComponent implements OnInit {
  cols: any[];
  columns: any[];
  columnsListadoMedico: any[];
  columnsListadoTodos: any[];
  columnsListadoCirugiaTodos: any[];
  loading: boolean;
  resultSave: boolean;
  es: any;
  displayDialog: boolean;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;
  DateForm: FormGroup;
  liquidacion: Liquidacion;
  elementos: Liquidacion[] = null;
  elementosFiltrados: Liquidacion[] = null;
  selectedRenglonitems: FacturaElectronicaRenglon[] = [];

  selecteditems: any[] = [];
  elementosPreFactura: Liquidacion[] = [];
  total_facturado_impresion: number;
  cantidad_practica: number = 0;
  total_original: number = 0;
  total_facturado: number = 0;

  selectedImpresion: string; //= 'Transferencia';
  impresiones: any[];
  barcode: boolean;
  resp_factura: any[];

  elementosAlicuota: any[] = null;
  elementoAlicuota: any = null;
  elemento: FacturaElectronicaRenglon;

  cantidad: number = 1;
  importe_unitario: number = 0;
  subtotal: string = "0";
  iva: string = "0";
  total: string = "0";
  concepto: string;

  value: string;
  constructor(
    private facturacionService: FacturacionService,
    private miServicio: LiquidacionService,
    private practicaService: PracticaService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public numberToWordsPipe: NumberToWordsPipe,
    private cp: CurrencyPipe,
    private dp: DecimalPipe,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.impresiones = [
      { name: "Presentación todos", code: "1" },
      { name: "Presentación a médico", code: "2" },
      { name: "Presentación medico ACLISA", code: "3" },
      { name: "Presentación DOS Cirugia", code: "4" },
      { name: "Presentación con IVA", code: "5" },
      { name: "Exportar Excel", code: "6" },
      { name: "Txt práctica y estudios DOS", code: "7" },
      { name: "Txt cirugia DOS", code: "8" },
      { name: "Imprimir factura", code: "9" },
    ];

    this.cols = [
      { field: "id", header: "Liq. nº", width: "7%" },
      { field: "obra_social_nombre", header: "Obra social", width: "20%" },
      { field: "entidad_nombre", header: "Entidad", width: "10%" },
      { field: "numero", header: "Periodo", width: "8%" },
      { field: "nivel", header: "Nivel", width: "10%" },
      { field: "fecha_desde", header: "Desde", width: "10%" },
      { field: "fecha_hasta", header: "Hasta", width: "10%" },
      { field: "cant_orden", header: "Ordenes", width: "10%" },
      { field: "total", header: "Subtotal", width: "20%" },
      { field: "medico_nombre", header: "Médico", width: "15%" },
      { field: "total_factura", header: "Subtotal", width: "20%" },
    ];
  }

  ngOnInit() {
    this.barcode = true;
    this.barcode = false;
    this.selectedImpresion = this.impresiones[0];
    this.es = calendarioIdioma;
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();

    this.Alicuota();
    this.loadlist();
  }

  Alicuota() {
    this.loading = true;
    try {
      this.facturacionService.Alicuota().subscribe(
        (resp) => {
          this.elementosAlicuota = resp;
          this.loading = false;
          console.log(this.elementosAlicuota);
          this.elementoAlicuota = this.elementosAlicuota[2];
        },
        (error) => {
          // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: "error",
            text: error.message,
            title: "error.status",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } catch (error) {}
  }

  calcularRenglon() {
    //valido  datos antes de calcular

    let item: FacturaElectronicaRenglon;
    this.selectedRenglonitems = [];

    for (let index = 0; index < this.selecteditems.length; index++) {
      this.selecteditems[index]["total_facturado"] =
        Number(this.selecteditems[index]["total"]) *
        Number(this.elementoAlicuota["porcentaje"]);

      let _iva =
        Number(this.selecteditems[index]["total"]) *
        Number(this.elementoAlicuota["porcentaje_simple"]);
      console.log();
      //SCRIPT PARA ARMAR EL TEXTO DE PRESENTACION
      let tipo_prestacion: string = this.selecteditems[index][
        "nivel"
      ].substring(0, 1);
      let tipo_facturacion: string = this.selecteditems[index][
        "nivel"
      ].substring(1, 2);
      let tipo_cirugia: string = this.selecteditems[index]["nivel"].substring(
        2,
        3
      );
      console.log(tipo_cirugia);

      let prestacion: string = "";
      let facturacion: string = "";
      let cirugia: string = "";
      let descripcion: string = "";

      if (tipo_prestacion === "1") {
        prestacion = "CONSULTAS";
      }

      if (tipo_prestacion === "2") {
        prestacion = "PRACTICAS";
      }

      if (tipo_prestacion === "3") {
        prestacion = "CIRUGIAS";
      }

      if (tipo_facturacion === "C") {
        prestacion = "COMPLEMENTARIAS";
      }

      if (tipo_facturacion === "R") {
        facturacion = "REFACTURACION";
      }

      if (tipo_facturacion === "F") {
        facturacion = "FACTURACION";
      }

      if (tipo_cirugia === "A") {
        cirugia = "AMBULATORIAS";
      }

      if (tipo_cirugia === "V") {
        cirugia = "VOLUNTARIO";
      }

      descripcion =
        "PRESENTACION " +
        facturacion +
        " " +
        " - " +
        prestacion +
        " " +
        cirugia +
        " " +
        this.selecteditems[index]["obra_social_nombre"] +
        " " +
        formatDate(this.selecteditems[index]["numero"], "MM-yyyy", "en");

      item = new FacturaElectronicaRenglon(
        "0",
        "0",
        descripcion,
        1,
        this.selecteditems[index]["total"],
        this.selecteditems[index]["total"],
        this.elementoAlicuota["iva_id"],
        this.elementoAlicuota["porcentaje"],
        this.elementoAlicuota["descripcion"],
        _iva,
        this.selecteditems[index]["total_facturado"],
        ""
      );
      //guardo en variable el renglon
      this.selectedRenglonitems.push(item);
    }

    console.log(this.selectedRenglonitems);
    this.ref.close(this.selectedRenglonitems);
  }

  actualizarFechaDesde(event) {
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.fechaDesde));
  }

  actualizarFechaHasta(event) {
    console.log(event);
    this.fechaHasta = event;
    console.log(new Date(this.fechaHasta));
  }

  accion(
    event: OperacionCobroDetalle,
    overlaypanel: OverlayPanel,
    elementos: Liquidacion
  ) {
    if (elementos) {
      //  this.selecteditemRegistro = elementos;
    }
    //     console.log(this.selecteditemRegistro);
    overlaypanel.toggle(event);
  }

  buscarObraSocial() {
    let data: any;

    const ref = this.dialogService.open(PopupObraSocialComponent, {
      data,
      header: "Buscar Practica",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((PopupObraSocialComponent: ObraSocial) => {
      if (PopupObraSocialComponent) {
        console.log(PopupObraSocialComponent);

        this.DateForm.patchValue({
          obra_social_nombre: PopupObraSocialComponent.nombre,
        });
        this.DateForm.patchValue({
          obra_social_id: PopupObraSocialComponent.id,
        });
      }
    });
  }

  loadlist() {
    this.loading = true;

    try {
      this.miServicio.getLiquidacionDetalle("AFE").subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
        },
        (error) => {
          // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            error.message,
            error.status
          );
        }
      );
    } catch (error) {
      this.throwAlert(
        "error",
        "Error al cargar los registros",
        error,
        error.status
      );
    }
  }

  sumarValores(vals: any) {
    let i: number;

    console.log(vals);
    this.total_facturado = 0;
    this.cantidad = 0;
    for (i = 0; i < vals.length; i++) {
      this.cantidad = this.cantidad + Number(vals[i]["cant_orden"]);
      this.total_facturado = this.total_facturado + Number(vals[i]["total"]);
    }
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    this.sumarValores(this.elementosFiltrados);
  }

  actualizarRegistros() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let td = formatDate(this.fechaDesde, "dd/MM/yyyy", "en");
    let th = formatDate(this.fechaHasta, "dd/MM/yyyy", "en");
    swal({
      title: "¿Desea actualizar estos  registros?",
      text: "Va a actualizar registros",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C5E1A5",
      cancelButtonColor: "#FF8A65",
      confirmButtonText: "Si, actualizar!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.selecteditems.forEach((element) => {
          element["usuario_audita_id"] = userData["id"];
        });
        this.actualizarRegistrosObraSocial();
      }
    });
  }

  actualizarRegistrosObraSocial() {
    if (this.selecteditems) {
      this.loading = true;
      console.log(this.selecteditems);
      try {
        this.practicaService
          .actualizarValoresPracticasByConvenio(this.selecteditems)
          .subscribe(
            (resp) => {
              this.throwAlert(
                "success",
                "Se actualizaron los registros con éxito",
                "",
                ""
              );
              this.loading = false;
              console.log(resp);
            },
            (error) => {
              // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert(
                "error",
                "Error: " + error.status + "  Error al cargar los registros",
                error.message,
                error.status
              );
            }
          );
      } catch (error) {
        this.throwAlert(
          "error",
          "Error al cargar los registros",
          error,
          error.status
        );
      }
    } else {
      this.throwAlert("warning", "No se selecciono ninguna ficha", "", "");
    }
  }

  desafectarPresentacion() {
    /* console.log(this.selecteditemRegistro);
   try {
    this.practicaService.desafectarPresentacion(this.selecteditemRegistro['id'])    
    .subscribe(resp => {
      
        
      this.throwAlert('success','Se desafecto el registro  con éxito','','');
        this.loading = false;
        console.log(resp);
        this.loadlist();
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
     });    
} catch (error) {
this.throwAlert('error','Error al cargar los registros',error,error.status);
}   */
  }

  exportarExcel() {
    this.loading = true;

    try {
      this.miServicio.getListadoPreFactura(this.selecteditems).subscribe(
        (resp) => {
          let i: number = 0;
          let resultado = resp;
          resultado.forEach((element) => {
            resp[i]["fecha_cobro"] = formatDate(
              element["fecha_cobro"],
              "dd/MM/yyyy",
              "en"
            );
            if (resp[i]["paciente_barra_afiliado"] !== "0") {
              resp[i]["numero_afiliado"] =
                resp[i]["numero_afiliado"] +
                "/" +
                resp[i]["paciente_barra_afiliado"];
            }
            i++;
          });
          this.sumarValores(resp);
          this.elementosPreFactura = resp;
          console.log(this.elementosPreFactura);
          this.loading = false;
          const fecha_impresion = formatDate(
            new Date(),
            "dd-MM-yyyy-mm",
            "es-Ar"
          );
          this.miServicio.exportAsExcelFile(
            this.elementosPreFactura,
            "listado_presentacion" + fecha_impresion
          );
        },
        (error) => {
          // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            error.message,
            error.status
          );
        }
      );
    } catch (error) {
      this.throwAlert(
        "error",
        "Error al cargar los registros",
        error,
        error.status
      );
    }
  }

  generarPdfListadoMedico() {
    let td = formatDate(this.fechaDesde, "dd/MM/yyyy", "en");
    let th = formatDate(this.fechaHasta, "dd/MM/yyyy", "en");
    let _fechaEmision = formatDate(new Date(), "dd/MM/yyyy HH:mm", "en");
    let rounded: string;
    let total_facturado: number = 0;
    let total_iva: number = 0;
    let total_cantidad: number = 0;
    let total_cantidad_impresion: string = "";
    let fecha_impresion = formatDate(new Date(), "dd/MM/yyyy HH:mm", "es-Ar");
    let i = 0;
    let userData = JSON.parse(localStorage.getItem("userData"));

    console.log(this.elementosPreFactura);
    for (i = 0; i < this.elementosPreFactura.length; i++) {
      total_cantidad =
        total_cantidad + Number(this.elementosPreFactura[i]["cantidad"]);
      total_facturado =
        total_facturado +
        Number(this.elementosPreFactura[i]["valor_facturado"]);
      //console.log( this.elementosPreFactura[i]['cantidad']);
    }
    total_cantidad_impresion = this.dp.transform(total_cantidad, "1.0-0");
    if (this.selecteditems) {
      var doc = new jsPDF("l");

      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      doc.addImage(logo_clinica, "PNG", 10, 10, 40, 11, undefined, "FAST");
      doc.setLineWidth(0.4);
      doc.setFontSize(9);
      doc.text(
        this.elementosPreFactura[0]["medico_nombre"],
        60,
        10,
        null,
        null,
        "left"
      );
      doc.setFontSize(6);
      doc.text(
        "Periodo: " + td + " al " + th,
        pageSize.width - 60,
        10,
        null,
        null
      );
      doc.line(60, 13, pageWidth - 15, 13);
      doc.setFontSize(7);
      let nivel_facturacion = this.elementosPreFactura[0]["nivel"].substring(
        1,
        2
      );
      if (nivel_facturacion === "F") {
        doc.text("FACTURACION", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "R") {
        doc.text("REFACTURACION", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "C") {
        doc.text("COMPLEMENTARIA", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "T") {
        doc.text("TRANSPANTE", pageWidth - 60, 20, null, null, "left");
      }
      doc.text(
        "Emitido : " + _fechaEmision,
        pageWidth - 60,
        35,
        null,
        null,
        "left"
      );
      doc.setFontSize(9);
      doc.text("Presentación a Obras Sociales", 60, 20, null, null, "left");
      doc.setFontSize(7);
      doc.text(
        this.elementosPreFactura[0]["entidad_nombre"],
        60,
        25,
        null,
        null,
        "left"
      );
      doc.text(
        "Obra social: " + this.elementosPreFactura[0]["obra_social_nombre"],
        60,
        30,
        null,
        null,
        "left"
      );

      doc.setFontSize(8);
      //doc.line(15, 35, pageWidth - 15, 35);
      let pageNumber = doc.internal.getNumberOfPages();
      doc.autoTable(this.columnsListadoTodos, this.elementosPreFactura, {
        margin: { top: 38, right: 5, bottom: 5, left: 5 },
        bodyStyles: { valign: "top" },
        showHead: "always",
        styles: {
          fontSize: 6,
          cellWidth: "wrap",
          rowPageBreak: "auto",
          halign: "justify",
          overflow: "linebreak",
        },
        columnStyles: { descripcion: { columnWidth: 20 } },
      });

      doc.setFontSize(8);
      let finalY = doc.autoTable.previous.finalY;
      doc.line(15, finalY + 3, pageWidth - 15, finalY + 3);
      doc.text(15, finalY + 8, "Cantidad : " + total_cantidad_impresion);
      doc.text(
        pageWidth - 120,
        finalY + 8,
        "Importe : " +
          this.cp.transform(total_facturado, "", "symbol-narrow", "1.2-2")
      );
      doc.text(
        pageWidth - 80,
        finalY + 8,
        "IVA : " + this.cp.transform(total_iva, "", "symbol-narrow", "1.2-2")
      );
      doc.text(
        pageWidth - 50,
        finalY + 8,
        "Total : " +
          this.cp.transform(total_facturado, "", "symbol-narrow", "1.2-2")
      );
      //doc.text(15, finalY+10, 'en letras : $' + this.numberToWordsPipe.transform(13) );

      const totalPagesExp = "{total_pages_count_string}";
      console.log(doc.putTotalPages);
      const footer = function (data) {
        let str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === "function") {
          str = str + " of " + totalPagesExp;
          console.log("test");
        }
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 30
        );
      };
      window.open(doc.output("bloburl"));
    }
  }

  generarPdfListadoTodos() {
    let td = formatDate(this.fechaDesde, "dd/MM/yyyy", "en");
    let th = formatDate(this.fechaHasta, "dd/MM/yyyy", "en");
    let _fechaEmision = formatDate(new Date(), "dd/MM/yyyy HH:mm", "en");
    let rounded: string;
    let total_facturado: number = 0;
    let total_iva: number = 0;
    let total_cantidad: number = 0;
    let total_cantidad_impresion: string = "";
    let fecha_impresion = formatDate(new Date(), "dd/MM/yyyy HH:mm", "es-Ar");
    let i = 0;
    let userData = JSON.parse(localStorage.getItem("userData"));

    for (i = 0; i < this.elementosPreFactura.length; i++) {
      total_cantidad =
        total_cantidad + Number(this.elementosPreFactura[i]["cantidad"]);

      total_facturado =
        total_facturado +
        Number(this.elementosPreFactura[i]["valor_facturado"]);
      console.log(this.elementosPreFactura[i]["cantidad"]);
    }
    total_cantidad_impresion = this.dp.transform(total_cantidad, "1.0-0");
    if (this.selecteditems) {
      var doc = new jsPDF("l");

      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      doc.addImage(logo_clinica, "PNG", 10, 10, 40, 11, undefined, "FAST");
      doc.setLineWidth(0.4);
      doc.setFontSize(9);
      doc.text("Clínica de la Visión", 60, 10, null, null, "left");
      doc.setFontSize(6);
      doc.text(
        "Periodo: " + td + " al " + th,
        pageSize.width - 60,
        10,
        null,
        null
      );
      doc.line(60, 13, pageWidth - 15, 13);
      doc.setFontSize(7);
      let nivel_facturacion = this.elementosPreFactura[0]["nivel"].substring(
        1,
        2
      );
      if (nivel_facturacion === "F") {
        doc.text("FACTURACION", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "R") {
        doc.text("REFACTURACION", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "C") {
        doc.text("COMPLEMENTARIA", pageWidth - 60, 20, null, null, "left");
      }
      if (nivel_facturacion === "T") {
        doc.text("TRANSPANTE", pageWidth - 60, 20, null, null, "left");
      }
      doc.text(
        "Emitido : " + _fechaEmision,
        pageWidth - 60,
        35,
        null,
        null,
        "left"
      );
      doc.setFontSize(9);
      doc.text("Presentación a Obras Sociales", 60, 20, null, null, "left");
      doc.setFontSize(7);
      doc.text(
        this.elementosPreFactura[0]["entidad_nombre"],
        60,
        25,
        null,
        null,
        "left"
      );
      doc.text(
        "Obra social: " + this.elementosPreFactura[0]["obra_social_nombre"],
        60,
        30,
        null,
        null,
        "left"
      );

      doc.setFontSize(8);
      //doc.line(15, 35, pageWidth - 15, 35);
      let pageNumber = doc.internal.getNumberOfPages();
      doc.autoTable(this.columnsListadoTodos, this.elementosPreFactura, {
        margin: { top: 38, right: 5, bottom: 5, left: 5 },
        bodyStyles: { valign: "top" },
        showHead: "always",
        styles: {
          fontSize: 6,
          cellWidth: "wrap",
          rowPageBreak: "auto",
          halign: "justify",
          overflow: "linebreak",
        },
        columnStyles: { text: { cellWidth: "auto" } },
      });

      doc.setFontSize(8);
      let finalY = doc.autoTable.previous.finalY;
      doc.line(15, finalY + 3, pageWidth - 15, finalY + 3);
      doc.text(15, finalY + 8, "Cantidad : " + total_cantidad_impresion);
      doc.text(
        pageWidth - 120,
        finalY + 8,
        "Importe : " +
          this.cp.transform(total_facturado, "", "symbol-narrow", "1.2-2")
      );
      doc.text(
        pageWidth - 80,
        finalY + 8,
        "IVA : " + this.cp.transform(total_iva, "", "symbol-narrow", "1.2-2")
      );
      doc.text(
        pageWidth - 50,
        finalY + 8,
        "Total : " +
          this.cp.transform(total_facturado, "", "symbol-narrow", "1.2-2")
      );
      //doc.text(15, finalY+10, 'en letras : $' + this.numberToWordsPipe.transform(13) );

      const totalPagesExp = "{total_pages_count_string}";
      console.log(doc.putTotalPages);
      const footer = function (data) {
        let str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === "function") {
          str = str + " of " + totalPagesExp;
          console.log("test");
        }
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 30
        );
      };
      window.open(doc.output("bloburl"));
    }
  }

  removeDuplicateUsingSet(arr) {
    let unique_array = arr.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });
    return unique_array;
  }

  throwAlert(
    estado: string,
    mensaje: string,
    motivo: string,
    errorNumero: string
  ) {
    let tipoerror: string;

    if (estado == "success") {
      swal({
        type: "success",
        title: "Exito",
        text: mensaje,
      });
    }

    if (errorNumero == "422") {
      mensaje =
        "Los datos que esta tratando de guardar son iguales a los que ya poseia";
      swal({
        type: "warning",
        title: "Atención..",
        text: mensaje,
        footer: motivo,
      });
    }

    if (estado == "error" && errorNumero != "422") {
      if (errorNumero == "422") {
        mensaje =
          "Los datos que esta tratando de guardar son iguales a los que ya poseia";
      }
      if (errorNumero == "400 ") {
        mensaje = "Bad Request ";
      }
      if (errorNumero == "404") {
        mensaje = "No encontrado ";
      }
      if (errorNumero == "401") {
        mensaje = "Sin autorización";
      }
      if (errorNumero == "403") {
        mensaje =
          " Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ";
      }
      if (errorNumero == "405") {
        mensaje = "Método no permitido";
      }
      if (errorNumero == "500") {
        mensaje = "Error interno en el servidor";
      }
      if (errorNumero == "503") {
        mensaje = "Servidor no disponible";
      }
      if (errorNumero == "502") {
        mensaje = "Bad gateway";
      }

      swal({
        type: "error",
        title: "Oops...",
        text: mensaje,
        footer: motivo,
      });
    }
  }
}
