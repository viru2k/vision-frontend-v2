import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { InsumoService } from './../../../../services/insumo.service';
import swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-popup-insumo-movimiento-detalle',
  templateUrl: './popup-insumo-movimiento-detalle.component.html',
  styleUrls: ['./popup-insumo-movimiento-detalle.component.css']
})
export class PopupInsumoMovimientoDetalleComponent implements OnInit {

  loading: boolean;
  selecteditem: any;
  elementos: any[] = [];
  elemento: any;
  selecteditems: any[] = [];
  es: any;
  columns: any[];
  cols: any[];

  constructor(private miServicio: InsumoService, public config: DynamicDialogConfig) {


    this.cols = [
      { field: 'accion', header: 'Accion' , width: '6%'} ,
      { field: 'cirugia_id', header: 'Cirugía',  width: '15%' },
      { field: 'insumo_descripcion', header: 'Descripción',  width: '30%' },
      {field: 'cantidad', header: 'Cant' , width: '10%' },
      {field: 'lote', header: 'Lote' , width: '20%' },
      {field: 'fecha_vencimiento', header: 'Vencim.' , width: '12%' },
      {field: 'insumo_stock_movimiento_fecha_ingreso', header: 'Movimien.' , width: '20%' },
      {field: 'fecha_modificacion', header: 'Ingreso' , width: '12%' },
      {field: 'cantidad_original', header: 'C. Orig.' , width: '12%' },
      {field: 'insumo_stock_movimiento_cantidad_usada', header: 'C Usada' , width: '12%' },
      {field: 'insumo_stock_movimiento_cantidad_existente', header: 'Existencia' , width: '12%' },
      {field: 'nombreyapellido', header: 'Usuario' , width: '20%' },
   ];

   }

  ngOnInit() {
    console.log(this.config.data);
    this.loadList();
  }

  accion(event: any , overlaypanel: OverlayPanel, elementos: any) {
    if (elementos) {
      this.selecteditem = elementos;
    }

      console.log(this.selecteditem);
      overlaypanel.toggle(event);
    }


  loadList() {
    this.loading = true;
    try {
        this.miServicio.getInsumoStockMovimiento(this.config.data['id'])
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

verDetalleCirugia(event) {
  console.log(event);
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

