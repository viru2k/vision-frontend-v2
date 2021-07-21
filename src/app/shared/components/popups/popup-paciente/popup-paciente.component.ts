import { PacienteService } from './../../../../services/paciente.service';
import { Paciente } from './../../../../models/paciente.model';
import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';


@Component({
  selector: 'app-popup-paciente',
  templateUrl: './popup-paciente.component.html',
  styleUrls: ['./popup-paciente.component.css']
})
export class PopupPacienteComponent implements OnInit {

 
  cols: any[];
  selectedItem: Paciente;
  es:any;
  // LOADING
  loading: boolean;
  elemento:Paciente = null;
  elementos:Paciente[] = null;
  busqueda: string = 'paciente.apellido';
  textoBusqueda:string = "";

  constructor(private miServico:PacienteService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
    this.cols = [
        {field: 'apellido', header: 'Apellido',   width: '20%'  },
        { field: 'nombre', header: 'Nombre' ,  width: '20%' },
        { field: 'dni', header: 'DNI' ,  width: '10%' },
        { field: 'fecha_nacimiento', header: 'F. nacimiento' ,  width: '20%'  },
        { field: 'domicilio', header: 'Domicilio' ,  width: '30%'  },
     ];
    } 

ngOnInit() {


}

buscar(){
    this.loadList();
}

loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServico.getItems(this.busqueda,this.textoBusqueda)          
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