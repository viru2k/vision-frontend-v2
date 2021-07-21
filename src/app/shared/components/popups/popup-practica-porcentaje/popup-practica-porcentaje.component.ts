import { ConvenioService } from './../../../../services/convenio.service';
import { Convenio } from './../../../../models/convenio.model';

import { MessageService, DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { PracticaDistribucionRegistro } from 'src/app/models/practica-distribucion-registro.model';
import { OperacionCobroPractica } from 'src/app/models/operacion-cobro-practica.model';



@Component({
  selector: 'app-popup-practica-porcentaje',
  templateUrl: './popup-practica-porcentaje.component.html',
  styleUrls: ['./popup-practica-porcentaje.component.css']
})
export class PopupPracticaPorcentajeComponent implements OnInit {

  loading: boolean;
  //selectedFormaPago:any;
  selectedForma:string ;//= 'Transferencia';
  formasPago:any[];
  cols: any[];
  selectedItem: Convenio;
  selectedItemPractica: OperacionCobroPractica = null;
  
  elemento:Convenio = null;
  elementos:Convenio[] = null;
  porcentaje:number = 1;
  valorRenglon:number=0;
  totalcalculado:number = 0;
  totaloriginal:number = 0;
  observacion:string= '';
  item: PracticaDistribucionRegistro =null;
  display:boolean;

  constructor(private miServico:ConvenioService ,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {
  
    this.formasPago = [
        {name: 'TRANSFERENCIA', code: '1'},
        {name: 'EFECTIVO', code: '2'},
        {name: 'TARJETA - CREDITO', code: '3'},        
        {name: 'TARJETA - DEBITO', code: '4'},        
        {name: 'CHEQUE', code: '5'},
        {name: 'VARIOS', code: '6'},
    ];

    this.cols = [
    { field: 'obra_social_nombre', header: 'Obra Social',  width: '20%' },
        {field: 'codigo', header: 'Codigo' , width: '10%' },
        { field: 'pmo_descripcion', header: 'Descripción',  width: '40%' },
        { field: 'complejidad', header: 'Nivel',  width: '10%' },        
        { field: 'valor', header: 'Valor' , width: '10%'},        
       
     ];

    
  }

  ngOnInit() {
    this.selectedForma =  this.formasPago[0];
    console.log(this.config.data);      
    this.loadList();
    this.selectedItemPractica = new OperacionCobroPractica('0','','','','',0,0,'','-','','',0,0,'','',0,0,'','','P','','','','','','','0','');
    this.observacion = '';
  }

  loadList(){
   
    this.loading = true;
    try {
        this.miServico.getItemsByObraSocialAndCoseguro(this.config.data.id,this.config.data.coseguro_id)    
        .subscribe(resp => {
        this.elementos = resp;                 
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  
}


loadListTodos(){
   
    this.loading = true;
    try {
        this.miServico.getItems()    
        .subscribe(resp => {
        this.elementos = resp;                 
            this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  
}

onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.selectedItem);
    this.valorRenglon= this.selectedItem.valor;
    this.totaloriginal = this.selectedItem.valor;
    this.calcularPorcentaje();
    if((this.selectedItem.obra_social_id == '99')||(this.selectedItem.obra_social_id == '86')){
        this.display = true;
        
    }
}

calcularPorcentaje(){    
    
    this.totalcalculado = this.valorRenglon* this.porcentaje;
}

guardarDato(){
    
    //    this.totalcalculado = this.totalcalculado;
    console.log(this.selectedForma);
    console.log(this.totalcalculado);
    if(this.selectedItem != null){
        if(this.observacion === ''){ this.observacion = '-'}
        console.log(this.selectedItem);
     //   this.selectedItemPractica.id = this.selectedItem.id;
        this.selectedItemPractica.obra_social_id = this.selectedItem.obra_social_id;
        this.selectedItemPractica.obra_social_nombre = this.selectedItem.obra_social_nombre;
        this.selectedItemPractica.observacion = this.observacion;
        this.selectedItemPractica.operacion_cobro_id = '0';
        this.selectedItemPractica.convenio_os_pmo_id = this.selectedItem.id;
        this.selectedItemPractica.pmo_descripcion = this.selectedItem.pmo_descripcion;
        this.selectedItemPractica.obra_social_id = this.selectedItem.obra_social_id;
        this.selectedItemPractica.valor_facturado = Number(this.totalcalculado);
        this.selectedItemPractica.valor_original = this.totaloriginal;
        this.selectedItemPractica.pmo_id = this.selectedItem.pmo_id;
        this.selectedItemPractica.pmo_nivel = this.selectedItem.complejidad;
        this.selectedItemPractica.cantidad = this.porcentaje;
        this.selectedItemPractica.es_coseguro = this.selectedItem.es_coseguro;
        this.selectedItemPractica.tiene_distribucion = this.selectedItem.tiene_distribucion;
        this.selectedItemPractica.forma_pago = this.selectedForma['name'];
    console.log(this.selectedItemPractica);
    this.ref.close(this.selectedItemPractica);
    }else{
        this.throwAlert('alerta','Error en el tipo de dato seleccionado', '¿Selecciono un registro para combinar?','sin error');
    }
}

eliminarRegistro(){
    console.log(this.selectedItem);
    
}

observacionChange(event){
    this.observacion = event;  
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
}
