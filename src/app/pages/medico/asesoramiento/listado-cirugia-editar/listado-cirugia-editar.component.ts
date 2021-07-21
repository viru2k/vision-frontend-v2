import { Component, OnInit } from '@angular/core';
import { CirugiaFicha } from '../../../../models/cirugia-ficha.model';

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';

import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');


import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CirugiaService } from './../../../../services/cirugia.service';
import { PopupLentesComponent } from '../../../../shared/components/popups/popup-lentes/popup-lentes.component';
import { CirugiaLente } from 'src/app/models/cirugia-lente.model';

import { PopupFichaQuirurgicaMedicoGrupoComponent } from '../../../../shared/components/popups/popup-ficha-quirurgica-medico-grupo/popup-ficha-quirurgica-medico-grupo.component';

import { CirugiaFichaMedico } from './../../../../models/cirugia-ficha-medico.model';
import { PopupHistoriaClinicaListaConsultaComponent } from '../../../../shared/components/popups/popup-historia-clinica-lista-consulta/popup-historia-clinica-lista-consulta.component';
import { MedicoService } from '../../../../services/medico.service';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { PopupDerivarAsesoramientoListadoComponent } from './../../../../shared/components/popups/popup-derivar-asesoramiento-listado/popup-derivar-asesoramiento-listado.component';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PopupListadoCirugiaQuirofanoEditarComponent } from './../../../../shared/components/popups/popup-listado-cirugia-quirofano-editar/popup-listado-cirugia-quirofano-editar.component';
import { logo_clinica,calendarioIdioma } from './../../../../config/config';
import { PopupListadoCirugiaQuirofanoObservacionEditarComponent } from '../../../../shared/components/popups/popup-listado-cirugia-quirofano-observacion-editar/popup-listado-cirugia-quirofano-observacion-editar.component';
import { CirugiaFichaListadoQuirofano } from '../../../../models/cirugia-ficha-listado-quirofano.model';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';


@Component({
  selector: 'app-listado-cirugia-editar',
  templateUrl: './listado-cirugia-editar.component.html',
  styleUrls: ['./listado-cirugia-editar.component.css'],
  providers: [MessageService,DialogService]
})
export class ListadoCirugiaEditarComponent implements OnInit {

  
  elementosHistoriaClinica:HistoriaClinica[];
  FormFicha:FormGroup;
  DateForm:FormGroup;
  loading: boolean;
  selecteditem:any;;
  es:any;
  elemento:CirugiaFicha = null;
  elementos:CirugiaFicha[] = null;
  elementosFiltrados:CirugiaFicha[] = null;
  selecteditems:CirugiaFicha[] = [];
  selecteditemRegistro:CirugiaFicha= null;
  popItem:CirugiaFicha;
  popItemLente:CirugiaLente;
  columns: any[];
  cols: any[];
  fechaHoy:Date;
  _fechaHoy:string;
  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;
  formPaciente:FormGroup;
  observacion:string;
  display:boolean;

  constructor(private miServicio:CirugiaService,private medicoService:MedicoService,private messageService: MessageService ,public dialogService: DialogService,  private router: Router ) {

    this.cols = [
      { field: '', header: 'Obs.',  width: '6%' }, 
      { field: 'cirugia_ficha_id', header: 'Nº' , width: '6%'} ,
      { field: 'orden', header: 'Orden' , width: '5%'},
      { field: 'fecha_hora', header: 'Hora' , width: '8%'},
      { field: 'paciente_apellido', header: 'Apellido',  width: '10%' },
      {field: 'paciente_nombre', header: 'Nombre' , width: '10%' },
      { field: 'paciente_dni', header: 'DNI',  width: '8%' },      
      { field: 'obra_social_nombre', header: 'Obra social / Coseguro',  width: '20%' },
      { field: 'cirugia_practica', header: 'Practica',  width: '15%' },
      { field: 'ojo', header: 'Ojo' , width: '6%'},
      { field: 'dioptria', header: 'Diop.' , width: '6%'},
      { field: 'lente_tipo', header: 'Lente' , width: '10%'},
      { field: 'lote', header: 'Lote' , width: '8%'},
      { field: 'usuario_medico_opera_nombre', header: 'Opera' , width: '12%'} ,
      { field: 'usuario_medico_ayuda_nombre', header: 'Ayuda' , width: '12%'} ,
      { field: 'usuario_medico_anestesista_nombre', header: 'Anestesista' , width: '12%'} ,
      { field: '', header: 'Editar' , width: '6%'} ,
   ];


   this.columns = [
    {title: 'Cir.', dataKey: 'cirugia_ficha_id'},
    {title: 'Orden', dataKey: 'orden'}, 
    {title: 'Hora', dataKey: 'hora'}, 
    {title: 'Apellido', dataKey: 'paciente_apellido'}, 
    {title: 'Nombre', dataKey: 'paciente_nombre'}, 
    {title: 'DNI', dataKey: 'paciente_dni'}, 
    {title: 'Obra social / Coseguro', dataKey: 'obra_social_nombre'},
    {title: 'Cirugia', dataKey: 'cirugia_practica'},    
    {title: 'Ojo', dataKey: 'ojo'},  
    {title: 'Diop.', dataKey: 'dioptria'},  
    {title: 'Lente', dataKey: 'lente_tipo'},     
    {title: 'Lote', dataKey: 'lote'}, 
    {title: 'Opera', dataKey: 'usuario_medico_opera_nombre'}, 
    {title: 'Ayuda', dataKey: 'usuario_medico_ayuda_nombre'}, 
    {title: 'Anestesista', dataKey: 'usuario_medico_anestesista_nombre'}, 
];
  



   }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fechaHoy = new Date();
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();

    this.DateForm = new FormGroup({
      'fechaHoy': new FormControl("", Validators.required), 
      'fechaDesde': new FormControl("", Validators.required), 
      'fechaHasta': new FormControl("", Validators.required), 
      'medico_nombre': new FormControl("")
      });

      this.FormFicha = new FormGroup({
        'cirugia_ficha_id': new FormControl(""), 
        'cirugia_ficha_usuario_audito_id': new FormControl(""),
        'cirugia_ficha_usuario_audito': new FormControl(""),
        'cirugia_ficha_usuario_modifico_id': new FormControl(""),
        'cirugia_ficha_usuario_modifico': new FormControl(""),
        'cirugia_medico_grupo_id': new FormControl(""),
        'cirugia_practica': new FormControl(""),
        'dioptria': new FormControl(""),
        'estado': new FormControl(""),
        'estado_cirugia_id': new FormControl(""),
        'fecha_derivacion': new FormControl(""),
        'lente_estado': new FormControl(""),
        'lente_tipo': new FormControl(""),
        'lente_vencimiento': new FormControl(""),
        'lote': new FormControl(""),
        'medico_deriva': new FormControl(""),
        'medico_deriva_id': new FormControl(""),
        'obra_social_id': new FormControl(""),
        'obra_social_nombre': new FormControl(""),
        'ojo': new FormControl(""),
        'orden': new FormControl(""), 
        'fecha_hora': new FormControl(""), 
        'hora': new FormControl(""), 
        'paciente_apellido': new FormControl(""),
        'paciente_dni': new FormControl(""),
        'paciente_fecha_nacimiento': new FormControl(""),
        'paciente_id': new FormControl(""),
        'paciente_nombre': new FormControl(""),
        'usuario_crea_id': new FormControl(""),
        'usuario_listado_creo_nombre': new FormControl(""),
        'usuario_listado_modifico_nombre': new FormControl(""),
        'usuario_medico_anestesista_nombre': new FormControl(""),
        'usuario_medico_ayuda_nombre': new FormControl(""),
        'usuario_medico_opera_nombre': new FormControl(""),
        'usuario_modifica_id': new FormControl(""),
        'es_nuevo': new FormControl("NO"),
        
        
        });
    this.DateForm.patchValue({es_nuevo: 'NO'});
    this.DateForm.patchValue({fechaHoy: this.fechaHoy});
    this.loadListByMedico();
  }

  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;
}

editRow(row){
  console.log(row.data);
  this.popItem = row.data;
      /* if( this.actualizarDatos()){
      this.showToast('exito',"Registro modificado","Exito al modificar");
  }*/
}


verObservacion(evt:any,overlaypanel:OverlayPanel,event:CirugiaFichaListadoQuirofano){    
  if(event){

      this.observacion = event.quirofano_observacion;        
  }
  this.display = true;
}

colorEstado(estado:string){
    
  if(estado == 'SI') {
    return {'es-pendiente'  :'null' };
}
}

  accion(event: any,overlaypanel: OverlayPanel,elementos: CirugiaFicha) {
    if(elementos){
      this.selecteditem = elementos;
    }

      console.log(this.selecteditemRegistro);
      overlaypanel.toggle(event);
    }

    actualizarFecha(event){
      console.log(event);
      this.fechaHoy = event;
      console.log(new Date(this.fechaHoy));
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


    
  loadList() {
 this.loading = true;
 let _fechaDesde = formatDate(this.fechaHoy, 'dd/MM/yyyy HH:mm:ss', 'en');
    try {
        this.miServicio.getListadoQurifano(_fechaDesde)
        .subscribe(resp => {
          let i:number = 0;
          let resultado = resp;
          resultado.forEach(element => {
            resp[i]['obra_social_nombre'] = resp[i]['obra_social_nombre'] +' / '+resp[i]['coseguro_nombre'] ;
            resp[i]['hora'] = formatDate( element['fecha_hora'], 'HH:mm', 'en');
        //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy', 'en');
            
            i++;
          });
            this.elementos = resp;
            console.log(resp);
            this.loading = false;
        },
        error => { // error path
            console.log(error);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
            this.loading = false;
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
}


loadListByMedicoByPeriodo() {
  let userData = JSON.parse(localStorage.getItem('userData'));
  this.loading = true;
  let _fechaDesde = formatDate(this.fechaDesde, 'dd/MM/yyyy HH:mm:ss', 'en');
  let _fechaHasta = formatDate(this.fechaHasta, 'dd/MM/yyyy HH:mm:ss', 'en');
  console.log(_fechaHasta);
     try {
         this.miServicio.getListadoQuirofanoByMedicoByPeriodo(_fechaDesde,_fechaHasta, userData['id'])
         .subscribe(resp => {
           let i:number = 0;
           let resultado = resp;
           resultado.forEach(element => {
             resp[i]['obra_social_nombre'] = resp[i]['obra_social_nombre'] +' / '+resp[i]['coseguro_nombre'] ;
             resp[i]['hora'] = formatDate( element['fecha_hora'], 'HH:mm', 'en');
         //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy', 'en');
             
             i++;
           });
             this.elementos = resp;
             console.log(resp);
             this.loading = false;
         },
         error => { // error path
             console.log(error);
             console.log(error.status);
             this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
             this.loading = false;
          });
     } catch (error) {
     this.throwAlert('error','Error al cargar los registros',error,error.status);
     }
 }

loadListByMedico() {
  let userData = JSON.parse(localStorage.getItem('userData'));
  this.loading = true;
  let _fechaDesde = formatDate(this.fechaHoy, 'dd/MM/yyyy HH:mm:ss', 'en');
  
     try {
         this.miServicio.getListadoQuirofanoByMedico(_fechaDesde, userData['id'])
         .subscribe(resp => {
           let i:number = 0;
           let resultado = resp;
           resultado.forEach(element => {
             resp[i]['obra_social_nombre'] = resp[i]['obra_social_nombre'] +' / '+resp[i]['coseguro_nombre'] ;
             resp[i]['hora'] = formatDate( element['fecha_hora'], 'HH:mm', 'en');
         //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy', 'en');
             
             i++;
           });
             this.elementos = resp;
             console.log(resp);
             this.loading = false;
         },
         error => { // error path
             console.log(error);
             console.log(error.status);
             this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
             this.loading = false;
          });
     } catch (error) {
     this.throwAlert('error','Error al cargar los registros',error,error.status);
     }
 }
 


editar(selecteditems:any){

  this.selecteditems['es_nuevo'] = 'NO';
  console.log(selecteditems);
  let data:any; 
  data = selecteditems;
  const ref = this.dialogService.open(PopupListadoCirugiaQuirofanoObservacionEditarComponent, {
  data,
   header: 'Editar listado', 
   width: '90%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupListadoCirugiaQuirofanoObservacionEditarComponent:any) => {
     
       
     this.loadList();
  });
}
 

verHistoriaClinica(){
 this.loading = true;
 console.log(this.selecteditem);
  try { 
    this.medicoService.getHistoriaClinicaByPaciente(this.selecteditem.paciente_dni)
    .subscribe(resp => {
   // this.elementosHistoriaClinica = resp;
    console.log(resp);      

    //this.formPaciente.patchValue({historia_clinica: resp})
  //  console.log(this.formPaciente);
    this.loading = false;
   
    console.log(resp);
    let data:any; 
    data = resp;
    const ref = this.dialogService.open(PopupHistoriaClinicaListaConsultaComponent, {
    data,
     header: 'Historia clínica', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupHistoriaClinicaListaConsultaComponent:HistoriaClinica) => {

          console.log(PopupHistoriaClinicaListaConsultaComponent);

    });

    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
   //     this.resultSave = false;
        this.loading = false;
      });    
} catch (error) {
  this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
}
  
}


darTurno(){
  this.router.navigate(['/recepcion/turnos'],{ state: { paciente: this.selecteditem } });
}

loadhistoriaClinica(){ 
  this.loading = true; 
 


}


verMedico(selecteditems){
  console.log(selecteditems);
  let data:any = this.selecteditem; 
  const ref = this.dialogService.open(PopupFichaQuirurgicaMedicoGrupoComponent, {
  data,
   header: 'Gestionar médicos', 
   width: '50%',
   height: '70%'
  });

  ref.onClose.subscribe((PopupFichaQuirurgicaMedicoGrupoComponent:CirugiaFichaMedico) => {
    this.loadList();
     
  });
}




imprimirListado(){}


verListadoCirugiaAtencion(selecteditems){
  console.log(selecteditems);
  let data:any = this.selecteditem; 
  const ref = this.dialogService.open(PopupDerivarAsesoramientoListadoComponent, {
  data,
   header: 'Listado atencion pacientes', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupDerivarAsesoramientoListadoComponent:CirugiaFicha) => {
   // this.loadList();
     
  });

}


generarPdfListadoMedico() {
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  let th = formatDate(this.fechaHoy, 'dd/MM/yyyy', 'en');
  let rounded:string;
  let total_facturado:number = 0;
  let total_iva:number = 0;
  let total_cantidad:number = 0;
  let total_cantidad_impresion:string = '';
  let fecha_impresion = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'es-Ar');  
  let i = 0;
  let userData = JSON.parse(localStorage.getItem('userData'));
  
  console.log(this.elementos);
   for(i=0;i<this.elementos.length;i++){
  
    total_cantidad++;
   } 
    
  if(this.selecteditems){
  var doc = new jsPDF('l');
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(9);
  doc.text('Listado provisorio de cirugias', 60, 10, null, null, 'left');
  doc.setFontSize(6);
  //doc.text('Periodo: '+td+' al '+th, pageSize.width -60, 10, null, null);
  doc.line(60, 13, pageWidth - 15, 13);
  doc.setFontSize(7);
 
  doc.setFontSize(9);
  doc.text('Usuario confecciono: '+userData['nombreyapellido'], 60, 20, null, null, 'left');
  doc.setFontSize(6);
  doc.text('Emitido : '+_fechaEmision, pageWidth/2, 30, null, null, 'center');
 
  doc.setFontSize(8);
  //doc.line(15, 35, pageWidth - 15, 35);
  let pageNumber = doc.internal.getNumberOfPages();
  doc.autoTable(this.columns, this.elementos,
    {
        margin: {top: 38, right: 5,bottom:5, left: 5},
        bodyStyles: {valign: 'top'},
        showHead: 'firstPage',
        styles: {fontSize: 6,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify',overflow: 'linebreak'},
       // columnStyles: {text: {cellWidth: 'auto'},minCellWidth:40}
        columnStyles: {cirugia_ficha_id: {columnWidth: 10}, orden:{columnWidth:10},hora: {columnWidth: 10}, paciente_apellido: {columnWidth: 20},
        paciente_nombre: {columnWidth: 20},  obra_social_nombre: {columnWidth: 25}, ojo: {columnWidth: 8},  dioptria: {columnWidth: 8}, paciente_dni: {columnWidth: 15}, lote: {columnWidth: 16}}

       /*  {title: 'Cir.', dataKey: 'cirugia_ficha_id'},
        {title: 'Orden', dataKey: 'orden'}, 
        {title: 'Hora', dataKey: 'hora'}, 
        {title: 'Apellido', dataKey: 'paciente_apellido'}, 
        {title: 'Nombre', dataKey: 'paciente_nombre'}, 
        {title: 'DNI', dataKey: 'paciente_dni'}, 
        {title: 'Obra social', dataKey: 'obra_social_nombre'},
        {title: 'Cirugia', dataKey: 'cirugia_practica'},    
        {title: 'Ojo', dataKey: 'ojo'}, 
        {title: 'Lente', dataKey: 'lente_tipo'},     
        {title: 'Lote', dataKey: 'lote'}, 
        {title: 'Opera', dataKey: 'usuario_medico_opera_nombre'}, 
        {title: 'Ayuda', dataKey: 'usuario_medico_ayuda_nombre'}, 
        {title: 'Anestesista', dataKey: 'usuario_medico_anestesista_nombre'},  */

    });
   
    doc.setFontSize(8);
    let finalY = doc.autoTable.previous.finalY;
    doc.line(15, finalY+3, pageWidth - 15, finalY+3);
    doc.text(15, finalY+8,'Total de cirugias : ' +  total_cantidad); 
   
    //doc.text(15, finalY+10, 'en letras : $' + this.numberToWordsPipe.transform(13) ); 
 
    
  const totalPagesExp = '{total_pages_count_string}';
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




throwAlert(estado: string, mensaje: string, motivo: string, errorNumero: string){
  let tipoerror:string;

  if(estado== 'success'){
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }

  if(errorNumero =='422'){
    mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
}
  
  if((estado== 'error')&&(errorNumero!='422')){
    if(errorNumero =='422'){
        mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    }
    if(errorNumero =='400 '){
        mensaje ='Bad Request ';
    }
    if(errorNumero =='404'){
        mensaje ='No encontrado ';
    }
    if(errorNumero =='401'){
        mensaje ='Sin autorización';
    }
    if(errorNumero =='403'){
        mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if(errorNumero =='405'){
        mensaje ='Método no permitido';
    }
    if(errorNumero =='500'){
        mensaje ='Error interno en el servidor';
    }
    if(errorNumero =='503'){
        mensaje ='Servidor no disponible';
    }
    if(errorNumero =='502'){
        mensaje ='Bad gateway';
    }
    
      swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        })
  }


}
}
