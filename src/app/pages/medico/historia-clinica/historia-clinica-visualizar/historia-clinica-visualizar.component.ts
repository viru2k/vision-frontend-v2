
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { DatePipe, formatDate } from '@angular/common';

import { FormControl, Validators, FormGroup, Form } from '@angular/forms';


import swal from 'sweetalert2';
import { MedicoObraSocial } from '../../../../models/medico-obrasocial.model';
import { PopupMedicoComponent } from '../../../../shared/components/popups/popup-medico/popup-medico.component';
import { Paciente } from '../../../../models/paciente.model';
import { PopupPacienteObrasocialComponent } from '../../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { AgendaTurno } from '../../../../models/agenda-turno.model';
import { MedicoService } from '../../../../services/medico.service';
import { PopupEstudiosImagenComponent } from '../../../../shared/components/popups/popup-estudios-imagen/popup-estudios-imagen.component';

@Component({
  selector: 'app-historia-clinica-visualizar',
  templateUrl: './historia-clinica-visualizar.component.html',
  styleUrls: ['./historia-clinica-visualizar.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class HistoriaClinicaVisualizarComponent implements OnInit {

  fechaHoy:Date;
  _fechaHoy:string;
  cols:any;
  popItem:HistoriaClinica;
  newPopItem: boolean;
  resultSave:boolean;
  es:any;
  displayDialog: boolean;
  // LOADING
  loading: boolean;
  val1: number;
  popItemHistoriaClinica:HistoriaClinica;
  elemento:HistoriaClinica;
  elementos:HistoriaClinica[];
  paciente:AgendaTurno = null;
  selecteditems:HistoriaClinica[] = [];
  selectedItem: HistoriaClinica;
  elementosFiltrados:HistoriaClinica[] = null;
  edad:number;
  popItemPaciente:Paciente;
  formPaciente:FormGroup;
  existe:boolean;
  condicion:string;
  selectedHistoriaClinica:HistoriaClinica;
  popItemAgenda:AgendaTurno;
  
  constructor(private miServico:MedicoService,private router: Router,private messageService: MessageService ,public dialogService: DialogService ) {
    if(this.router.getCurrentNavigation().extras.state != undefined){
      console.log(this.router.getCurrentNavigation().extras.state.paciente);
      // si es llamado desde la agenda del paciente busco los datos
      this.paciente = this.router.getCurrentNavigation().extras.state.paciente;
      console.log(this.paciente);
      //this.formPaciente.patchValue(this.popItemPaciente); 
      
    }

    this.cols = [
      
      { field: 'accion', header: 'Accion' , width: '4%'} ,
      { field: 'FECHA', header: 'Fecha',  width: '10%' },
      { field: 'MEDICONOM', header: 'Médico',  width: '15%' },
      {field: 'MC', header: 'Motivo' , width: '25%' },
      { field: 'OBSERVACIO', header: 'Observación' , width: '25%'},      
      { field: 'SINTOMAS', header: 'Sintomas' , width: '30%'}   
      
   ];

   this.formPaciente = new FormGroup({
    
    'edad': new FormControl('', Validators.required),
    'numero_afiliado': new FormControl('', Validators.required),
    'plan': new FormControl('', Validators.required),
    'dni': new FormControl('', Validators.required),  
    'domicilio': new FormControl('', Validators.required),  
    'paciente_id': new FormControl('', Validators.required),
    'paciente_nombre': new FormControl('', Validators.required),
    'paciente_apellido': new FormControl('', Validators.required),
    'obra_social_nombre': new FormControl('', Validators.required),
    'NUMERO': new FormControl('', Validators.required),
    'PACIENTE': new FormControl('', Validators.required),
    'FECHA': new FormControl('', Validators.required),
    'MC': new FormControl('', Validators.required),
    'AEA': new FormControl('', Validators.required),
    'APP': new FormControl('', Validators.required),
    'AF': new FormControl('', Validators.required),
    'BIO': new FormControl('', Validators.required),
    'COMENTARIO': new FormControl('', Validators.required),
    'FO': new FormControl('', Validators.required),
    'CVC': new FormControl('', Validators.required),
    'OBSERVACIO': new FormControl('', Validators.required),
    'SINTOMAS': new FormControl('', Validators.required),
    'TRATAMIENT': new FormControl('', Validators.required),
    'medico_nombre': new FormControl('', Validators.required),
    'medico_id': new FormControl('0', Validators.required),
    'nombreyapellido': new FormControl('', Validators.required),    
    'usuario_id': new FormControl('', Validators.required),
    'DIAGNOSTIC': new FormControl('', Validators.required),
    'REFRACCION_OD': new FormControl('', Validators.required),
    'REFRACCION_OI': new FormControl('', Validators.required),
    'CICLOPEGIA_OD': new FormControl('', Validators.required),
    'CICLOPEGIA_OI': new FormControl('', Validators.required),
    'PIO_OD': new FormControl('', Validators.required),
    'PIO_OI': new FormControl('', Validators.required),
    'BIO_OD': new FormControl('', Validators.required),
    'BIO_OI': new FormControl('', Validators.required),
    'SINTOMAS_SIGNOS': new FormControl('', Validators.required),
    'FONDO_OD': new FormControl('', Validators.required),
    'FONDO_OI': new FormControl('', Validators.required),
    'DIAGNOSTICO_OD': new FormControl('', Validators.required),
    'DIAGNOSTICO_OI': new FormControl('', Validators.required),
    'TRATAMIENTO_MEDICO': new FormControl('', Validators.required),
    'TRATAMIENTO_QUIRURGICO': new FormControl('', Validators.required),
    'obra_social_id': new FormControl('', Validators.required),    
    'barra_afiliado': new FormControl('', Validators.required),
    'historia_clinica': new FormControl([], Validators.required),
    'ESTUDIOSES': new FormControl('', Validators.required),
    
    });
  }

  ngOnInit() {
    if(this.paciente != null){
      this.formPaciente.patchValue({paciente_nombre: this.paciente.paciente_apellido + ' '+this.paciente.paciente_nombre});   
      this.formPaciente.patchValue({paciente_id:this.paciente.id});
      this.formPaciente.patchValue({obra_social_nombre:this.paciente.paciente_obra_social_nombre});
      this.edad =(new Date()).getFullYear() - (new Date(this.paciente.paciente_fecha_nacimiento)).getFullYear();
      this.formPaciente.patchValue({edad: this.edad});
    this.loadhistoriaClinica();
    }else{ //10029750
      this.paciente = new AgendaTurno('',new Date(), new Date(), new Date(),'','','','','','','','','','','','','','','888888','' ,'','','','','','','','','', new Date(),'','','', '','', '','','','','','','','','');
    //  this.historiaClinica();
    }
  }

  derivar(){}

buscarPaciente(){

  let data:any; 
  const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
  data,
   header: 'Buscar paciente', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteObrasocialComponent: Paciente) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);
       this.popItemPaciente = PopupPacienteObrasocialComponent;
       this.formPaciente.patchValue(this.popItemPaciente); 
       this.formPaciente.patchValue({paciente_nombre: this.popItemPaciente.apellido + ' '+this.popItemPaciente.nombre});   
       this.formPaciente.patchValue({paciente_id:this.popItemPaciente.id});
       this.formPaciente.patchValue({PACIENTE:this.popItemPaciente.dni});
       this.formPaciente.patchValue({obra_social:this.popItemPaciente.obra_social_nombre});
       this.edad =(new Date()).getFullYear() - (new Date(this.popItemPaciente.fecha_nacimiento)).getFullYear();
       this.formPaciente.patchValue({edad: this.edad});
       this.paciente = this.formPaciente.value;
       this.paciente.paciente_dni=   this.formPaciente.value.PACIENTE;
       console.log( this.paciente);
      
      this.loadhistoriaClinica();
      }
  });

}
 
buscarMedico(){

  let data:any; 
  const ref = this.dialogService.open(PopupMedicoComponent, {
  data,
   header: 'Buscar médico', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupMedicoComponent: MedicoObraSocial) => {
      if (PopupMedicoComponent) {
        console.log(PopupMedicoComponent);
        this.formPaciente.patchValue({medico_nombre: PopupMedicoComponent.apellido+' '+PopupMedicoComponent.nombre});
        this.formPaciente.patchValue({medico_id: PopupMedicoComponent.usuario_id});
        this.formPaciente.patchValue({MEDICO: PopupMedicoComponent.codigo_old});
   /*    this.popItemPaciente = PopupPacienteObrasocialComponent;
       this.formPaciente.patchValue(this.popItemPaciente); 
       this.formPaciente.patchValue({paciente_nombre: this.popItemPaciente.apellido + ' '+this.popItemPaciente.nombre});   
       this.formPaciente.patchValue({paciente_id:this.popItemPaciente.id});
       this.formPaciente.patchValue({PACIENTE:this.popItemPaciente.dni});
       this.formPaciente.patchValue({obra_social:this.popItemPaciente.obra_social_nombre});
       this.edad =(new Date()).getFullYear() - (new Date(this.popItemPaciente.fecha_nacimiento)).getFullYear();
       this.formPaciente.patchValue({edad: this.edad});
       this.paciente = this.formPaciente.value;
       this.paciente.paciente_dni=   this.formPaciente.value.PACIENTE;
       console.log( this.paciente);*/
      
     // this.loadhistoriaClinica();
      }
  });

}


verEstudios(estudio_id:string){

  let data:any; 
  data =  estudio_id;
  const ref = this.dialogService.open(PopupEstudiosImagenComponent, {
  data,
   header: 'Estudios', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupEstudiosImagenComponent: Paciente) => {
      if (PopupEstudiosImagenComponent) {
        console.log(PopupEstudiosImagenComponent);
    
      }
  });

}

  
loadhistoriaClinica(){ 
  this.loading = true; 
  try { 
      this.miServico.getHistoriaClinicaByPaciente(this.paciente.paciente_dni)
      .subscribe(resp => {
      this.elementos = resp;
      console.log(resp);      
      
      
      this.loading = false;
      //this.loadList();
      //this.resultSave = true;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
     //     this.resultSave = false;
          this.loading = false;
        });    
  } catch (error) {
    this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
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
