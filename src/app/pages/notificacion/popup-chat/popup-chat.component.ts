import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { calendarioIdioma, logo_clinica } from '../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, DialogService } from 'primeng/api';

@Component({
  selector: 'app-popup-chat',
  templateUrl: './popup-chat.component.html',
  styleUrls: ['./popup-chat.component.scss']
})
export class PopupChatComponent implements OnInit {
  loading: boolean;
  chat:FormGroup;
  texto:string;

  constructor(private notificacionesService:NotificacionesService, private messageService: MessageService ,public dialogService: DialogService) { 


    this.chat = new FormGroup({
      'fecha_desde': new FormControl('', Validators.required), 
      'fecha_hasta': new FormControl('', Validators.required), 
      'presentacion_nro': new FormControl(''), 
      'obra_social_nombre': new FormControl('') ,
      'obra_social_id': new FormControl('') 
      });     
  }

  ngOnInit() {
    this.enviarChat();
  }


  
  enviarChat(){

    this.loading = true;
    console.log(this.texto);
    try {
        this.notificacionesService.setChat(this.texto)    
        .subscribe(resp => {
         
            //this.elementos = resp;
            console.log(resp);
            this.getChat(resp);
             
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
        //    this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
   // this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  
}



getChat(resp:string){

  this.loading = true;

  try {
      this.notificacionesService.getChat(resp)    
      .subscribe(resp => {
      
          console.log(resp);
         
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
      //    this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
       });    
  } catch (error) {
 // this.throwAlert('error','Error al cargar los registros',error,error.status);
  }  
}
}
