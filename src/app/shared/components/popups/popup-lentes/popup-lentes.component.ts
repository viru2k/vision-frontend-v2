

import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef, MessageService, DialogService } from 'primeng/api';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { CirugiaLente } from 'src/app/models/cirugia-lente.model';
import { CirugiaService } from '../../../../services/cirugia.service';
import { CirugiaFicha } from '../../../../models/cirugia-ficha.model';
import { Filter } from './../../../filter';

@Component({
  selector: 'app-popup-lentes',
  templateUrl: './popup-lentes.component.html',
  styleUrls: ['./popup-lentes.component.css']
})
export class PopupLentesComponent implements OnInit {

 
  cols: any[];
  selectedItem: CirugiaLente;
  es:any;
  // LOADING
  loading: boolean;
  elemento:CirugiaLente = null;
  elementos:CirugiaLente[] = null;
  cirugia_lente:CirugiaFicha;
  constructor(private miServicio:CirugiaService,private messageService: MessageService ,public dialogService: DialogService, public ref: DynamicDialogRef, public config: DynamicDialogConfig , private filter: Filter  ) { 

    this.cols = [              
      { field: 'tipo', header: 'Lente',  width: '20%' },
      {field: 'dioptria', header: 'Dioptria' , width: '10%' },
      { field: 'lote', header: 'Lote',  width: '15%' },
      { field: 'fecha_vencimiento', header: 'F. vencimiento',  width: '10%' },
      { field: 'proveedor', header: 'Proveedor',  width: '20%' },
      { field: 'ubicacion', header: 'Ubicación',  width: '10%' },
      { field: 'estado', header: 'Estado',  width: '20%' },
      { field: '', header: 'Seleccionar' , width: '10%'} ,
   ];

  }

ngOnInit() {
  
    console.log(this.config.data);
   
    
this.loadList();
}



loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    try {
        this.miServicio.getLentesSinUso('NO')    
        .subscribe(resp => {
        this.elementos = resp;
            console.log(this.elementos);    
            this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
      this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
    }  
}

seleccionarLente(elem:any){
console.log(elem);
this.loading = true;
let vacio:string[] = []
this.cirugia_lente = new CirugiaFicha(this.config.data.id,'', '', '', '', '', '', '', '', '', '', '',elem.id ,'', '', '', '', '', '', '', '', '');
console.log(this.cirugia_lente);
try {
    this.miServicio.postLenteFichaQuirurgica(this.cirugia_lente)    
    .subscribe(resp => {
    this.elementos = resp;
        console.log(this.elementos);    
        this.loading = false;       
        
      
          this.ref.close(this.elementos);
        
        
    
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
     });    
} catch (error) {
  this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
}  

}



sinLente(){
  
  this.loading = true;
  let vacio:string[] = []
  this.cirugia_lente = new CirugiaFicha(this.config.data.id,'', '', '', '', '', '', '', '', '', '', '','0' ,'', '', '', '', '', '', '', '', '');
  console.log(this.cirugia_lente);
  try {
      this.miServicio.postLenteFichaQuirurgica(this.cirugia_lente)    
      .subscribe(resp => {
      this.elementos = resp;
          console.log(this.elementos);    
          this.loading = false;       
          
        
            this.ref.close(this.elementos);
          
          
      
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
       });    
  } catch (error) {
    this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
  }  
  
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
      if(estado== 'error'){
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
      if(estado== 'alerta'){
        swal({   
            type: 'warning',
            title: 'Cuidado!',
            text: mensaje,
            footer: motivo
          })
    }
    }

    vencimiento(vencimiento){


      if((this.filter.monthDiff(vencimiento) < 6) ){
        if((this.filter.monthDiff(vencimiento) < 3)){
          return {'texto-warning'  :'null' };
        } else{
          return {'text-danger'  :'null' };
        }
      } else{
        return {'texto-success'  :'null' };
      }
     
    }  
}
