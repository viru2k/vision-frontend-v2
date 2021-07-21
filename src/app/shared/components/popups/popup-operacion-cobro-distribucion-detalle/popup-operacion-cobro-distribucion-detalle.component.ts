import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService, DialogService } from 'primeng/api';
import { formatDate, CurrencyPipe, DecimalPipe } from '@angular/common';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { Liquidacion } from './../../../../models/liquidacion.model';
import { PopupOperacionCobroDetalleComponent } from './../popup-operacion-cobro-detalle/popup-operacion-cobro-detalle.component';
import { DistribucionMedico } from './../../../../models/distribucion-medico.model';
import { logo_clinica } from './../../../../config/config';
import { Filter } from './../../../filter';
import { MedicoService } from '../../../../services/medico.service';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-operacion-cobro-distribucion-detalle',
  templateUrl: './popup-operacion-cobro-distribucion-detalle.component.html',
  styleUrls: ['./popup-operacion-cobro-distribucion-detalle.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupOperacionCobroDistribucionDetalleComponent implements OnInit {
  cols: any[];
  columns: any[];
  columns_detalle: any[];
  elementos:any[] = null;
  TOTAL_OPERA:number = 0;
  TOTAL_AYUDA:number = 0;
  TOTAL_AYUDA2:number = 0;
  TOTAL_CLINICA:number = 0;
  TOTAL:number = 0;
  elementosFiltrados:any[] = null;
  selecteditems:any[] = [];
  distribucionMedicos:any[] = [];
  distribucionMedico:DistribucionMedico;

  _obra_social_nombre: any[] = [];
  _medico_opera: any[] = [];
  _medico_ayuda: any[] = [];
  _medico_ayuda2: any[] = [];  

  // MEDICO

  
loading: boolean;
elementosMedicos: any[] = null;
elementoMedicos: any = null;
medico_id: string;
checked = false;


  constructor( public ref: DynamicDialogRef, public config: DynamicDialogConfig,
               private liquidacionService: LiquidacionService,
               private messageService: MessageService ,
               public dialogService: DialogService,
               private medicoService: MedicoService,
               private cp: CurrencyPipe,
               private filter: Filter ) {

    this.cols = [
      { field: 'operacion_cobro_id', header: 'O.C', width: '8%'} ,
      { field: 'obra_social_nombre', header: 'O.S',  width: '20%' },
      { field: 'paciente_apellido', header: 'Paciente', width: '15%'} ,
      { field: 'dni', header: 'DNI', width: '8%'} ,
      { field: 'fecha_cobro', header: 'Fecha', width: '10%'} ,

      { field: 'medico_opera', header: 'Médico opera', width: '15%'} ,  
      { field: 'medico_opera_valor', header: 'Médico opera $', width: '10%'} ,
      { field: 'medico_opera_porcentaje', header: 'Médico opera %' , width: '6%'} ,

      { field: 'medico_ayuda', header: 'Médico ayuda' , width: '15%'} ,
      { field: 'medico_ayuda_valor', header: 'Médico ayuda $' , width: '10%'} ,
      { field: 'medico_ayuda_porcentaje', header: 'Médico ayuda %',  width: '6%' },

      { field: 'medico_ayuda2', header: 'Médico ayuda 2' , width: '15%'} ,
      { field: 'medico_ayuda2_valor', header: 'Médico ayuda 2 $',  width: '10%' },
      {field: 'medico_ayuda2_porcentaje', header: 'Médico ayuda 2 %' , width: '6%' },

      { field: 'medico_clinica', header: 'Clínica ',  width: '15%' },
      { field: 'medico_clinica_valor', header: 'Clínica $',  width: '10%' },
      { field: 'medico_clinica_porcentaje', header: 'Clínica %',  width: '6%' },
      { field: 'valor_distribuido', header: 'Total',  width: '10%' },
   ];

   
   this.columns = [
    {title: 'OC', dataKey: 'operacion_cobro_id'},
    {title: 'Fecha', dataKey: 'fecha_cobro'},
    {title: 'Obra social', dataKey: 'obra_social_nombre'},
    {title: 'Paciente', dataKey: 'paciente_apellido'},
    {title: 'dni', dataKey: 'dni'},
    
    {title: 'Opera', dataKey: 'medico_opera'},
    {title: '%', dataKey: 'medico_opera_porcentaje'},
    {title: 'Valor', dataKey: 'medico_opera_valor'},
    {title: 'Ayuda', dataKey: 'medico_ayuda'},
    {title: '%', dataKey: 'medico_ayuda_porcentaje'},   
    {title: 'Valor', dataKey: 'medico_ayuda_valor'},
    {title: 'Ayuda 2', dataKey: 'medico_ayuda2'},
    {title: '%', dataKey: 'medico_ayuda2_porcentaje'},
    {title: 'Valor', dataKey: 'medico_ayuda2_valor'},
    {title: 'Clínica', dataKey: 'medico_clinica'},
    {title: '%', dataKey: 'medico_clinica_porcentaje'},   
    {title: 'Valor', dataKey: 'medico_clinica_valor'},
    {title: 'Distribuido', dataKey: 'valor_distribuido'}
];


this.columns_detalle = [
  {title: 'OC', dataKey: 'operacion_cobro_id'},
  {title: 'Fecha', dataKey: 'fecha_cobro'},
  {title: 'Obra social', dataKey: 'obra_social_nombre'},
  {title: 'Paciente', dataKey: 'paciente_apellido'},  
  {title: 'Descripción', dataKey: 'descripcion'},
  {title: 'Opera', dataKey: 'medico_opera'},
  {title: '%', dataKey: 'medico_opera_porcentaje'},
  {title: 'Valor', dataKey: 'medico_opera_valor'},
  {title: 'Ayuda', dataKey: 'medico_ayuda'},
  {title: '%', dataKey: 'medico_ayuda_porcentaje'},   
  {title: 'Valor', dataKey: 'medico_ayuda_valor'},
  {title: 'Ayuda 2', dataKey: 'medico_ayuda2'},
  {title: '%', dataKey: 'medico_ayuda2_porcentaje'},
  {title: 'Valor', dataKey: 'medico_ayuda2_valor'},
  {title: 'Clínica', dataKey: 'medico_clinica'},
  {title: '%', dataKey: 'medico_clinica_porcentaje'},   
  {title: 'Valor', dataKey: 'medico_clinica_valor'},
  {title: 'Distribuido', dataKey: 'valor_distribuido'}
];

  }

  ngOnInit() {
    console.log(this.config.data);
    this.elementos = this.config.data;
    this.sumarValores(this.elementos);
    this.getMedicosFacturan();
    this.realizarFiltroBusqueda(this.elementos);
  }

  
  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;  
    this.sumarValores(this.elementosFiltrados);
}


sumarValores(vals:any){
  let i:number;
  //console.log(vals[1]['valor_facturado']);
  console.log(vals !== undefined);
  this.TOTAL_OPERA = 0;
  this.TOTAL_AYUDA = 0;
  this.TOTAL_AYUDA2 = 0;
  this.TOTAL_CLINICA = 0;
  this.TOTAL = 0;

  for(i=0;i<vals.length;i++){
      this.TOTAL_OPERA = this.TOTAL_OPERA+ Number(vals[i]['medico_opera_valor']);
      this.TOTAL_AYUDA = this.TOTAL_AYUDA+ Number(vals[i]['medico_ayuda_valor']);
      this.TOTAL_AYUDA2 = this.TOTAL_AYUDA2+ Number(vals[i]['medico_ayuda2_valor']);
      this.TOTAL_CLINICA = this.TOTAL_CLINICA+ Number(vals[i]['medico_clinica_valor']);
      this.TOTAL = this.TOTAL+ Number(vals[i]['valor_distribuido']);
  }

}



obtenerMedico(){
  console.log(this.elementoMedicos);
  this.medico_id = this.elementoMedicos['id'];
  this.loading = false;
  
}


getMedicosFacturan(){
  this.loading = true;  
  try {
    this.medicoService.getItems()
    .subscribe(resp => {      
      resp.forEach(element => {
        element.apellido = element.apellido + ' '+ element.nombre;
        });
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


verDetalle(agendaTurno:any){

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
  
  }

public exportarExcel(){
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');  
 /*  for(let i=0; i<this.selecteditems.length; i++){
    this.distribucionMedico = new DistribucionMedico(
      this.selecteditems[i]['obra_social_nombre'],
      this.selecteditems[i]['medico_opera'],
      this.selecteditems[i]['medico_opera_porcentaje'],
      this.selecteditems[i]['medico_opera_valor'],
      this.selecteditems[i]['medico_ayuda'],
      this.selecteditems[i]['medico_ayuda_porcentaje'],
      this.selecteditems[i]['medico_ayuda_valor'],
      this.selecteditems[i]['medico_ayuda2'],
      this.selecteditems[i]['medico_ayuda2_porcentaje'],
      this.selecteditems[i]['medico_ayuda2_valor'],
      this.selecteditems[i]['medico_clinica'],
      this.selecteditems[i]['medico_clinica_porcentaje'],
      this.selecteditems[i]['medico_clinica_valor'],
      this.selecteditems[i]['valor_distribuido'],
      this.selecteditems[i]['total'],
      this.selecteditems[i]['fecha_cobro'],
      this.selecteditems[i]['operacion_cobro_id'],
      this.selecteditems[i]['paciente_apellido'],
      this.selecteditems[i]['dni']);
      this.distribucionMedicos.push(this.distribucionMedico);

  } */

  this.elementos.forEach(element => {
    if ((element.medico_opera === this.elementoMedicos.apellido ) ||  (element.medico_ayuda === this.elementoMedicos.apellido ) ||  (element.medico_ayuda2 === this.elementoMedicos.apellido ) || (element.medico_clinica === this.elementoMedicos.apellido )) { 
      this.distribucionMedico = new DistribucionMedico(
        element['obra_social_nombre'],
        element['medico_opera'],
        element['medico_opera_porcentaje'],
        element['medico_opera_valor'],
        element['medico_ayuda'],
        element['medico_ayuda_porcentaje'],
        element['medico_ayuda_valor'],
        element['medico_ayuda2'],
        element['medico_ayuda2_porcentaje'],
        element['medico_ayuda2_valor'],
        element['medico_clinica'],
        element['medico_clinica_porcentaje'],
        element['medico_clinica_valor'],
        element['valor_distribuido'],
        element['total'],
        element['fecha_cobro'],
        element['operacion_cobro_id'],
        element['paciente_apellido'],
        element['dni']);
        this.distribucionMedicos.push(element);
    }
  });
  this.liquidacionService.exportAsExcelFile(  this.distribucionMedicos, 'listado_presentacion'+fecha_impresion);
  this.distribucionMedicos = [];
}


generarPdfListado() {

  let selectedImpresion: any[] = [];
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  let rounded:string;
  let total_facturado:number = 0;
  let total_iva:number = 0;
  let _total_opera = 0;
  let _total_ayuda = 0;
  let _total_ayuda2 = 0;
  let _total_clinica = 0;
  let _total_a_pagar = 0;
  let total_cantidad_impresion:string = '';  
  let i = 0;
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log(this.config.data.consulta);

/* -------------------------------------------------------------------------- */
/*                  SI ES DETALLE ENTREGA OTRA CONFIGURACION                  */
/* -------------------------------------------------------------------------- */

if (this.config.data.consulta === 'detalle') {
  if (this.checked) {
    console.log(this.elementoMedicos);

/* -------------------------------------------------------------------------- */
/*                            CONFECCIONO LAS FILAS                           */
/* -------------------------------------------------------------------------- */

    console.log(selectedImpresion);
    let _operacion_cobro_id = 0;
    let esPrimero = true;

    this.elementos.forEach(elem => {
      try {
        elem.fecha_cobro = formatDate( elem.fecha_cobro, 'dd/MM/yyyy', 'en');
      } catch (error) {
        
      }
      
      // tslint:disable-next-line: max-line-length
      if ((elem.medico_opera === this.elementoMedicos.apellido ) ||  (elem.medico_ayuda === this.elementoMedicos.apellido ) ||  (elem.medico_ayuda2 === this.elementoMedicos.apellido ) || (elem.medico_clinica === this.elementoMedicos.apellido )) {

        if (esPrimero) {

          esPrimero = false;
          _operacion_cobro_id =  elem.operacion_cobro_id ;

        } else {
        
          if (elem.operacion_cobro_id === _operacion_cobro_id) {
            elem.medico_opera =  '';
            elem.medico_opera_porcentaje =  '';
            elem.medico_opera_valor =  '';
            elem.medico_ayuda =  '';
            elem.medico_ayuda_porcentaje =  '';
            elem.medico_ayuda_valor =  '';
            elem.medico_ayuda2 =  '';
            elem.medico_ayuda2_porcentaje =  '';
            elem.medico_ayuda2_valor =  '';
            elem.medico_clinica =  '';
            elem.medico_clinica_porcentaje =  '';
            elem.medico_clinica_valor =  '';
            elem.valor_distribuido =  '';
            // si es primero lo cancelo
        } else {
            if (esPrimero) {
              esPrimero = true;
            }
          _operacion_cobro_id =  elem.operacion_cobro_id ;

        }

        }

        


        selectedImpresion.push(elem);
      }
      if (elem.medico_opera === this.elementoMedicos.apellido ) {
        _total_opera = _total_opera + Number(elem.medico_opera_valor);
      }

      if (elem.medico_ayuda === this.elementoMedicos.apellido ) {
        _total_ayuda = _total_ayuda + Number(elem.medico_ayuda_valor);
      }

      if (elem.medico_ayuda2 === this.elementoMedicos.apellido ) {
        _total_ayuda2 = _total_ayuda2 + Number(elem.medico_ayuda2_valor);
      }

      if (elem.medico_clinica === this.elementoMedicos.apellido ) {
        _total_clinica = _total_clinica + Number(elem.medico_clinica_valor);
      }

      

    });
  } else {
    selectedImpresion = this.selecteditems;
  }

  //  USO SELECTED IMPRESION PARA PODER DECIDIR QUE ACCION TOMAR
  if(selectedImpresion){
  var doc = new jsPDF('l');
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(10);
  doc.text('DISTRIBUCION A ' +this.elementoMedicos.apellido, pageWidth/2, 10, null, null, 'center');
  doc.line(60, 13, pageWidth - 15, 13);
  doc.setFontSize(7);
  selectedImpresion.forEach(element => {
    if(element.medico_opera === null) {
      selectedImpresion[i].medico_opera = '';
    }
    if (element.medico_ayuda === null) {
      selectedImpresion[i].medico_ayuda = '';
    }
    if (element.medico_ayuda2 === null) {
      selectedImpresion[i].medico_ayuda2 = '';
    }
    if (element.medico_clinica === null) {
      selectedImpresion[i].medico_clinica = '';
    }
    i++;
  });
  doc.setFontSize(8);
  doc.autoTable(this.columns_detalle, selectedImpresion,
    {
        margin: {top: 25, right: 5,bottom:5, left: 5},
        bodyStyles: {valign: 'top'},
        showHead: 'firstPage',
        styles: {fontSize: 5,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify',overflow: 'linebreak'},
        columnStyles: {text: {cellWidth: 'auto'}}
    });

    doc.setFontSize(8);
    let pageNumber = doc.internal.getNumberOfPages();
    const totalPagesExp = '{total_pages_count_string}';

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
 
  doc.setFontSize(8);
  let finalY = doc.autoTable.previous.finalY;
  doc.line(15, finalY + 3, pageWidth - 15, finalY + 3 );
  doc.text(15, finalY + 8,  'TOTAL OPERA : ' + this.cp.transform(_total_opera, '', 'symbol-narrow', '1.2-2'));
  doc.text(65, finalY + 8, 'TOTAL AYUDA : ' +  this.cp.transform(_total_ayuda, '', 'symbol-narrow', '1.2-2'));
  doc.text(115, finalY + 8, 'TOTAL AYUDA 2 : ' + this.cp.transform(_total_ayuda2, '', 'symbol-narrow', '1.2-2'));
  doc.text(165, finalY + 8, 'TOTAL CLINICA : ' + this.cp.transform(_total_clinica, '', 'symbol-narrow', '1.2-2')); 
  doc.text(pageWidth - 50, finalY + 8, 'TOTAL A PAGAR : ' + this.cp.transform( (_total_opera + _total_ayuda + _total_ayuda2 + _total_clinica), '', 'symbol-narrow', '1.2-2'));
  

  

console.log(doc.putTotalPages);
const footer = function(data) {
  let str = 'Page ' + data.pageCount;
  // Total page number plugin only available in jspdf v1.0+
  if (typeof doc.putTotalPages === 'function') {
    str = str + ' of ' + totalPagesExp;
    console.log('test');
  }
  doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
};
  window.open(doc.output('bloburl'));
}

} else {

  if (this.checked) {
    console.log(this.elementoMedicos);
    //console.log(this.elementos);
    //selectedImpresion = this.elementos;
    console.log(selectedImpresion);
    this.elementos.forEach(element => {
      try {
        element.fecha_cobro = formatDate( element.fecha_cobro, 'dd/MM/yyyy', 'en');
      } catch (error) {
        
      }
      if ((element.medico_opera === this.elementoMedicos.apellido ) ||  (element.medico_ayuda === this.elementoMedicos.apellido ) ||  (element.medico_ayuda2 === this.elementoMedicos.apellido ) || (element.medico_clinica === this.elementoMedicos.apellido )) { 
        selectedImpresion.push(element);
      }
      if (element.medico_opera === this.elementoMedicos.apellido ) {
        _total_opera = _total_opera + Number(element.medico_opera_valor);
      }

      if (element.medico_ayuda === this.elementoMedicos.apellido ) {
        _total_ayuda = _total_ayuda + Number(element.medico_ayuda_valor);
      }

      if (element.medico_ayuda2 === this.elementoMedicos.apellido ) {
        _total_ayuda2 = _total_ayuda2 + Number(element.medico_ayuda2_valor);
      }

      if (element.medico_clinica === this.elementoMedicos.apellido ) {
        _total_clinica = _total_clinica + Number(element.medico_clinica_valor);
      }

      

    });
  } else {
    selectedImpresion = this.selecteditems;
  }

  //  USO SELECTED IMPRESION PARA PODER DECIDIR QUE ACCION TOMAR
  if(selectedImpresion){
  var doc = new jsPDF('l');
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(10);
  doc.text('DISTRIBUCION A ' +this.elementoMedicos.apellido, pageWidth/2, 10, null, null, 'center');
  doc.line(60, 13, pageWidth - 15, 13);
  doc.setFontSize(7);
  selectedImpresion.forEach(element => {
    if(element.medico_opera === null) {
      selectedImpresion[i].medico_opera = '';
    }
    if (element.medico_ayuda === null) {
      selectedImpresion[i].medico_ayuda = '';
    }
    if (element.medico_ayuda2 === null) {
      selectedImpresion[i].medico_ayuda2 = '';
    }
    if (element.medico_clinica === null) {
      selectedImpresion[i].medico_clinica = '';
    }
    i++;
  });
  doc.setFontSize(8);
  doc.autoTable(this.columns, selectedImpresion,
    {
        margin: {top: 25, right: 5,bottom:5, left: 5},
        bodyStyles: {valign: 'top'},
        showHead: 'firstPage',
        styles: {fontSize: 5,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify',overflow: 'linebreak'},
        columnStyles: {text: {cellWidth: 'auto'}}
    });

    doc.setFontSize(8);
    let pageNumber = doc.internal.getNumberOfPages();
    const totalPagesExp = '{total_pages_count_string}';

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
 
  doc.setFontSize(8);
  let finalY = doc.autoTable.previous.finalY;
  doc.line(15, finalY + 3, pageWidth - 15, finalY + 3 );
  doc.text(15, finalY + 8,  'TOTAL OPERA : ' + this.cp.transform(_total_opera, '', 'symbol-narrow', '1.2-2'));
  doc.text(65, finalY + 8, 'TOTAL AYUDA : ' +  this.cp.transform(_total_ayuda, '', 'symbol-narrow', '1.2-2'));
  doc.text(115, finalY + 8, 'TOTAL AYUDA 2 : ' + this.cp.transform(_total_ayuda2, '', 'symbol-narrow', '1.2-2'));
  doc.text(165, finalY + 8, 'TOTAL CLINICA : ' + this.cp.transform(_total_clinica, '', 'symbol-narrow', '1.2-2')); 
  doc.text(pageWidth - 50, finalY + 8, 'TOTAL A PAGAR : ' + this.cp.transform( (_total_opera + _total_ayuda + _total_ayuda2 + _total_clinica), '', 'symbol-narrow', '1.2-2'));
  

  

console.log(doc.putTotalPages);
const footer = function(data) {
  let str = 'Page ' + data.pageCount;
  // Total page number plugin only available in jspdf v1.0+
  if (typeof doc.putTotalPages === 'function') {
    str = str + ' of ' + totalPagesExp;
    console.log('test');
  }
  doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
};
  window.open(doc.output('bloburl'));
}

}
selectedImpresion = [];

}

realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._obra_social_nombre = [];
  this._medico_opera = [];
  this._medico_ayuda= [];
  this._medico_ayuda2 = [];

  
  resp.forEach(element => {
    this._obra_social_nombre.push(element['obra_social_nombre']);
    this._medico_opera.push(element['medico_opera']);
   this._medico_ayuda.push(element['medico_ayuda']);
   this._medico_ayuda2.push(element['medico_ayuda2']);
  });
  
  // ELIMINO DUPLICADOS
  this._obra_social_nombre = this.filter.filterArray(this._obra_social_nombre);  
  this._medico_opera = this.filter.filterArray(this._medico_opera);  
  this._medico_ayuda = this.filter.filterArray(this._medico_ayuda);
  this._medico_ayuda2 = this.filter.filterArray(this._medico_ayuda2);
  
  
}
}

