import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AfterViewInit, ViewChildren,   QueryList, HostListener
} from '@angular/core';
import * as $ from 'jquery';
import { ChatService } from '../../services/chat-service.service';
import swal from 'sweetalert2';
import { ChatRenglon } from '../../models/chat-renglon.model';
import { DocumentService } from '../../services/document-service.service';
import { PopupAdjuntarArchivoComponent } from './popups/popup-adjuntar-archivo/popup-adjuntar-archivo.component';
import { DialogService, MessageService } from 'primeng/api';
import { URL_ARCHIVO } from './../../config/config';

import { PopupUsuarioComponent } from './../../shared/components/popups/popup-usuario/popup-usuario.component';
import { PopupAsociarUsuarioGrupoComponent } from './popups/popup-asociar-usuario-grupo/popup-asociar-usuario-grupo.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessengerService } from './../../services/messenger.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {


  //@ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollMe',{ static: false }) myScrollContainer: ElementRef;
  loading;
  loading_chat;
  loadDetalle: string = '';
  userData: any;
  lista_usuarios: any[] = [];
  lista_chat: any[] = [];
  selected_usuario: any = null;
  textoAenviar = '';
  limite_historia:boolean = false;
  limite:string = 'LIMIT 200';
  usuarioChat: any;
  habilitarTexto;
  private scrollContainer: any;
  public url:string  = URL_ARCHIVO;
  searchText;
  _admin;
  detalleUsuarios: any[];

  constructor(private documentService: DocumentService, private chatService: ChatService, private messageService: MessageService , 
    public dialogService: DialogService, private messengerService: MessengerService) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this._admin = this.userData['admin'];
    console.log(this.userData['admin'])
   }

  ngOnInit() {
  
    this.loadListaUsuario();
    this.habilitarTexto = true;

this.documentService
.getMessages()
.subscribe((message: string) => {
  console.log(message);
  if (this.usuarioChat) {
    if ((message['chat_sesion_id'] === this.usuarioChat.chat_sesion_id) ) {
      console.log(' invocacion llamando chat');
      this.loadChat(message);
      this.scrollToBottom();
    }else{
      const valor = this.lista_usuarios.findIndex(x => x.chat_sesion_id === message['chat_sesion_id']);
     // console.log(valor);
      this.lista_usuarios[valor]['estado'] = 'NUEVO';
      this.loadListaUsuario();
    }
  }else{
    this.loadListaUsuario();
    const valor = this.lista_usuarios.findIndex(x => x.chat_sesion_id === message['chat_sesion_id']);
    //console.log(valor);
    this.lista_usuarios[valor]['estado'] = 'NUEVO';
  }

  console.log(this.lista_usuarios.sort(this.compare));
});
  }



  ngAfterViewInit() {
    this.scrollContainer = this.myScrollContainer.nativeElement;


   
  }

  scrollToBottom(): void {
  /*  try {
       
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log(err); } */

    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  

}

limiteHistoria(){
  if(this.limite_historia){
    this.limite = '';
  }else{
    this.limite = 'LIMIT 200';
  }
}

asociarArchivo() {

  let data:any; 
  data = this.selected_usuario;
  const ref = this.dialogService.open(PopupAdjuntarArchivoComponent, {
  data,
   header: 'Adjuntar archivo', 
   width: '60%',
   height: '90%'
  });
  ref.onClose.subscribe((PopupAdjuntarArchivoComponent : any) => {
    if (PopupAdjuntarArchivoComponent) {
    console.log('subido ok');
    this.loadChat(this.usuarioChat);
    }
});
}

agregarUsuario() {

  let data:any; 
  data = this.selected_usuario;
  const ref = this.dialogService.open(PopupUsuarioComponent, {
  data,
   header: 'Asociar usuario', 
   width: '60%',
   height: '90%'
  });
  ref.onClose.subscribe((PopupUsuarioComponent : any) => {
    if (PopupAdjuntarArchivoComponent) {
    console.log('subido ok');
    this.loadListaUsuario();
    }
});
}



gestionarGrupos() {
  let data:any; 
  data = this.selected_usuario;
  const ref = this.dialogService.open(PopupAsociarUsuarioGrupoComponent, {
  data,
   header: 'Asociar usuario y grupos', 
   width: '95%',
   height: '80%'
  });
  ref.onClose.subscribe((PopupAsociarUsuarioGrupoComponent : any) => {
    if (PopupAsociarUsuarioGrupoComponent) {
    console.log('subido ok');
    this.loadListaUsuario();
    }
});
}


verUsuarios(event: any, overlaypanel: OverlayPanel ) {

    overlaypanel.toggle(event);
  }

verUsuariosDetalleByGrupo(sesion_id: string) {

  this.loading = true;
  if (this.userData['id']) {
  try {
      this.chatService.getGrupoDetalleUsuarios(sesion_id)
      .subscribe(resp => {
     this.detalleUsuarios = resp;
      console.log(resp);
      this.loading = false;
    

      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
     //     this.resultSave = false;
          this.loading = false;
        });
  } catch (error) {
    this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
  }

}
  
}

  loadListaUsuario() {
    this.loading = true;
    if (this.userData['id']) {
    try {
        this.chatService.getSesionListByUsuario(this.userData['id'])
        .subscribe(resp => {
       this.lista_usuarios = resp;
        console.log(this.lista_usuarios);
       // console.log('arreglo ordenado');
       // console.log(this.lista_usuarios.sort(this.compare));;
        this.lista_usuarios.sort(this.compare);
        this.loading = false;
      

        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
       //     this.resultSave = false;
            this.loading = false;
          });
    } catch (error) {
      this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
    }

  }
  }

/* -------------------------------------------------------------------------- */
/*                          ORDER ARREGLO DE OBJETOS                          */
/* -------------------------------------------------------------------------- */

   compare(a, b) {
    const bandA = a.estado.toUpperCase();
    const bandB = b.estado.toUpperCase();
  
    let comparison = 0;
    if (bandA < bandB) {
      comparison = 1;
    } else if (bandA > bandB) {
      comparison = -1;
    }
    return comparison;
  }
  

  


  origenMensaje(usuario_id: string) {
    if (this.userData['id'] === usuario_id) {
      return {'message other-message float-right'  : 'null' };
    } else {

      return {'message my-message'  : 'null' };
    }
  }

  origenMensajeUsuario(usuario_id: string) {
    if (this.userData['id'] === usuario_id) {
      return {'message-data align-right'  : 'null' };
    } else {

      return {'message-data align-left'  : 'null' };
    }
  }

  loadChat(e: any) {
    //console.log(e);
    this.usuarioChat = e;
    this.selected_usuario = e;
    this.loading_chat = true;
    this.loadDetalle = 'Cargando mensajes...';
    const valor = this.lista_usuarios.findIndex(x => x.chat_sesion_id === e['chat_sesion_id']);
    //console.log(valor);
    this.lista_usuarios[valor]['estado'] = 'LEIDO';
    try {

        this.chatService.getChatBySesion(e.id, e.chat_sesion_id, e.grupo_nombre, this.limite)
        .subscribe(resp => {
        this.lista_chat = resp;
       // console.log(resp);
        this.loading_chat = false;
        this.loadDetalle = '';
        this.scrollContainer.scroll({
          top: this.scrollContainer.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
        this.habilitarTexto = false;
        this.verUsuariosDetalleByGrupo(e.chat_sesion_id);
        this.lista_usuarios.sort(this.compare);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
       //     this.resultSave = false;
       this.loading_chat = false;
       this.loadDetalle = '';
          });
    } catch (error) {
      this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
    }
  }


  


  enviarTexto() {
    if (this.textoAenviar !== '') {
      console.log('Texto enviado');
      const mensaje = new ChatRenglon(this.usuarioChat.chat_sesion_id, this.userData['id'], this.textoAenviar, 'NO', '', 'chat-nuevo');
      console.log(mensaje);
      this.loadDetalle = 'Enviando mensajes...';
      this.loading_chat = true;
      try {

          this.chatService.insertarRenglonChat(mensaje)
          .subscribe(resp => {
          console.log(resp);
          this.loading = false;
          this.loadDetalle = '';
          this.textoAenviar = '';
          this.scrollToBottom();
          this.loadChat(this.usuarioChat);
          this.usuarioChat.usuario_envia_id = this.userData.id;
          this.documentService.sendMessage(this.usuarioChat);
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
         //     this.resultSave = false;
         this.loading_chat = false;
         this.loadDetalle = '';
            });
      } catch (error) {
        this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
      }
    } else {
      console.log('Texto vacio');
    }
  }



throwAlert(estado: string, mensaje: string, motivo: string, errorNumero: string) {
  let tipoerror: string;

  if (estado == 'success') {
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        });
  }

  if (errorNumero =='422') {
    mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    swal({
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      });
}

  if ((estado == 'error') && (errorNumero !='422')) {
    if (errorNumero =='422') {
        mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    }
    if (errorNumero =='400 ') {
        mensaje ='Bad Request ';
    }
    if (errorNumero =='404') {
        mensaje ='No encontrado ';
    }
    if (errorNumero =='401') {
        mensaje ='Sin autorización';
    }
    if (errorNumero =='403') {
        mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if (errorNumero =='405') {
        mensaje ='Método no permitido';
    }
    if (errorNumero =='500') {
        mensaje ='Error interno en el servidor';
    }
    if (errorNumero =='503') {
        mensaje ='Servidor no disponible';
    }
    if (errorNumero =='502') {
        mensaje ='Bad gateway';
    }

      swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        });
  }


}
}

