import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DynamicDialogConfig, MessageService, DynamicDialogRef, DialogService } from 'primeng/api';
import { calendarioIdioma, config } from '../../../../config/config';
import { formatDate } from '@angular/common';
import { CirugiaService } from '../../../../services/cirugia.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-ficha-quirurgica-estado',
  templateUrl: './popup-ficha-quirurgica-estado.component.html',
  styleUrls: ['./popup-ficha-quirurgica-estado.component.css']
})
export class PopupFichaQuirurgicaEstadoComponent implements OnInit {

  es:any;
  loading: boolean;
  estadoCirugia:any[];
  selectedCirugia:string ;
  fecha_internacion:Date;
  _fecha_internacion:string;
  fecha_inicio_acto_quirurgico:Date;
  _fecha_inicio_acto_quirurgico:string;
  fecha_fin_acto_quirurgico:Date;
  _fecha_fin_acto_quirurgico:string;
  fecha_alta:Date;
  _fecha_alta:string;
  observacion_cirugia:string;
  DateForm:FormGroup;

  constructor(public miServico:CirugiaService, public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService) {

    this.estadoCirugia = [
      {name: 'SELECCIONAR ESTADO', code: '0'},
      {name: 'PENDIENTE', code: '1'},
      {name: 'REALIZADO', code: '2'},
      {name: 'QUIROFANO', code: '3'},        
      {name: 'SUSPENDIDO', code: '4'},        
      {name: 'REPROGRAMADA', code: '5'},     
  ];
   }

  ngOnInit() {
    console.log(this.config.data);
    this.es = calendarioIdioma;
    this.fecha_internacion = new Date();        
    this.fecha_inicio_acto_quirurgico = new Date();
    this.fecha_fin_acto_quirurgico = new Date();
    this.fecha_alta = new Date();
   this.selectedCirugia = this.config.data.estado_cirugia_id;
    this.DateForm = new FormGroup({
      'fecha_internacion': new FormControl( this.fecha_internacion, Validators.required), 
      'fecha_inicio_acto_quirurgico': new FormControl( this.fecha_inicio_acto_quirurgico, Validators.required),
      'fecha_fin_acto_quirurgico': new FormControl( this.fecha_fin_acto_quirurgico, Validators.required), 
      'fecha_alta': new FormControl( this.fecha_alta, Validators.required),  
      'estado_cirugia_id': new FormControl(''),
      'observacion_cirugia': new FormControl(''),
      'usuario_modifico_id': new FormControl(''),
      });

  }

  actualizarFechaInternacion(event){
    console.log(event);
    this.fecha_internacion = event;    
    console.log(new Date(this.fecha_internacion));
  }

  actualizarFechaInicio(event){
    console.log(event);
    this.fecha_inicio_acto_quirurgico = event;    
    console.log(new Date(this.fecha_inicio_acto_quirurgico));
  }

  actualizarFechaFin(event){
    console.log(event);
    this.fecha_fin_acto_quirurgico = event;    
    console.log(new Date(this.fecha_fin_acto_quirurgico));
  }

  actualizarFechaAlta(event){
    console.log(event);
    this.fecha_alta = event;    
    console.log(new Date(this.fecha_alta));
  }

  guardarDatos(){
    this.DateForm.patchValue({fecha_internacion: formatDate(this.fecha_internacion, 'dd/MM/yyyy HH:mm', 'en')});
    this.DateForm.patchValue({fecha_inicio_acto_quirurgico: formatDate(this.fecha_inicio_acto_quirurgico, 'dd/MM/yyyy HH:mm', 'en')});
    this.DateForm.patchValue({fecha_fin_acto_quirurgico: formatDate(this.fecha_fin_acto_quirurgico, 'dd/MM/yyyy HH:mm', 'en')});
    this.DateForm.patchValue({fecha_alta: formatDate(this.fecha_alta, 'dd/MM/yyyy HH:mm', 'en')});  
    let userData = JSON.parse(localStorage.getItem('userData'));
    this.DateForm.patchValue({estado_cirugia_id: this.selectedCirugia['code']});
    this.DateForm.patchValue({observacion_cirugia: this.observacion_cirugia});
    this.DateForm.patchValue({usuario_modifico_id: userData['id']});
    console.log(this.DateForm.value);

    this.loading = true;
    try {
        this.miServico.updEstadoQurifano(this.DateForm.value, this.config.data.id)    
        .subscribe(resp => {
                     
            this.loading = false;
            this.ref.close(resp);
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
      if(estado== 'alerta'){
        swal({   
            type: 'warning',
            title: 'Cuidado!',
            text: mensaje,
            footer: motivo
          })
    }
    }
}

