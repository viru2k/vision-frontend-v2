import { ConvenioService } from './../../../../services/convenio.service';
import { DynamicDialogConfig, MessageService, DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from './../../../../config/config';
import { DatePipe, formatDate } from '@angular/common';
import { Paciente } from '../../../../models/paciente.model';
import { PracticaDistribucionRegistro } from '../../../../models/practica-distribucion-registro.model';
import { Medico } from '../../../../models/medico.model';
import { ObraSocial } from '../../../../models/obra-social.model';
import { PopupPacienteObrasocialComponent } from '../popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import swal from 'sweetalert2';
import { PopupObraSocialComponent } from '../popup-obra-social/popup-obra-social.component';
import { PopupMedicoComponent } from '../popup-medico/popup-medico.component';
import { MedicoObraSocial } from '../../../../models/medico-obrasocial.model';
import { PopupConvenioComponent } from '../popup-convenio/popup-convenio.component';
import { Convenio } from '../../../../models/convenio.model';
import { PracticaService } from '../../../../services/practica.service';
import { PopupPacienteConsultaComponent } from '../popup-paciente-consulta/popup-paciente-consulta.component';

@Component({
  selector: 'app-popup-operacion-cobro-editar',
  templateUrl: './popup-operacion-cobro-editar.component.html',
  styleUrls: ['./popup-operacion-cobro-editar.component.css']
})
export class PopupOperacionCobroEditarComponent implements OnInit {

  es:any;
  formasPago:any[];
  updateDataForm:FormGroup;
  forma_pago:string ;
  _fechaHoy:string;
  popItemPaciente:Paciente;
  popItemPractica:Convenio;
  popItemMedico:MedicoObraSocial;
  popItemObraSocial:ObraSocial;
  selectedForma:string;

  constructor(public config: DynamicDialogConfig,private miServicio:PracticaService ,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {

   this.es = calendarioIdioma;

  this.updateDataForm = new FormGroup({
    'operacion_cobro_estado': new FormControl('', Validators.required),
    'operacion_cobro_fecha_cobro': new FormControl(),
    'operacion_cobro_id': new FormControl(),
    'operacion_cobro_liquidacion_numero': new FormControl(),
    'operacion_cobro_numero_bono': new FormControl(),
    'operacion_cobro_total_operacion_cobro': new FormControl({value: 0,disabled: true}),
    'operacion_cobro_obra_social_id': new FormControl(0),
    'operacion_cobro_obra_social_nombre': new FormControl(''),
    'operacion_cobro_total_coseguro': new FormControl(''),    
    'operacion_cobro_total_honorarios_medicos': new FormControl(''),
    'operacion_cobro_total_facturado': new FormControl(''),
    'operacion_cobro_total_otros': new FormControl(''),
    'paciente_id': new FormControl(''),    
    'operacion_cobro_paciente_nombre': new FormControl(''), 
    'operacion_cobro_es_anulado': new FormControl('NO'), 
    'operacion_cobro_observacion': new FormControl(''), 

  });

  this.formasPago = [
    {name: 'TRANSFERENCIA', code: '1'},
    {name: 'EFECTIVO', code: '2'},
    {name: 'TARJETA - CREDITO', code: '3'},        
    {name: 'TARJETA - DEBITO', code: '4'},        
    {name: 'CHEQUE', code: '5'},
    {name: 'VARIOS', code: '6'},
];

  }

  ngOnInit() {
  // this._fechaHoy = formatDate(this.updateDataForm.value.fecha_cobro, 'yyyy-MM-dd', 'en');
    console.log(this.config.data); 
    let _fecha:Date = new Date(this.config.data.operacion_cobro_fecha_cobro);
    let dateFix = new Date(_fecha);//.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
    console.log(dateFix);
    this.config.data.operacion_cobro_fecha_cobro = dateFix;
    this.updateDataForm.patchValue(this.config.data);
    
 //   this.updateDataForm.patchValue({fecha_cobro: this._fechaHoy});
    console.log(this.updateDataForm.value);
    

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
          this.popItemPaciente = PopupPacienteObrasocialComponent;
          console.log(this.popItemPaciente);
          this.updateDataForm.patchValue({paciente_id: PopupPacienteObrasocialComponent.id})
          this.updateDataForm.patchValue({operacion_cobro_paciente_nombre: PopupPacienteObrasocialComponent.apellido+' '+PopupPacienteObrasocialComponent.nombre});

          console.log(this.updateDataForm.value);
        }
    });
  }

  buscarObraSocial(){
    let data:any; 
    const ref = this.dialogService.open(PopupObraSocialComponent, {
    data,
     header: 'Buscar Practica', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
        if (PopupObraSocialComponent) {

          this.popItemObraSocial = PopupObraSocialComponent;
          console.log(this.popItemObraSocial);
          this.updateDataForm.patchValue({operacion_cobro_obra_social_nombre: PopupObraSocialComponent.nombre});
          this.updateDataForm.patchValue({operacion_cobro_obra_social_id: PopupObraSocialComponent.id});
        }
    });

  }


  
  editarPaciente(){
    
    let data:any; 
    data = this.updateDataForm.value;
    const ref = this.dialogService.open(PopupPacienteConsultaComponent, {
    data,
     header: 'Buscar paciente', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupPacienteConsultaComponent:Paciente) => {
        if (PopupPacienteObrasocialComponent) {         
          this.popItemPaciente = PopupPacienteConsultaComponent;
          console.log(this.popItemPaciente);
          this.updateDataForm.patchValue({paciente_id: PopupPacienteConsultaComponent.id})
          this.updateDataForm.patchValue({operacion_cobro_paciente_nombre: PopupPacienteConsultaComponent.apellido+' '+PopupPacienteConsultaComponent.nombre});

          console.log(this.updateDataForm.value);
        }
    });
  }

  actualizarFecha(event){

    let _fecha:Date = new Date(event);
    let dateFix = new Date(_fecha);//.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
    console.log(dateFix);
    this.config.data.operacion_cobro_fecha_cobro = dateFix;
    this.updateDataForm.patchValue(this.config.data);

/*
    console.log(event);
    this.fechaHoy = event;
    this._fechaHoy = formatDate(new Date(this.fechaHoy), 'yyyy-MM-dd HH:mm', 'es-AR');
    console.log(new Date(this.fechaHoy));*/
  }

  actualizarDatos(){

    console.log(this.updateDataForm.value);

    try {
      this.miServicio.putOperacionCobro(this.updateDataForm.value,this.updateDataForm.value.id)    
      .subscribe(resp => {
        this.throwAlert('success','Se modificó el registro con éxito','','');
        console.log(resp);
        this.ref.close();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
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
  
    if(errorNumero =='422'){
      mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
      swal({   
          type: 'warning',
          title: 'Atención..',
          text: mensaje,
          footer: motivo
        })
  }
  
  if(errorNumero =='99'){
    mensaje ='Debe seleccionar un paciente antes de cargar las prácticas';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
  }
  
  if(errorNumero =='100'){
    mensaje ='El paciente posee una obra social que no esta habilitada';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
  }
    if(estado == 'warning'){
      
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
  
  
  
