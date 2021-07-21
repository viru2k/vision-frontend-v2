import { PacienteService } from '../../../../services/paciente.service';

import { Component, OnInit, PipeTransform ,EventEmitter, Output} from '@angular/core';

import { Paciente } from '../../../../models/paciente.model';
import { calendarioIdioma } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'app-popup-paciente-ampliado',
  templateUrl: './popup-paciente-ampliado.component.html',
  styleUrls: ['./popup-paciente-ampliado.component.css']
})
export class PopupPacienteAmpliadoComponent implements OnInit {

  
  cols: any[];
  selectedItem: Paciente;
  displayDialog: boolean;
  popItem:Paciente;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  elemento:Paciente = null;
  elementos:Paciente[] = null;
  busquedaForm:FormGroup;
  busqueda: string = 'paciente.apellido';
  textoBusqueda:string = "";
  
  constructor(private miServico:PacienteService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
   console.log("loading");
    this.cols = [
      { field: 'apellido', header: 'Apellido' },
      {field: 'nombre', header: 'Nombre' },
      { field: 'dni', header: 'DNI' },
      { field: 'fecha_nacimiento', header: 'Fecha Nacimiento' },
      { field: 'domicilio', header: 'Domicilio' },
      { field: 'telefono_cel', header: 'Telefono celular' },
     ];
    } 

ngOnInit() {
    this.busquedaForm = new FormGroup({'consulta': new FormControl("", Validators.required)});
//this.loadList();
}

buscar(){
    this.loadList();
}
/** CARGA LA LISTA **/


loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    console.log(this.busquedaForm.value.consulta);
    try {
            this.miServico.getItems(this.busqueda,this.textoBusqueda)     
            .subscribe(resp => {
            this.elementos = resp;            
            this.loading = false;
        },
        error => { // error path
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
         });    
    } catch (error) {
          this.throwAlert("error","Error al cargar los registros",error);
    }  
}


onRowSelect(event) {  
    this.selectedItem = event.data;   
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

