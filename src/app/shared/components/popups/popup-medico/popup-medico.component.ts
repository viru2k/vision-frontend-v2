import { MedicoObraSocialService } from './../../../../services/medico-obra-social.service';
import { PacienteService } from './../../../../services/paciente.service';
import { Paciente } from './../../../../models/paciente.model';
import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { MedicoObraSocial } from './../../../../models/medico-obrasocial.model';
import { DialogService } from 'primeng/components/common/api';

@Component({
  selector: 'app-popup-medico',
  templateUrl: './popup-medico.component.html',
  styleUrls: ['./popup-medico.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupMedicoComponent implements OnInit {

 
  cols: any[];
  selectedItem: MedicoObraSocial;
  es:any;
  // LOADING
  loading: boolean;
  elemento:MedicoObraSocial = null;
  elementos:MedicoObraSocial[] = null;

  constructor(private miServico:MedicoObraSocialService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService ) {
    this.cols = [
        {field: 'apellido', header: 'Apellido',   width: '20%'  },
        { field: 'nombre', header: 'Nombre' ,  width: '20%' },      
     ];
    } 

ngOnInit() {

this.loadList();
}



loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServico.getItemMedicoTodos()    
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