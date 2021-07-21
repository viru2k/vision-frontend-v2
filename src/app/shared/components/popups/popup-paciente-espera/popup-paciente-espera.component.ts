
import { DialogService, MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');


import { Document } from 'src/app/models/document';
import { startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';



import { PopupOperacionCobroDetalleComponent } from './../popup-operacion-cobro-detalle/popup-operacion-cobro-detalle.component';
import { Liquidacion } from './../../../../models/liquidacion.model';
import { DocumentService } from './../../../../services/document-service.service';
import { PopupPacienteConsultaComponent } from './../popup-paciente-consulta/popup-paciente-consulta.component';
import { PopupOperacionCobroPresentacionComponent } from './../popup-operacion-cobro-presentacion/popup-operacion-cobro-presentacion.component';
import { PopupTurnoUsuarioObraSocialComponent } from './../../../../pages/recepcion/agenda/turno/popup-turno-usuario-obra-social/popup-turno-usuario-obra-social.component';
import { PopupMedicoComponent } from './../popup-medico/popup-medico.component';
import { AgendaTurno } from './../../../../models/agenda-turno.model';
import { Paciente } from './../../../../models/paciente.model';
import { PopupPacienteObrasocialComponent } from './../popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { AgendaService } from './../../../../services/agenda.service';
import { Agenda } from './../../../../models/agenda.model';
import { calendarioIdioma, logo_clinica } from './../../../../config/config';


@Component({
  selector: 'app-popup-paciente-espera',
  templateUrl: './popup-paciente-espera.component.html',
  styleUrls: ['./popup-paciente-espera.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class PopupPacienteEsperaComponent implements OnInit {

  
  display: boolean = false;
  cols: any[];
  selectedItem: Agenda;
  es:any;
  // LOADING
  DateForm:FormGroup;
  loading: boolean;
  elemento:AgendaTurno = null;
  elementos:Agenda[] = null;
  fechaHoy:Date;
  _fechaHoy:string;
  fecha:Date;
  selecteditems:AgendaTurno[] = [];
  usuario_id:string;
  busqueda: any[];
  pacienteForm: FormGroup;
  colsAgenda:any;
  popItemAgenda:AgendaTurno;
  elementosTurnos:AgendaTurno[] = null;
  popItemMedicoObraSocial:MedicoObraSocial;
  agendaTurno:AgendaTurno[] = [];
  agendaTurnos:AgendaTurno[] =[];
  selectedagendaTurno:AgendaTurno= null;
  elementosFiltrados:AgendaTurno[] = [];
  elementosFiltradosImpresion:AgendaTurno[] = [];
  observacion:string;
  popItemPaciente:Paciente;
  condicion:string;
  columns: any[];
  checked: boolean = false;
   userData:any;
  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;
  document: Document;
  motivo:string;

  constructor(private documentService: DocumentService,private miServico:AgendaService, private messageService: MessageService ,public config: DynamicDialogConfig,
    public dialogService: DialogService,  private route: ActivatedRoute,     private router: Router, public ref: DynamicDialogRef ) {

  this.cols = [
      {field: 'boton', header: '' , width: '4%'},
      {field: 'agenda_dia_horario_atencion_id', header: 'Nº', width: '5%' }, 
      {field: 'operacion_cobro_id', header: 'OC', width: '5%' }, 
      {field: 'paciente_apellido', header: 'Apellido', width: '8%' }, 
      {field: 'paciente_nombre', header: 'Nombre', width: '8%' }, 
      {field: 'paciente_dni', header: 'Dni', width: '8%' },      
      {field: 'paciente_obra_social_nombre', header: 'Obra social', width: '8%' },
      {field: 'telefono_cel', header: 'Telefono ', width: '8%' },
      {field: 'hora_desde', header: 'Turno', width: '10%' },
      {field: 'estado', header: 'Estado', width: '8%' },
      {field: 'nombreyapellido', header: 'Medico', width: '15%' },  
      {field: 'dia_nombre', header: 'Dia', width: '6%' },
      {field: 'presente', header: 'Presente', width: '8%' },      
      {field: 'es_alerta', header: '' , width: '4%'},
      {field: 'boton', header: '', width: '8%' },
      ];
   this.busqueda = [
      {label:'Seleccione una busqueda', value:null},
      {label:'Fecha', value:{id:1, name: 'New York', code: 'FE'}},
      {label:'Médico', value:{id:2, name: 'Rome', code: 'MD'}}
      
  ];

  
         
   this.columns = [
    {title: 'OC', dataKey: 'operacion_cobro_id'},
     {title: 'Apellido', dataKey: 'paciente_apellido'},
     {title: 'Nombre', dataKey: 'paciente_nombre'},
     {title: 'DNI', dataKey: 'paciente_dni'},
     {title: 'Celular', dataKey: 'telefono_cel'},
     {title: 'Fijo', dataKey: 'telefono_fijo'},
     {title: 'Obra social', dataKey: 'paciente_obra_social_nombre'},       
     {title: 'Medico', dataKey: 'nombreyapellido'},
     {title: 'Turno', dataKey: 'hora_desde'},
     {title: 'Dia', dataKey: 'dia_nombre'}
 ];
  

  this.DateForm = new FormGroup({
      'fechaHoy': new FormControl('', Validators.required), 
      'medico_nombre': new FormControl('')
      });
this.popItemAgenda = new AgendaTurno('',new Date(),new Date(), new Date(), '','', '', '', '','','','','','','','','','','','','','','','','','','','','',new Date(),'','','','','', '','','','','','','','','');
}

ngOnInit() {
  console.log(this.config.data);
  this.userData = JSON.parse(localStorage.getItem('userData'));
  this.popItemPaciente =  new Paciente('0','','','','','',new Date(),'','','','','','','','','0','0','','','0','','','','','','');
  this.es = calendarioIdioma;
  this.fechaHoy = new Date();
  this.fecha = new Date();
  this.pacienteForm = new FormGroup({
    'nombre': new FormControl('', Validators.required),
    'apellido': new FormControl('', Validators.required),
    'dni': new FormControl('', Validators.required),
});

this.DateForm.patchValue({fechaHoy: this.fechaHoy});


this.loadList();

let timer = Observable.timer(180000,180000);//180000 -- 3 minutos inicia y en 3 minutos vuelve a llamar
timer.subscribe(t=> {
  console.log('bucando turnos');
  this.loadList();
});

} 

darTurno(){
  console.log(this.popItemAgenda);
  this.router.navigate(['/recepcion/turnos'],{ state: { paciente: this.popItemAgenda } });
  this.ref.close();
}

ngOnDestroy() {

}




actualizarFecha(event){
  console.log(event);
  this.fechaHoy = event;
  console.log(new Date(this.fechaHoy));
}

actualizarBusqueda(event){
    console.log(event);
}

loadTurno(){
  this.loadList();
}

loadTurnoTodos(){
  this.loadList();
}



ActualizarTurnoLlamando(){

  try {
    this.miServico.ActualizarTurnoLlamando(this.popItemAgenda.paciente_id,this.popItemAgenda.usuario_id, this.userData['puesto'])
    .subscribe(resp => {   
 
        this.loading = false;
        this.documentService.sendMessage('llamando-pantalla');
        this.actualizarTurno();


    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        console.log(error);
        swal({
          toast: false,
          type: 'warning',
          title: error.status,
          text: error.message,
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
}


pacienteIngresado(event:AgendaTurno){
  this.popItemAgenda = event;
  this.popItemAgenda.agenda_estado_id = '9';
      this.popItemAgenda.puesto_llamado = this.userData['puesto'];
      this.popItemAgenda.puesto_estado = 'LLAMANDO';
      this.popItemAgenda.llamando = this._fechaHoy;
      console.log(event)      ;
  this.ActualizarTurnoLlamando();
  
}

pacienteAtendido(event:AgendaTurno){
  console.log(event);
  this.popItemAgenda = event;
  this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  this.popItemAgenda.atendido = this._fechaHoy;
  this.popItemAgenda.agenda_estado_id = '3';
  //this.popItemAgenda.puesto_llamado = this.userData['puesto'];
 // this.popItemAgenda.puesto_estado = 'INGRESADO' ;
  this.actualizarTurno();
}





buscarPaciente(){
  let data:any; 
  const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
  data,
   header: 'Buscar paciente', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteObrasocialComponent:Paciente) => {
      if (PopupPacienteObrasocialComponent) {

      }
  });
}



buscarPacienteConsulta(){
  let data:any; 
  data = this.popItemAgenda;  
  const ref = this.dialogService.open(PopupPacienteConsultaComponent, {
  data,
   header: 'Consultar paciente', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteConsultaComponent:Paciente) => {
      if (PopupPacienteObrasocialComponent) {
        this.loadList();
      }
  });
}


  
accion(evt:any,overlaypanel:OverlayPanel,event:AgendaTurno){    
  if(event){
    this.selectedagendaTurno = event;

      this.observacion = event.observacion;
  }
  console.log(event);
this.popItemAgenda = event;
  overlaypanel.toggle(evt);
}


async editarRegistro(cond:string){
  this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  console.log(cond);
  this.condicion = cond;
  this.popItemAgenda = this.selectedagendaTurno;
   
    if(cond == 'observacion'){

      console.log('observacion');

      this.display = true;
      
    } 

    if(cond === 'paciente'){
      this.buscarPacienteConsulta();
      
    } 
    
    if(cond == 'espera'){
      this.popItemAgenda.agenda_estado_id = '5';
      this.popItemAgenda.llegada = this._fechaHoy;
      this.actualizarTurno();
    }

    if(cond == 'operacioncobro'){
      console.log('ausente');
      this.router.navigate(['/recepcion/operacioncobro'], { state: { paciente: this.popItemAgenda } });
      this.ref.close();
    } 


    if(cond == 'llamando'){
      this.popItemAgenda.agenda_estado_id = '9';
      this.popItemAgenda.puesto_llamado = this.userData['puesto'];
      this.popItemAgenda.puesto_estado = 'LLAMANDO';
      this.popItemAgenda.llamando = this._fechaHoy;
      this.actualizarTurno();
    }

    if(cond == 'rellamar'){
      this.popItemAgenda.agenda_estado_id = '9';
      this.popItemAgenda.puesto_llamado = this.userData['puesto'];
      this.popItemAgenda.puesto_estado = 'LLAMANDO';
      this.popItemAgenda.llamando = this._fechaHoy;
      this.actualizarTurno();
    }
    if(cond == 'ausente'){
      this.popItemAgenda.agenda_estado_id = '10';
      this.popItemAgenda.llegada = this._fechaHoy;
      this.popItemAgenda.atendido = this._fechaHoy;
      this.popItemAgenda.puesto_llamado = this.userData['puesto'];
      this.popItemAgenda.puesto_estado = 'ATENDIDO';

      this.actualizarTurno();
    }

    
    if(cond == 'presente'){
      this.popItemAgenda.agenda_estado_id = '8';
      this.popItemAgenda.presente = this._fechaHoy;
      this.popItemAgenda.llegada = '2099-12-31 00:00:00';
      this.actualizarTurno();
}

}

verMotivo(evt:any,overlaypanel:OverlayPanel,event:AgendaTurno){    
  if(event){
    this.selectedagendaTurno = event;
      this.motivo = event.es_observacion;
      this.observacion = event.observacion;        
  }
  this.display = true;
}

filtered(event){
  console.log(event.filteredValue);
  this.elementosFiltrados  = event.filteredValue;
}


loadList(){
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
// console.log(this.popItemAgenda);
if(this._fechaHoy!=''){
  this.popItemAgenda.fecha_turno = this._fechaHoy;    
  try {
    console.log(this.popItemAgenda);
      this.miServico.getHorarioTurnoPresente(this.popItemAgenda)
      .subscribe(resp => {
        if (resp[0]) {
          let i:number = 0;
          let resultado = resp;
          resultado.forEach(element => {
            resp[i]['telefono_cel'] =  resp[i]['telefono_cel']+' / '+resp[i]['telefono_fijo'];
            resp[i]['edad'] =String((new Date()).getFullYear() - (new Date(resp[i]['paciente_fecha_nacimiento'])).getFullYear());
            i++;
          });
          this.agendaTurno = resp;
          console.log(this.agendaTurno);
            }else{
              this.agendaTurno =null;
            }

          this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.loading = false;
          this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
       });    
  } catch (error) {
  this.throwAlert('error','Error al cargar los registros',error);
  }  
} 

}




darSobreTurno(){
this.router.navigate(['/recepcion/turnos']);
}

loadListByMedico(){
this.es = calendarioIdioma;
this.loading = true;
this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
console.log(this.popItemAgenda);
if(this._fechaHoy!=''){
this.popItemAgenda.fecha_turno = this._fechaHoy;   
this.popItemAgenda.usuario_id = this.popItemMedicoObraSocial.usuario_id; 
try {
    this.miServico.getHorarioTurnoMedico(this.popItemAgenda)    
    .subscribe(resp => {
    //  console.log(resp);
    
    if (resp[0]) {
      let i:number = 0;
      let resultado = resp;
      resultado.forEach(element => {
        resp[i]['telefono_cel'] =  resp[i]['telefono_cel']+' / '+resp[i]['telefono_fijo'];
        i++;
      });
        this.agendaTurno = resp;
        console.log(this.agendaTurno);
          }else{
            this.agendaTurno =null;
          }
       
        this.loading = false;
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
     });    
} catch (error) {
this.throwAlert('error','Error al cargar los registros',error);
}  
} 

}



actualizarTurno(){
this.es = calendarioIdioma;
this.loading = true;

console.log(this.popItemAgenda);  
try {
    this.miServico.putItem(this.popItemAgenda, this.popItemAgenda.agenda_dia_horario_atencion_id)
    .subscribe(resp => {
   // this.agendaTurno = resp;
        console.log(resp);    
        this.loading = false;
     
    
        this.loadList(); 
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        console.log(error);
        this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
     });    
} catch (error) {
this.throwAlert('error','Error al cargar los registros',error);
}  
} 


guardarObservacion(){
console.log(this.observacion);
if(this.observacion ===undefined){    
  this.popItemAgenda.observacion = '-';
  if(this.checked){
    this.popItemAgenda.es_alerta = 'S';
  }else{
    this.popItemAgenda.es_alerta = 'N';
  }    
}
this.popItemAgenda.observacion = this.observacion; 
this.actualizarTurno();
this.display = false;
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


generarPdf(){

let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
console.log(this.elementos);
if(!this.elementosFiltrados){
  this.elementosFiltradosImpresion = this.agendaTurno;
}else{
  this.elementosFiltradosImpresion = this.elementosFiltrados;
}
let fecha = formatDate(this.fechaHoy, 'dd/MM/yyyy', 'en');
var doc = new jsPDF('landscape');

/** valores de la pagina**/
const pageSize = doc.internal.pageSize;
const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11);
doc.setLineWidth(0.4);
doc.line(10, 30, pageWidth - 10, 30);
doc.setFontSize(12);
doc.text('Agenda de pacientes', pageWidth/2, 20, null, null, 'center');
doc.setFontSize(8);
doc.text(pageWidth-60, 20, 'Fecha :' + fecha);
doc.text('Emitido : '+_fechaEmision, pageWidth-40, 18, null, null, 'left');


 doc.autoTable(this.columns, this.elementosFiltradosImpresion,
    {
       
      margin: {horizontal: 5, vertical: 35},
          
      bodyStyles: {valign: 'top'},
      styles: {fontSize: 8,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
      columnStyles: {text: {cellWidth: 'auto'}}
    }
    );
    window.open(doc.output('bloburl'));  
}

/** ACCIONES */

colorRow(estado:string){
  

  if(estado == 'ATENDIDO') {
    return {'es-atendido'  :'null' };
  }
  if(estado == 'ATENDIDO') {
      return {'es-atendido'  :'null' };
  }
  if(estado == 'PENDIENTE') {
      return {'es-pendiente'  :'null' };
  }
  if(estado == 'AUSENTE') {
      return {'es-ausente'  :'null' };
  }
  if(estado == 'INGRESADO') {
      return {'es-ingresado'  :'null' };
  }
  if(estado == 'ESPERA') {
      return {'es-espera'  :'null' };
  }
  if(estado == 'PRESENTE') {
    return {'es-presente'  :'null' };
}
  if(estado == 'SOBRETURNO') {
    return {'es-sobreturno'  :'null' };
  }
  if(estado == 'TURNO') {
    return {'es-turno'  :'null' };
  }

  if(estado == 'DERIVADO') {
    return {'es-turno'  :'null' };
  }

  if(estado == 'ASESORAMIENTO') {
    return {'es-asesoramiento'  :'null' };
  }


  if(estado == 'CANCELADO') {  
    return {'es-cancelado'  :'null' };
  }  
 
  if(estado == 'LLAMANDO') {
    return {'es-llamando'  :'null' };
  }
  


}

colorString(estado:string){

if((estado === '0')||(estado === null)) {
  return {'es-transferencia'  :'null' };
}else{
  return {'es-tarjeta-debito'  :'null' };
}
}

colorEsSobreturno(sobreturno:string, estado:string){

if((estado === 'SOBRETURNO')) {

}else{
  if((sobreturno === 'SI')) {
    return {'text-danger-bold'  :'null' };
}
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





