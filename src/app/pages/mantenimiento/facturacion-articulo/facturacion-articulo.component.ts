import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { FacturacionService } from './../../../services/facturacion.service';
import swal from 'sweetalert2';
import { DialogService } from 'primeng/components/common/api';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { PopupArticuloComponent } from './../../../shared/components/popups/popup-articulo/popup-articulo.component';
import { calendarioIdioma } from './../../../config/config';

@Component({
  selector: 'app-facturacion-articulo',
  templateUrl: './facturacion-articulo.component.html',
  styleUrls: ['./facturacion-articulo.component.css'],
  providers: [MessageService,DialogService]
})
export class FacturacionArticuloComponent implements OnInit {

  cols: any[];
  selectedItem: any;
  es:any;
  // LOADING
  loading: boolean;
  elemento:any = null;
  elementos:any[] = null;

  constructor(private miServico:FacturacionService  ,private messageService: MessageService ,public dialogService: DialogService,private cp: CurrencyPipe, private dp: DecimalPipe ){ 
    this.cols = [
      {field: 'descripcion', header: 'Descripcion',   width: '60%'  }, 
      { field: 'importe', header: 'Importe' ,  width: '10%'  },
      { field: 'factura_alicuota_descripcion', header: 'Tipo' ,  width: '10%'  },
      { field: 'factura_tipo_articulo_dscripcion', header: 'Tipo' ,  width: '15%'  },
      { field: 'tipo_movimiento', header: 'Movimiento' ,  width: '15%'  },
   ];
  

    
  }

  ngOnInit() {
    this.loadList();
  }


  loadList(){
    this.es = calendarioIdioma;
    this.loading = true;
    console.log('cargando lista');
    try {
        this.miServico.FacturaArticulo()    
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


Nuevo(){
  let data:any; 
  const ref = this.dialogService.open(PopupArticuloComponent, {
  data,
   header: 'Editar artículo', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupArticuloComponent:any) => {
      if (PopupArticuloComponent) {
        console.log(PopupArticuloComponent);

     this.loadList();
      }
  });
}

onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    let data:any; 
    data = this.selectedItem;
    const ref = this.dialogService.open(PopupArticuloComponent, {
    data,
     header: 'Editar artículo', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupArticuloComponent:any) => {
      console.log('respuesta');
        if (PopupArticuloComponent) {
          console.log(PopupArticuloComponent);
       this.loadList();
        }
    });
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


