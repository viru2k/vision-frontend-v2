import { PopupObrasocialComponent } from './../../mantenimiento/popup/popup-obrasocial/popup-obrasocial.component';
import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from '../../../config/config';
import { ObraSocial } from 'src/app/models/obra-social.model';

@Component({
  selector: 'app-popup-paciente',
  templateUrl: './popup-paciente.component.html',
  styleUrls: ['./popup-paciente.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupPacienteNuevoComponent implements OnInit {
  popItem:ObraSocial;
  es:any;
  updateDataForm: FormGroup;
  checked: boolean = false;
  edad:string;
  constructor(public config: DynamicDialogConfig, private messageService: MessageService ,public dialogService: DialogService, public ref: DynamicDialogRef) { 
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
      'gravado_adherente': new FormControl('O'),
      'es_coseguro': new FormControl('N'),
  });
    if(this.config.data.id !='0'){
         /*** CORRECCION PARA LAS VENTANAS EMERGENTES QUE MANEJAN FECHA EN INPUT */
         let _fecha:Date = new Date(this.config.data.fecha_nacimiento);
         let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));      
         this.edad =String((new Date()).getFullYear() - (new Date(dateFix)).getFullYear());
         console.log((new Date()).getFullYear() - (new Date(dateFix)).getFullYear());
         console.log(dateFix);
     this.config.data.fecha_nacimiento = dateFix;
      this.updateDataForm.patchValue(this.config.data);
    }
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
    this.config.data = this.updateDataForm.value;
    console.log(this.config.data);
    this.ref.close(this.updateDataForm.value);
  }
}
