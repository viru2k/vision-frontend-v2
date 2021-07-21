import { Component, OnInit } from '@angular/core';
import { CirugiaService } from 'src/app/services/cirugia.service';
import swal from 'sweetalert2';
import { URL_ARCHIVO  } from '../../../../config/config';

@Component({
  selector: 'app-popup-documentacion-detalle',
  templateUrl: './popup-documentacion-detalle.component.html',
  styleUrls: ['./popup-documentacion-detalle.component.css']
})
export class PopupDocumentacionDetalleComponent implements OnInit {

  documentos: any[];
  loading: boolean;
  cols: any[];
  selectedItem: any;


  constructor(private documentacion: CirugiaService) {

    this.cols = [
      { field: 'archivo', header: 'Archivo' , width: '40%' },
          {field: 'descripcion', header: 'Descripcion' , width: '40%' },
          { field: 'estado', header: 'Habilitado' , width: '12%' },
          { field: '', header: 'Ver' , width: '8%' },

       ];
  }

  ngOnInit() {
    this.loadList();
  }


  loadList(){
    try {
        this.documentacion.getDocumentacion()
        .subscribe(resp => {

            this.documentos = resp;
            console.log(this.documentos);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);

            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message);
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error);
    }
  }



selectedRow(event) {
  console.log(event);
  this.selectedItem = event.data;
  console.log(this.selectedItem);
 // window.open(url, "_blank");

}
goToLink(archivo: any){
  window.open(URL_ARCHIVO+'documentos/'+archivo, "_blank");
 console.log(URL_ARCHIVO+archivo);
}


  throwAlert(estado:string, mensaje:string, motivo:string){
    if(estado== 'success'){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }
    if(estado== 'error'){
        swal({
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: motivo
          })
    }
  }
  }
