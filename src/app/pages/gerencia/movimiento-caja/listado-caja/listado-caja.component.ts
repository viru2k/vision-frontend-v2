import { calendarioIdioma,logo_clinica } from './../../../../config/config';
import { Paciente } from './../../../../models/paciente.model';
import { AgendaTurno } from './../../../../models/agenda-turno.model';
import { AgendaService } from './../../../../services/agenda.service';
import { PopupMedicoComponent } from './../../../../shared/components/popups/popup-medico/popup-medico.component';
import { Agenda } from './../../../../models/agenda.model';
import { DialogService, MessageService } from 'primeng/api';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MovimientoCajaService } from '../../../../services/movimiento-caja.service';
import { Filter } from './../../../../shared/filter';
import { ExcelService } from '../../../../services/excel.service';
import { PopupMovimientoComponent } from '../popup-movimiento/popup-movimiento.component';
import { LiquidacionService } from '../../../../services/liquidacion.service';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-listado-caja',
  templateUrl: './listado-caja.component.html',
  styleUrls: ['./listado-caja.component.css']
})
export class ListadoCajaComponent implements OnInit {

  cols: any[];
  selectedItem: Agenda;
  es: any;
  display: boolean;
  observacion: string;
  // LOADING
  DateForm: FormGroup;
  DateForm1: FormGroup;
  loading: boolean;
  elemento: any[] = null;
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columns: any;
  userData: any;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;

  total_ingreso = 0;
  total_egreso = 0;
  saldo = 0;

  _cuenta_nombre: any[] = [];
  _tipo_comprobante: any[] = [];
  _concepto_cuenta: any[] = [];
  _movimiento_tipo: any[] = [];
  _tipo_moneda: any[] = [];



  constructor(private movimientoCajaService:MovimientoCajaService ,  private messageService: MessageService , private liquidacionService: LiquidacionService,
    public dialogService: DialogService,  private route: ActivatedRoute, private excelService: ExcelService,    private router: Router, private filter: Filter ) {
   
    this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'fecha_carga', header: 'Fecha', width: '10%' }, 
        {field: 'cuenta_nombre', header: 'Cuenta', width: '16%' }, 
        {field: 'tipo_comprobante', header: 'Comprobante', width: '12%' },
        {field: 'concepto_cuenta', header: 'Concepto', width: '16%' },
        {field: 'proveedor_nombre', header: 'A nombre', width: '20%' },
        {field: 'comprobante_numero', header: 'Número', width: '10%' },
        {field: 'descripcion', header: 'Descripción', width: '20%' },
        {field: 'movimiento_tipo', header: 'Tipo', width: '10%' },
        {field: 'tipo_moneda', header: 'Moneda' , width: '10%'},
        {field: 'importe', header: 'Importe', width: '10%' },
        {field: 'cotizacion', header: 'Cotización', width: '10%' },
        {field: 'total', header: 'Total', width: '10%' },
        
        ];

        this.columns = [
          {title: 'Fecha', dataKey: 'fecha_carga'},
          {title: 'Cuenta', dataKey: 'cuenta_nombre'},
          {title: 'Comprobante', dataKey: 'tipo_comprobante'},
          {title: 'Concepto', dataKey: 'concepto_cuenta'},
          {title: 'A nombre', dataKey: 'nombreyapellido_paciente'},
          {title: 'Numero', dataKey: 'comprobante_numero'},
          {title: 'Descripción', dataKey: 'descripcion'},
          {title: 'Tipo', dataKey: 'movimiento_tipo'},
          {title: 'Importe', dataKey: 'importe'},
          {title: 'Cotiz.', dataKey: 'cotizacion'},
          {title: 'Total', dataKey: 'total'}
          
          
      ];
   
      }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;

    this.fechaDesde = new Date();
    this.fechaHasta = new Date();

  }



exportarExcel(){
let result = this.elementosFiltrados as any;
if (this.selecteditems.length >0) {
       
}else{
  swal({
    title: 'TURNOS NO SELECCIONADOS' ,
    text: 'Debe seleccionar al menos un turno',
    type: 'warning',
    showConfirmButton: false,
    timer: 4000
       
  })
}

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoComponent, {
  data,
   header: 'Agregar ingreso',
   width: '98%',
   height: '95%'
  });

  ref.onClose.subscribe((PopupMovimientoComponent: any) => {

    if (PopupMovimientoComponent) {
      this.loadMovimientoRegistro();
    }
  });

}


public exportarExcelDetallado(){
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');  
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
    seleccionados['fecha_carga'] =   formatDate(element['fecha_carga'], 'dd/MM/yyyy', 'es-Ar');  ;
    seleccionados['cuenta_nombre'] = element.cuenta_nombre ;
    seleccionados['tipo_comprobante'] = element.tipo_comprobante;
    seleccionados['concepto_cuenta'] = element.concepto_cuenta;
    seleccionados['proveedor_nombre'] = element.proveedor_nombre;
    seleccionados['comprobante_numero'] = element.comprobante_numero ;
    seleccionados['descripcion'] = element.descripcion;
    seleccionados['movimiento_tipo'] = element.movimiento_tipo;
    seleccionados['tipo_moneda'] = element.tipo_moneda;
    seleccionados['cantidad'] = element.importe;
    seleccionados['cotizacion'] = element.cotizacion;
    seleccionados['total'] = element.total;
   // exportar.push(seleccionados);
   exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
  this.liquidacionService.exportAsExcelFile(  exportar, 'listado_presentacion_detallado'+fecha_impresion);
}




  editarRegistro(event) {
    
  const data: any = event;

  const ref = this.dialogService.open(PopupMovimientoComponent, {
  data,
   header: 'Editar ingreso',
   width: '98%',
   height: '95%'
  });

  ref.onClose.subscribe((PopupMovimientoComponent: any) => {

    if (PopupMovimientoComponent) {
      this.loadMovimientoRegistro();
    }
  });

  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;
    this.sumarValores(this.elementosFiltrados) ;
}


loadMovimientoRegistro() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd HH:mm', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd HH:mm', 'en');
 console.log(userData['id']);

  try {
      this.movimientoCajaService.geRegistroMovimientoBydate(this._fechaDesde, this._fechaHasta)
      .subscribe(resp => {

      if (resp[0]) {
        resp.forEach(element => {
          
          if (element.proveedor_nombre === null) {
            element.proveedor_nombre = '';
            element.nombreyapellido_paciente = element.paciente_nombre + element.proveedor_nombre;
          }

          if (element.paciente_nombre === null) {
            element.paciente_nombre = '';
            element.nombreyapellido_proveedor = element.paciente_nombre + element.proveedor_nombre;
          }
          element.proveedor_nombre  = element.paciente_nombre + element.proveedor_nombre;
         
         
        });
        this.realizarFiltroBusqueda(resp);
      
          this.elemento = resp;
          console.log(resp);
          this.sumarValores(resp);
        }
          this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
       });
  } catch (error) {
  this.throwAlert('error', 'Error al cargar los registros' , error);
  }


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







verDetalle(agendaTurno: any) {
/* 
  console.log(agendaTurno);
  let liquidacion:Liquidacion;
  liquidacion = new Liquidacion(agendaTurno['operacion_cobro_id'],'','','','','','',0,0,'','',[],'','','',0);
  let data:any; 
  data = liquidacion;
  const ref = this.dialogService.open(PopupOperacionCobroDetalleComponent, {
  data,
   header: 'Ver detalle de presentación', 
   width: '98%',
   height: '100%'
  });
  
  ref.onClose.subscribe((PopupOperacionCobroDetalleComponent:any) => {
     
  });
   */
  }


generarPdf() {

  let i = 0;
  this.selecteditems.forEach(element => {
    this.selecteditems[i].fecha_carga = formatDate(element.fecha_carga, 'dd/MM/yyyy', 'en');
    
    if (element.nombreyapellido_paciente === 'null') {
      this.selecteditems[i].nombreyapellido_paciente =  '';
    }
    
    
    
    i++;
  });

  console.log(this.selecteditems);
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  let _fechaDesde_imp = formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en');
  let _fechaHasta_imp = formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en');
  var doc = new jsPDF('landscape');

  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('MOVIMIENTOS DE CAJA', pageWidth/2, 20, null, null, 'center');
  doc.setFontSize(8);
  doc.text('Desde : '+ _fechaDesde_imp + ' Hasta ' + _fechaHasta_imp, pageWidth/2, 28, null, null, 'center');
  doc.setFontSize(8);
  


   doc.autoTable(this.columns, this.selecteditems,
      {
        margin: {horizontal: 5, vertical: 35},
        bodyStyles: {valign: 'top'},
        styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify',overflow: 'linebreak'},
        columnStyles: {text: {cellWidth: 'auto'}}
      }

   
      );
      window.open(doc.output('bloburl')); 
}



/** ACCIONES */

colorRow(estado: string){
 
    if(estado == 'INGRESO') {  
        return {'es-ingreso'  :'null' };
    }
    
    if(estado == 'EGRESO') {  
        return {'es-egreso'  :'null' };
    }


}




sumarValores(vals: any) {
  let i: number;
  console.log(vals);
  this.total_egreso = 0;
  this.total_ingreso = 0;
  this.saldo = 0;
  vals.forEach(element => {
      console.log(element.movimiento_tipo);
      if (element.movimiento_tipo === 'INGRESO') {
        this.total_ingreso = this.total_ingreso + Number(element.total);
      }
      if (element.movimiento_tipo === 'EGRESO') {
        this.total_egreso = this.total_egreso  + Number(element.total);
      }
        this.saldo = this.total_ingreso - this.total_egreso;
  });


}



realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._cuenta_nombre = [];
  this._tipo_comprobante = [];
  this._concepto_cuenta = [];
  this._movimiento_tipo = [];
  this._tipo_moneda = [];

  resp.forEach(element => {
    this._cuenta_nombre.push(element['cuenta_nombre']);
    this._tipo_comprobante.push(element['tipo_comprobante']);
   this._concepto_cuenta.push(element['concepto_cuenta']);
   this._movimiento_tipo.push(element['movimiento_tipo']);
   this._tipo_moneda.push(element['tipo_moneda']);
  });
  
  // ELIMINO DUPLICADOS
  this._cuenta_nombre = this.filter.filterArray(this._cuenta_nombre);  
  this._tipo_comprobante = this.filter.filterArray(this._tipo_comprobante);
  this._concepto_cuenta = this.filter.filterArray(this._concepto_cuenta);
  this._movimiento_tipo = this.filter.filterArray(this._movimiento_tipo);
  this._tipo_moneda = this.filter.filterArray(this._tipo_moneda);

}


colorString(estado:string){
  
  if((estado === 'INGRESO')||(estado === null)) {
    return {'es-ingreso'  :'null' };
  }else{
    return {'es-egreso'  :'null' };
  }

}

throwAlert(estado:string, mensaje:string, motivo:string){
  if(estado== 'success'){
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }
  if(estado== 'error'){
      swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        })
  }
}
}





