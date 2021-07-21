import { Component, OnInit, PipeTransform } from '@angular/core';

import { ObraSocialService } from './../../../../services/obra-social.service';
import {ObraSocial} from '../../../../models/obra-social.model';
import { calendarioIdioma } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {  formatDate } from '@angular/common';
import swal from 'sweetalert2';
import { MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';


@Component({
  selector: 'app-popup-obra-social',
  templateUrl: './popup-obra-social.component.html',
  styleUrls: ['./popup-obra-social.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupObraSocialComponent implements OnInit {

  cols: any[];
  selectedItem: ObraSocial;
  displayDialog: boolean;
  popItem:ObraSocial;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  elemento:ObraSocial = null;
  elementos:ObraSocial[] = null;
  resultSave:boolean;
  _id:number = 0;

  constructor(private miServico:ObraSocialService,private messageService: MessageService ,public dialogService: DialogService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
  
    this.cols = [
    { field: 'nombre', header: 'Nombre' },
        {field: 'descripcion', header: 'Descripcion' },
        { field: 'es_habilitada', header: 'Habilitada' },
        { field: 'entidad_nombre', header: 'Entidad factura' },
        { field: 'tiene_distribucion', header: 'Distribución' },
        { field: 'es_coseguro', header: 'Es coseguro' },
     ];
    }

ngOnInit() {


this.loadList();
}


/** CARGA LA LISTA **/

loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServico.getItems()    
        .subscribe(resp => {
        this.elementos = resp;                 
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert("error","Error al cargar los registros",error,error.status);
    }  
}




selectedRow(event) {
    console.log(event);
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    this.ref.close(this.selectedItem);
  
}



actualizarDatos(){
          
    try { 
        console.log(this.popItem);
      //  console.log(this.popItem.id);
        this.miServico.putItem(this.popItem, this.popItem.id)
        .subscribe(resp => {
        this.elemento = resp;
        console.log(this.elemento);    
        this.loading = false;
        this.loadList();
        this.resultSave = true;
        },   
        error => { // error path
            console.log(error.message);
       //     console.log(error.status);
            this.throwAlert("error","Error: "+error.status,"  Error al insertar los registros",error.status);
            this.resultSave = false;
 });    
    } catch (error) {
        this.throwAlert("error","Error al cargar los registros",error,error.status);
    }
    return this.resultSave;
}

nuevoItem(){ 
   
    try { 
        this.miServico.postItem(this.popItem)
        .subscribe(resp => {
        this.elemento = resp;
        console.log(this.elemento);    
        this.loading = false;                  
        this.loadList();
        this.resultSave = true;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert("error","Error: "+error.status,  "Error al cargar los registros",error.status);
            this.resultSave = false;
          });    
    } catch (error) {
        this.throwAlert("error","Error al cargar los registros",error,error.status);
    }
    return this.resultSave;
        
}

/** ACCIONES */

imprimirTodos(){

}





throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
    let tipoerror:string;

    if(estado== "success"){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
    if(estado== "error"){
      if(errorNumero =="422"){
          mensaje ="Los datos que esta tratando de guardar son iguales a los que ya poseia";
      }
      if(errorNumero =="400 "){
          mensaje ="Bad Request ";
      }
      if(errorNumero =="404"){
          mensaje ="No encontrado ";
      }
      if(errorNumero =="401"){
          mensaje ="Sin autorización";
      }
      if(errorNumero =="403"){
          mensaje =" Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ";
      }
      if(errorNumero =="405"){
          mensaje ="Método no permitido";
      }
      if(errorNumero =="500"){
          mensaje ="Error interno en el servidor";
      }
      if(errorNumero =="503"){
          mensaje ="Servidor no disponible";
      }
      if(errorNumero =="502"){
          mensaje ="Bad gateway";
      }
      
        swal({   
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: motivo
          })
    }
}
}

