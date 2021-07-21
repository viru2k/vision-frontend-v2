import { Component, OnInit} from '@angular/core';

import { ObraSocialService } from './../../../../services/obra-social.service';
import {ObraSocial} from '../../../../models/obra-social.model';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';


@Component({
  selector: 'app-popup-obrasocial',
  templateUrl: './popup-obrasocial.component.html',
  styleUrls: ['./popup-obrasocial.component.css']
})
export class PopupObrasocialComponent implements OnInit {

  
  cols: any[];
  selectedItem: ObraSocial;
  popItem:ObraSocial;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  elemento:ObraSocial = null;
  elementos:ObraSocial[] = null;


  constructor(private miServico:ObraSocialService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
   console.log("loading");
    this.cols = [
        { field: 'nombre', header: 'Nombre' },
        {field: 'descripcion', header: 'Descripcion' },
        { field: 'es_habilitada', header: 'Habilitada' },
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
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
         });    
    } catch (error) {
    this.throwAlert("error","Error al cargar los registros",error);
    }  
}


onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    this.ref.close(this.selectedItem);
}


/** ACCIONES */


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

