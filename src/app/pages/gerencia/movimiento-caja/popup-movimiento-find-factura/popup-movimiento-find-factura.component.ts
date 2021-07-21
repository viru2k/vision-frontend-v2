import { Component, OnInit,Output, EventEmitter,ViewChild, PipeTransform, ElementRef, OnDestroy } from '@angular/core';
import { calendarioIdioma, logo_clinica } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { MessageService, SelectItem, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { formatDate, CurrencyPipe, DecimalPipe } from '@angular/common';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { FacturaElectronica } from '../../../../models/factura-electronica.model';
import { PopupPacienteObrasocialComponent } from '../../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { FacturacionService } from './../../../../services/facturacion.service';
import { LiquidacionService } from './../../../../services/liquidacion.service';

@Component({
  selector: 'app-popup-movimiento-find-factura',
  templateUrl: './popup-movimiento-find-factura.component.html',
  styleUrls: ['./popup-movimiento-find-factura.component.css']
})
export class PopupMovimientoFindFacturaComponent implements OnInit {

  DateForm:FormGroup;
  tipo_busqueda:string = 'fecha';
  columns: any[];
  columnsIva: any[];
  selecteditemRegistro:FacturaElectronica;
  selecteditems:FacturaElectronica[];
  elementos:FacturaElectronica[] = [];
  elemento:FacturaElectronica = null;
  elementosFiltrados:FacturaElectronica[] = [];
  elementosPDF:any[] = [];
  cols:any;
  fecha:Date;
  _fecha:string;
  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;
  es:any;
  loading: boolean;
  paciente_nombre:string;
  medico_id:string;
  medico_nombre:string;
  elementosMedicos:any[] = null;
  elementoMedicos:any= null;
  estado = '';

  // tslint:disable-next-line: max-line-length
  constructor(private facturacionService: FacturacionService, private messageService: MessageService , public dialogService: DialogService,
    private cp: CurrencyPipe, private dp: DecimalPipe, private liquidacionService:LiquidacionService, public ref: DynamicDialogRef) {

    this.cols = [
              
      { field: 'accion', header: 'Accion' , width: '6%'} ,
      { field: 'nombreyapellido', header: 'Facturar a ' , width: '15%'},
      { field: 'descripcion', header: 'Tipo Fac.',  width: '8%' },
      { field: 'punto_vta', header: 'Pto. Vta.',  width: '5%' },
      { field: 'factura_numero', header: 'factura nº' , width: '8%' },
      { field: 'fecha', header: 'Fecha',  width: '7%' },
      { field: 'factura_cliente', header: 'Cliente',  width: '20%' },      
      { field: 'factura_documento_comprador_descripcion', header: 'Tipo',  width: '5%' },
      { field: 'factura_documento', header: 'Documento' , width: '8%'}, 
      { field: 'importe_exento_iva', header: 'Imp. exc' , width: '8%'},      
      { field: 'importe_gravado', header: 'Imp. grav' , width: '10%'},
      { field: 'importe_iva', header: 'IVA' , width: '8%'},
      { field: 'importe_total' , header: 'Total' , width: '10%'},
     ];    


     this.columns = [
      {title: 'Descripcion', dataKey: 'descripcion'},
      {title: 'Cant', dataKey: 'cantidad'},
      {title: 'Precio unit.', dataKey: 'precio_unitario'},
      {title: 'Alic.', dataKey: 'alicuota_descripcion'},
      {title: 'Iva', dataKey: 'iva'},
      {title: 'Importe', dataKey: 'total_renglon'},
  ];

  
           
  this.columnsIva = [
    {title: 'Fecha', dataKey: 'fecha'},
    {title: 'Tipo', dataKey: 'comprobante_tipo'},
    {title: 'Comp. número', dataKey: 'numero'},
    {title: 'Categoria', dataKey: 'categoria_iva'},
    {title: 'Cliente', dataKey: 'factura_cliente'},
    {title: 'CUIT/DNI', dataKey: 'descripcion'},
    {title: 'Número', dataKey: 'factura_documento'},
    {title: 'Alícuota', dataKey: 'alicuota'},
    {title: 'Imp. IVA', dataKey: 'importe_iva'},
    {title: 'Imp. sin IVA', dataKey: 'total_sin_iva'},
    {title: 'Imp. gravado', dataKey: 'importe_gravado'},
    {title: 'Imp. ex. IVA', dataKey: 'importe_exento_iva'},
    {title: 'Total', dataKey: 'importe_total'}
];
   }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();   
    
    this.getMedicosFacturan();
  }

  padLeft(text:string, padChar:string, size:number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}

  actualizarFechaDesde(event){
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.fechaDesde));
  }

  actualizarFechaHasta(event){
    console.log(event);
    this.fechaHasta = event;
    console.log(new Date(this.fechaHasta));
  }

  accion(event:FacturaElectronica,overlaypanel: OverlayPanel,elementos:FacturaElectronica){
    if(elementos){
      this.selecteditemRegistro = elementos;
    }

      console.log(this.selecteditemRegistro);
      overlaypanel.toggle(event);
    }

    
  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;      
}

 
getMedicosFacturan(){
  this.loading = true;
  try {
    this.facturacionService.getMedicosFacturan()
    .subscribe(resp => {
        this.elementosMedicos = resp;
        this.loading = false;
        console.log( this.elementosMedicos);
        this.elementoMedicos = this.elementosMedicos['0'];
        console.log(this.elementoMedicos['id']);
      this.medico_id = this.elementoMedicos['id'];

    },
    error => { // error path
      this.loading = false;
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          text: error.message,
          title: 'error.status',
          showConfirmButton: false,
          timer: 2000
        });
     });
} catch (error) {

}
}

obtenerMedico(){
  console.log(this.elementoMedicos)
  this.medico_id = this.elementoMedicos['id'];
  this.medico_nombre = this.elementoMedicos['nombreyapellido'];
}


buscarPaciente(){
  this.loading = true; 
    try { 
        this.facturacionService.GetFacturaByNameOrDocumento(this.paciente_nombre)
        .subscribe(resp => {
          let i:number = 0;
          let resultado = resp;
          resultado.forEach(element => {
            resp[i]['factura_numero'] =  this.padLeft(resp[i]['factura_numero'], '0', 8);
            resp[i]['punto_vta'] =  this.padLeft(resp[i]['punto_vta'], '0', 4);
            i++;
          });
        this.elementos = resp;
        this.loading = false;        
        console.log(this.elementos);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
            this.loading = false;
          });
    } catch (error) {
      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
    }
}


  buscar(){
    this.elementos = [];
    this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd', 'en');
    this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd', 'en');
    this.loading = true;
    if(this.tipo_busqueda === 'fecha'){
    try { 
        this.facturacionService.GetFacturaBetweenDates(this._fechaDesde, this._fechaHasta)
        .subscribe(resp => {
          let i:number = 0;
          let resultado = resp;
          resultado.forEach(element => {
            resp[i]['factura_numero'] =  this.padLeft(resp[i]['factura_numero'], '0', 8);
            resp[i]['punto_vta'] =  this.padLeft(resp[i]['punto_vta'], '0', 4);
            i++;
          });
        this.elementos = resp;
        this.loading = false;        
        console.log(this.elementos);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
            this.loading = false;
          });    
    } catch (error) {
      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
    }
  } else {
    this.buscarPaciente();
  }

  }

 
confirmar(event) {
  // console.log(event);
   this.ref.close(event);
 }
 
}
