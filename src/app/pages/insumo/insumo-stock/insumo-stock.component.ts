import { Component, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';

import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from './../../../config/config';
import { InsumoService } from './../../../services/insumo.service';
import { InsumoStockAgregarComponent } from './insumo-stock-agregar/insumo-stock-agregar.component';
import { PopupInsumoMovimientoDetalleComponent } from '../popups/popup-insumo-movimiento-detalle/popup-insumo-movimiento-detalle.component';
import { PopupInsumoAsociarComponent } from './../popups/popup-insumo-asociar/popup-insumo-asociar.component';
import { PopupInsumoConsultaComponent } from '../popups/popup-insumo-consulta/popup-insumo-consulta.component';

@Component({
  selector: 'app-insumo-stock',
  templateUrl: './insumo-stock.component.html',
  styleUrls: ['./insumo-stock.component.css']
})
export class InsumoStockComponent implements OnInit {


  loading: boolean;
  selecteditem: any;
  elementos: any[] = [];
  elemento: any;
  selecteditems: any[] = [];
  es: any;
  columns: any[];
  cols: any[];
  

  constructor(private miServicio: InsumoService, private messageService: MessageService , public dialogService: DialogService) {

    this.cols = [
      { field: 'accion', header: 'Accion' , width: '6%'} ,
      { field: 'insumo_descripcion', header: 'Descripción',  width: '30%' },
      {field: 'cantidad', header: 'Cant' , width: '10%' },
      {field: 'lote', header: 'Lote' , width: '20%' },
      {field: 'fecha_vencimiento', header: 'Vencim.' , width: '12%' },
      {field: 'fecha_ingreso', header: 'Ingreso' , width: '12%' },
      {field: 'fecha_modificacion', header: 'Movimien.' , width: '12%' },
      {field: 'cantidad_original', header: 'C. Orig.' , width: '15%' },
      {field: 'cantidad_usada', header: 'C Usada' , width: '15%' },
      {field: 'cantidad_existente', header: 'Existencia' , width: '20%' },
      {field: 'nombreyapellido', header: 'Usuario' , width: '20%' },
   ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.loadList();
  }

  consultarInsumo() {
    console.log(this.selecteditem);
    let data: any;
    data = this.selecteditem;
    const ref = this.dialogService.open(PopupInsumoConsultaComponent, {
    data,
     header: 'Consultar historial de insumo',
     width: '95%',
     height: '90%'
    });
  
    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopupInsumoAsociarComponent: any) => {
  
        if (PopupInsumoAsociarComponent) {
          console.log(PopupInsumoAsociarComponent);
          this.loadList();
        }
    });
  }

  cargarMovimiento() {
    console.log(this.selecteditem);
  let data: any;
  data = this.selecteditem;
  const ref = this.dialogService.open(PopupInsumoAsociarComponent, {
  data,
   header: 'Agregar movimiento de insumo',
   width: '60%',
   height: '90%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupInsumoAsociarComponent: any) => {

      if (PopupInsumoAsociarComponent) {
        console.log(PopupInsumoAsociarComponent);
        this.loadList();
      }
  });
  }

  accion(event: any , overlaypanel: OverlayPanel, elementos: any) {
    if (elementos) {
      this.selecteditem = elementos;
    }

      console.log(this.selecteditem);
      overlaypanel.toggle(event);
    }


  verDetalle() {

    console.log(this.selecteditem);
  let data: any;
  data = this.selecteditem;
  const ref = this.dialogService.open(PopupInsumoMovimientoDetalleComponent, {
  data,
   header: 'Detalle de insumos usados',
   width: '95%',
   height: '90%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupInsumoMovimientoDetalleComponent: any) => {

      if (PopupInsumoMovimientoDetalleComponent) {
        console.log(PopupInsumoMovimientoDetalleComponent);
       // this.popItemLente = PopupDetalleLenteComponent;
        this.loadList();
      }
  });
  }

  agregarInsumoStock() {
    console.log(this.selecteditem);
    const data: any = '';

    const ref = this.dialogService.open(InsumoStockAgregarComponent, {
    data,
     header: 'Gestionar insumo',
     width: '90%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupDetalleLenteComponent: any) => {
        if (PopupDetalleLenteComponent) {
          console.log(PopupDetalleLenteComponent);
       //   this.popItemLente = PopupDetalleLenteComponent;
          this.loadList();
        }
    });
  }


  loadList() {
    this.loading = true;
    try {
        this.miServicio.getInsumoStock()
        .subscribe(resp => {

            this.elementos = resp;
            console.log(resp);
            this.loading = false;
        },
        error => { // error path
          this.loading = false;
            console.log(error);
            console.log(error.status);
            this.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
         });
    } catch (error) {
      this.loading = false;
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


