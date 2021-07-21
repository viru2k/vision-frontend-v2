import { DynamicDialogConfig, MessageService, DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from './../../../../config/config';
import swal from 'sweetalert2';
import { CirugiaService } from '../../../../services/cirugia.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-popup-listado-cirugia-quirofano-observacion-editar',
  templateUrl: './popup-listado-cirugia-quirofano-observacion-editar.component.html',
  styleUrls: ['./popup-listado-cirugia-quirofano-observacion-editar.component.css']
})
export class PopupListadoCirugiaQuirofanoObservacionEditarComponent implements OnInit {

  updateDataForm:FormGroup;
  es:any;
  _fechaHoy:string;
  fechaHoy:Date;
  _es_nuevo:string;
  constructor(public config: DynamicDialogConfig,private miServicio:CirugiaService ,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService) { 

    
   this.es = calendarioIdioma;
    
   this.updateDataForm = new FormGroup({
    'id': new FormControl(''), 
    'cirugia_ficha_id': new FormControl(''), 
    'cirugia_ficha_usuario_audito_id': new FormControl(''),
    'cirugia_ficha_usuario_audito': new FormControl(''),
    'cirugia_ficha_usuario_modifico_id': new FormControl(''),
    'cirugia_ficha_usuario_modifico': new FormControl(''),
    'cirugia_medico_grupo_id': new FormControl(''),
    'cirugia_practica': new FormControl(''),
    'dioptria': new FormControl(''),
    'estado': new FormControl(''),
    'estado_cirugia_id': new FormControl(''),
    'fecha_derivacion': new FormControl(''),
    'lente_estado': new FormControl(''),
    'lente_tipo': new FormControl(''),
    'lente_vencimiento': new FormControl(''),
    'lote': new FormControl(''),
    'medico_deriva': new FormControl(''),
    'medico_deriva_id': new FormControl(''),
    'obra_social_id': new FormControl(''),
    'obra_social_nombre': new FormControl(''),
    'ojo': new FormControl(''),
    'orden': new FormControl(''), 
    'fecha_hora': new FormControl(''), 
    'paciente_apellido': new FormControl(''),
    'paciente_dni': new FormControl(''),
    'paciente_fecha_nacimiento': new FormControl(''),
    'paciente_id': new FormControl(''),
    'paciente_nombre': new FormControl(''),
    'usuario_crea_id': new FormControl(''),
    'usuario_listado_creo_nombre': new FormControl(''),
    'usuario_listado_modifico_nombre': new FormControl(''),
    'usuario_medico_anestesista_nombre': new FormControl(''),
    'usuario_medico_ayuda_nombre': new FormControl(''),
    'usuario_medico_opera_nombre': new FormControl(''),
    'usuario_modifica_id': new FormControl(''),
    'observacion': new FormControl(''),
    'quirofano_observacion': new FormControl(''),
    'tiene_observacion': new FormControl(''),
    'es_nuevo': new FormControl('NO'),
   });
  }

  ngOnInit() {
    this.fechaHoy = new Date();
    let userData = JSON.parse(localStorage.getItem('userData'));
    this.config.data.usuario_modifica_id = userData['id'];
    console.log(this.config.data);
    console.log(this.updateDataForm.value);

    if(!this.config.data.es_nuevo){

     this._es_nuevo  = 'NO';
    }
    if(this._es_nuevo =='NO'){
    console.log(this.config.data);
    let _fecha:Date = new Date(this.config.data.fecha_hora);
    let dateFix = new Date(_fecha);//.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
    console.log(dateFix);
    this.config.data.fecha_hora = dateFix;
    this.updateDataForm.patchValue({id:  this.config.data.id});
    this.updateDataForm.patchValue({fecha_hora:  this.config.data.fecha_hora});
    this.updateDataForm.patchValue({orden:  this.config.data.orden});
    this.updateDataForm.patchValue({cirugia_ficha_id: this.config.data.cirugia_ficha_id});
    this.updateDataForm.patchValue({usuario_crea_id: userData['id']});
    this.updateDataForm.patchValue({usuario_modifica_id: userData['id']});
    this.updateDataForm.patchValue({ojo: this.config.data.ojo});
    this.updateDataForm.patchValue({cirugia_practica: this.config.data.cirugia_practica});
    this.updateDataForm.patchValue({quirofano_observacion: this.config.data.quirofano_observacion});
    this.updateDataForm.patchValue({tiene_observacion: this.config.data.tiene_observacion});
  }else{
    //this.updateDataForm.patchValue(this.config.data);
    this.updateDataForm.patchValue({fecha_hora: this.fechaHoy});
    this.updateDataForm.patchValue({cirugia_ficha_id: this.config.data.cirugia_ficha_id});
    this.updateDataForm.patchValue({usuario_crea_id: userData['id']});
    this.updateDataForm.patchValue({usuario_modifica_id: userData['id']}); 
    this.updateDataForm.patchValue({ojo: this.config.data.ojo});
    this.updateDataForm.patchValue({cirugia_practica: this.config.data.cirugia_practica});   
    this.updateDataForm.patchValue({quirofano_observacion: this.config.data.quirofano_observacion});
    this.updateDataForm.patchValue({tiene_observacion: this.config.data.tiene_observacion});
    console.log(this.config.data);
 //this.updateDataForm.patchValue(this.config.data);
  }
  }

  actualizarFecha(event){

    let _fecha:Date = new Date(event);
    let dateFix = new Date(_fecha);//.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
    console.log(dateFix);
    this.config.data.fecha_hora = dateFix;
    this.updateDataForm.patchValue(this.config.data);
  }
  
  actualizarDatos(){
    if(this.updateDataForm.value.es_nuevo ==='NO'){
    this.config.data = this.updateDataForm.value; // paso los datos que no estaban actualizados
  //  this.updateDataForm.patchValue(this.config.data);
    console.log( this.config.data);
    try {
      this.miServicio.updListadoQurifano( this.config.data,this.updateDataForm.value.id)    
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

}else{ 



 
  this.config.data = this.updateDataForm.value; // paso los datos que no estaban actualizados
//  this.updateDataForm.patchValue(this.config.data);
 console.log(this.updateDataForm.value);
  console.log( this.config.data);
  try {
    this.miServicio.postListadoQurifano( this.config.data,this.updateDataForm.value.id)    
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
