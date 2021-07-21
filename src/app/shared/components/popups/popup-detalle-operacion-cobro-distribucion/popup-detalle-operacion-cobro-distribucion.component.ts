import { Component, OnInit } from '@angular/core';
import { MedicoObraSocialService } from '../../../../services/medico-obra-social.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import swal from 'sweetalert2';
import { MedicoObraSocial } from './../../../../models/medico-obrasocial.model';
import { calendarioIdioma } from '../../../../config/config';
import { LiquidacionDistribucion } from '../../../../models/liquidacion-distribucion-model';
import { formatDate } from '@angular/common';
import { LiquidacionService } from '../../../../services/liquidacion.service';


@Component({
  selector: 'app-popup-detalle-operacion-cobro-distribucion',
  templateUrl: './popup-detalle-operacion-cobro-distribucion.component.html',
  styleUrls: ['./popup-detalle-operacion-cobro-distribucion.component.css']
})
export class PopupDetalleOperacionCobroDistribucionComponent implements OnInit {

  constructor(private miServico:MedicoObraSocialService, private liquidacionService:LiquidacionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) { }

  TOTAL_DISTRIBUCION: number = 1000;
  TOTAL_CALCULADO: number = 0;
  /**** medico seleccionado */
  selectedMedicoOpera: MedicoObraSocial;
  selectedMedicoAyuda: MedicoObraSocial;
  selectedMedicoAyuda2: MedicoObraSocial;
  selectedClinica: MedicoObraSocial;

  /** porcentaje */
  medicoOperaPorcentaje: number = 0;
  medicoAyudaPorcentaje: number = 0;
  medicoAyuda2Porcentaje: number = 0;
  medicoClinicaPorcentaje: number = 50;
  /** distribucion */
  medicoOperaDistribucion: number = 0;
  medicoAyudaDistribucion: number = 0;
  medicoAyuda2Distribucion: number = 0;
  medicoClinicaDistribucion: number = 0;
  liquidacionDistribucion:LiquidacionDistribucion = null;
  selecteditems:any[];
  es:any;
  // LOADING
  loading: boolean;
  elemento:MedicoObraSocial = null;

  elementosOpera:MedicoObraSocial[] = null;
  elementosAyuda:MedicoObraSocial[] = null;
  elementosAyuda2:MedicoObraSocial[] = null;
  elementosClinica:MedicoObraSocial[] = null;

  filteredItemsOpera: any[];
  filteredItemsAyuda: any[];
  filteredItemsAyuda2: any[];
  filteredItemsClinica: any[];

  medicoOpera:string ;
  medicoAyuda:string;
  medicoAyuda2:string;
  medicoClinica:string;

  nombre:string;

  ngOnInit() {
    console.log(this.config.data);
    console.log(this.config.data.liquidacion_distribucion_id);
    this.liquidacionDistribucion = new LiquidacionDistribucion('','',0,0,'',0,0,'',0,0,'',0,0,0,0,'','','','',this.config.data);
    this.selecteditems = this.config.data;
    //console.log(this.config.data['0']['nombre']);
    //console.log(this.config.data['0']['liquidacion_distribucion_id']);
    //console.log(this.config.data['0']); 
  

   this.sumarValores();
    this.calcularPorcentaje();
    this.loadList();
  }


  
loadList(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.miServico.getItemMedicoTodos()
      .subscribe(resp => {

        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {   
        resp[i]['nombre']  =  element['apellido'] +' '+element['nombre'];
        this.elementosOpera = resp;
        this.elementosAyuda = resp;
        this.elementosAyuda2 = resp;
        this.elementosClinica = resp;
        i++;
    });
          console.log(this.elementosOpera);    
          this.loading = false;
          if (this.config.data.liquidacion_distribucion_id > 0) {
            console.log('tiene distribucion');
            this.GetDistribucionByNumero();
          }
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });    
  } catch (error) {
    this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
  }  
}



  
GetDistribucionByNumero(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.liquidacionService.GetDistribucionByNumero(this.config.data.liquidacion_distribucion_id)
      .subscribe(resp => {
        console.log(resp[0]);
        if (resp[0]) {          
         // OPERA
          this.medicoOpera = resp[0].medico_opera_id;
          this.medicoOperaPorcentaje = resp[0].medico_opera_porcentaje; 
          this.medicoOperaDistribucion = resp[0].medico_opera_valor;
          // AYUDA
          this.medicoAyuda = resp[0].medico_ayuda_id;
          this.medicoAyudaPorcentaje = resp[0].medico_ayuda_porcentaje; 
          this.medicoAyudaDistribucion = resp[0].medico_ayuda_valor;
          //AYUDA 2
          this.medicoAyuda2 = resp[0].medico_ayuda2_id;
          this.medicoAyuda2Porcentaje = resp[0].medico_ayuda2_porcentaje; 
          this.medicoAyudaDistribucion = resp[0].medico_ayuda2_valor;
          // CLINICA

          this.medicoClinica = resp[0].medico_clinica_id;
          this.medicoClinicaPorcentaje = resp[0].medico_clinica_porcentaje; 
          this.medicoClinicaDistribucion = resp[0].medico_clinica_valor;
          this.TOTAL_CALCULADO =  resp[0].total;
          this.TOTAL_DISTRIBUCION =  resp[0].valor_distribuido;
          this.TOTAL_CALCULADO =  resp[0].total;
        }
        
          this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });    
  } catch (error) {
    this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
  }  
}


ActualizarliquidarPracticas() {
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.liquidacionService.liquidarOperacionCobroActualizar(this.liquidacionDistribucion)    
      .subscribe(resp => {

        let i:number = 0;
        let resultado = resp;
      
          console.log(resp);    
          this.loading = false;
          swal({
            toast: false,
            type: 'success',
            title: 'Datos guardados',
            showConfirmButton: false,
            timer: 1000
          });
          this.ref.close();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });    
  } catch (error) {
    this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
  }  

}

liquidarPracticas(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.liquidacionService.liquidarOperacionCobro(this.liquidacionDistribucion)    
      .subscribe(resp => {

        let i:number = 0;
        let resultado = resp;
      
          console.log(resp);    
          this.loading = false;
          swal({
            toast: false,
            type: 'success',
            title: 'Datos guardados',
            showConfirmButton: false,
            timer: 1000
          });
          this.ref.close();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });    
  } catch (error) {
    this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
  }  
}


guardarDistribucion(){
  let userData = JSON.parse(localStorage.getItem('userData'));
  const fecha_distribucion = formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en');
 this.liquidacionDistribucion.fecha_distribucion = fecha_distribucion;
 this.liquidacionDistribucion.usuario_audito = userData['id'];
  if(this.medicoOpera)
  {
    this.liquidacionDistribucion.medico_opera_id = this.medicoOpera ;
    this.liquidacionDistribucion.medico_opera_porcentaje = this.medicoOperaPorcentaje;
    this.liquidacionDistribucion.medico_opera_valor = this.medicoOperaDistribucion;
    console.log(this.liquidacionDistribucion);
  }
 if(this.medicoAyuda){
    this.liquidacionDistribucion.medico_ayuda_id = this.medicoAyuda ;
    this.liquidacionDistribucion.medico_ayuda_porcentaje = this.medicoAyudaPorcentaje;
    this.liquidacionDistribucion.medico_ayuda_valor = this.medicoAyudaDistribucion;
  }
  if(this.medicoAyuda2){
    
    this.liquidacionDistribucion.medico_ayuda2_id = this.medicoAyuda2 ;
    this.liquidacionDistribucion.medico_ayuda2_porcentaje = this.medicoAyuda2Porcentaje;
    this.liquidacionDistribucion.medico_ayuda2_valor = this.medicoAyuda2Distribucion;
  }
  if(this.medicoClinica){
    this.liquidacionDistribucion.medico_clinica_id = this.medicoClinica ;
    this.liquidacionDistribucion.medico_clinica_porcentaje = this.medicoClinicaPorcentaje;
    this.liquidacionDistribucion.medico_clinica_valor = this.medicoClinicaDistribucion;
  }
   this.liquidacionDistribucion.valor_distribuido = this.TOTAL_DISTRIBUCION;
   this.liquidacionDistribucion.total = this.TOTAL_CALCULADO;
/*
  console.log(this.liquidacionDistribucion);
  console.log(this.filteredItems);*/
  
  if (this.config.data.liquidacion_distribucion_id > 0) {
    this.liquidacionDistribucion.id =this.config.data.liquidacion_distribucion_id;
    this.ActualizarliquidarPracticas();
  } else{
    this.liquidarPracticas();
  }
 
}

calcularPorcentaje(){
 this.medicoOperaDistribucion =  (this.medicoOperaPorcentaje *  this.TOTAL_DISTRIBUCION)/100;
 this.medicoAyudaDistribucion =  (this.medicoAyudaPorcentaje *  this.TOTAL_DISTRIBUCION)/100;
 this.medicoAyuda2Distribucion =  (this.medicoAyuda2Porcentaje *  this.TOTAL_DISTRIBUCION)/100;
 this.medicoClinicaDistribucion =  (this.medicoClinicaPorcentaje *  this.TOTAL_DISTRIBUCION)/100;
 this.TOTAL_CALCULADO = this.medicoOperaDistribucion + this.medicoAyudaDistribucion + this.medicoAyuda2Distribucion +  this.medicoClinicaDistribucion;
}


sumarValores(){
  
  let i:number;

  console.log(this.selecteditems);
  this.TOTAL_DISTRIBUCION = 0;

  for(i=0;i<this.selecteditems.length;i++){
    if (this.config.data.liquidacion_distribucion_id > 0) {      
    } else {
      this.TOTAL_DISTRIBUCION = this.TOTAL_DISTRIBUCION+ Number(this.selecteditems[i]['valor_facturado'])+Number(this.selecteditems[i]['categorizacion']);      
    }
      
  }

  console.log(this.TOTAL_DISTRIBUCION);
}


filterItemsOpera(event) {
 let item:any;
  this.filteredItemsOpera = [];
  for(let i = 0; i < this.elementosOpera.length; i++) {
        let nombre= this.elementosOpera[i]['nombre'];
      
      if(this.elementosOpera[i]['nombre'].toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        item= this.elementosOpera[i];
        console.log(this.filteredItemsOpera);
          this.filteredItemsOpera.push(this.elementosOpera[i]);
      }
  }
}

filterItemsAyuda(event) {
  let item:any;
   this.filteredItemsAyuda = [];
   for(let i = 0; i < this.elementosAyuda.length; i++) {
         let nombre= this.elementosAyuda[i]['nombre'];
       
       if(this.elementosAyuda[i]['nombre'].toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
         item= this.elementosAyuda[i];
         console.log(this.filteredItemsAyuda);
           this.filteredItemsAyuda.push(this.elementosAyuda[i]);
       }
   }
 }

 filterItemsAyuda2(event) {
  let item:any;
   this.filteredItemsAyuda2 = [];
   for(let i = 0; i < this.elementosAyuda2.length; i++) {
         let nombre= this.elementosAyuda2[i]['nombre'];
       
       if(this.elementosAyuda2[i]['nombre'].toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
         item= this.elementosAyuda2[i];
         console.log(this.filteredItemsAyuda2);
           this.filteredItemsAyuda2.push(this.elementosAyuda2[i]);
       }
   }
 }

 filterItemsClinica(event) {
  let item:any;
   this.filteredItemsClinica = [];
   for(let i = 0; i < this.elementosClinica.length; i++) {
         let nombre= this.elementosClinica[i]['nombre'];
       
       if(this.elementosClinica[i]['nombre'].toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
         item= this.elementosClinica[i];
         console.log(this.filteredItemsClinica);
           this.filteredItemsClinica.push(this.elementosClinica[i]);
       }
   }
 }


seleccionadoOpera(elemento:any){

  console.log(elemento.usuario_id);
  this.medicoOpera = elemento.usuario_id;
}

seleccionadoAyuda(elemento:any){
  console.log(elemento);
  this.medicoAyuda = elemento.usuario_id;
}

seleccionadoAyuda2(elemento:any){
  console.log(elemento);
  this.medicoAyuda2 = elemento.usuario_id;
}

seleccionadoClinica(elemento:any){
  console.log(elemento);
  this.medicoClinica = elemento.usuario_id;
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

  if(errorNumero =='422'){
    mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
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

