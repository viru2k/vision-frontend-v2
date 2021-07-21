import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/components/common/api';
import { MessageService, DynamicDialogConfig } from 'primeng/api';
import { NotificacionesService } from './../../../../services/notificaciones.service';
import { UserService } from './../../../../services/user.service';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-notificacion-nueva',
  templateUrl: './popup-notificacion-nueva.component.html',
  styleUrls: ['./popup-notificacion-nueva.component.css']
})
export class PopupNotificacionNuevaComponent implements OnInit {
  loading: boolean;
  cols: any[];
  elementos:any[] = null;
  elementosFiltrados:any[] = null;
  selecteditems:any[] = [];
  usuarioForm: FormGroup = null;
  userData:any;

  constructor(public userService:UserService, public config: DynamicDialogConfig, private notificacionesService:NotificacionesService, private messageService: MessageService ,public dialogService: DialogService) { 

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.cols = [
              
       
      { field: 'nombreyapellido', header: 'Usuario'},
   
        
     ];    

     this.usuarioForm = new FormGroup({
      'usuario_creo': new FormControl(this.userData['id']), 
      'titulo': new FormControl(''), 
      'mensaje': new FormControl(''), 
      'tipo_mensaje': new FormControl('MENSAJE'), 
      'notificacion_usuario': new FormControl([]), 
      
      });

  }

  ngOnInit() {
    console.log(this.config.data);  
    this.elementos = this.config.data;
    this.loadUsuario();
  }

  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;  
   
}

crearNotificacion(){
 this.usuarioForm.patchValue({notificacion_usuario: this.selecteditems});
 console.log(this.usuarioForm.value);



  this.loading = true;

  try {
      this.notificacionesService.crearNotificacion(this.usuarioForm.value)
      .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          swal({
            toast: false,
            type: 'success',
            title: 'Exito',
            text: 'Se creo la notificación con éxito',
            showConfirmButton: false,
            timer: 2000
          });
          this.usuarioForm.patchValue = null;
          this.loadUsuario();
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

loadUsuario(){
  
  this.loading = true;
  try {
      this.userService.getItems()
      .subscribe(resp => {
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
 
  }  
}
}
