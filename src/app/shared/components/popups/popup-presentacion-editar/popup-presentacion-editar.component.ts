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
  selector: 'app-popup-presentacion-editar',
  templateUrl: './popup-presentacion-editar.component.html',
  styleUrls: ['./popup-presentacion-editar.component.css']
})
export class PopupPresentacionEditarComponent implements OnInit {

  
  es:any;
  formasPago:any[];
  updateDataForm:FormGroup;
  forma_pago:string ;
  _fechaHoy:string;
  
  popItemPractica:Convenio;
  popItemMedico:MedicoObraSocial;
  popItemObraSocial:ObraSocial;
  selectedForma:string;

  constructor(public config: DynamicDialogConfig,private miServicio:PracticaService ,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {

   this.es = calendarioIdioma;

  this.updateDataForm = new FormGroup({
    'cant_orden': new FormControl('0', Validators.required),
    'entidad_nombre': new FormControl(),
    'estado': new FormControl(),
    'fecha_desde': new FormControl(),
    'fecha_hasta': new FormControl(),
    'id': new FormControl(),
    'liquidacion_generada_id': new FormControl('0'),
    'medico_id': new FormControl(''),
    'medico_nombre': new FormControl(''),    
    'nivel': new FormControl(''),
    'nombreyapellido': new FormControl(''),
    'numero': new FormControl(''),
    'obra_social_id': new FormControl(''),    
    'obra_social_nombre': new FormControl(''), 
    'total': new FormControl('0'), 
    'usuario_audito': new FormControl()

  });

  }

  ngOnInit() {
    let dateFix:Date;
    console.log(this.config.data); 
    let _fecha_desde:Date = new Date(this.config.data.fecha_desde);
    this.config.data.fecha_desde = new Date(_fecha_desde.getTime() + (_fecha_desde.getTimezoneOffset() * 60 * 1000));      

    let _fecha_hasta:Date = new Date(this.config.data.fecha_hasta);   
    this.config.data.fecha_hasta = new Date(_fecha_hasta.getTime() + (_fecha_hasta.getTimezoneOffset() * 60 * 1000));      


    let _numero:Date = new Date(this.config.data.numero);
    this.config.data.numero = new Date(_numero.getTime() + (_numero.getTimezoneOffset() * 60 * 1000));      

    this.updateDataForm.patchValue(this.config.data);
    
 //   this.updateDataForm.patchValue({fecha_cobro: this._fechaHoy});
    console.log(this.updateDataForm.value);
    

  }

  buscarMedico(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar paciente', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {         
          this.popItemMedico = PopupMedicoComponent;
          console.log(this.popItemMedico);
          this.updateDataForm.patchValue({medico_id: PopupMedicoComponent.id})
          this.updateDataForm.patchValue({medico_nombre: PopupMedicoComponent.apellido+' '+PopupMedicoComponent.nombre});

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
          this.updateDataForm.patchValue({obra_social_nombre: PopupObraSocialComponent.nombre});
          this.updateDataForm.patchValue({obra_social_id: PopupObraSocialComponent.id});
        }
    });

  }


  
  actualizarFechaDesde(event){

    let _fecha:Date = new Date(event);
;
    this.config.data.fecha_desde = formatDate(event, 'dd/MM/yyyy', 'en');
    this.updateDataForm.patchValue({fecha_desde: this.config.data.fecha_desde});
  }

  
  actualizarFechaHasta(event){


    this.config.data.fecha_hasta = formatDate(event, 'dd/MM/yyyy', 'en');
    this.updateDataForm.patchValue({fecha_hasta: this.config.data.fecha_hasta});
  }


  
  actualizarNumero(event){

   
    this.config.data.numero = formatDate(event, 'dd/MM/yyyy', 'en');
    this.updateDataForm.patchValue({numero: this.config.data.numero});
  }

  actualizarDatos(){

    console.log(this.updateDataForm.value);

    try {
      this.miServicio.updatePresentacion(this.updateDataForm.value,this.updateDataForm.value.id)    
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