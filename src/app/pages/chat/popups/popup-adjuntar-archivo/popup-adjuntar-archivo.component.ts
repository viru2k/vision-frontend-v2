import { Component, OnInit } from '@angular/core';
import { MessageService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { URL_ARCHIVO_SUBIDA } from './../../../../config/config';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-adjuntar-archivo',
  templateUrl: './popup-adjuntar-archivo.component.html',
  styleUrls: ['./popup-adjuntar-archivo.component.css']
})
export class PopupAdjuntarArchivoComponent implements OnInit {

  uploadedFiles: any;
  public url:string  = URL_ARCHIVO_SUBIDA;
  userData:any;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }
    ngOnInit() {
     // console.log(this.config.data);
     // console.log(this.userData);
    }


    onUpload(event) { 

         console.log('subido');
         swal({
           type: 'success',
           title: 'Exito',
           text: 'Archivo subido con éxito'
         });
         this.ref.close(event);
     }
}
