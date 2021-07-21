import { Convenio } from './../../../../models/convenio.model';
import { ConvenioService } from './../../../../services/convenio.service';
import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';



@Component({
  selector: 'app-popup-convenio',
  templateUrl: './popup-convenio.component.html',
  styleUrls: ['./popup-convenio.component.css']
})
export class PopupConvenioComponent implements OnInit {

 
  cols: any[];
  selectedItem: Convenio;
  es:any;
  // LOADING
  loading: boolean;
  elemento:Convenio = null;
  elementos:Convenio[] = null;

  constructor(private miServico:ConvenioService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
    this.cols = [
       
        { field: 'obra_social_nombre', header: 'Obra social' ,  width: '30%' },
        {field: 'codigo', header: 'Codigo',   width: '10%'  },
        { field: 'pmo_descripcion', header: 'Descripción' ,  width: '40%' },
        { field: 'complejidad', header: 'Complejidad' ,  width: '10%'  },
        { field: 'valor', header: 'Valor' ,  width: '10%'  },
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