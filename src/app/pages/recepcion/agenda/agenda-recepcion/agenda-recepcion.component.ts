import { PopupMedicoComponent } from './../../../../shared/components/popups/popup-medico/popup-medico.component';
import { DialogService, MessageService } from 'primeng/api';
import { PopupTurnoUsuarioObraSocialComponent } from './../turno/popup-turno-usuario-obra-social/popup-turno-usuario-obra-social.component';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { formatDate, DatePipe } from '@angular/common';
import { AgendaTurno } from './../../../../models/agenda-turno.model';
import { AgendaService } from './../../../../services/agenda.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Paciente } from './../../../../models/paciente.model';
import { calendarioIdioma,logo_clinica } from '../../../../config/config';
import { Agenda } from '../../../../models/agenda.model';

import swal from 'sweetalert2';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PopupPacienteObrasocialComponent } from '../../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { startWith } from 'rxjs/operators';
import { DocumentService } from './../../../../services/document-service.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { PopupPacienteConsultaComponent } from '../../../../shared/components/popups/popup-paciente-consulta/popup-paciente-consulta.component';
import { PopupOperacionCobroPresentacionComponent } from '../../../../shared/components/popups/popup-operacion-cobro-presentacion/popup-operacion-cobro-presentacion.component';
import { Liquidacion } from '../../../../models/liquidacion.model';
import { PopupOperacionCobroDetalleComponent } from '../../../../shared/components/popups/popup-operacion-cobro-detalle/popup-operacion-cobro-detalle.component';
import { PopupPacienteEsperaComponent } from '../../../../shared/components/popups/popup-paciente-espera/popup-paciente-espera.component';
import { Filter } from './../../../../shared/filter';


@Component({
  selector: 'app-agenda-recepcion',
  templateUrl: './agenda-recepcion.component.html',
  styleUrls: ['./agenda-recepcion.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class AgendaRecepcionComponent implements OnInit , OnDestroy{

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
  agendaTurno:AgendaTurno[];
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
  
 
  motivo:string;
  presentes:number = 0;
  derivados:number = 0;
  asesoramiento:number = 0;
  sobreturno:number = 0;
  pendiente:number = 0;
  presente:number = 0;
  llamando:number = 0;
  espera:number = 0;
  ingresado:number = 0;
  atendido:number = 0;
   timer:any;
   subscription: any;
   _nombreyapellido: any[] = [];
   _paciente_obra_social_nombre: any[] = [];
   
   _estado: any[] = [];
   
  constructor(private documentService: DocumentService, private miServico: AgendaService,
    private messageService: MessageService , public dialogService: DialogService,
     private route: ActivatedRoute,     private router: Router, private filter: Filter ) {
 
 
    this.cols = [
      {field: 'agenda_dia_horario_atencion_id', header: 'Nº', width: '5%' }, 
    {field: 'operacion_cobro_id', header: 'OC', width: '5%' }, 
      {field: 'paciente_apellido', header: 'Apellido', width: '8%' }, 
      {field: 'paciente_nombre', header: 'Nombre', width: '8%' }, 
      {field: 'paciente_dni', header: 'Dni', width: '8%' },
      {field: 'paciente_obra_social_nombre', header: 'Obra social', width: '8%' },
      {field: 'hora_desde', header: 'Turno', width: '10%' },
      {field: 'estado', header: 'Estado', width: '8%' },
      {field: 'nombreyapellido', header: 'Medico', width: '15%' },  
      {field: 'dia_nombre', header: 'Dia', width: '8%' },
      {field: 'presente', header: 'Presente', width: '8%' },
      {field: 'llegada', header: 'Llegada', width: '8%' },
      {field: 'atendido', header: 'Ingresado' , width: '8%'},
      {field: 'es_alerta', header: '' , width: '4%'},
      {field: 'boton', header: '' , width: '4%'},
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

this.documentService
.getMessages()
.subscribe((message: string) => {
  console.log(message);
  if(message ==='llamando-agendas'){
    console.log(' invocacion llamando agendas');
 //   this.loadList();    
  }
});



this.loadList();

 this.timer = Observable.timer(60000,180000);//180000 -- 3 minutos inicia y en 3 minutos vuelve a llamar
 this.subscription = this.timer.subscribe(t =>{
  console.log('llamando turnos desde timer');
  this.loadList();
 }
 
 );

/* this.timer.subscribe(t=> {
  console.log('llamando turnos desde timer');
  this.loadList();
}); */

} 

ngOnDestroy() {
 // this.documentService.getMessages().unsubscribe();
 this.subscription.unsubscribe();
  //this.documentService.getMessages().unsus;
  console.log("destruido");
  //this.documentService.getMessages().unsubscribe();
}


actualizarFecha(event){
  console.log(event);
  this.fechaHoy = event;
  console.log(new Date(this.fechaHoy));
  this.loadList();
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

loadTurnoTodosLosEstados(){
  this.loadListTodosTurnos();
}

buscarUsuarioObraSocial(){
  
let data:any; 
const ref = this.dialogService.open(PopupMedicoComponent, {
data,
 header: 'Buscar Medico por obra social', 
 width: '60%',
 height: '90%'
});
ref.onClose.subscribe((PopupMedicoComponent : MedicoObraSocial) => {
  if (PopupMedicoComponent) {
    console.log(PopupMedicoComponent);
    this.usuario_id = PopupMedicoComponent.usuario_id;
    this.popItemMedicoObraSocial = PopupMedicoComponent;
    this.DateForm.patchValue({medico_nombre: PopupMedicoComponent.apellido +' '+  PopupMedicoComponent.nombre});
    this.popItemAgenda.usuario_id = this.popItemMedicoObraSocial.usuario_id;
    this.popItemAgenda.codigo_old = this.popItemMedicoObraSocial.codigo_old;
    this.loadListByMedico();
  }
});

}
buscarHistoriaUsuario(){
 
let data:any; 
const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
data,
 header: 'Buscar paciente', 
 width: '98%',
 height: '90%'
});

ref.onClose.subscribe((PopupPacienteObrasocialComponent:Paciente) => {
    if (PopupPacienteObrasocialComponent) {
      console.log(PopupPacienteObrasocialComponent);
     this.popItemPaciente = PopupPacienteObrasocialComponent;
     this.loadHistoriaPaciente();
    }
});


}


pacienteIngresado(event:AgendaTurno){
 // console.log(event);
  this.popItemAgenda = event;
  this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  this.popItemAgenda.llegada = this._fechaHoy;
  this.popItemAgenda.agenda_estado_id = '3';
  console.log(this.popItemAgenda);
  this.actualizarTurno();
}

pacienteAtendido(event:AgendaTurno){
  console.log(event);
  this.popItemAgenda = event;
  this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  this.popItemAgenda.atendido = this._fechaHoy;
  this.popItemAgenda.agenda_estado_id = '4';
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

verListadoEspera(){
  let data:any; 
  data = this.popItemAgenda;  
  const ref = this.dialogService.open(PopupPacienteEsperaComponent, {
  data,
   header: 'Listado de pacientes en espera', 
   width: '98%',
   height: '80%'
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

  overlaypanel.toggle(evt);
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
  this.sumarValores();
}

async editarRegistro(cond:string){
this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
console.log(cond);
this.condicion = cond;
this.popItemAgenda = this.selectedagendaTurno;
  if(cond === 'cancelado'){

    swal({
      title: 'Cancelar turno',
      text: '¿Desea cancelar el turno?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A5D6A7',
      cancelButtonColor: '#FF5733',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.popItemAgenda.agenda_estado_id = '7';
        this.popItemAgenda.atendido = this._fechaHoy;
        this.cancelarTurno();
      }
    });
   
  }
  if(cond == 'reasignar'){

    await  swal({
      title: 'Reasignar turno',
      text: '¿Desea reasignar el turno?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A5D6A7',
      cancelButtonColor: '#FF5733',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.popItemAgenda.agenda_estado_id = '7';
        this.popItemAgenda.atendido = this._fechaHoy;
         this.cancelarTurno();
      }
    });
    
   
  }

  if(cond == 'ingresado'){

    await  swal({
      title: 'Ingresar turno',
      text: '¿Desea cambiar el estado del turno a ingresdo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A5D6A7',
      cancelButtonColor: '#FF5733',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.popItemAgenda.agenda_estado_id = '3';
        this.popItemAgenda.presente = this._fechaHoy;
     //   this.popItemAgenda.puesto_llamado = this.userData['puesto'];
     //   this.popItemAgenda.puesto_estado = 'LLAMANDO'; 
      }
    });
    
   
  }

  if(cond == 'espera'){
    this.popItemAgenda.agenda_estado_id = '5';
    this.popItemAgenda.llegada = this._fechaHoy;
    this.actualizarTurno();
  }

  if(cond == 'presente'){
    this.popItemAgenda.agenda_estado_id = '2';
    this.popItemAgenda.presente = this._fechaHoy;
    this.popItemAgenda.llegada = '2099-12-31 00:00:00';
    this.popItemAgenda.atendido = '2099-12-31 00:00:00';
  }

  if(cond == 'atendido'){
    this.popItemAgenda.agenda_estado_id = '4';
    this.popItemAgenda.atendido = this._fechaHoy;
    this.popItemAgenda.puesto_estado = 'ATENDIDO';
  }

  if(cond == 'llamando'){
    this.popItemAgenda.agenda_estado_id = '9';
    this.popItemAgenda.puesto_llamado = this.userData['puesto'];
    this.popItemAgenda.puesto_estado = 'LLAMANDO';
    this.popItemAgenda.llamando = this._fechaHoy;
    this.ActualizarTurnoLlamando();
    
  }

  if(cond == 'rellamar'){
    this.popItemAgenda.agenda_estado_id = '9';
    this.popItemAgenda.puesto_llamado = this.userData['puesto'];
    this.popItemAgenda.puesto_estado = 'LLAMANDO'; 
    this.popItemAgenda.llamando = this._fechaHoy;
    this.ActualizarTurnoLlamando();
  }
  if(cond == 'ausente'){
    this.popItemAgenda.agenda_estado_id = '10';
    this.popItemAgenda.llegada = this._fechaHoy;
    this.popItemAgenda.atendido = this._fechaHoy;
    this.popItemAgenda.puesto_estado = 'ATENDIDO';
    this.actualizarTurno();
  }

  

  if(cond == 'observacion'){

    console.log('observacion');

    this.display = true;
    
  } 

  if(cond === 'paciente'){
    this.buscarPacienteConsulta();
    
  } 
  
  if(cond == 'operacioncobro'){
    console.log('ausente');
    this.router.navigate(['/recepcion/operacioncobro'], { state: { paciente: this.popItemAgenda } });
  } 

  console.log(this.popItemAgenda);
  if(cond != 'cancelado'){
  this.actualizarTurno();
  }
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
      this.miServico.getHorarioTurnoTodos(this.popItemAgenda)
      .subscribe(resp => {
        if (resp[0]) {
          this.realizarFiltroBusqueda(resp);
          this.agendaTurno = resp;
          this.elementosFiltrados = resp;
          // AL TENER LA RESPUESTA, ACTUALIZO LA CANTIDAD DE TURNOS Y LOS CALCULO
          this.sumarValores();
          console.log(this.agendaTurno);
          this.sumarPresente();
            }else{
              this.agendaTurno =null;
            }          
          this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.loading = false;
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

}



loadListTodosTurnos(){
this.es = calendarioIdioma;
this.loading = true;
this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
// console.log(this.popItemAgenda);
if(this._fechaHoy!=''){
this.popItemAgenda.fecha_turno = this._fechaHoy;    
try {
    this.miServico.getHorarioTurnoTodos(this.popItemAgenda)    
    .subscribe(resp => {
      if (resp[0]) {
        this.realizarFiltroBusqueda(resp);
        this.agendaTurno = resp;
        console.log(this.agendaTurno);
          }else{
            this.agendaTurno =null;
          }
          this.sumarPresente();
        this.loading = false;
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.loading = false;
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

}


loadHistoriaPaciente(){


try {
  
    this.miServico.getHistoriaTurno(this.popItemPaciente.id)    
    .subscribe(resp => {
      if (resp[0]) {
        this.realizarFiltroBusqueda(resp);
        this.agendaTurno = resp;
        console.log(this.agendaTurno);
        this.sumarPresente();
          }else{
            this.agendaTurno =null;
          }
     //   console.log(resp);    
        this.loading = false;
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.loading = false;
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



loadAgendaCancelada(){

this.loading = true;
try{

this.miServico.getTurnoCancelado()    
.subscribe(resp => {
  if (resp[0]) {
    this.realizarFiltroBusqueda(resp);
    this.agendaTurno = resp;
    console.log(this.agendaTurno);
      }else{
        this.agendaTurno =null;
      }
 //   console.log(resp);    
    this.loading = false;
},
error => { // error path
    console.log(error.message);
    console.log(error.status);
    this.loading = false;
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


cancelarTurno(){

this.loading = true;
try{
console.log(this.condicion);
this.miServico.cancelarTurno( this.popItemAgenda.agenda_dia_horario_atencion_id)
.subscribe(resp => {
    this.loading = false;
    if(this.condicion ==='reasignar'){
      this.router.navigate(['/recepcion/turnos'],{ state: { paciente: this.popItemAgenda } });
    }else{
      this.loadList();
    }
},
error => { // error path
    console.log(error.message);
    console.log(error.status);
    this.loading = false;
   // this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
 });    
} catch (error) {
//this.throwAlert('error','Error al cargar los registros',error);

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
      this.realizarFiltroBusqueda(resp);
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

}

ActualizarTurnoLlamando(){

  try {
    this.miServico.ActualizarTurnoLlamando(this.popItemAgenda.paciente_id,this.popItemAgenda.usuario_id, this.userData['puesto'])
    .subscribe(resp => {   
      this.realizarFiltroBusqueda(resp);
        console.log(resp);    
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

actualizarTurno(){
this.es = calendarioIdioma;
this.loading = true;

console.log(this.popItemAgenda);  
try {
    this.miServico.putItem(this.popItemAgenda, this.popItemAgenda.agenda_dia_horario_atencion_id)
    .subscribe(resp => {
        console.log(resp);    
        this.loading = false;
    this.documentService.sendMessage('llamando-recepcion');    
        this.loadList(); 
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

sumarPresente(){
  this.presentes = 0;
  this.derivados = 0;
  this.asesoramiento = 0;
  let i:number;
  this.agendaTurnos = this.agendaTurno;
  if(this.agendaTurnos){
  for(i=0;i<this.agendaTurnos.length;i++){
    if((this.agendaTurnos[i]['presente'] !== null ) &&(this.agendaTurnos[i]['presente'] !== '2099-12-31 00:00:00' ) && (this.agendaTurno[i]['llegada'] === '2099-12-31 00:00:00' )&& (this.agendaTurno[i]['estado'] !== 'LLAMANDO')&& (this.agendaTurno[i]['estado'] !== 'ATENDIDO' )){
      this.presentes = this.presentes+1;
    }

    if((this.agendaTurnos[i]['presente'] !== null ) &&(this.agendaTurnos[i]['estado'] === 'DERIVADO' )){
      this.derivados = this.derivados+1;
    }

    if((this.agendaTurnos[i]['presente'] !== null ) &&(this.agendaTurnos[i]['estado'] === 'ASESORAMIENTO' ) ){
      this.asesoramiento = this.asesoramiento+1;
    }
  }
}
  
}

generarPdf(){

const _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
console.log(this.elementos);
if(!this.elementosFiltrados){
  this.elementosFiltradosImpresion = this.agendaTurno;
} else{
  this.elementosFiltradosImpresion = this.elementosFiltrados;
}
const fecha = formatDate(this.fechaHoy, 'dd/MM/yyyy', 'en');
const doc = new jsPDF('landscape');

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

colorRow(estado:string) {

  if(estado === 'ATENDIDO') {
    return {'es-atendido'  :'null' };
  }
  if(estado === 'ATENDIDO') {
      return {'es-atendido'  :'null' };
  }
  if(estado === 'PENDIENTE') {
      return {'es-pendiente'  :'null' };
  }
  if(estado === 'AUSENTE') {
      return {'es-ausente'  :'null' };
  }
  if(estado === 'INGRESADO') {
      return {'es-ingresado'  :'null' };
  }
  if(estado === 'ESPERA') {
      return {'es-espera'  :'null' };
  }
  if(estado === 'PRESENTE') {
    return {'es-presente'  :'null' };
}
  if(estado === 'SOBRETURNO') {
    return {'es-sobreturno'  :'null' };
  }
  if(estado === 'TURNO') {
    return {'es-turno'  :'null' };
  }

  if(estado === 'DERIVADO') {
    return {'es-turno'  :'null' };
  }

  if(estado === 'ASESORAMIENTO') {
    return {'es-asesoramiento'  :'null' };
  }

  if(estado === 'CANCELADO') {
    return {'es-cancelado'  :'null' };
  }

  if(estado === 'LLAMANDO') {
    return {'es-llamando'  :'null' };
  }

}


colorString(estado:string){

  if((estado === '0') || (estado === null)) {
    return {'es-transferencia'  :'null' };
  } else {
    return {'es-tarjeta-debito'  :'null' };
  }

}



sumarValores(){
  let i:number;
  this.sobreturno = 0;
  this.pendiente = 0;
  this.presente = 0;
  this.llamando = 0;
  this.espera = 0;
  this.ingresado = 0;
  this.atendido = 0;
  let estado: string;
console.log(this.elementosFiltrados);
  for(i=0;i<this.elementosFiltrados.length;i++){
    
    
    if(this.elementosFiltrados[i]['estado']=== 'SOBRETURNO'){
      this.sobreturno++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'PENDIENTE'){
      this.pendiente++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'PRESENTE') {
      this.presente++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'LLAMANDO') {
      this.llamando++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'ESPERA')   {
      this.espera++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'INGRESADO'){
      this.ingresado++;
    }
    if(this.elementosFiltrados[i]['estado']=== 'ATENDIDO') {
      this.atendido++;
    }
    
      
  }
 
}




colorEsSobreturno(sobreturno:string, estado:string){

if((estado === 'SOBRETURNO')) {

}else{
  if((sobreturno === 'SI')) {
    return {'es-sobreturno-texto'  :'null' };
  }
}

if((estado === 'TURNO')) {
  return {'text-white'  :'null' };
}
}


realizarFiltroBusqueda(resp: any[]){
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._nombreyapellido = [];
  this._paciente_obra_social_nombre = [];  
  this._estado = [];
  resp.forEach(element => {
    this._nombreyapellido.push(element['nombreyapellido']);
    this._paciente_obra_social_nombre.push(element['paciente_obra_social_nombre']);   
   this._estado.push(element['estado']);
  });
  console.log(this._nombreyapellido);
  // ELIMINO DUPLICADOS
  this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
  console.log(this._nombreyapellido);
  this._paciente_obra_social_nombre = this.filter.filterArray(this._paciente_obra_social_nombre);  
  this._estado = this.filter.filterArray(this._estado);

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





