import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { calendarioIdioma, logo_clinica } from '../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, DialogService } from 'primeng/api';
import swal from 'sweetalert2';
import { PopupNotificacionNuevaComponent } from './popup-notificacion-nueva/popup-notificacion-nueva.component';

@Component({
  selector: 'app-popup-notificacion',
  templateUrl: './popup-notificacion.component.html',
  styleUrls: ['./popup-notificacion.component.css'], 
  providers: [MessageService,DialogService]
})
export class PopupNotificacionComponent implements OnInit {
  puede_notificar:boolean;  
  loading: boolean;
  chat:FormGroup;
  texto:string;
  userData:any;
  elementos:any[] = [];
  
  constructor(private notificacionesService:NotificacionesService, private messageService: MessageService ,public dialogService: DialogService) { 

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.chat = new FormGroup({
      'fecha_desde': new FormControl('', Validators.required), 
      'fecha_hasta': new FormControl('', Validators.required), 
      'presentacion_nro': new FormControl(''), 
      'obra_social_nombre': new FormControl('') ,
      'obra_social_id': new FormControl('') 
      });     
     
  }

  ngOnInit() {
    /* VALIDO SI PUEDE NOTIFICAR*/
    let i:number;
    let resultado:string;    
    let acceso:any = this.userData['access_list'];
    
    for(i=0; i<acceso.length;i++){
      resultado = acceso[i]['modulo_nombre'];
      if( resultado === 'puede_notificar'){
        this.puede_notificar = true;
        console.log(this.puede_notificar);
      }
    }


    this.getNotificacionesByUsuario();
  }


  
  getNotificacionesBynotificacionId(){

    this.loading = true;
    console.log(this.texto);
    try {
        this.notificacionesService.getNotificacionesBynotificacionId('1')    
        .subscribe(resp => {
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'error',
              title: error.status,
              text: error.message,
              showConfirmButton: false,
              timer: 2000
            });
         });    
    } catch (error) {
   // this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  
}



getNotificacionesByUsuario(){

  this.loading = true;
  console.log(this.texto);
  try {
      this.notificacionesService.getNotificacionesByUsuario(this.userData["id"])    
      .subscribe(resp => {
       
         let i:number = 0;
          let respuesta;
            let resultado = resp;        
            this.elementos = resp;
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            title: error.status,
            text: error.message,
            showConfirmButton: false,
            timer: 2000
          });
       });    
  } catch (error) {
 // this.throwAlert('error','Error al cargar los registros',error,error.status);
  }  
}

crearNotificacion(){
  console.log('creando notificacion');
    let data:any; 
    //data = this.popItemAgenda;  
    const ref = this.dialogService.open(PopupNotificacionNuevaComponent, {
    data,
     header: 'Notificación nueva', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupNotificacionNuevaComponent:any) => {
        if (PopupNotificacionNuevaComponent) {
          this.getNotificacionesByUsuario();
        }
    });
  }


actualizarVisto(elemento:any){
let temp:any = '';
  this.loading = true;
  console.log(elemento);
  try {
      this.notificacionesService.confirmarNotificacionByUsuario(elemento,this.userData["id"])
      .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          this.getNotificacionesByUsuario();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            title: error.status,
            text: error.message,
            showConfirmButton: false,
            timer: 2000
          });
       });    
  } catch (error) {
 // this.throwAlert('error','Error al cargar los registros',error,error.status);
  }  
}

verListado(){

}
}
