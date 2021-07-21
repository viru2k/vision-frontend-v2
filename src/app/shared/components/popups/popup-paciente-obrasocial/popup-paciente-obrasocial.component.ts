import { PacienteService } from './../../../../services/paciente.service';
import { Paciente } from './../../../../models/paciente.model';
import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-paciente-obrasocial',
  templateUrl: './popup-paciente-obrasocial.component.html',
  styleUrls: ['./popup-paciente-obrasocial.component.css']
})
export class PopupPacienteObrasocialComponent implements OnInit {

  cols: any[];
  selectedItem: Paciente;
  es:any;
  // LOADING
  loading: boolean;
  elemento:Paciente = null;
  elementos:Paciente[] = null;
  busquedaForm:FormGroup;
  busqueda: string = 'paciente.dni';
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
  
//this.loadList();
}

buscar(){
    if((this.busqueda !=undefined)&&(this.busqueda.length >=3)){
    this.loadList();
    }else{
        this.throwAlert('warning','error','La busqueda debe tener mas de tres caracteres','100');
    }
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
            
         });    
    } catch (error) {
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
    }  
}


onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    this.ref.close(this.selectedItem);
}


/** ACCIONES */

throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
  let tipoerror:string;

  if(estado== 'success'){
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }

  if(errorNumero =='422'){
    mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
}

if(errorNumero =='99'){
  mensaje ='Debe seleccionar un paciente antes de cargar las prácticas';
  swal({   
      type: 'warning',
      title: 'Atención..',
      text: mensaje,
      footer: motivo
    })
}

if(errorNumero =='100'){
  mensaje ='El paciente posee una obra social que no esta habilitada';
  swal({   
      type: 'warning',
      title: 'Atención..',
      text: mensaje,
      footer: motivo
    })
}
  if(estado == 'warning'){
    
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
  }
  
  if((estado== 'error')&&(errorNumero!='422')){
    if(errorNumero =='422'){
        mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
    }
    if(errorNumero =='400 '){
        mensaje ='Bad Request ';
    }
    if(errorNumero =='404'){
        mensaje ='No encontrado ';
    }
    if(errorNumero =='401'){
        mensaje ='Sin autorización';
    }
    if(errorNumero =='403'){
        mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if(errorNumero =='405'){
        mensaje ='Método no permitido';
    }
    if(errorNumero =='500'){
        mensaje ='Error interno en el servidor';
    }
    if(errorNumero =='503'){
        mensaje ='Servidor no disponible';
    }
    if(errorNumero =='502'){
        mensaje ='Bad gateway';
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


