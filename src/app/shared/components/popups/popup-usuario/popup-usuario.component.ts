import { MedicoObraSocialService } from './../../../../services/medico-obra-social.service';
import { PacienteService } from './../../../../services/paciente.service';
import { Paciente } from './../../../../models/paciente.model';
import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { UserService } from './../../../../services/user.service';
import { ChatService } from '../../../../services/chat-service.service';


@Component({
  selector: 'app-popup-usuario',
  templateUrl: './popup-usuario.component.html',
  styleUrls: ['./popup-usuario.component.css']
})
export class PopupUsuarioComponent implements OnInit {


  cols: any[];
  selectedItem: any;
  es:any;
  // LOADING
  loading: boolean;
  elemento:any = null;
  elementos:any[] = null;

  constructor(private miServico: UserService,  private chatService: ChatService , public ref: DynamicDialogRef,
     public config: DynamicDialogConfig,
    private messageService: MessageService , public dialogService: DialogService ) {
    this.cols = [
        {field: 'nombreyapellido', header: 'Usuario',   width: '20%'  }

     ];
    }

ngOnInit() {

this.loadList();
}



loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServico.getItems()
        .subscribe(resp => {
        this.elementos = resp;
            console.log(this.elementos);
            this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message);
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error);
    }
}


onRowSelect(event) {  
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.chatService.asociarUsuarioGrupo(userData['id'], this.selectedItem['id'], 'LISTADO','0')
        .subscribe(resp => {
        this.elementos = resp;
            console.log(this.elementos);    
            this.loading = false;
            this.ref.close(this.selectedItem);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros', error);
    }  
 
}

AsociarUsuario()
{

 
}

/** ACCIONES */

throwAlert(estado:string, mensaje:string, motivo:string){
    if(estado== 'success'){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
    if(estado== 'error'){
        swal({
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: motivo
          })
    }
}
}