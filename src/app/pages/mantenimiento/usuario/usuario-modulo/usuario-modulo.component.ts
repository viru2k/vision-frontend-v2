import { AlertServiceService } from './../../../../services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioModulo } from '../../../../models/user-modulo.model';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import swal from 'sweetalert2';




import { DialogService } from 'primeng/components/common/api';
import { MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';


@Component({
  selector: 'app-usuario-modulo',
  templateUrl: './usuario-modulo.component.html',
  styleUrls: ['./usuario-modulo.component.css']
})
export class UsuarioModuloComponent implements OnInit {

  cols: any[];
  columns: any[];
  elementos: any[];
  modulosUsuario: any[];
  selecteditems: any;
  loading;
  userData: any;
  selectedElemento: any;
  selectedModulos: any[];
  mensaje: string;

  // tslint:disable-next-line: max-line-length
  constructor(public config: DynamicDialogConfig, private userService: UserService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService, private messageService: MessageService) { }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    this.loadlist();
  }




  loadlist() {

    this.loading = true;
    this.mensaje = 'Cargando listado ...';
    try {
        this.userService.getItemsMenu()
        .subscribe(resp => {
            this.elementos = resp;
            console.log(this.elementos);
            this.loading = false;
            console.log(resp);
            this.loadlistModuloUsuario();
        },
        error => { // error path
            console.log(error);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}



loadlistModuloUsuario() {

  this.loading = true;
  this.mensaje = 'Cargando modulos del usuario ...';
  try {
      this.userService.getItemUserAndMenu(this.config.data.email)
      .subscribe(resp => {
          this.modulosUsuario = resp;
          console.log(this.modulosUsuario);
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
       });
  } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
  }
}

borrar(e: any) {
  console.log(e.value);

  this.loading = true;
  try {
      this.userService.delModulo(e.value.user_modulo_id)
      .subscribe(resp => {
          this.loadlistModuloUsuario();
          console.log(resp);
      },
      error => { // error path
          console.log(error);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
       });
  } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
  }


}

guardarModulos() {
  console.log(this.selectedModulos);

  this.loading = true;
  this.mensaje = 'Cargando modulos del usuario ...';
  try {
      this.userService.postUserMenu(this.selectedModulos, this.config.data.id)
      .subscribe(resp => {
          this.loadlistModuloUsuario();
          console.log(resp);
      },
      error => { // error path
          console.log(error);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
       });
  } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
  }

}
}
