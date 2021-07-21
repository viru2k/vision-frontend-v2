import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from '../../../../config/config';
import { InsumoService } from './../../../../services/insumo.service';

@Component({
  selector: 'app-popup-insumo-asociar',
  templateUrl: './popup-insumo-asociar.component.html',
  styleUrls: ['./popup-insumo-asociar.component.css']
})
export class PopupInsumoAsociarComponent implements OnInit {

  es: any;
  updateDataForm: FormGroup;
  userData: any;
  loading;
  // tslint:disable-next-line: max-line-length
  constructor(private miServicio: InsumoService,  public config: DynamicDialogConfig, private messageService: MessageService , public dialogService: DialogService, public ref: DynamicDialogRef) {
    this.es = calendarioIdioma;
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    this.updateDataForm = new FormGroup({
      'id': new FormControl('0'),
      'insumo_id': new FormControl(),
      'usuario_id': new FormControl(),
      'cirugia_id': new FormControl('0'),
      'fecha_ingreso': new FormControl(new Date),
      'insumo_stock_id': new FormControl(),
      'cantidad_usada': new FormControl('0'),
      'cantidad_usada_insumo': new FormControl('0'),
      'cantidad_existente': new FormControl('0'),
      'cantidad_original': new FormControl('0'),
  });
  
  this.updateDataForm.patchValue({insumo_id: this.config.data['insumo_id']});
  this.updateDataForm.patchValue({usuario_id:  this.userData['id']});
  this.updateDataForm.patchValue({insumo_stock_id: this.config.data['id']});
  this.updateDataForm.patchValue({cantidad_existente: this.config.data['cantidad_existente']});
  this.updateDataForm.patchValue({cantidad_original: this.config.data['cantidad_original']});
  this.updateDataForm.patchValue({cantidad_usada_insumo: this.config.data['cantidad_usada']});

  console.log(this.updateDataForm.value);
  }

  guardarDatos() {
    console.log(this.updateDataForm.value.cantidad_existente);
    console.log(this.updateDataForm.value.cantidad_usada);
    if (this.updateDataForm.value.cantidad_existente < this.updateDataForm.value.cantidad_usada ) {
        swal({
            type: 'warning',
            title: 'Cantidad excedida',
            text: 'La cantidad no puede ser mayor a la existente'
          });
    } else {
      this.loading = true;
      try {
          this.miServicio.crearInsumoStockMovimiento(this.updateDataForm.value)
          .subscribe(resp => {

              console.log(resp);
              this.loading = false;
              swal({
                type: 'success',
                title: 'Agregado',
                text: 'El movimiento fue guardado',
                showConfirmButton: false,
                timer: 2000
              });
              this.ref.close();
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
