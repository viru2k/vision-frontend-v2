import { Component, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DocumentService } from './../../../services/document-service.service';
import { MessengerService } from './../../../services/messenger.service';
import { ChatService } from './../../../services/chat-service.service';
import { AlertServiceService } from './../../../services/alert-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-notificator',
  templateUrl: './chat-notificator.component.html',
  styleUrls: ['./chat-notificator.component.css']
})
export class ChatNotificatorComponent implements OnInit {

  usuarioChat: any;
  userData: any;
  lista_usuarios: any[] = [];
  nuevo = false;

   // MESEENGER
   messages: any[] = [];
   subscription: Subscription;

  constructor(private documentService: DocumentService,
    private messengerService: MessengerService, 
    private chatService: ChatService,
    private alertServiceService: AlertServiceService) {
      this.userData = JSON.parse(localStorage.getItem('userData'));
     }

  ngOnInit() {
    
    this.loadListaUsuario();


    this.documentService
.getMessages()
.subscribe((message: string) => {
  console.log(message);

    console.log('sin ventana chat');
    console.log(message);
  //  this.loadListaUsuario();
    const valor = this.lista_usuarios.findIndex(x => x.chat_sesion_id === message['chat_sesion_id']);
    console.log(valor);
    console.log(message['chat_sesion_id']);
  
    if ( valor >= 0 ) {
    if(this.userData.id !== message['usuario_envia_id']) {
      console.log(message['usuario_envia_id']);
      this.nuevo = true;
      this.playAudio();
    }
  }
 
 
});
  }

  chequeado(){
    this.nuevo = false;
  }

  loadListaUsuario() {    
    if (this.userData['id']) {
    try {
        this.chatService.getSesionListByUsuario(this.userData['id'])
        .subscribe(resp => {
       this.lista_usuarios = resp;
        console.log(this.lista_usuarios);
       // console.log('arreglo ordenado');
       // console.log(this.lista_usuarios.sort(this.compare));;
        this.lista_usuarios.sort(this.compare);
        
      

        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
       //     this.resultSave = false;
            
          });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
    }

  }
  }

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

  playAudio(){
    const audio = new Audio();
    audio.src = './assets/sound/swiftly.mp3';
    audio.load();
    audio.play();
  }
  
}
