

import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { CirugiaLente } from 'src/app/models/cirugia-lente.model';
import { CirugiaService } from '../../../../services/cirugia.service';

@Component({
  selector: 'app-popup-lente-tipo',
  templateUrl: './popup-lente-tipo.component.html',
  styleUrls: ['./popup-lente-tipo.component.css']
})
export class PopupLenteTipoComponent implements OnInit {

  cols: any[];
  selectedItem: any;
  es:any;
  // LOADING
  loading: boolean;
  elemento:any = null;
  elementos:any[] = null;

  constructor(private miServico:CirugiaService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
    this.cols = [
        {field: 'tipo', header: 'Tipo lente',   width: '20%'  },
        { field: 'proveedor', header: 'Proveedor' ,  width: '20%' },      
     ];
    } 

ngOnInit() {

this.loadList();
}



loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServico.getLenteTipo()    
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