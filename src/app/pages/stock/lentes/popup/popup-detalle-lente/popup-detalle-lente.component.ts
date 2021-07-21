
import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { calendarioIdioma } from './../../../../../config/config';
import { CirugiaService } from '../../../../../services/cirugia.service';
import { PopupLenteTipoComponent } from '../../../../../shared/components/popups/popup-lente-tipo/popup-lente-tipo.component';
import { CirugiaLente } from '../../../../../models/cirugia-lente.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-popup-detalle-lente',
  templateUrl: './popup-detalle-lente.component.html',
  styleUrls: ['./popup-detalle-lente.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupDetalleLenteComponent implements OnInit {
  loading:boolean;
  es:any;
  listaestado:any[];
  es_nuevo:boolean;
  DataForm:FormGroup;
  element:any;
  popItemLente:CirugiaLente = null;
  selectedForma:string;
  _fechaHoy:string;
  

  constructor(public config: DynamicDialogConfig, private miServicio:CirugiaService,private messageService: MessageService ,public dialogService: DialogService,public ref: DynamicDialogRef) {
    this.es = calendarioIdioma;
    this.DataForm = new FormGroup({
      'tipo_lente_id': new FormControl(),
      'tipo': new FormControl(),      
      'dioptria': new FormControl('', Validators.required),
      'lote': new FormControl('', Validators.required),
      'remito': new FormControl(''),
      'factura': new FormControl(''),
      'fecha_vencimiento': new FormControl('', Validators.required),
      'proveedor': new FormControl('', Validators.required),
      'ubicacion': new FormControl('', Validators.required),
      'estado': new FormControl('', Validators.required),
      'es_baja': new FormControl(''),
      'usuario_modifico': new FormControl(''),
  }); 
  this.listaestado = [
    {name: 'ASIGNADO A CIRUGIA', code: '1'},
    {name: 'DESECHO', code: '2'},
    {name: 'PRESTAMO', code: '3'},
    {name: 'CAMBIO DE DIOPTRIA', code: '4'},
    {name: 'DEVOLUCION', code: '5'},
    {name: 'UTILIZADO', code: '6'},
    {name: 'EN STOCK', code: '7'},
    {name: 'REINGRESO POR PRESTAMO', code: '7'},
    {name: 'ABIERTO', code: '8'},
];
   }

  ngOnInit() {
    
    console.log(this.config.data);
    if(this.config.data){
      console.log(this.listaestado.find(x => x.name === this.config.data.estado));
      this.es_nuevo= false;
      this.selectedForma =  this.listaestado.find(x => x.name === this.config.data.estado);
      this._fechaHoy = formatDate( this.config.data.fecha_vencimiento, 'yyyy-MM-dd', 'es-AR');  
      this.element = this.config.data;
      console.log(new Date(this._fechaHoy));
      
      this.DataForm.patchValue(this.config.data);
      /*** CORRECCION PARA LAS VENTANAS EMERGENTES QUE MANEJAN FECHA EN INPUT */
      let _fecha:Date = new Date(this._fechaHoy);
      let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
      this._fechaHoy = formatDate( dateFix, 'yyyy-MM-dd', 'es-AR');  
      this.DataForm.patchValue({fecha_vencimiento: new Date(dateFix)});
      this.DataForm.patchValue({estado: this.listaestado.find(x => x.name === this.config.data.estado)});
      
      console.log(dateFix);
      console.log(this.DataForm.value);
    }else{
      this.selectedForma =  this.listaestado[6];
      console.log(this.selectedForma);
      this.es_nuevo= true;
      console.log(this.es_nuevo);  
      this.element= new CirugiaLente('','','','','','','','','','','');
      this.DataForm.patchValue(this.element);
      this.DataForm.patchValue({fecha_vencimiento: new Date()});
      this.DataForm.patchValue({estado: this.selectedForma });
    }

    
  }

  guardarDatos(){
    /**  CORRIGE EL FALLO DEL DIA EN LA SELECCION DE DIA */
  //  let dateFix = new Date(this.DataForm.value.fecha_vencimiento.getTime() + (this.DataForm.value.fecha_vencimiento.getTimezoneOffset() * 60 * 1000));
   // console.log(dateFix);
    /**  CORRIGE EL FALLO DEL DIA EN LA SELECCION DE DIA */
    let userData = JSON.parse(localStorage.getItem('userData'));    
    this._fechaHoy = formatDate( this.DataForm.value.fecha_vencimiento, 'yyyy-MM-dd', 'es-AR');     
    this.DataForm.patchValue({usuario_modifico:  userData['id']});
    this.element = this.DataForm.value;  
    this.element.fecha_vencimiento = this._fechaHoy;
console.log(this.element);
console.log(this.DataForm.value);
    if(this.es_nuevo){
      this.loading = true; 
      console.log("crear");
      console.log(this.DataForm.value);
  try { 
      this.miServicio.postLente(this.DataForm.value)
      .subscribe(resp => {
      this.loading = false;
      this.throwAlert('success','Se inserto el registro con éxito','','');
      this.ref.close(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','Error: '+error.status,  'Error al guardar',error.status);
          this.loading = false;
        });    
  } catch (error) {
      this.throwAlert('error','Error al guardar',error,error.status);
  }
    }else{
      this.loading = true; 
 
      
      try { 
        console.log("actualizar");
        console.log(this.element);
          this.miServicio.putLente(this.element,this.config.data.id )
          .subscribe(resp => {
          this.loading = false;
          this.throwAlert('success','Se modifico el registro con éxito','','');
          this.ref.close(resp);
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert('error','Error: '+error.status,  'Error al guardar',error.status);
              this.loading = false;
            });
      } catch (error) {
          this.throwAlert('error','Error al guardar',error,error.status);
      }
    }
  }

 

  buscarTipo(){
    let data:any; 

    const ref = this.dialogService.open(PopupLenteTipoComponent, {
    data,
     header: 'Gestionar lente', 
     width: '90%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupLenteTipoComponent:any) => {
        if (PopupLenteTipoComponent) {
          console.log(PopupLenteTipoComponent);
          this.element = PopupLenteTipoComponent;
          this.element.tipo_lente_id = PopupLenteTipoComponent.id;
          this.element.proveedor = PopupLenteTipoComponent.proveedor;
          this.element.tipo = PopupLenteTipoComponent.tipo;
          this.element.ubicacion = PopupLenteTipoComponent.ubicacion;
          this.DataForm.patchValue({tipo_lente_id: this.element.tipo_lente_id});
          this.DataForm.patchValue({proveedor: this.element.proveedor });
          this.DataForm.patchValue({tipo: this.element.tipo});
          this.DataForm.patchValue({ubicacion: this.element.ubicacion});
        }
    });
  }

  throwAlert(estado: string, mensaje: string, motivo: string, errorNumero: string){
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
  

