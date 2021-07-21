import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from './../../../services/alert-service.service';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'app-usuario-password',
  templateUrl: './usuario-password.component.html',
  styleUrls: ['./usuario-password.component.scss']
})
export class UsuarioPasswordComponent implements OnInit {
  loading;
  userData: any;
  password = '';
  constructor( private userService: UserService,
               private alertServiceService: AlertServiceService) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
   }

  ngOnInit() {
  }


  modificarPassword() {

    this.userData.password = this.password;
    try {
      this.userService.EditarUsuarioPassword(this.userData.id, this.userData)
      .subscribe(resp => {
        this.loading = false;
        console.log(resp);
        this.password = '';
        this.alertServiceService.throwAlert('success', 'Contraseña modificada ' , '', '200');
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
