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
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';


//import { ExcelService } from './../../../../services/excel.service';
import { LiquidacionService } from '../../../../services/liquidacion.service';
import { Table } from 'primeng/table';
import { Filter } from './../../../../shared/filter';
import { Liquidacion } from './../../../../models/liquidacion.model';
import { PopupOperacionCobroDetalleComponent } from './../../../../shared/components/popups/popup-operacion-cobro-detalle/popup-operacion-cobro-detalle.component';


@Component({
  selector: 'app-agenda-consulta',
  templateUrl: './agenda-consulta.component.html',
  styleUrls: ['./agenda-consulta.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class AgendaConsultaComponent implements OnInit {

  cols: any[];
  selectedItem: Agenda;
  es:any;
  display:boolean;
  observacion:string;
  // LOADING
  DateForm:FormGroup;
  DateForm1:FormGroup;
  loading: boolean;
  elemento:AgendaTurno = null;
  elementos:Agenda[] = null;
  elementosFiltrados:AgendaTurno[] = [];
  elementosFiltradosImpresion:AgendaTurno[] = [];
  fechaHoy:Date;
  _fechaHoy:string;
  fecha:Date;
  selecteditems:any[] = [];
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
  columns:any;
  userData:any;
  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;
 
  motivo:string;

  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;

  sobreturno:number = 0;
  pendiente:number = 0;
  presente:number = 0;
  llamando:number = 0;
  espera:number = 0;
  ingresado:number = 0;
  atendido:number = 0;
  // VARIABLES PARA FILTRAR
  _nombreyapellido: any[] = [];
  _paciente_obra_social_nombre: any[] = [];
  _dia_nombre: any[] = [];
  _estado: any[] = [];

  @ViewChild('dt', {static: false}) table: Table;

  constructor(private liquidacionService:LiquidacionService , private miServico:AgendaService, private messageService: MessageService ,
    public dialogService: DialogService,  private route: ActivatedRoute,     private router: Router, private filter: Filter ) {
   
    this.cols = [
        {field: 'operacion_cobro_id', header: 'OC', width: '5%' }, 
        {field: 'paciente_apellido', header: 'Apellido', width: '8%' }, 
        {field: 'paciente_nombre', header: 'Nombre', width: '8%' },         
        {field: 'paciente_dni', header: 'DNI', width: '6%' },         
        {field: 'paciente_obra_social_nombre', header: 'Obra social', width: '16%' },
        {field: 'nombreyapellido', header: 'Médico', width: '8%' },
        {field: 'fecha_turno', header: 'Fecha', width: '8%' },
        {field: 'hora_desde', header: 'Turno', width: '10%' },
        {field: 'llegada', header: 'Llegada', width: '7%' },
        {field: 'atendido', header: 'Ingresado' , width: '7%'},
        {field: 'estado', header: 'Estado', width: '8%' },        
        {field: 'dia_nombre', header: 'Dia', width: '8%' },
        {field: 'usuario_alta', header: 'Generó', width: '8%' },
        {field: 'agenda_creacion', header: 'Creado', width: '8%' },
        {field: 'es_alerta', header: '' , width: '4%'},
        {field: 'boton', header: '' , width: '4%'},
        ];
     this.busqueda = [
        {label:'Seleccione una busqueda', value:null},
        {label:'Fecha', value:{id:1, name: 'New York', code: 'FE'}},
        {label:'Médico', value:{id:2, name: 'Rome', code: 'MD'}}
        
    ];
 
        
    this.columns = [
      {title: 'Apellido', dataKey: 'paciente_apellido'},
      {title: 'Nombre', dataKey: 'paciente_nombre'},
      {title: 'DNI', dataKey: 'paciente_dni'},
      {title: 'Celular', dataKey: 'telefono_cel'},
      {title: 'Obra social', dataKey: 'paciente_obra_social_nombre'},       
      {title: 'Medico', dataKey: 'nombreyapellido'},
      {title: 'Turno', dataKey: 'hora_desde'},
      {title: 'Estado', dataKey: 'estado'},
      {title: 'Dia', dataKey: 'dia_nombre'}, 
      {title: 'Generó', dataKey: 'usuario_alta'}
    ];

    this.DateForm1 = new FormGroup({
      'fecha_desde': new FormControl('', Validators.required), 
      'fecha_hasta': new FormControl('', Validators.required), 
      'presentacion_nro': new FormControl(''), 
      'obra_social_nombre': new FormControl('') ,
      'obra_social_id': new FormControl('') 
      });
  
    this.DateForm = new FormGroup({
        'fechaHoy': new FormControl('', Validators.required), 
        'medico_nombre': new FormControl('')
        });
  this.popItemAgenda = new AgendaTurno('',new Date(),new Date(), new Date(), '','', '', '', '','','','','','','','','','','','','','','','','','','','','',new Date(),'','','', '', '', '','','','','','','','','');
  
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.fechaHoy = new Date();
    this.fechaDesde = new Date();        
    this.fechaHasta = new Date();
    this.fecha = new Date();
    this.pacienteForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'dni': new FormControl('', Validators.required),     
  });
  this.DateForm.patchValue({fechaHoy: this.fechaHoy});
  this.loadListByMedico();

  }

  ngOnDestroy() {
   
  }

  onnombreyapellidoChange(event) {
    debugger;
    console.log(event);
    this.table.filter(event.value, 'nombreyapellido', 'in');
}

  

  actualizarFecha(event){
    console.log(event);
    this.fechaHoy = event;
    console.log(new Date(this.fechaHoy));
    this.loadListByMedico();
  }

  actualizarBusqueda(event){
      console.log(event);
  }
  
  loadTurno(){
    this.loadListByMedico();
  }

  

  loadTurnoTodosLosEstados(){}

  buscarUsuarioObraSocial(){
    
  let data:any; 
  const ref = this.dialogService.open(PopupMedicoComponent, {
  data,
   header: 'Buscar médico por obra social', 
   width: '60%',
   height: '90%'
  });
  ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
    if (PopupMedicoComponent) {
      console.log(PopupMedicoComponent);
      this.usuario_id = PopupMedicoComponent.usuario_id;
      this.popItemMedicoObraSocial = PopupMedicoComponent;
      this.DateForm.patchValue({medico_nombre: PopupMedicoComponent.apellido +' '+  PopupMedicoComponent.nombre});
      this.popItemAgenda.usuario_id = this.popItemMedicoObraSocial.usuario_id;
      this.loadListByMedico();
    }
});

  }

  
  verMotivo(evt:any,overlaypanel:OverlayPanel,event:AgendaTurno){    
    if(event){
      this.selectedagendaTurno = event;
        this.motivo = event.es_observacion;
        this.observacion = event.observacion;        
    }
    this.display = true;
  }
  pacienteIngresado(event:AgendaTurno){
   // console.log(event);
    this.popItemAgenda = event;
    this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');        
    this.popItemAgenda.atendido = this._fechaHoy;
    this.popItemAgenda.agenda_estado_id = '3';
    console.log(this.popItemAgenda);
    this.actualizarTurno();
  }

  pacienteAtendido(event:AgendaTurno){
    console.log(event);
    this.popItemAgenda = event;
    this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');    
    swal({
      title: '¿Desea dar atendido al paciente?',
      text: 'Va a eliminar un registro',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#A5D6A7',
      cancelButtonColor: '#F9A825',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.popItemAgenda.agenda_estado_id = '4';
        this.actualizarTurno();
      }
    });

  }

   
exportarExcel(){
let result = this.elementosFiltrados as any;
if (this.selecteditems.length >0) {
          this.liquidacionService.exportAsExcelFile(  this.selecteditems, 'listado_agenda');
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


public exportarExcelDetallado(){
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');  
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
    seleccionados['operacion_cobro_id'] = element['operacion_cobro_id'];
    seleccionados['fecha_cobro'] = element['fecha_turno'] ;
    seleccionados['apellido'] = element.paciente_apellido;
    seleccionados['nombre'] = element.paciente_nombre;
    seleccionados['dni'] = element.paciente_dni;
    seleccionados['obra_social_nombre'] = element['paciente_obra_social_nombre'] ;
    seleccionados['descripcion'] = '';
    seleccionados['medico_nombre'] = element['nombreyapellido'];
    seleccionados['forma_pago'] = '';
    seleccionados['cantidad'] = 1;
    seleccionados['valor_facturado'] = element['total_operacion_cobro'];
   // exportar.push(seleccionados);
   exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
//  console.log(exportar);
  this.liquidacionService.exportAsExcelFile(  exportar, 'listado_presentacion_detallado'+fecha_impresion);
}

    
  accion(evt:any,overlaypanel:OverlayPanel,event:AgendaTurno){
    if(event){
      this.selectedagendaTurno = event;
      this.observacion = event.observacion;
    }
    console.log(event);

    overlaypanel.toggle(evt);
  }
  
  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;     
    this.sumarValores() ;
}

async editarRegistro(cond:string){
  console.log(cond);
  this.popItemAgenda = this.selectedagendaTurno;
    if(cond == 'historia'){
    // navegar a historia clinica
    this.router.navigate(['/medico/historiaclinica'], { state: { paciente: this.popItemAgenda } });
    }
    if(cond == 'turno'){
      this.popItemAgenda.agenda_estado_id = '7';
     //await  this.actualizarTurno();
     this.router.navigate(['/recepcion/turnos'], { state: { paciente: this.popItemAgenda } });
    }    

    if(cond == 'observacion'){
      console.log('observacion');
      this.display = true;
      
    } 
  
    this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    this.popItemAgenda.atendido = this._fechaHoy;
   
    console.log(this.popItemAgenda);
   // this.actualizarTurno();
}



guardarObservacion(){
  console.log(this.observacion);
  if(this.observacion ===undefined){    
    this.popItemAgenda.observacion = '-';
  }
 this.popItemAgenda.observacion = this.observacion; 
  this.actualizarTurno();
  this.display = false;
}

darSobreTurno(){
  this.router.navigate(['/recepcion/turnos'],{ state: { paciente: this.popItemAgenda } });
}

loadListByMedico(){
  let userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
 console.log(userData['id']);
if(this._fechaHoy!=''){
  this.popItemAgenda.fecha_turno = this._fechaHoy;     
  this.popItemAgenda.usuario_id = userData['id']; 
  try {
      this.miServico.getHorarioTurnoTodosSinEstado(this.popItemAgenda)
      .subscribe(resp => {
      
       
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
          this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
       });    
  } catch (error) {
  this.throwAlert('error','Error al cargar los registros',error);
  }  
} 

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


loadListByDates(){

  this.es = calendarioIdioma;
  this.loading = true;
  let td = formatDate(this.fechaDesde, 'dd/MM/yyyy HH:mm', 'en');  
  let th = formatDate(this.fechaHasta, 'dd/MM/yyyy HH:mm', 'en');


  try {
      this.miServico.getHorarioTurnoTodosSinEstadoByDates(td, th)
      .subscribe(resp => {
      //  console.log(resp);
      
      if (resp[0]) {
        this.realizarFiltroBusqueda(resp);
          this.agendaTurno = resp;
          console.log(this.agendaTurno);
          this.elementosFiltrados = resp;
          this.sumarValores();
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


loadListByDatesOC(){

  this.es = calendarioIdioma;
  this.loading = true;
  let td = formatDate(this.fechaDesde, 'dd/MM/yyyy HH:mm', 'en');  
  let th = formatDate(this.fechaHasta, 'dd/MM/yyyy HH:mm', 'en');


  try {
      this.miServico.getHorarioTurnoTodosSinEstadoByDatesGerencia(td, th)
      .subscribe(resp => {
      //  console.log(resp);
      
      if (resp[0]) {
        this.realizarFiltroBusqueda(resp);
          this.agendaTurno = resp;
          console.log(this.agendaTurno);
          this.elementosFiltrados = resp;
          this.sumarValores();
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



loadListTodosTurnos(){
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
// console.log(this.popItemAgenda);
if(this._fechaHoy!=''){
  this.popItemAgenda.fecha_turno = this._fechaHoy;    
  try {
      this.miServico.getHorarioTurnoMedicoSinEstado(this.popItemAgenda)    
      .subscribe(resp => {
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
          this.loading = false;
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
          this.loadListByMedico(); 
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
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('Agenda de pacientes', pageWidth/2, 20, null, null, 'center');
  doc.text('Emitido : '+_fechaEmision, pageWidth/2, 24, null, null, 'center');
  doc.setFontSize(8);
  doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);


   doc.autoTable(this.columns, this.elementosFiltradosImpresion,
      {
        margin: {horizontal: 5, vertical: 35},    
        bodyStyles: {valign: 'top'},
        styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
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

    if(estado == 'SOBRETURNO') {  
      return {'es-sobreturno'  :'null' };
    }
    if(estado == 'CANCELADO') {  
      return {'es-cancelado'  :'null' };
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
  let estado:string;
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



realizarFiltroBusqueda(resp: any[]){
        // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
        this._nombreyapellido = [];
        this._paciente_obra_social_nombre = [];
        this._dia_nombre = [];
        this._estado = [];
        resp.forEach(element => {
          this._nombreyapellido.push(element['nombreyapellido']);
          this._paciente_obra_social_nombre.push(element['paciente_obra_social_nombre']);
         this._dia_nombre.push(element['dia_nombre']);
         this._estado.push(element['estado']);
        });
        console.log(this._nombreyapellido);
        // ELIMINO DUPLICADOS
        this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
        console.log(this._nombreyapellido);
        this._paciente_obra_social_nombre = this.filter.filterArray(this._paciente_obra_social_nombre);
        this._dia_nombre = this.filter.filterArray(this._dia_nombre);
        this._estado = this.filter.filterArray(this._estado);
  
}


colorString(estado:string){
  
  if((estado === '0')||(estado === null)) {
    return {'es-transferencia'  :'null' };
  }else{
    return {'es-tarjeta-debito'  :'null' };
  }

}


 onmyChange(event) {
  //debugger;
  console.log(event.itemValue.value);
  //this.table.filter(event.itemValue.value, 'nombreyapellido', 'in');
  this.table.filter(event.itemValue.value, this.agendaTurno['nombreyapellido'],  'in');
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





