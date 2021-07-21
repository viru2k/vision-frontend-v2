
import { ObraSocial } from 'src/app/models/obra-social.model';


import { Component, OnInit,Output, EventEmitter,ViewChild, PipeTransform, ElementRef, OnDestroy } from '@angular/core';



import { calendarioIdioma, logo_clinica } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { MessageService, DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { PracticaService } from 'src/app/services/practica.service';
import { OperacionCobroDetalle } from '../../../../models/operacion-cobro-detalle.model';
import { formatDate, CurrencyPipe, DecimalPipe } from '@angular/common';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { PopupObraSocialComponent } from 'src/app/shared/components/popups/popup-obra-social/popup-obra-social.component';
import { config } from 'rxjs';




import { ObraSocialService } from 'src/app/services/obra-social.service';
import { PopupOperacionCobroRegistroEditarComponent } from './../popup-operacion-cobro-registro-editar/popup-operacion-cobro-registro-editar.component';
import { PopupOperacionCobroEditarComponent } from './../popup-operacion-cobro-editar/popup-operacion-cobro-editar.component';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
//import { PopupMedicoComponent } from './../../../../pages/mantenimiento/popup/popup-medico/popup-medico.component';
import { Liquidacion } from '../../../../models/liquidacion.model';
import { PopupOperacionCobroPresentacionEditarRegistroComponent } from '../popup-operacion-cobro-presentacion-editar-registro/popup-operacion-cobro-presentacion-editar-registro.component';
import { PopupMedicoComponent } from './../popup-medico/popup-medico.component';
import { PopupOperacionCobroDistribucionComponent } from './../popup-operacion-cobro-distribucion/popup-operacion-cobro-distribucion.component';
import { PopupOperacionCobroEditarDistribucionComponent } from './../popup-operacion-cobro-editar-distribucion/popup-operacion-cobro-editar-distribucion.component';

@Component({
  selector: 'app-popup-operacion-cobro-presentacion',
  templateUrl: './popup-operacion-cobro-presentacion.component.html',
  styleUrls: ['./popup-operacion-cobro-presentacion.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupOperacionCobroPresentacionComponent implements OnInit {

    
  cantidad_practica:number=0;
  total_facturado:number=0;
  total_original:number=0;
  total_categoria:number = 0;
  total_final:number = 0;
  cols: any[];
  selectedItem: OperacionCobroDetalle;
  popItem:OperacionCobroDetalle;
  newPopItem: boolean;
  resultSave:boolean;
  es:any;
  displayDialog: boolean;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  formObraSocial: FormGroup;
  elemento:OperacionCobroDetalle = null;
  elementos:OperacionCobroDetalle[] = null;
  elementosFiltrados:OperacionCobroDetalle[] = null;
  selecteditems:OperacionCobroDetalle[] = [];
  selecteditemRegistro:OperacionCobroDetalle= null;
  popItemOperacionCobro:OperacionCobroDetalle =null;
  elemento_temp:Liquidacion =null;
  popItemMedico:MedicoObraSocial= null;
  _id:number = 0;
  columns: any[];
  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;
  fechaPeriodo:Date;
  _fechaPeriodo:string;
  DateForm:FormGroup;
  popItemObraSocial:ObraSocial;
  liquidacion:Liquidacion;

  internacion_tipo:string = 'A';
  result_distribucion:any[];

    constructor(private miServicio:PracticaService,public config: DynamicDialogConfig, private messageService: MessageService ,public dialogService: DialogService,private cp: CurrencyPipe, private dp: DecimalPipe   ) {
  
          this.cols = [
              
            { field: 'accion', header: 'Accion' , width: '6%'} ,
            { field: 'liquidacion_numero', header: 'Liq. Nº',  width: '5%' },
            { field: 'operacion_cobro_id', header: 'Cobro Nº',  width: '5%' },
            { field: 'apellido', header: 'Apellido',  width: '10%' },
            {field: 'nombre', header: 'Nombre' , width: '10%' },
            { field: 'dni', header: 'DNI',  width: '7%' },
            { field: 'obra_social_nombre', header: 'O.S',  width: '15%' },
            { field: 'descripcion', header: 'Descrpición',  width: '20%' },
            { field: 'complejidad', header: 'nivel' , width: '5%'}, 
            { field: 'codigo', header: 'Codigo' , width: '8%'},
            { field: 'medico_nombre', header: 'Médico' , width: '10%'},
            { field: 'usuario_cobro_nombre', header: 'Usuario' , width: '8%'},
            { field: 'fecha_cobro' , header: 'Fecha' , width: '8%'},
            { field: 'cantidad', header: 'Cant.' , width: '6%'},
            { field: 'categorizacion', header: 'Categ.' , width: '6%'},
            { field: 'valor_facturado', header: 'Valor' , width: '6%'},
            { field: 'valor_final', header: 'Total' , width: '6%'},
            { field: 'forma_pago', header: 'Medio' , width: '10%'} 
              
           ];         

           
           this.columns = [
            {title: 'Apellido', dataKey: 'apellido'},
            {title: 'Nombre', dataKey: 'nombre'},
            {title: 'DNI', dataKey: 'dni'},
            {title: 'Obra social', dataKey: 'obra_social_nombre'},
            {title: 'Código', dataKey: 'codigo'},
            {title: 'Descripción', dataKey: 'descripcion'},
            {title: 'Nivel', dataKey: 'complejidad'},
            {title: 'Cobro', dataKey: 'fecha_cobro'},
            {title: 'Cant', dataKey: 'cantidad'},
            {title: 'Nivel', dataKey: 'complejidad'},            
            {title: 'Valor F.', dataKey: 'valor_facturado'}
        ];
          

        this.DateForm = new FormGroup({
            'fecha_desde': new FormControl('', Validators.required), 
            'fecha_hasta': new FormControl('', Validators.required), 
            'numero': new FormControl(''), 
            'nivel': new FormControl(''), 
            'obra_social_id': new FormControl('0'), 
            'obra_social_nombre': new FormControl('') ,
            'medico_id': new FormControl('0'), 
            'medico_nombre': new FormControl('') 
            });

        
 

          }
  
    ngOnInit() {
      console.log(this.config.data);  
      this.elemento_temp = this.config.data;
        this.es = calendarioIdioma;
        this.fechaDesde = new Date();
        this.fechaHasta = new Date();
        this.DateForm.patchValue({fecha_desde: this.fechaDesde});
        this.DateForm.patchValue({fecha_hasta: this.fechaHasta});
        this.popItemOperacionCobro =  new OperacionCobroDetalle('','',0,0,0,'','','','','','','','','','','',0,0,0,'','','',0);
       this.liquidacion = new Liquidacion('','','','','','','',0,0,'','',[],'','','',0);
       this.loadRegistroByIdLiquidacion();
    }
  
    actualizarFechaDesde(event){
        console.log(event);
        this.fechaDesde = event;
        console.log(new Date(this.fechaDesde));
      }

      actualizarFechaHasta(event){
        console.log(event);
        this.fechaHasta = event;
        console.log(new Date(this.fechaHasta));
      }
      actualizarFechaPeriodo(event){
        console.log(event);
        this.fechaPeriodo = event;
        console.log(new Date(this.fechaPeriodo));
      }

    /** CARGA LA LISTA **/

      editRow(row){
        console.log(row.data);
        this.popItem = row.data;
            /* if( this.actualizarDatos()){
            this.showToast('exito','Registro modificado','Exito al modificar');
        }*/
    }


    accion(event:OperacionCobroDetalle,overlaypanel: OverlayPanel,elementos:OperacionCobroDetalle){
      if(elementos){
        this.selecteditemRegistro = elementos;
      }

        console.log(this.selecteditemRegistro);
        overlaypanel.toggle(event);
      }



  sumarValores(vals:any){
    let i:number;
    //console.log(vals[1]['valor_facturado']);
    console.log(vals !== undefined);
    this.total_facturado = 0;
    this.total_original = 0;
    this.total_categoria = 0;
    this.cantidad_practica = 0;
    this.total_final=0;
    for(i=0;i<vals.length;i++){
        this.total_original = this.total_original+ Number(vals[i]['valor_original']);
        this.total_facturado = this.total_facturado+ Number(vals[i]['valor_facturado']);
        this.total_categoria = this.total_categoria+ Number(vals[i]['categorizacion']);
        
    }
    this.total_final =   this.total_facturado+ this.total_categoria;
    this.cantidad_practica = vals.length;
    console.log(this.total_facturado);
  }


  filtered(event){
      console.log(event.filteredValue);
      this.elementosFiltrados  = event.filteredValue;  
      this.sumarValores(this.elementosFiltrados);
  }



  editarRegistro(){
    let data:any; 
    data = this.selecteditemRegistro;
    const ref = this.dialogService.open(PopupOperacionCobroRegistroEditarComponent, {
    data,
     header: 'Editar registro', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupOperacionCobroRegistroEditarComponent:OperacionCobroDetalle) => {
        if (PopupOperacionCobroRegistroEditarComponent) {
          console.log(PopupOperacionCobroRegistroEditarComponent);    
          this.popItemOperacionCobro = PopupOperacionCobroRegistroEditarComponent;
          this.loadRegistroByIdLiquidacion();
        }
    });
  }


  editarOperacionCobro(){
    let data:any; 
    data = this.selecteditemRegistro;
    const ref = this.dialogService.open(PopupOperacionCobroEditarComponent, {
    data,
     header: 'Editar registro', 
     width: '98%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupOperacionCobroEditarComponent: OperacionCobroDetalle) => {
     
        if (PopupOperacionCobroEditarComponent) {
          console.log(PopupOperacionCobroEditarComponent);
          this.loadRegistroByIdLiquidacion();
        }
    });
  }



  editarDistribucion(){
    let data:any; 
    data = this.selecteditemRegistro;
    const ref = this.dialogService.open(PopupOperacionCobroEditarDistribucionComponent, {
    data,
     header: 'Editar distribución 111', 
     width: '98%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupOperacionCobroEditarComponent: OperacionCobroDetalle) => {
     
        if (PopupOperacionCobroEditarComponent) {
          console.log(PopupOperacionCobroEditarComponent);
          this.loadRegistroByIdLiquidacion();
        }
    });
  }
  
  verRegistro(){
    let data:any; 
    data = this.selecteditemRegistro;
    const ref = this.dialogService.open(PopupOperacionCobroDistribucionComponent, {
    data,
     header: 'Ver distribución', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupOperacionCobroDistribucionComponent:OperacionCobroDetalle) => {
        if (PopupOperacionCobroDistribucionComponent) {
          console.log(PopupOperacionCobroDistribucionComponent);    
          this.popItemOperacionCobro = PopupOperacionCobroDistribucionComponent;
        //  this.formObraSocial.patchValue({id: this.popItemObraSocial.id});
         // this.formObraSocial.patchValue({nombre: this.popItemObraSocial.nombre});
         
        }
    });
  }


  


  editarPresentacion(){
    let data:any; 
    data = this.selecteditemRegistro;
    const ref = this.dialogService.open(PopupOperacionCobroPresentacionEditarRegistroComponent, {
    data,
     header: 'Editar registro', 
     width: '100%',
     height: '100%'
    });
    ref.onClose.subscribe((PopupOperacionCobroPresentacionEditarRegistroComponent:OperacionCobroDetalle) => {
      this.loadRegistro();
        if (PopupOperacionCobroPresentacionEditarRegistroComponent) {
          console.log(PopupOperacionCobroPresentacionEditarRegistroComponent);    
        //  this.popItemOperacionCobro = PopupOperacionCobroEditarComponent;
         
        //  this.formObraSocial.patchValue({id: this.popItemObraSocial.id});
         // this.formObraSocial.patchValue({nombre: this.popItemObraSocial.nombre});
         
        }
    });
  }

  eliminarRegistro(){
    swal({
      title: '¿Desea eliminar el registro?',
      text: 'Va a eliminar un registro',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.deleteRegistro(this.selecteditemRegistro.id);        
      }
    })
}


  
  buscarMedico(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar Médico', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);    
          this.popItemMedico = PopupMedicoComponent;
          this.DateForm.patchValue({medico_id: this.popItemMedico.usuario_id});
          this.DateForm.patchValue({medico_nombre: this.popItemMedico.apellido+" "+this.popItemMedico.nombre});
         console.log(this.DateForm.value);
        }
    });

  }
 


  buscarObraSocial(){
    let data:any; 
    const ref = this.dialogService.open(PopupObraSocialComponent, {
    data,
     header: 'Buscar Obra social', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
        if (PopupObraSocialComponent) {
          console.log(PopupObraSocialComponent);    
          this.popItemObraSocial = PopupObraSocialComponent;
          this.DateForm.patchValue({obra_social_id: this.popItemObraSocial.id});
          this.DateForm.patchValue({obra_social_nombre: this.popItemObraSocial.nombre});
         console.log(this.DateForm.value);
        }
    });

  }
 

  loadRegistro(){
    this.es = calendarioIdioma;
    this.loading = true;
    this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd HH:mm', 'en');
    this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd HH:mm', 'en');
    console.log(this._fechaDesde+' ' +this._fechaHasta);
    try {
        this.miServicio.getOperacionCobroRegistrosBetweenDates(this._fechaDesde, this._fechaHasta, 'AFE')
        .subscribe(resp => {
          if (resp[0]) {
            let i:number = 0;
            let resultado = resp;
            resultado.forEach(element => {
              resp[i]['dni'] = resp[i]['dni'] +' - '+resp[i]['numero_afiliado'] +' / '+resp[i]['barra_afiliado'] ;
              resp[i]['valor_final'] = (Number(resp[i]['valor_facturado']) +Number(resp[i]['categorizacion'])) ;
          //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy', 'en');
          
              i++;
            });
            this.elementos = resp;
            console.log(this.elementos);
              }else{
                this.elementos =null;
              }
                   
            this.loading = false;
            console.log(resp);
            this.sumarValores(resp);
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




loadRegistroByIdLiquidacion(){
  this.es = calendarioIdioma;
  this.loading = true;

  try {
      this.miServicio.getOperacionCobroRegistrosByLiquidacionNumero(this.config.data.id)
      .subscribe(resp => {
        if (resp[0]) {
          let i:number = 0;
          let resultado = resp;
          resultado.forEach(element => {
            resp[i]['dni'] = resp[i]['dni'] +' - '+resp[i]['numero_afiliado'] +' / '+resp[i]['barra_afiliado'] ;
            resp[i]['valor_final'] = (Number(resp[i]['valor_facturado']) +Number(resp[i]['categorizacion'])) ;
        //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy', 'en');
        
            i++;
          });
          this.elementos = resp;
          console.log(this.elementos);
            }else{
              this.elementos =null;
            }
                 
          this.loading = false;
          console.log(resp);
          this.sumarValores(resp);
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




deleteRegistro(id:string){

  try {
      this.miServicio.destroyByPracticaById(id)
      .subscribe(resp => {
        if(resp == 1){
          this.throwAlert('success', 'Se modificó el registro con éxito','','');
          this.loadRegistro();
        }else{
          this.throwAlert('error', 'No se elimino ningun registro','Registro', '200');
        }

          this.loading = false;
          console.log(resp);
          this.sumarValores(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });
  } catch (error) {
  this.throwAlert('error','Error al cargar los registros',error,error.status);
  }  
}


generarPdfListado(filtro:string) {
  console.log(this.selecteditems);
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  let _fechaDesde = formatDate(this.fechaDesde, 'dd/MM/yyyy HH:mm', 'en');
  let _fechaHasta = formatDate(this.fechaHasta, 'dd/MM/yyyy HH:mm', 'en');
  let tfacturado:number = 0;
  let ttransferencia:number = 0;
  let tdebito:number = 0;
  let tcredito:number = 0;
  let tefectivo:number = 0;
  let tpractica:number = 0;
  let tvarios:number = 0;
  let tcheque:number = 0;
  let tconsulta_medico:number = 0;
  let testudio_medico:number = 0;
  let testudio_clinica:number = 0;
  let ttotal_medico:number = 0;
  
  let i = 0;
  for(i=0;i<this.selecteditems.length;i++){
    if(this.selecteditems[i]['forma_pago'] === 'TRANSFERENCIA'){
      ttransferencia = ttransferencia+Number(this.selecteditems[i]['valor_facturado']);
    }
    if(this.selecteditems[i]['forma_pago'] === 'EFECTIVO'){
      tefectivo = tefectivo+Number(this.selecteditems[i]['valor_facturado']);
    }
    if(this.selecteditems[i]['forma_pago'] === 'TARJETA - CREDITO'){
      tcredito = tcredito+Number(this.selecteditems[i]['valor_facturado']);
    }
    if(this.selecteditems[i]['forma_pago'] === 'TARJETA - DEBITO'){
      tdebito = tdebito+Number(this.selecteditems[i]['valor_facturado']);
    }
    if(this.selecteditems[i]['forma_pago'] === 'CHEQUE'){
      tcheque = tcheque+Number(this.selecteditems[i]['valor_facturado']);
    }
    if(this.selecteditems[i]['forma_pago'] === 'VARIOS'){
      tvarios = tvarios+Number(this.selecteditems[i]['valor_facturado']);
    }
    console.log(this.selecteditems[i]['complejidad']);
    if((this.selecteditems[i]['complejidad'] == '2')&&(this.selecteditems[i]['forma_pago'] !== 'TRANSFERENCIA')&&(this.selecteditems[i]['forma_pago'] !== 'TARJETA - CREDITO')&&(this.selecteditems[i]['forma_pago'] !== 'TARJETA - DEBITO')){
    
      console.log(this.selecteditems[i]['valor_facturado']);      
      testudio_medico = testudio_medico+Number(this.selecteditems[i]['valor_facturado'])*0.5;
      ttotal_medico = Number(ttotal_medico)+Number(testudio_medico);
    }
    
    if((this.selecteditems[i]['complejidad'] == '1')&&(this.selecteditems[i]['forma_pago'] !== 'TRANSFERENCIA')&&(this.selecteditems[i]['forma_pago'] !== 'TARJETA - CREDITO')&&(this.selecteditems[i]['forma_pago'] !== 'TARJETA - DEBITO')){
      tconsulta_medico = tconsulta_medico+Number(this.selecteditems[i]['valor_facturado']);
      ttotal_medico = Number(ttotal_medico)+Number(tconsulta_medico);
    }
    tfacturado = tfacturado+ Number(this.selecteditems[i]['valor_facturado']);
  }
  //tfacturado = Number(this.cp.transform(tfacturado, '', 'symbol-narrow', '1.2-2'));
  let userData = JSON.parse(localStorage.getItem('userData'));
  console.log(this.elementosFiltrados);
  console.log(this.selecteditems);
  
  if(this.selecteditems){
  let _fechaDesde = formatDate(this.fechaDesde, 'dd/MM/yyyy HH:mm', 'en');
  let _fechaHasta = formatDate(this.fechaHasta, 'dd/MM/yyyy HH:mm', 'en');
  var doc = new jsPDF('landscape');  
  /** valores de la pagina**/
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);

  doc.line(10, 33, pageWidth - 10, 33);
  doc.setFontSize(12);
  doc.text('LISTADO DE ORDENES', pageWidth/2, 15, null, null, 'center');
  doc.setFontSize(6);
  doc.text('Emitido : '+_fechaEmision, pageWidth/2, 20, null, null, 'center');
  doc.setFontSize(8);

  
  doc.setFontSize(6);
    doc.text(15, 38, 'Tarjeta : ' +this.cp.transform(tcredito, '', 'symbol-narrow', '1.2-2') ); 
    doc.text(45, 38, 'Debito: ' +this.cp.transform(tdebito, '', 'symbol-narrow', '1.2-2') ); 
    doc.text(75, 38, 'Efectivo: ' +this.cp.transform(tefectivo, '', 'symbol-narrow', '1.2-2') ); 
    doc.text(105, 38, 'Transferencia: ' +this.cp.transform(ttransferencia, '', 'symbol-narrow', '1.2-2') ); 
    doc.text(135, 38, 'Total : ' +this.cp.transform(tfacturado, '', 'symbol-narrow', '1.2-2') );  
    doc.setFontSize(8);
  if(filtro === 'medico'){ 
  
  doc.text(pageWidth-60, 15, 'Médico : ' + this.selecteditems[0]['medico_nombre']);      
  doc.text(pageWidth-60, 20, 'Usuario : ' + userData['nombreyapellido']);
  doc.text(pageWidth-60, 25, 'Desde : ' + _fechaDesde);
  doc.text(pageWidth-60, 30, 'Hasta : ' + _fechaHasta);

  doc.text(pageWidth-100, 15, 'Prácticas : ' +this.cp.transform(testudio_medico, '', 'symbol-narrow', '1.2-2') ); 
  doc.text(pageWidth-100, 20, 'Consultas: ' +this.cp.transform(tconsulta_medico, '', 'symbol-narrow', '1.2-2') ); 
 // doc.line(pageWidth-100, 23, pageWidth-80, 23);
 // doc.setFontSize(10);
 // doc.text(pageWidth-100, 30, 'Total : ' +this.cp.transform(ttotal_medico, '', 'symbol-narrow', '1.2-2') ); 
  doc.setFontSize(8);
}else{

  doc.text(pageWidth-60, 15, 'CLINICA DE LA VISION' );      
  doc.text(pageWidth-60, 20, 'Usuario : ' + userData['nombreyapellido']);
  doc.text(pageWidth-60, 25, 'Desde : ' + _fechaDesde);
  doc.text(pageWidth-60, 30, 'Hasta : ' + _fechaHasta);  
}
  doc.setFontSize(10);
  
  doc.setFontSize(8);
  doc.autoTable(this.columns, this.selecteditems,
    {
        margin: {horizontal: 5, vertical: 42},
        bodyStyles: {valign: 'top'},
        styles: {fontSize: 6,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
        columnStyles: {text: {cellWidth: 'auto'}}
    });
 // doc.save('rendicion-de-caja'+_fechaEmision+'.pdf');
 window.open(doc.output('bloburl'));  
  }
}





async generarPreFactura(){

  let td = formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en');  
  let th = formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en');
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  let rounded:string;
  let fecha_chirugia = formatDate(this.selecteditems[0]['fecha_cobro'], 'dd/MM/yyyy HH:mm', 'en');
  let total_iva:number = 0;
  let total_cantidad:number = 0;
  let total_cantidad_impresion:string = '';
  let fecha_impresion = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'es-Ar');  
  let i = 0;
  let a = 0;
  let userData = JSON.parse(localStorage.getItem('userData'));
  let y:number=0;
  /** RENGLON PARA OBRA SOCIAL */
  let i_obra_social:number;
  let y_gastos:number = 115;
  let y_honorarios:number = 80;
  let total_facturado:number = 0;

  /** RENGLON PARA COSEGURO  */
  let i_coseguro:number = 0;
  let y_gastos_coseguro:number = 115;
  let y_honorarios_coseguro:number = 80;
let total_facturado_coseguro:number = 0;
  console.log(this.selecteditems);
  

    total_cantidad_impresion = this.dp.transform(total_cantidad, '1.0-0');
  if(this.selecteditems){

    /** guardo los indices de os y coseguro */
    for(a=0;a<this.selecteditems.length;a++){
      if(this.selecteditems[a]['obra_social_id'] === 1 ){
        i_obra_social = a;
      }else{
        i_coseguro = a;
      }
    }
    // OBTENGO LA OPERACIUON DE COBRO PARA MOSTRAR
    let operacion_cobro_id = this.selecteditems[0]['operacion_cobro_id'];
  var doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
 
  /************ OBTENGO LAS DISTRIBUCIONES */
  this.result_distribucion = await this.buscarDistribucion();
  console.log(this.result_distribucion);

  let codigo:string;
  let cambio_codigo:boolean = false;
  let honorarios:string;
  let gastos:string;

/****************************************************   OBRA SOCIAL ******************************************************************************** */


doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(9);
  doc.text('Clínica de la Visión', 60, 10, null, null, 'left');
  doc.line(60, 13, pageWidth -  10 , 13);
  //doc.text('Facturación de presentaciones', 60, 18, null, null, 'left');
  doc.setFontSize(6);
  doc.text('Emitido : '+_fechaEmision, pageWidth-40, 18, null, null, 'left');
  doc.text('Nº - O.C : '+operacion_cobro_id, pageWidth-40, 22, null, null, 'left');
  doc.setFontSize(8);
  doc.text('Internación Nro: '+this.selecteditems[i_obra_social]['operacion_cobro_numero_bono'], 10, 30, null, null, 'left');
  doc.text('Obra Social: '+this.selecteditems[i_obra_social]['obra_social_nombre'], 10, 35, null, null, 'left');
  doc.text('Paciente: '+this.selecteditems[i_obra_social]['apellido']+' '+this.selecteditems[0]['nombre'], 10, 40, null, null, 'left');
  doc.text('Nro. Afiliado: '+this.selecteditems[i_obra_social]['numero_afiliado']+'/'+this.selecteditems[0]['barra_afiliado'], 10, 45, null, null, 'left');
  doc.text('Fecha de internación: '+fecha_chirugia, 10, 50, null, null, 'left');
  doc.text('Médico que interna: '+this.selecteditems[i_obra_social]['medico_nombre'], 10, 55, null, null, 'left');
  doc.setFontSize(8);
  doc.line(10, 60, pageWidth - 10, 60);
  doc.text('Código', 10, 65, null, null, 'left');
  doc.text('Práctica', 30, 65, null, null, 'left');  
  doc.text('Categoria', 140, 65, null, null, 'left');
  doc.text('Cant.', 160, 65, null, null, 'left');
  doc.text('TOTAL', 180, 65, null, null, 'left');
  doc.line(10, 68, pageWidth - 10, 68);
  doc.text('GASTOS', 10, 110, null, null, 'left'); //INICIO EN Y DE GASTOS ES 80
  doc.text('HONORARIOS', 10, 75, null, null, 'left'); // INICIO DE Y EN HONORARIOS ES 130

  for(i=0;i<this.result_distribucion.length;i++){

    if((this.result_distribucion[i]['obra_social_id'] === 1)){

/************************** DATOS DE OBRA SOCIAL */



      if(this.result_distribucion[i]['obra_social_practica_nombre'] === 'GASTOS'){
        total_facturado  = total_facturado+ (Number(this.result_distribucion[i]['distribucion_total']* Number(this.result_distribucion[i]['cantidad'])));
     //   console.log(this.result_distribucion[i]);
        doc.text(this.result_distribucion[i]['codigo'], 10, y_gastos, null, null, 'left');
        doc.text(this.result_distribucion[i]['descripcion'], 30, y_gastos, null, null, 'left');
       
        doc.text(this.result_distribucion[i]['cantidad'], 160, y_gastos, null, null, 'left');
        doc.text(String(Number(this.result_distribucion[i]['distribucion_total']) * Number(this.result_distribucion[i]['cantidad'])), 180, y_gastos, null, null, 'left');
       y_gastos =  y_gastos+5;
      }
      if(this.result_distribucion[i]['obra_social_practica_nombre'] === 'HONORARIOS'){
       // console.log(this.result_distribucion[i]);
        total_facturado  = total_facturado+ (Number(this.result_distribucion[i]['distribucion_total'])* Number(this.result_distribucion[i]['cantidad']));
        console.log((Number(this.result_distribucion[i]['distribucion_total'])* Number(this.result_distribucion[i]['cantidad'])));
        doc.text(this.result_distribucion[i]['codigo'], 10, y_honorarios, null, null, 'left');
        doc.text(this.result_distribucion[i]['descripcion'], 30, y_honorarios, null, null, 'left');
        doc.text(String(Number(this.result_distribucion[i]['categorizacion']) * Number(this.result_distribucion[i]['cantidad'])), 140, y_honorarios, null, null, 'left');
        doc.text(this.result_distribucion[i]['cantidad'], 160, y_honorarios, null, null, 'left');
        
        doc.text(String(Number(this.result_distribucion[i]['distribucion_total'])* Number(this.result_distribucion[i]['cantidad'])), 180, y_honorarios, null, null, 'left');
        total_facturado  = total_facturado+ (Number(this.result_distribucion[i]['categorizacion'])* Number(this.result_distribucion[i]['cantidad']));
        y_honorarios = y_honorarios+5;
      }
    
     
    }
  }

  
  /*****  AGREGO UNIDAD DE INTERNACION PARA OBRA SOCIAL */
  
  for(a=0;a<this.selecteditems.length;a++){
    if((this.selecteditems[a]['obra_social_id'] === 1 )&&(this.selecteditems[a]['codigo'] === '43.01.07' )){
      console.log('UNIDAD DE INTERNACION'); 
      console.log(this.selecteditems[a]);
      total_facturado  = total_facturado+ Number(this.selecteditems[a]['valor_facturado']);
      doc.text(this.selecteditems[a]['codigo'], 10, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['descripcion'], 30, y_gastos, null, null, 'left');      
      doc.text(this.selecteditems[a]['cantidad'], 160, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['valor_facturado'] , 180, y_gastos, null, null, 'left');
    //  y_gastos = y_gastos+5;
    }
  }

  // AGREGO TOTALES
  doc.setFontSize(10);
  doc.line(10, 195, pageWidth - 10, 195);
  doc.text('TOTAL: ', 10, 200, null, null, 'left');
  doc.text(this.cp.transform(total_facturado, '', 'symbol-narrow', '1.2-2'), 30, 200, null, null, 'left');
  doc.line(10, 203, pageWidth - 10, 203);
  doc.setFontSize(8);


  // RESETEO LOS VALORES
  

  
  y_gastos= 115;
  y_honorarios = 80;
  total_facturado = 0;

  /** RENGLON PARA COSEGURO  */
  
  y_gastos_coseguro= 115;
  y_honorarios_coseguro = 80;
  total_facturado_coseguro = 0;

  /****************************************************   COSEGURO ******************************************************************************** */

  doc.addPage();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(9);
  doc.text('Clínica de la Visión', 60, 10, null, null, 'left');
  doc.line(60, 13, pageWidth -  10 , 13);
  //doc.text('Facturación de presentaciones', 60, 18, null, null, 'left');
  doc.setFontSize(6);
  doc.text('Emitido : '+_fechaEmision, pageWidth-40, 18, null, null, 'left');
  doc.text('Nº - O.C : '+operacion_cobro_id, pageWidth-40, 22, null, null, 'left');
  doc.setFontSize(7);
  doc.text('Internación Nro: '+this.selecteditems[i_coseguro]['operacion_cobro_numero_bono'], 10, 30, null, null, 'left');
  doc.text('Obra Social: '+this.selecteditems[i_coseguro]['obra_social_nombre'], 10, 35, null, null, 'left');
  doc.text('Paciente: '+this.selecteditems[i_coseguro]['apellido']+' '+this.selecteditems[0]['nombre'], 10, 40, null, null, 'left');
  doc.text('Nro. Afiliado: '+this.selecteditems[i_coseguro]['numero_afiliado']+'/'+this.selecteditems[0]['barra_afiliado'], 10, 45, null, null, 'left');
  doc.text('Fecha de internación: '+fecha_chirugia, 10, 50, null, null, 'left');
  doc.text('Médico que interna: '+this.selecteditems[i_coseguro]['medico_nombre'], 10, 55, null, null, 'left');
  doc.setFontSize(8);
  doc.line(10, 60, pageWidth - 10, 60);
  doc.text('Código', 10, 65, null, null, 'left');
  doc.text('Práctica', 30, 65, null, null, 'left');  
  
  doc.text('Categoria', 140, 65, null, null, 'left');
  doc.text('Cant.', 160, 65, null, null, 'left');
  doc.text('TOTAL', 180, 65, null, null, 'left');
  doc.line(10, 70, pageWidth - 10, 70);
  doc.text('GASTOS', 10, 110, null, null, 'left'); //INICIO EN Y DE GASTOS ES 80
  doc.text('HONORARIOS', 10, 75, null, null, 'left'); // INICIO DE Y EN HONORARIOS ES 130


  for(i=0;i<this.result_distribucion.length;i++){

    if((this.result_distribucion[i]['obra_social_id'] !== 1)){

/************************** DATOS DE COSEGURO */


      if(this.result_distribucion[i]['obra_social_practica_nombre'] === 'GASTOS'){
     //   console.log(this.result_distribucion[i]);
        doc.text(this.result_distribucion[i]['codigo'], 10, y_gastos, null, null, 'left');
        doc.text(this.result_distribucion[i]['descripcion'], 30, y_gastos, null, null, 'left');
       
        doc.text(this.result_distribucion[i]['cantidad'], 160, y_gastos, null, null, 'left');
       let total_coseguro:string =  this.cp.transform(Number((this.result_distribucion[i]['distribucion_total']*20)/80) * Number(this.result_distribucion[i]['cantidad']) , '', 'symbol-narrow', '1.2-2');
       total_facturado_coseguro  = total_facturado_coseguro+ Number(((this.result_distribucion[i]['distribucion_total']*20)/80)* Number(this.result_distribucion[i]['cantidad']));
        doc.text(total_coseguro, 180, y_gastos, null, null, 'left');
       y_gastos =  y_gastos+5;
      }
      if(this.result_distribucion[i]['obra_social_practica_nombre'] === 'HONORARIOS'){
       // console.log(this.result_distribucion[i]);
    //   total_facturado_coseguro  = total_facturado_coseguro+ Number(this.result_distribucion[i]['distribucion_total']);
        doc.text(this.result_distribucion[i]['codigo'], 10, y_honorarios, null, null, 'left');
        doc.text(this.result_distribucion[i]['descripcion'], 30, y_honorarios, null, null, 'left');
        doc.text(String(Number(this.result_distribucion[i]['categorizacion']) * Number(this.result_distribucion[i]['cantidad'])), 140, y_honorarios, null, null, 'left');
        doc.text(this.result_distribucion[i]['cantidad'], 160, y_honorarios, null, null, 'left');        
        console.log((this.result_distribucion[i]['distribucion_total']*20)/80);
        console.log(this.cp.transform(((this.result_distribucion[i]['distribucion_total']*20)/80) , '', 'symbol-narrow', '1.2-2'));
        let total_coseguro:string =  this.cp.transform(((this.result_distribucion[i]['distribucion_total']*20)/80) * this.result_distribucion[i]['cantidad'] , '', 'symbol-narrow', '1.2-2');
        //total_facturado_coseguro  = total_facturado_coseguro+ (Number((this.result_distribucion[i]['distribucion_total']*20)/80)* Number(this.result_distribucion[i]['cantidad']));
        total_facturado_coseguro = total_facturado_coseguro+  (Number((this.result_distribucion[i]['distribucion_total']*20)/80)* Number(this.result_distribucion[i]['cantidad']))+ (Number(this.result_distribucion[i]['categorizacion'])* Number(this.result_distribucion[i]['cantidad']));              
        doc.text(total_coseguro, 180, y_honorarios, null, null, 'left');
        y_honorarios = y_honorarios+5;
      }
    
     
    }
  }
  /*
  *
  * VALIDAR EN PROXIMAS LIQUIDACIONES DE CAMBIAR EL CODIGO PARA CONFECCION DE PRE FACTURA
  * 
  *  PROBAR GENERAR UNA DISTRIBUCION PARA LAS UNIDADES DE NIVEL 2 
  *  ASI SE ASOCIAN A INSUMOS, DE TAL FORMA QUE PUEDAN SER AGREGADAS TODAS
  * /

   /*****  AGREGO UNIDAD DE INTERNACION E INSUMOS  PARA COSEGURO, DEBE FIGURAR */
   for(a=0;a<this.selecteditems.length;a++){
     let complejidad = Number(this.selecteditems[a]['complejidad']);
     console.log(complejidad);
    if((this.selecteditems[a]['obra_social_id'] !== 1 )&&(complejidad === 4 )){
      total_facturado_coseguro  = total_facturado_coseguro+ Number(this.selecteditems[a]['valor_facturado']);
      doc.text(this.selecteditems[a]['codigo'], 10, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['descripcion'], 30, y_gastos, null, null, 'left');      
      doc.text(this.selecteditems[a]['cantidad'], 160, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['valor_facturado'], 180, y_gastos, null, null, 'left');
      y_gastos = y_gastos+5;
    }
    /*if((this.selecteditems[a]['obra_social_id'] !== 1 )&&(this.selecteditems[a]['codigo'] === 'LIOF05' )){
      total_facturado_coseguro  = total_facturado_coseguro+ Number(this.selecteditems[a]['valor_facturado']);
      doc.text(this.selecteditems[a]['codigo'], 10, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['descripcion'], 30, y_gastos, null, null, 'left');      
      doc.text(this.selecteditems[a]['cantidad'], 160, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['valor_facturado'], 180, y_gastos, null, null, 'left');
      y_gastos = y_gastos+5;
    }*/
  }

  
  // AGREGO TOTALES
  doc.setFontSize(10);
  doc.line(10, 195, pageWidth - 10, 195);
  doc.text('TOTAL: ', 10, 200, null, null, 'left');
  doc.text(this.cp.transform(total_facturado_coseguro, '', 'symbol-narrow', '1.2-2'), 30, 200, null, null, 'left');
  doc.line(10, 203, pageWidth - 10, 203);
  doc.setFontSize(8);


/****************************************************   LENTE ******************************************************************************** */

  /********************************* AGREGO EL LENTE  */

  
  let total_lente:number = 0;
  let tiene_lente:boolean;
  for(a=0;a<this.selecteditems.length;a++){
    var lente = this.selecteditems[a]['codigo'].substring(0, 4);
    if((this.selecteditems[a]['obra_social_id'] === 1 )&&(lente === 'LIOF' )){
    tiene_lente = true;
    doc.addPage();
    }
  }
  if(tiene_lente){
    
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.setFontSize(9);
  doc.text('Clínica de la Visión', 60, 10, null, null, 'left');
  doc.line(60, 13, pageWidth -  10 , 13);
  //doc.text('Facturación de presentaciones', 60, 18, null, null, 'left');
  doc.setFontSize(6);
  doc.text('Emitido : '+_fechaEmision, pageWidth-40, 18, null, null, 'left');
  doc.text('Nº - O.C : '+operacion_cobro_id, pageWidth-40, 22, null, null, 'left');
  doc.setFontSize(7);
  doc.text('Internación Nro: '+this.selecteditems[i_obra_social]['operacion_cobro_numero_bono'], 10, 30, null, null, 'left');
  doc.text('Obra Social: '+this.selecteditems[i_obra_social]['obra_social_nombre'], 10, 35, null, null, 'left');
  doc.text('Paciente: '+this.selecteditems[i_obra_social]['apellido']+' '+this.selecteditems[0]['nombre'], 10, 40, null, null, 'left');
  doc.text('Nro. Afiliado: '+this.selecteditems[i_obra_social]['numero_afiliado']+'/'+this.selecteditems[0]['barra_afiliado'], 10, 45, null, null, 'left');
  doc.text('Fecha de internación: '+fecha_chirugia, 10, 50, null, null, 'left');
  doc.text('Médico que interna: '+this.selecteditems[i_obra_social]['medico_nombre'], 10, 55, null, null, 'left');
  doc.setFontSize(8);
  doc.line(10, 60, pageWidth - 10, 60);
  doc.text('Código', 10, 65, null, null, 'left');
  doc.text('Práctica', 30, 65, null, null, 'left');  
  doc.text('Categoria', 140, 65, null, null, 'left');
  doc.text('Cant.', 160, 65, null, null, 'left');
  doc.text('TOTAL', 180, 65, null, null, 'left');
  doc.line(10, 68, pageWidth - 10, 68);
  doc.text('INSUMOS', 10, 75, null, null, 'left'); //INICIO EN Y DE GASTOS ES 80
  
    y_gastos = 80;
  for(a=0;a<this.selecteditems.length;a++){
    if((this.selecteditems[a]['obra_social_id'] === 1 )&&(this.selecteditems[a]['codigo'] === 'LIOF05' )){
      total_lente  = total_lente+ Number(this.selecteditems[a]['valor_facturado']);
      doc.text(this.selecteditems[a]['codigo'], 10, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['descripcion'], 30, y_gastos, null, null, 'left');      
      doc.text(this.selecteditems[a]['cantidad'], 160, y_gastos, null, null, 'left');
      doc.text(this.selecteditems[a]['valor_facturado'], 180, y_gastos, null, null, 'left');
      y_gastos = y_gastos+5;
    }
  }

   // AGREGO TOTALES
   doc.setFontSize(10);
   doc.line(10, 195, pageWidth - 10, 195);
   doc.text('TOTAL: ', 10, 200, null, null, 'left');
   doc.text(this.cp.transform(total_lente, '', 'symbol-narrow', '1.2-2'), 30, 200, null, null, 'left');
   doc.line(10, 203, pageWidth - 10, 203);
   doc.setFontSize(8);
  }

  
  
  let pageNumber = doc.internal.getNumberOfPages();
  
   
    doc.setFontSize(8);
    
    
  const totalPagesExp = '{total_pages_count_string}';  
  const footer = function(data) {
    let str = 'Page ' + data.pageCount;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      str = str + ' of ' + totalPagesExp;
      console.log('test');
    }
    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
  };
    window.open(doc.output('bloburl'));  
  
  }

}

async buscarDistribucion(){
  let rest;
  try {
    
    rest = await   this.miServicio.getOperacionCobroDistribucionByIdPrefactura(this.selecteditems[0]['operacion_cobro_id'],this.selecteditems[0]['estado_liquidacion'],this.selecteditems[0]['obra_social_id'])    
      console.log(this.result_distribucion);
} catch (error) {

}  
return rest;
}






  colorRow(estado:string){
  

    if(estado == 'EFECTIVO') {
      return {'es-efectivo'  :'null' };
    }
  }  
  

      showToast(estado:string ,mensaje:string, encabezado:string){

        if(estado =='exito'){
            this.messageService.add({severity:'success', summary: mensaje, detail:encabezado});
        }
        if(estado =='info'){
            this.messageService.add({severity:'info', summary: 'El campo no es correcto', detail:'Los datos del campo son incorrectos'});
        }
        if(estado =='warning'){
            this.messageService.add({severity:'warning', summary: 'El campo no es correcto', detail:'Los datos del campo son incorrectos'});
        }
        if(estado =='error'){
            this.messageService.add({severity:'error', summary: 'Error', detail:'No se pudo modificar el registro'});
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