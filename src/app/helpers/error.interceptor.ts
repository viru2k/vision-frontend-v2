import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            try {
                
            } catch (error) {
                
            }
            console.log(String(err.status));
            let reserr= String(err.status);
            if (reserr === '401') {
                console.log('error');
               /* swal({
                    text: 'Su sesión expirado',
                    imageUrl: './assets/icons/invalid-user-profile.png',
                    imageHeight: 300,
                    imageWidth: 300,
                    title: 'Sesión vencida o invalida',
                    footer: 'No realizó acciones durante un largo periodo de tiempo, y su sesion a expirado. sera reenviado al menu de inicio',
                    showConfirmButton: false,
                    timer: 3000,
                    onClose: () => {
                        window.location.reload();
                    
                    },
                    backdrop: `
                    rgba(26, 188, 156,0.7)
                    no-repeat `
                  });*/
                    if(this.router.url === '/inicio'){}else{
          //     this.authenticationService.logout();
           //   this.router.navigateByUrl('/login');
           //    window.location.reload();
                    }
               console.log("error en la autenticacion");
            }
            
            const error = err.error.message || err.statusText;
          
            return throwError(error);
           
        }))
    }

      }
