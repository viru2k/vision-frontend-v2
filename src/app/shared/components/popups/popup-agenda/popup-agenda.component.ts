import { PopupTurnoUsuarioObraSocialComponent } from './../../../../pages/recepcion/agenda/turno/popup-turno-usuario-obra-social/popup-turno-usuario-obra-social.component';
import { DialogService, MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { formatDate, DatePipe } from '@angular/common';
import { AgendaTurno } from './../../../../models/agenda-turno.model';
import { AgendaService } from './../../../../services/agenda.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { calendarioIdioma } from '../../../../config/config';
import { Agenda } from '../../../../models/agenda.model';

import swal from 'sweetalert2';


@Component({
  selector: 'app-popup-agenda',
  templateUrl: './popup-agenda.component.html',
  styleUrls: ['./popup-agenda.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class PopupAgendaComponent implements OnInit {

    cols: any[];
    selectedItem: Agenda;
    es:any;
    // LOADING
    DateForm:FormGroup;
    loading: boolean;
    elemento:Agenda = null;
    elementos:Agenda[] = null;
    fechaHoy:Date;
    fecha:Date;
    _fechaHoy:string;
    usuario_id:string;
    busqueda: any[];
    pacienteForm: FormGroup;
    colsAgenda:any;
    popItemAgenda:AgendaTurno;
    popItemMedicoObraSocial:MedicoObraSocial;
    agendaTurno:AgendaTurno[] = [];
  
    constructor(private miServico:AgendaService, private messageService: MessageService ,public dialogService: DialogService,  public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
     
      this.colsAgenda = [
          
          {field: 'paciente_apellido', header: 'Apellido' }, 
          {field: 'paciente_nombre', header: 'Nombre' }, 
          {field: 'paciente_dni', header: 'Dni' },
          {field: 'paciente_obra_social_nombre', header: 'Obra social' },
          {field: 'hora_desde', header: 'Turno' },
          {field: 'estado', header: 'Estado' },
          {field: 'nombreyapellido', header: 'Medico' },
          {field: 'dia_nombre', header: 'Dia' },
          {field: 'llegada', header: 'Llegada' },
          {field: 'atendido', header: 'Ingresado' },
          {field: 'boton', header: '' },
          ];
       this.busqueda = [
          {label:'Seleccione una busqueda', value:null},
          {label:'Fecha', value:{id:1, name: 'New York', code: 'FE'}},
          {label:'Médico', value:{id:2, name: 'Rome', code: 'MD'}}
          
      ];
   
      this.DateForm = new FormGroup({
          'fechaHoy': new FormControl('', Validators.required), 
          'medico_nombre': new FormControl('')
          });
    this.popItemAgenda = new AgendaTurno('',new Date(),new Date(), new Date(),'','', '','', '','','','','','','','','','','','','','','','','','','','','',new Date(),'','','','','', '','','','','','','','','');
    }
  
    ngOnInit() {
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
  
    loadTurnoTodosLosEstados(){}
  
    buscarUsuarioObraSocial(){
      
    let data:any; 
    const ref = this.dialogService.open(PopupTurnoUsuarioObraSocialComponent, {
    data,
     header: 'Buscar Medico por obra social', 
     width: '60%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupTurnoUsuarioObraSocialComponent:MedicoObraSocial) => {
      if (PopupTurnoUsuarioObraSocialComponent) {
        console.log(PopupTurnoUsuarioObraSocialComponent);
        this.usuario_id = PopupTurnoUsuarioObraSocialComponent.usuario_id;
        this.popItemMedicoObraSocial = PopupTurnoUsuarioObraSocialComponent;
        this.DateForm.patchValue({medico_nombre: PopupTurnoUsuarioObraSocialComponent.apellido +" "+  PopupTurnoUsuarioObraSocialComponent.nombre});
        this.popItemAgenda.usuario_id = this.popItemMedicoObraSocial.usuario_id;
        this.loadListByMedico();
      }
  });
  
    }
  
    selectedPaciente(event:AgendaTurno){
        // console.log(event);
         this.popItemAgenda = event;
         this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd HH:mm:ss', 'en');        
         this.popItemAgenda.llegada = this._fechaHoy;
         this.popItemAgenda.agenda_estado_id = "5";
         console.log(this.popItemAgenda);
         this.actualizarTurno();
       }
  
    
  
    loadList(){
      this.es = calendarioIdioma;
      this.loading = true;
      this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
   // console.log(this.popItemAgenda);
   if(this._fechaHoy!=''){
      this.popItemAgenda.fecha_turno = this._fechaHoy;    
      try {
          this.miServico.getHorarioTurno(this.popItemAgenda)    
          .subscribe(resp => {
          this.agendaTurno = resp;
           //   console.log(resp);    
              this.loading = false;
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
           });    
      } catch (error) {
      this.throwAlert("error","Error al cargar los registros",error);
      }  
    } 
  
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
        this.agendaTurno = resp;
         //   console.log(resp);    
            this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
         });    
    } catch (error) {
    this.throwAlert("error","Error al cargar los registros",error);
    }  
  } 
  
  }
  
  
  
  actualizarTurno(){
    this.es = calendarioIdioma;
    this.loading = true;
  
    console.log(this.popItemAgenda);  
    this.ref.close(this.popItemAgenda);
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
  
  throwAlert(estado:string, mensaje:string, motivo:string){
    if(estado== "success"){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
    if(estado== "error"){
        swal({
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: motivo
          })
    }
  }
  }
  
  
  
  
  
  