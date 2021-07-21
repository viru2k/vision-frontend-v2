import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import { DynamicDialogConfig, MessageService, DialogService } from 'primeng/api';
import { CirugiaFicha } from '../../../../models/cirugia-ficha.model';
import { CirugiaLente } from './../../../../models/cirugia-lente.model';
import swal from 'sweetalert2';
import { PopupLentesComponent } from './../popup-lentes/popup-lentes.component';
import { Filter } from './../../../filter';

@Component({
  selector: 'app-popup-ficha-quirurgica-lente',
  templateUrl: './popup-ficha-quirurgica-lente.component.html',
  styleUrls: ['./popup-ficha-quirurgica-lente.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupFichaQuirurgicaLenteComponent implements OnInit {
  columns: any[];
  cols: any[];
  selecteditems:CirugiaLente[] = [];
  elementos:CirugiaLente[] = null;
  loading: boolean;
  selectedItem:CirugiaLente;

  constructor(public config: DynamicDialogConfig, private miServicio:CirugiaService,private messageService: MessageService ,public dialogService: DialogService , private filter: Filter ) {

    this.cols = [
              
    
      { field: 'tipo', header: 'Lente',  width: '20%' },
      {field: 'dioptria', header: 'Dioptria' , width: '10%' },
      { field: 'lote', header: 'Lote',  width: '15%' },
      { field: 'fecha_vencimiento', header: 'F. vencimiento',  width: '10%' },
      { field: 'proveedor', header: 'Proveedor',  width: '20%' },
      { field: 'estado', header: 'Estado',  width: '20%' },
      { field: '', header: 'Quitar' , width: '10%'} ,
      

   ];
   }

  ngOnInit() {
    console.log(this.config.data);
    this.loadList();
  }

  agregarLente(){
 
    let data:any;  
    data = this.config.data;
    const ref = this.dialogService.open(PopupLentesComponent, {
    data,
     header: 'Gestionar lente', 
     width: '90%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupFichaQuirurgicaLenteComponent:CirugiaLente) => {
        if (PopupFichaQuirurgicaLenteComponent) {
          console.log(PopupFichaQuirurgicaLenteComponent);
         this.loadList();
        }
    });
    
  }
  onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.selectedItem);   
}

  loadList() {

    try {
        this.miServicio.getFichaLente(this.config.data.id)
        .subscribe(resp => {

            this.elementos = resp;
            console.log(resp);
            this.loading = false;
           
        },
        error => { // error path
            console.log(error);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
}


quitar(event){
   console.log(event);
  try {
    this.miServicio.delLenteFichaQuirurgica( event.lente_id , event.cirugia_id)
    .subscribe(resp => {

    //    this.elementos = resp;
        console.log(resp);
        this.loading = false;
        this.loadList();
        this.throwAlert('success','Se elimino el lente de la ficha con éxito','','');
    },
    error => { // error path
        console.log(error);
        console.log(error.status);
    //    this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
     });
} catch (error) {
//this.throwAlert('error','Error al cargar los registros',error,error.status);
}
}





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
