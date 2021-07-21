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
import { PopupPacienteConsultaComponent } from './../popup-paciente-consulta/popup-paciente-consulta.component';


@Component({
  selector: 'app-popup-operacion-cobro-registro-editar',
  templateUrl: './popup-operacion-cobro-registro-editar.component.html',
  styleUrls: ['./popup-operacion-cobro-registro-editar.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupOperacionCobroRegistroEditarComponent implements OnInit {
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
    'pmo_nombre': new FormControl("", Validators.required),
    'id': new FormControl(),
    'operacion_cobro_id': new FormControl(),
    'cantidad': new FormControl(),
    'valor_original': new FormControl({value: 0,disabled: true}),
    'valor_facturado': new FormControl(0),
    'apellido': new FormControl(""),
    'nombre': new FormControl(""),
    'nombreyapellido': new FormControl(""),
    'codigo': new FormControl(""),
    'complejidad': new FormControl(""),
    'descripcion': new FormControl(""),
    'dni': new FormControl(""),
    'fecha_cobro': new FormControl(""),
    'medico_nombre': new FormControl(""),
    'obra_social_nombre': new FormControl(""),
    'categorizacion': new FormControl(0),
    'estado_liquidacion': new FormControl("PEN"),
    'forma_pago': new FormControl(''),
    'paciente_id': new FormControl(''),
    'user_medico_id': new FormControl(''),
    'convenio_os_pmo_id': new FormControl(''),
    'obra_social_id': new FormControl(''), 
    'usuario_audita_id': new FormControl(''),
    'observacion': new FormControl(''),
    'tiene_observacion': new FormControl(''),
    'motivo_observacion': new FormControl('-'),
    'es_anulado': new FormControl('NO'),
    'liquidacion_numero': new FormControl('0'),
    'internacion_tipo': new FormControl('A'),
    
    
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
    this.selectedForma =  this.formasPago.find(x => x.name === this.config.data.forma_pago);
    this.updateDataForm.patchValue(this.config.data);
    this.updateDataForm.patchValue({nombreyapellido: this.config.data.apellido+" "+this.config.data.nombre});
    console.log(this.selectedForma);  
    this.updateDataForm.patchValue({forma_pago: this.selectedForma });
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
          this.updateDataForm.patchValue({nombreyapellido: PopupPacienteObrasocialComponent.apellido+" "+PopupPacienteObrasocialComponent.nombre});
          this.updateDataForm.patchValue({apellido: PopupPacienteObrasocialComponent.apellido});
          this.updateDataForm.patchValue({nombre: PopupPacienteObrasocialComponent.nombre});
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


  buscarMedico(){

    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar médico a facturar', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          this.popItemMedico = PopupMedicoComponent;
          this.updateDataForm.patchValue({medico_nombre: PopupMedicoComponent.apellido+" "+PopupMedicoComponent.nombre});
          this.updateDataForm.patchValue({user_medico_id: PopupMedicoComponent.usuario_id});
          console.log(this.updateDataForm.value);
        }
    });
  }
  


  buscarPractica(){

    let data:any; 
    const ref = this.dialogService.open(PopupConvenioComponent, {
    data,
     header: 'Buscar práctica', 
     width: '98%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupConvenioComponent:Convenio) => {
      if (PopupConvenioComponent) {
        console.log(PopupConvenioComponent);
          this.popItemPractica = PopupConvenioComponent;
          this.updateDataForm.patchValue({convenio_os_pmo_id: PopupConvenioComponent.id});
          this.updateDataForm.patchValue({codigo: PopupConvenioComponent.codigo});
          this.updateDataForm.patchValue({descripcion: PopupConvenioComponent.pmo_descripcion});
          this.updateDataForm.patchValue({valor_original: PopupConvenioComponent.valor});
          this.updateDataForm.patchValue({obra_social_nombre: PopupConvenioComponent.obra_social_nombre});
      }
  });
   
  }

   
  editarPaciente(){
    
    let data:any; 
    data = this.updateDataForm.value;
    const ref = this.dialogService.open(PopupPacienteConsultaComponent, {
    data,
     header: 'Editar paciente', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupPacienteConsultaComponent:Paciente) => {
        if (PopupPacienteObrasocialComponent) {         
          this.popItemPaciente = PopupPacienteConsultaComponent;
          console.log(this.popItemPaciente);
          this.updateDataForm.patchValue({paciente_id: PopupPacienteConsultaComponent.id})
          this.updateDataForm.patchValue({operacion_cobro_paciente_nombre: PopupPacienteConsultaComponent.apellido+" "+PopupPacienteConsultaComponent.nombre});

          console.log(this.updateDataForm.value);
        }
    });
  }



  actualizarDatos(){
    let forma = this.updateDataForm.value.forma_pago['name'];
    console.log(this.updateDataForm.value.forma_pago['name']);
    this.updateDataForm.patchValue({forma_pago: forma})
    console.log(this.updateDataForm.value);

    try {
      this.miServicio.putOperacionCobroRegistro(this.updateDataForm.value,this.updateDataForm.value.id)    
      .subscribe(resp => {
        this.throwAlert("success","Se modificó el registro con éxito","","");
        this.ref.close();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert("error","Error al cargar los registros",error,error.status);
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
  
  
  
