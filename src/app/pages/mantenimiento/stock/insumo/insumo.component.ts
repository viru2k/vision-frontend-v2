import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from './../../../../config/config';


import { StockInsumoEditarComponent } from './stock-insumo-editar/stock-insumo-editar.component';
import { InsumoService } from './../../../../services/insumo.service';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent implements OnInit {

  loading: boolean;
  selecteditem: any;
  elementos: any[] = [];
  elemento: any;
  selecteditems: any[] = [];
  es: any;
  columns: any[];
  cols: any[];
  popItemLente: any;

  constructor(private miServicio: InsumoService, private messageService: MessageService , public dialogService: DialogService) {

    this.cols = [
      { field: 'insumo_descripcion', header: 'Descripción',  width: '70%' },
      {field: 'cantidad', header: 'cantidad' , width: '20%' },
     
      { field: '', header: 'Editar' , width: '10%'} ,
   ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.loadList();
  }

  editar(event) {
    console.log(event);
    console.log(this.selecteditem);
  let data: any;
  data = event;
  const ref = this.dialogService.open(StockInsumoEditarComponent, {
  data,
   header: 'Gestionar insumo',
   width: '70%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupDetalleLenteComponent: any) => {

      if (PopupDetalleLenteComponent) {
        console.log(PopupDetalleLenteComponent);
        this.popItemLente = PopupDetalleLenteComponent;
        this.loadList();
      }
  });
  }

  agregarInsumo() {
    console.log(this.selecteditem);
    const data: any = '';

    const ref = this.dialogService.open(StockInsumoEditarComponent, {
    data,
     header: 'Gestionar insumo',
     width: '90%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupDetalleLenteComponent: any) => {
        if (PopupDetalleLenteComponent) {
          console.log(PopupDetalleLenteComponent);
          this.popItemLente = PopupDetalleLenteComponent;
          this.loadList();
        }
    });
  }


  loadList() {

    try {
        this.miServicio.getInsumo()
        .subscribe(resp => {

            this.elementos = resp;
            console.log(resp);
            this.loading = false;
        },
        error => { // error path
            console.log(error);
            console.log(error.status);
            this.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
         });
    } catch (error) {
    this.throwAlert('error', 'Error al cargar los registros' , error, error.status);
    }
}


throwAlert(estado: string, mensaje: string, motivo: string, errorNumero: string) {

  if (estado === 'success') {
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        });
  }

  if (errorNumero === '422') {
    mensaje = 'Los datos que esta tratando de guardar son iguales a los que ya poseia';
    swal({
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      });
}

  if ((estado === 'error') && (errorNumero !== '422')) {
    if (errorNumero === '422') {
        mensaje = 'Los datos que esta tratando de guardar son iguales a los que ya poseia';
    }
    if (errorNumero === '400 ') {
        mensaje = 'Bad Request ';
    }
    if (errorNumero === '404') {
        mensaje = 'No encontrado ';
    }
    if (errorNumero === '401') {
        mensaje = 'Sin autorización';
    }
    if (errorNumero === '403') {
        // tslint:disable-next-line: max-line-length
        mensaje = ' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if (errorNumero === '405') {
        mensaje = 'Método no permitido';
    }
    if ( errorNumero === '500') {
        mensaje = 'Error interno en el servidor';
    }
    if (errorNumero === '503') {
        mensaje = 'Servidor no disponible';
    }
    if (errorNumero === '502') {
        mensaje = 'Bad gateway';
    }

      swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        } );
  }


}
}

