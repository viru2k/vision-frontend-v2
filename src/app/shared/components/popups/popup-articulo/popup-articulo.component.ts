import { DialogService } from 'primeng/components/common/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FacturaArticulo } from './../../../../models/articulo.model';
import { FacturacionService } from './../../../../services/facturacion.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-articulo',
  templateUrl: './popup-articulo.component.html',
  styleUrls: ['./popup-articulo.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupArticuloComponent implements OnInit {

  constructor(private facturacionService: FacturacionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService ) { }

  updateDataForm: FormGroup;
  popItem:FacturaArticulo = null;
  newItem:boolean;
  elementosAlicuota:any[] = null;
  elementoAlicuota:any= null;

  ngOnInit() {

    this.updateDataForm = new FormGroup({
      'id': new FormControl(''),
      'descripcion': new FormControl(''),
      'factura_alicuota_id': new FormControl(0),
      'importe': new FormControl(0),
      'cantidad': new FormControl(0), 
      'unidad': new FormControl(''), 
      'tipo_articulo': new FormControl(''), 
      'tipo_movimiento': new FormControl(''), 
      'elementoAlicuota': new FormControl(''), 
  });
  this.updateDataForm.reset();
  console.log(this.config.data);
    if(this.config.data !=null){
      this.popItem =this.config.data;
      this.updateDataForm.patchValue(this.popItem);
     
      this.newItem = false;
    }else{
 
      this.popItem = new FacturaArticulo('','','',0,0,'','','');
      this.newItem = true;
    }
    this.Alicuota();
  }


  
  
  Alicuota(){

    try {
      this.facturacionService.Alicuota()
      .subscribe(resp => {      
          this.elementosAlicuota = resp;
         
          console.log( this.elementosAlicuota);          
          if(this.config.data !=null){
            this.elementoAlicuota= this.elementosAlicuota.find(x => x.iva_id == this.config.data.iva_id);
          
          }
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

 guardar(){
   if(this.config.data !=null){
    this.popItem.cantidad = this.updateDataForm.value.cantidad;
    this.popItem.descripcion = this.updateDataForm.value.descripcion;
    this.popItem.factura_alicuota_id = this.elementoAlicuota['iva_id'];
    this.popItem.id = this.updateDataForm.value.id;
    this.popItem.importe = this.updateDataForm.value.importe;
    this.popItem.tipo_articulo = this.updateDataForm.value.tipo_articulo;
    this.popItem.unidad = this.updateDataForm.value.unidad;
    console.log(this.elementoAlicuota['iva_id']);

    console.log(this.popItem);
    this.ActualizarArticulo(this.popItem);
   }else{
  //  console.log(this.updateDataForm.value);
    this.updateDataForm.patchValue({factura_alicuota_id :this.elementoAlicuota['iva_id']});
    this.NuevoArticulo(this.updateDataForm.value);
   }
 }
  
  NuevoArticulo(value:FacturaArticulo){

    try {
      this.facturacionService.CrearFacturaArticulo(value)
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

  
  ActualizarArticulo(value:FacturaArticulo){

    try {
      this.facturacionService.ActualizarFacturaArticulo(value)
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
