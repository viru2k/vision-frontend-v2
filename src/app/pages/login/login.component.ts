import { User } from './../../models/user.model';
import { PmoService } from './../../services/pmo.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  elemento:User = null;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,private miServico:UserService ) {}

  ngOnInit() {
    
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      // reset login status
      this.authenticationService.logout();

      // get return url from route parameters or default to '/'
    //  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
   
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
         // .pipe(first())
          .subscribe(
              data => {
                console.log(data);
                //  this.router.navigate([this.returnUrl]);
                this.loadUser();
              },
              error => {
                console.log(error);
                  this.error = error;
                  this.loading = false;
              });
  }

  ver(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser["access_token"]);
  }

  loadUser(){
    
    this.loading = true;
    try {
      this.miServico.getItemInfoAndMenu(this.f.username.value)  
        .subscribe(resp => {
        this.elemento = resp;
            console.log(this.elemento);    
            this.loading = false;
            console.log("logueado");
          //  this.router.navigateByUrl('login');
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            localStorage.removeItem('error');
            localStorage.setItem('error', JSON.stringify(error));
        //    this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
         });    
    } catch (error) {
  //  this.throwAlert("error","Error al cargar los registros",error);
    }  
}


throwAlert(estado:string, mensaje:string, motivo:string){
  if(estado== "success"){
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }
  if(estado== "error"){
      swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        })
  }
}

}