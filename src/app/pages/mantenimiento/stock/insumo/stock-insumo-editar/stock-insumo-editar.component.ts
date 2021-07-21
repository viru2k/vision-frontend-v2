import { DialogService } from 'primeng/components/common/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Insumo } from './../../../../../models/insumo.model';
import { InsumoService } from './../../../../../services/insumo.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-stock-insumo-editar',
  templateUrl: './stock-insumo-editar.component.html',
  styleUrls: ['./stock-insumo-editar.component.css']
})
export class StockInsumoEditarComponent implements OnInit {

 
  // tslint:disable-next-line: max-line-length
  constructor(private insumoService: InsumoService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService ) { }

  updateDataForm: FormGroup;
  popItem:Insumo = null;
  newItem:boolean;
  elementosAlicuota:any[] = null;
  elementoAlicuota:any= null;

  ngOnInit() {

    this.updateDataForm = new FormGroup({
      'id': new FormControl(''),
      'insumo_descripcion': new FormControl(''),
      'cantidad': new FormControl(0),
      'unidad_id': new FormControl(1)
  });
  this.updateDataForm.reset();
  console.log(this.config.data);
    if (this.config.data) {
      this.popItem =this.config.data;
      this.updateDataForm.patchValue(this.popItem);
      this.newItem = false;
    } else {
      console.log('vacio');
      this.popItem = new Insumo('0', '', '1', 0, 'ACTIVO');
      this.newItem = true;
    }
  }



 guardar(){
   if (this.config.data) {
     console.log(this.updateDataForm);
    this.popItem.cantidad = this.updateDataForm.value.cantidad;
    this.popItem.insumo_descripcion = this.updateDataForm.value.insumo_descripcion;
    this.popItem.unidad_id = '1';
    
    console.log(this.popItem);
    this.ActualizarInsumo(this.popItem);
   } else {
    this.updateDataForm.patchValue({unidad_id: '1'});
    this.NuevoInsumo(this.updateDataForm.value);
   }
 }
  
  NuevoInsumo(value:Insumo){
    console.log(value);
    try {
      this.insumoService.crearInsumo(value)
      .subscribe(resp => {
        this.ref.close(value);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            text: error.message,
            title: 'error.status',
            showConfirmButton: false,
            timer: 2000
          });
       });
  } catch (error) {
  
  }  
  }

  
  ActualizarInsumo(value: Insumo){

    try {
      this.insumoService.actualizarInsumo(value, value.id)
      .subscribe(resp => {
         this.ref.close(value);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            text: error.message,
            title: 'error.status',
            showConfirmButton: false,
            timer: 2000
          });
       });    
  } catch (error) {
  
  }  
  }

}
