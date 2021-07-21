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
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-popup-asociar-usuario-grupo',
  templateUrl: './popup-asociar-usuario-grupo.component.html',
  styleUrls: ['./popup-asociar-usuario-grupo.component.css']
})
export class PopupAsociarUsuarioGrupoComponent implements OnInit {

 
  cols: any[];
  cols_grupo: any[];
  selectedItems: any;
  selectedItem_grupo: any;
  es:any;
  // LOADING
  loading: boolean;
  elemento:any = null;
  elementos:any[] = null;
  elemento_grupo:any = null;
  elementos_grupos:any[] = null;
  grupo:string;
  detalleUsuarios:any;

  constructor(private miServico:UserService, private chatService:ChatService , public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService ) {
    this.cols = [
        {field: 'nombreyapellido', header: 'Usuario',   width: '20%'  }
     ];
   this.cols_grupo = [
    {field: 'grupo_nombre', header: 'Grupo',   width: '94%'  },
    {field: '', header: '',   width: '6%'  }
   ];
    } 

ngOnInit() {

this.loadGrupos();
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
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error);
    }  
}


loadGrupos(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.chatService.getGrupos()    
      .subscribe(resp => {
      this.elementos_grupos = resp;
          console.log(this.elementos_grupos);    
          this.loading = false;
          this.loadList();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
       });    
  } catch (error) {
  this.throwAlert('error','Error al cargar los registros',error);
  }  
}


guardar(element) {  
    let userData = JSON.parse(localStorage.getItem('userData'));
   
    console.log(element);

    this.loading = true;
   try {
        this.chatService.asociarUsuarioGrupo(userData['id'], element.id, this.selectedItem_grupo['grupo_nombre'], this.selectedItem_grupo['id'])
        .subscribe(resp => {
  
            console.log(this.elementos);    
            this.loading = false;
      
            swal({
              type: 'success',
              title: 'Exito',
              text: 'Usuario guardado'
            });
        },
        error => { 
            console.log(error);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
         });
    } catch (error) {
      console.log(error);
    this.throwAlert('error','Error al cargar los registros',error);
    }  
 
}

onRowSelectGrupo(){
  console.log(this.selectedItem_grupo);
}

onRowSelected(){
  console.log(this.selectedItems);
}



crearGrupo()
{
  if(this.grupo != ''){
    this.loading = true;
    try {
        this.chatService.crearSesionListadoGrupo(this.grupo)
        .subscribe(resp => {
        this.elementos = resp;
            console.log(this.elementos);
            this.loading = false;
            this.loadGrupos();
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error);
    }  
  }
 
 
}

accion(event: any, overlaypanel: OverlayPanel, elementos: any) {
    this.selectedItem_grupo = elementos;
    this.verUsuariosDetalleByGrupo(elementos.id);
    console.log(this.selectedItem_grupo);
    overlaypanel.toggle(event);
  }


  
verUsuariosDetalleByGrupo(sesion_id: string) {

  this.loading = true;

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
          this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros');
     //     this.resultSave = false;
          this.loading = false;
        });
  } catch (error) {
    this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros');
  }

}

borrar(element) {

  console.log(element);
 try {
    this.chatService.destroyUsuarioGrupoSesion(element.value.chat_sesion_id, element.value.usuario_id)
    .subscribe(resp => {
  // this.detalleUsuarios = resp;
    console.log(resp);
    this.loading = false;
    swal({
      type: 'info',
      title: 'Borrado',
      text: 'Usuario quitado del grupo'
    });
    this.verUsuariosDetalleByGrupo(element.value.chat_sesion_id);
    },
    error => {
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros');   
        this.loading = false;
      });
} catch (error) {
  this.throwAlert('error', 'error', 'Error: ' + error.status + '  Error al cargar los registros');
} 
}

/** ACCIONES */

throwAlert(estado: string, mensaje: string, motivo: string){
    if (estado === 'success') {
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
    if (estado== 'error') {
   /*      swal({
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: motivo
          }) */
    }
}
}