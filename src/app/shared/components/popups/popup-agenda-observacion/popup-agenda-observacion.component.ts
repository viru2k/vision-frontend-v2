import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { DialogService, MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AgendaService } from '../../../../services/agenda.service';
import { PacienteService } from '../../../../services/paciente.service';
import swal from 'sweetalert2';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
@Component({
  selector: 'app-popup-agenda-observacion',
  templateUrl: './popup-agenda-observacion.component.html',
  styleUrls: ['./popup-agenda-observacion.component.css']
})
export class PopupAgendaObservacionComponent implements OnInit {
  
  motivos:any[];
  estudios:any[];  
  selectedMotivo:string;
  selectedEstudio:string;
  selectedMedicoEfector:string;
  usuarios:User[];
  checked:boolean;
  observacion:string;
  motivoatencion:any[];

  constructor(private miUserServico:UserService,private miServicoPaciente:PacienteService ,private miServico:AgendaService, public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService) { 

      
    this.estudios = [
      {name: 'SIN ESTUDIOS', code: '16'},
      {name: 'ESTUDIOS COMBINADOS', code: '13'},
      {name: 'RFG + OCT', code: '14'},
      {name: 'RFG + OCT + PAQUIMETRIA', code: '15'},
      {name: 'LASER ARGON', code: '1'},
      {name: 'YAG LASER', code: '2'},
      {name: 'ECOGRAFIA', code: '3'},        
      {name: 'ECOMETRIA', code: '4'},
      {name: 'RETINOGRAFIA', code: '5'},
      {name: 'RETINOFLUORESCEINOGRAFIA', code: '6'},
      {name: 'PAQUIMETRIA', code: '7'},
      {name: 'CAMPIMETRIA COMPUTARIZADA', code: '8'},
      {name: 'OCT', code: '9'},
      {name: 'TOPOGRAFIA', code: '10'},
      {name: 'IOL MASTER', code: '11'},
      {name: 'MICROSCOPIA', code: '12'},
      
  ];

  this.motivos = [
    {name: 'SIN SELECCION', code: '5'},
    {name: 'ESTUDIOS', code: '1'},
    {name: 'CONTROL POSQUIRURGICO', code: '2'},
    {name: 'ADVERTENCIA', code: '3'},
    {name: 'CIRUGIA', code: '4'},
   
    
];

  }

  ngOnInit() {
    console.log(this.config.data);      
    this.getUsuarioMedico();
    this.selectedEstudio =  this.estudios[0];
    this.selectedMotivo =  this.motivos[5];
    
  }


  guardarObservacion(){
    let selectedMedicoEfector_:string;
    let selectedEstudio_:String;
    let selectedMotivo_:String;
    console.log(this.selectedMedicoEfector);
    if(!this.selectedMedicoEfector['nombreyapellido']){
      selectedMedicoEfector_ = '';
    }else{
      selectedMedicoEfector_ ='MEDICO:  '+ this.selectedMedicoEfector['nombreyapellido'];   
    }

    if(!this.selectedEstudio['name']){
      selectedEstudio_ = '';
    }else{
      selectedEstudio_ ='ESTUDIO: '+ this.selectedEstudio['name'];     
    }

    if(!this.selectedMotivo['name']){
      selectedMotivo_ = '';
    }else{
      selectedMotivo_ = this.selectedMotivo['name'];     
    }

    
    
    this.motivoatencion = [];
    this.motivoatencion.push(selectedEstudio_);
    this.motivoatencion.push(selectedMedicoEfector_);
    this.motivoatencion.push(this.checked);
    this.motivoatencion.push(this.observacion);
    this.motivoatencion.push(selectedMotivo_);
    this.ref.close(this.motivoatencion);
  }

  getUsuarioMedico(){
    
    try {
        this.miUserServico.getItems()    
        .subscribe(resp => {
        this.usuarios = resp;                             
            console.log(resp);
            this.selectedMedicoEfector = resp[0]['nombreyapellido'] ;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros de médico',error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  

  }


  throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
    let tipoerror:string;
  
    if(estado== 'success'){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
  
  
    if(estado== 'warning'){
      swal({
          type: 'warning',
          title: 'Faltan datos',
          text: mensaje
        })
  }
  
    if(estado== 'error'){
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
