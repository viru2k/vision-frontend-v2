
import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ObraSocial } from 'src/app/models/obra-social.model';
import { PopupObrasocialComponent } from './../../../../pages/mantenimiento/popup/popup-obrasocial/popup-obrasocial.component';
import { calendarioIdioma } from './../../../../config/config';
import { PacienteService } from '../../../../services/paciente.service';
import { Paciente } from './../../../../models/paciente.model';

@Component({
  selector: 'app-popup-paciente-consulta',
  templateUrl: './popup-paciente-consulta.component.html',
  styleUrls: ['./popup-paciente-consulta.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupPacienteConsultaComponent implements OnInit {

  popItem:ObraSocial;
  es:any;
  updateDataForm: FormGroup;
  checked: boolean = false;
  paciente:Paciente;
  paciente_id:string;

  constructor(public pacienteService:PacienteService, public config: DynamicDialogConfig, private messageService: MessageService ,public dialogService: DialogService, public ref: DynamicDialogRef) { 
    this.es = calendarioIdioma;
  }

  ngOnInit() {
    console.log(this.config.data);
    this.updateDataForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
       'dni': new FormControl('', [ Validators.required, Validators.maxLength(8)]),
      'domicilio': new FormControl('San Juan', Validators.required),
      'sexo': new FormControl('M', Validators.required),
      'email': new FormControl('sin_correo@delavision.com.ar', [Validators.required, Validators.email]),
      'fecha_nacimiento': new FormControl('', Validators.required),
      'ciudad': new FormControl('San Juan', Validators.required),
      'telefono_cel': new FormControl('0', Validators.required),
      'telefono_fijo': new FormControl('0', Validators.required),
      'tiene_whatsapp': new FormControl('false'),
      'obra_social_nombre': new FormControl(''),
      'obra_social_id': new FormControl(''),
      'coseguro_nombre': new FormControl('PARTICULARES'),
      'coseguro_id': new FormControl('86'),
      'usuario_alta_id': new FormControl('0'), 
      'numero_afiliado': new FormControl('0'), 
      'barra_afiliado': new FormControl('0'),
      'plan': new FormControl('0'),
      'id': new FormControl('0'),
      'gravado_adherente': new FormControl('A'),
      'es_coseguro': new FormControl('N'),
  });
   
         /*** CORRECCION PARA LAS VENTANAS EMERGENTES QUE MANEJAN FECHA EN INPUT */
         if(this.config.data.fecha_nacimiento){
         let _fecha:Date = new Date(this.config.data.fecha_nacimiento);
         let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
     console.log(dateFix);
     this.config.data.fecha_nacimiento = dateFix;
      this.updateDataForm.patchValue(this.config.data);
         }
      console.log(this.config.data);
      this.paciente_id = this.config.data.paciente_id;
      this.buscarPaciente();
    
  }



  buscarObraSocial(){
    this.popItem = new ObraSocial('','','','','','','','');
      let data:any; 
      const ref = this.dialogService.open(PopupObrasocialComponent, {
      data,
       header: 'Crear /Modificar registro', 
       width: '95%',
       height: '90%'
   });

   ref.onClose.subscribe((PopupObrasocialComponent:ObraSocial) => {
       if (PopupObrasocialComponent) {
       console.log(PopupObrasocialComponent);    
            this.popItem = PopupObrasocialComponent;
            this.config.data = this.updateDataForm.value;
            this.config.data.obra_social_nombre = this.popItem.nombre;
            this.config.data.obra_social_id = this.popItem.id;
            this.config.data.es_coseguro = this.popItem.es_coseguro;
            this.updateDataForm.patchValue(this.config.data);
       }
   });
  }

  buscarCoseguro(){
    this.popItem = new ObraSocial('','','','','','','','');
      let data:any; 
      const ref = this.dialogService.open(PopupObrasocialComponent, {
      data,
       header: 'Crear /Modificar registro', 
       width: '95%',
       height: '90%'
   });

   ref.onClose.subscribe((PopupObrasocialComponent:ObraSocial) => {
       if (PopupObrasocialComponent) {
       console.log(PopupObrasocialComponent);    
            this.popItem = PopupObrasocialComponent;
            this.config.data = this.updateDataForm.value;
            this.config.data.coseguro_nombre = this.popItem.nombre;
            this.config.data.coseguro_id = this.popItem.id;
            this.config.data.es_coseguro = this.popItem.es_coseguro;
            this.updateDataForm.patchValue(this.config.data);
       }
   });
  }

  guardarDatos(){
   
  
//this.updateDataForm.value

try{
  this.pacienteService.putItem(this.updateDataForm.value, this.updateDataForm.value.id)
      .subscribe(resp => {
     
      console.log(resp);    
    
     // this.loadList();
     this.config.data = this.updateDataForm.value;
     console.log(this.config.data);
     this.ref.close(this.updateDataForm.value);
     this.throwAlert('success','Se modificó el registro con éxito','','');
      },   
      error => { // error path
          console.log(error.message);
     //     console.log(error.status);
          this.throwAlert('error','Error: '+error.status,'  Error al insertar los registros',error.status);
         
});    
  } catch (error) {
      this.throwAlert('error','Error al cargar los registros',error,error.status);
  }

}


buscarPaciente(){
   console.log(this.paciente_id);
  
  //this.updateDataForm.value
  
  try{
    this.pacienteService.getItem(this.paciente_id)
        .subscribe(resp => {
       
        console.log(resp[0]);   
        let p:any = resp[0];
  //      this.paciente = resp[0] ;
     let _fecha:Date = new Date(p.fecha_nacimiento);
     let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
    console.log(dateFix);
      p.fecha_nacimiento = dateFix;
     this.updateDataForm.patchValue(p);
      console.log(p.plan);
     // this.updateDataForm.patchValue({plan: resp[0].plan});
      

     this.paciente = resp;
        },   
        error => { // error path
            console.log(error.message);
       //     console.log(error.status);
            this.throwAlert('error','Error: '+error.status,'  Error al insertar los registros',error.status);
           
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

