import { PopupOperacionCobroRegistroEditarComponent } from '../../../../shared/components/popups/popup-operacion-cobro-registro-editar/popup-operacion-cobro-registro-editar.component';
import { ObraSocial } from 'src/app/models/obra-social.model';

import { ObraSocialService } from '../../../../services/obra-social.service';
import { Component, OnInit,Output, EventEmitter,ViewChild, PipeTransform, ElementRef, OnDestroy } from '@angular/core';
import { ConvenioService } from '../../../../services/convenio.service';
import {Convenio} from   '../../../../models/convenio.model';

import { calendarioIdioma, logo_clinica } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable'); 

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { PracticaService } from 'src/app/services/practica.service';
import { OperacionCobroDetalle } from 'src/app/models/operacion-cobro-detalle.model';
import { formatDate, DecimalPipe, CurrencyPipe } from '@angular/common';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { PopupObraSocialComponent } from 'src/app/shared/components/popups/popup-obra-social/popup-obra-social.component';
import { Liquidacion } from '../../../../models/liquidacion.model';
import { LiquidacionService } from '../../../../services/liquidacion.service';
import { NumberToWordsPipe } from '../../../../shared/pipes/number-to-words.pipe';
import { PopupOperacionCobroPresentacionComponent } from '../../../../shared/components/popups/popup-operacion-cobro-presentacion/popup-operacion-cobro-presentacion.component';
import { PopupPresentacionEditarComponent } from '../../../../shared/components/popups/popup-presentacion-editar/popup-presentacion-editar.component';
//import { ExcelService } from '../../../../services/excel.service';
import { PopupDetalleOperacionCobroDistribucionComponent } from '../../../../shared/components/popups/popup-detalle-operacion-cobro-distribucion/popup-detalle-operacion-cobro-distribucion.component';
import { PopupOperacionCobroDistribucionComponent } from '../../../../shared/components/popups/popup-operacion-cobro-distribucion/popup-operacion-cobro-distribucion.component';
import { MedicoObraSocial } from 'src/app/models/medico-obrasocial.model';
import { PopupMedicoComponent } from './../../../../shared/components/popups/popup-medico/popup-medico.component';
import { PopupOperacionCobroDistribucionDetalleComponent } from '../../../../shared/components/popups/popup-operacion-cobro-distribucion-detalle/popup-operacion-cobro-distribucion-detalle.component';
import { PopupOperacionCobroDistribucionMultipleComponentComponent } from './../../../../shared/popups/popup-operacion-cobro-distribucion-multiple-component/popup-operacion-cobro-distribucion-multiple-component.component';
import { Filter } from './../../../../shared/filter';
import { LiquidacionGenerada } from '../../../../models/liquidacion-generada.model';



@Component({
  selector: 'app-liquidar' ,
  templateUrl: './liquidar.component.html' ,
  styleUrls: ['./liquidar.component.css'],
  providers: [MessageService,DialogService]
})
export class LiquidarComponent implements OnInit {

  total_seleccionado: number = 0;
  cols: any[];
  columns: any[];
  columnsListadoMedico: any[];
  columnsListadoTodos: any[];
  columnsListadoCirugiaTodos: any[];
  loading: boolean;
  resultSave: boolean;
  es: any;
  displayDialog: boolean;
  fechaLiquidacion: Date;
  _fechaLiquidacion: string;
  fechaHasta: Date;
  _fechaHasta: string;
  DateForm: FormGroup;
  liquidacion: Liquidacion;
  elementos: Liquidacion[] = null;
  elementosFiltrados: Liquidacion[] = null;
  elementosCirugia: Liquidacion[] = null;
  selecteditemRegistro: Liquidacion = null;
  selecteditems: Liquidacion[] = [];
  elementosPreFactura: Liquidacion[] = [];
  total_facturado_impresion: number;
  cantidad_practica:number = 0;
  total_original: number = 0;
  total_facturado: number = 0;
  cantidad: number = 0;
  selectedImpresion:string ;//= 'Transferencia';
  impresiones: any[];
  popItemMedico: MedicoObraSocial = null;
  apellido: string;
  liquidacion_nro = 1;
  detalle = '';


// FILTROS

_entidad_nombre: any[] = [];
_nivel: any[] = [];
_fecha_desde: any[] = [];
_fecha_hasta: any[] = [];
_medico_nombre: any[] = [];
_numero: any[] = [];
_obra_social_nombre: any[] = [];

  constructor(private miServicio: LiquidacionService, private practicaService: PracticaService,
     private liquidacionService: LiquidacionService, private messageService: MessageService ,
     public dialogService: DialogService, public numberToWordsPipe: NumberToWordsPipe,
     private cp: CurrencyPipe, private dp: DecimalPipe,  private filter: Filter) {

    this.impresiones = [
      {name: 'Distribución por médico' , code: '1'},
      {name: 'Distribución por médico detallada ' , code: '2'},
      {name: 'Detalle del expediente ' , code: '3'},
      //{name: 'Distribución por Obra social' , code: '3'},        
      //{name: 'Distribuciónes seleccionadas' , code: '4'},
  ];

    this.cols = [
      { field: 'accion' , header: 'Accion' , width: '6%'} ,
      { field: 'id' , header: 'Liq. nº' , width: '7%'} ,
      { field: 'obra_social_nombre' , header: 'Obra social' , width: '20%'} ,
      { field: 'entidad_nombre' , header: 'Entidad' , width: '10%'} ,
      { field: 'numero' , header: 'Periodo' ,  width: '8%' },
      { field: 'nivel' , header: 'Nivel' ,  width: '10%' },
      {field: 'fecha_desde' , header: 'Desde' , width: '10%' },
      { field: 'fecha_hasta' , header: 'Hasta' ,  width: '10%' },
      { field: 'cant_orden' , header: 'Ordenes' ,  width: '10%' },
      { field: 'total' , header: 'Total' ,  width: '20%' },
      { field: 'medico_nombre' , header: 'Médico' , width: '15%'},
      { field: 'nombreyapellido' , header: 'Audito' , width: '15%'},

   ];


   this.columns = [
    {title: 'Obra social' , dataKey: 'obra_social_nombre'},
    {title: 'Número' , dataKey: 'numero'},
    {title: 'Nivel' , dataKey: 'nivel'},
    {title: 'Desde' , dataKey: 'fecha_desde'},
    {title: 'Hasta' , dataKey: 'fecha_hasta'},
    {title: 'Cantidad' , dataKey: 'cant_orden'},
    {title: 'Total' , dataKey: 'total'},
    {title: 'Audito' , dataKey: 'nombreyapellido'}
];

this.columnsListadoMedico = [
  {title: 'Paciente' , dataKey: 'paciente_nombre'},  
  {title: 'Num. afiliado' , dataKey: 'numero_afiliado'},
  {title: 'Código' , dataKey: 'codigo'},
  {title: 'Descripción' , dataKey: 'descripcion'},
  {title: 'Fecha' , dataKey: 'fecha_cobro'},
  {title: 'Cant' , dataKey: 'cantidad'},
  {title: 'Honorario' , dataKey: 'valor_facturado'},
  {title: 'Matricula' , dataKey: 'matricula'},
  {title: 'Médico' , dataKey: 'medico_nombre'}
];


this.columnsListadoTodos = [
  {title: 'Paciente' , dataKey: 'paciente_nombre'},  
  {title: 'Num. afiliado' , dataKey: 'numero_afiliado'},
  {title: 'Código' , dataKey: 'codigo'},
  {title: 'Descripción' , dataKey: 'descripcion'},
  {title: 'Fecha' , dataKey: 'fecha_cobro'},
  {title: 'Cant' , dataKey: 'cantidad'},

  {title: 'Honorario' , dataKey: 'valor_facturado'},
  {title: 'Matricula' , dataKey: 'matricula'},
  {title: 'Médico' , dataKey: 'medico_nombre'}
];







   }

  ngOnInit() {
    this.selectedImpresion = this.impresiones[0];
    this.es = calendarioIdioma;
    this.fechaLiquidacion = new Date();

    this.loadlist();
  }


  generarLiquidacion() {


if (this.selecteditems) {
  let liquidacionGenerada: LiquidacionGenerada = null;
  this.loading = true;
  liquidacionGenerada = new LiquidacionGenerada(String(this.liquidacion_nro), this.detalle, formatDate( this.fechaLiquidacion, 'dd/MM/yyyy' , 'en'), 'LIQ');

  console.log(liquidacionGenerada);

  try {
      this.miServicio.generarLiquidacionNumero(liquidacionGenerada)
      .subscribe(resp => {

        swal({
          toast: false,
          type: 'success' ,
          title: 'Liquidacion generada' ,
          showConfirmButton: false,
          timer: 3000
        });
        
          this.loading = false;
          console.log(resp);
          this.generarLiquidacionExpedientes(resp);
      },
      error => { // error path
        //  console.log(error.message);
        //  console.log(error.status);
          this.throwAlert('error' , 'Error: ' + error.status + '  Error al cargar los registros' , error.message, error.status);
          this.loading = false;
       });
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  this.loading = false;
  }
}else{
  this.throwAlert('warning' , 'No se selecciono ningun expediente' , '' , '');
  this.loading = false;
}

  }


  generarLiquidacionExpedientes(liquidacion: any[]) {

    if (this.selecteditems) {
      console.log(liquidacion[0].numero);
      this.loading = true;
      console.log(this.selecteditems);

      try {
          this.miServicio.LiquidarExpedientes(this.selecteditems, liquidacion[0].numero)
          .subscribe(resp => {

            swal({
              toast: false,
              type: 'success' ,
              title: 'Liquidacion generada' ,
              showConfirmButton: false,
              timer: 3000
            });
            this.loadlist();
              this.loading = false;
              console.log(resp);
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
           });    
      } catch (error) {
      this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
      }   
    }else{
      this.throwAlert('warning' , 'No se selecciono ningun expediente' , '' , '');
    }
    
      }

  listarLiquidaciones(){}
  
  actualizarFechaDesde(event) {
    console.log(event);
    this.fechaLiquidacion = event;
    console.log(new Date(this.fechaLiquidacion));
  }

  actualizarFechaLiquidacion(event) {
    console.log(event);
    this.fechaLiquidacion = event;
    console.log(new Date(this.fechaLiquidacion));
  }

 
  accion(event:OperacionCobroDetalle,overlaypanel: OverlayPanel, elementos: Liquidacion) {
    if (elementos) {
      this.selecteditemRegistro = elementos;
    }
      
      console.log(this.selecteditemRegistro);
      overlaypanel.toggle(event);
    }
  


    buscarMedico() {
      let data: any; 
      const ref = this.dialogService.open(PopupMedicoComponent, {
      data,
       header: 'Buscar Médico' , 
       width: '98%' ,
       height: '90%'
      });
  
      ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
          if (PopupMedicoComponent) {
            console.log(PopupMedicoComponent);    
            this.popItemMedico = PopupMedicoComponent;
            this.apellido =  this.popItemMedico['apellido']+ ' ' +this.popItemMedico['nombre'] ;
          }
      });
  
    }


   

  imprimir() {
    
    if ( this.selectedImpresion['code'] === '1') {
      this.loadDistribucionMedico();
    }
    if ( this.selectedImpresion['code'] === '2') {
      this.loadDistribucionMedicoDetalle();
    }
    if ( this.selectedImpresion['code'] === '3') {
      this.loadPresentacionMedicoACLISA();
    }
    if ( this.selectedImpresion['code'] === '4') {
      this.loadPresentacionCirugiaTodos();
    }
  }

    buscarObraSocial() {
      let data: any;
     
      const ref = this.dialogService.open(PopupObraSocialComponent, {
      data,
       header: 'Buscar Practica' , 
       width: '98%' ,
       height: '90%'
      });
  
      ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
          if (PopupObraSocialComponent) {
            console.log(PopupObraSocialComponent);    
            
            
            this.DateForm.patchValue({obra_social_nombre: PopupObraSocialComponent.nombre});
            this.DateForm.patchValue({obra_social_id: PopupObraSocialComponent.id});
           
          }
      });
  
    }

    editarRegistro() {

      let data: any; 
      data =  this.selecteditemRegistro;
      const ref = this.dialogService.open(PopupPresentacionEditarComponent, {
      data,
       header: 'Editar de presentación' , 
       width: '98%' ,
       height: '100%'
      });
  
      ref.onClose.subscribe((PopupPresentacionEditarComponent: Liquidacion) => {
                              
            console.log('actualizando')          ;
            this.loadlist();
           
          
      });

    }

    verDetalle(elementos: any) {
      if (elementos) {
        this.selecteditemRegistro = elementos;
      }
      let data: any; 
      data =  this.selecteditemRegistro;
      const ref = this.dialogService.open(PopupOperacionCobroDistribucionComponent, {
      data,
       header: 'Ver detalle para distribuir' , 
       width: '98%' ,
       height: '100%'
      });
  
      ref.onClose.subscribe((PopupOperacionCobroDistribucionComponent : any) => {
          if (PopupOperacionCobroDistribucionComponent) {
            console.log(PopupOperacionCobroDistribucionComponent);
          }
      });
    }



    verDetalleTodos(){

      let data: any; 
      data =  this.selecteditems;
      const ref = this.dialogService.open(PopupOperacionCobroDistribucionMultipleComponentComponent, {
      data,
       header: 'Ver detalle para distribuir' , 
       width: '98%' ,
       height: '100%'
      });
  
      ref.onClose.subscribe((PopupOperacionCobroDistribucionMultipleComponentComponent : any) => {
          if (PopupOperacionCobroDistribucionMultipleComponentComponent) {
            console.log(PopupOperacionCobroDistribucionMultipleComponentComponent);
          }
      });
    }


    

    verDistribucion(elementos: Liquidacion, consulta: string) {
      if (elementos) {
        this.selecteditemRegistro = elementos;
        
      }
      let data: any; 
      data =  this.selecteditemRegistro;
      data.consulta = consulta;
      const ref = this.dialogService.open(PopupOperacionCobroDistribucionDetalleComponent, {
      data,
       header: 'Ver detalle de distribucion' , 
       width: '98%' ,
       height: '100%'
      });
  
      ref.onClose.subscribe((PopupOperacionCobroDistribucionDetalleComponent : any) => {
          if (PopupOperacionCobroDistribucionDetalleComponent) {
            console.log(PopupOperacionCobroDistribucionDetalleComponent);
          }
      });
    }


    

  loadlist() {

    this.loading = true;
  
    try {
        this.miServicio.getLiquidacionDetalle('DIS')
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
            this.sumarValores(this.elementos);
            this.realizarFiltroBusqueda(resp);
              }else{
                this.elementos =null;
              }
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
    }  
}
 

loadDistribucionTodos() {

  this.loading = true;

  try {
      this.miServicio.GetDistribucionByExpediente(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
       /* resultado.forEach(element => {
          
          resp[i]['fecha_cobro'] = formatDate( element['fecha_cobro'], 'dd/MM/yyyy' , 'en');
      //    let t = formatDate( element['fecha_cobro'], 'dd/MM/yyyy' , 'en');
          console.log(resp[i]['fecha_cobro']);
          i++;
        });*/
          this.elementosPreFactura = resp;
         console.log(this.elementosPreFactura);
      //    this.generarPdfListadoTodos();
          this.loading = false;
        //  console.log(resp);
        this.verDistribucion(resp, 'todos');
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}



loadDistribucionMedico() {

  this.loading = true;

  try {
      this.miServicio.GetDistribucionByMedico(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
         // console.log(this.selecteditems);
          //resp[i]['obra_social_nombre'] = this.selecteditems[0]['obra_social_nombre'];
          i++;
        });
          this.elementosPreFactura = resp;
         console.log(resp);
          this.loading = false;
        this.verDistribucion(resp, 'medico');
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}

loadDistribucionMedicoDetalle() {

  this.loading = true;

  try {
      this.miServicio.GetDistribucionByMedicoDetalle(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
         // console.log(this.selecteditems);
          //resp[i]['obra_social_nombre'] = this.selecteditems[0]['obra_social_nombre'];
          i++;
        });
          this.elementosPreFactura = resp;
         console.log(resp);
          this.loading = false;
        this.verDistribucion(resp, 'detalle');
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}



loadPresentacionCirugiaTodos() {

  this.loading = true;
  console.log(this.selecteditems);
  try {
      this.miServicio.getListadoPreFacturaCirugia(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
          
          resp[i]['fecha_cobro'] = formatDate( element['fecha_cobro'], 'dd/MM/yyyy' , 'en');
          if (( resp[i]['paciente_barra_afiliado'] !== '0')) {
            resp[i]['numero_afiliado'] = resp[i]['numero_afiliado']+ '/' +resp[i]['paciente_barra_afiliado'] ;
          }
          
          console.log(resp[i]['fecha_cobro']);
          i++;
        });
          this.elementosPreFactura = resp;
         console.log(this.elementosPreFactura);
          
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}



generarTxt() {

  this.loading = true;

  try {
      this.miServicio.generarTxt(this.selecteditems)    
      .subscribe(resp => {
        
        this.throwAlert('success' , 'Se generó el archivo con éxito' , '' , '');
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}

generarTxtCirugia() {
  
  this.loading = true;
  console.log(this.selecteditems);
  try {
      this.miServicio.getListadoPreFacturaCirugia(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
          
          resp[i]['fecha_cobro'] = formatDate( element['fecha_cobro'], 'dd/MM/yyyy HH:mm' , 'en');
          if (( resp[i]['paciente_barra_afiliado'] !== '0')) {
            resp[i]['numero_afiliado'] = resp[i]['numero_afiliado']+ '/' +resp[i]['paciente_barra_afiliado'] ;
          }
          
          console.log(resp[i]['fecha_cobro']);
          i++;
        });
          this.elementosPreFactura = resp;
         console.log(this.elementosPreFactura);
          /***********
           * 
           * 
           * 
           * 
           * 
           * 
           *   ORDENO LA FACTURACION  
           * 
           * 
           * 
           * */

          
          let j = 0;
          for(i=0;i<this.elementosPreFactura.length;i++) {

            let practica = this.elementosPreFactura[i]['convenio_os_pmo_id'];        
            for(j=0;j<this.elementosPreFactura.length;j++) {        
              if (this.elementosPreFactura[j]['convenio_os_pmo_id'] === practica) {            
                if ((this.elementosPreFactura[j]['obra_social_practica_nombre'] === 'HONORARIOS')&&(this.elementosPreFactura[j]['complejidad'] !== 2)) {
                  if (this.elementosPreFactura[j]['operacion_cobro_distribucion_total'] === null) {
                    this.elementosPreFactura[i]['operacion_cobro_distribucion_total'] = 0;
                  }else{
                    if (this.selecteditems[0]['obra_social_nombre']=== 'DOS - OBRA SOCIAL PROVINCIA') {
                      this.elementosPreFactura[i]['honorarios'] =  this.elementosPreFactura[j]['operacion_cobro_distribucion_total'];
                    }else{
                      this.elementosPreFactura[i]['honorarios'] =  this.cp.transform((((this.elementosPreFactura[j]['operacion_cobro_distribucion_total'])*20)/80), '' , 'symbol-narrow' , '1.2-2'); 
                    }
                  }
                }
                if ((this.elementosPreFactura[j]['obra_social_practica_nombre'] === 'GASTOS')&&(this.elementosPreFactura[j]['complejidad'] !== 2)) {
                  if (this.elementosPreFactura[j]['operacion_cobro_distribucion_total'] === null) {
                    this.elementosPreFactura[i]['operacion_cobro_distribucion_total'] = 0;
                  }else{
                    console.log(this.selecteditems[0]['obra_social_id']);
                    if (this.selecteditems[0]['obra_social_nombre'] == 'DOS - OBRA SOCIAL PROVINCIA') {
                     console.log('obra social');
                     this.elementosPreFactura[i]['gastos'] =  this.elementosPreFactura[j]['operacion_cobro_distribucion_total'];
                    }else{
                      console.log('coseguro');
                      this.elementosPreFactura[i]['gastos'] =  this.cp.transform((((this.elementosPreFactura[j]['operacion_cobro_distribucion_total'])*20)/80), '' , 'symbol-narrow' , '1.2-2'); 
                    }
                  }
                }
                if (this.elementosPreFactura[j]['complejidad'] === 2) {         
                    this.elementosPreFactura[i]['gastos'] =  this.elementosPreFactura[j]['valor_facturado'];
                    this.elementosPreFactura[i]['honorarios'] =  '0.00';
                  }
              }
            }
            }

           const filteredArr = this.elementosPreFactura.reduce((acc, current) => {
            const x = acc.find(item => item['operacion_cobro_practica_id'] === current['operacion_cobro_practica_id']);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          try {
            this.miServicio.generarTxtCirugia(filteredArr)    
            .subscribe(resp => {
              
              this.throwAlert('success' , 'Se generó el archivo con éxito' , '' , '');
                this.loading = false;
                console.log(resp);
            },
            error => { // error path
                console.log(error.message);
                console.log(error.status);
                this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
             });    
        } catch (error) {
        this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
        }  

          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}


loadPresentacionMedico() {

  this.loading = true;

  try {
      this.miServicio.getListadoPreFactura(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
          
          resp[i]['fecha_cobro'] = formatDate( element['fecha_cobro'], 'dd/MM/yyyy' , 'en');
          if (( resp[i]['paciente_barra_afiliado'] !== '0')) {
            resp[i]['numero_afiliado'] = resp[i]['numero_afiliado']+ '/' +resp[i]['paciente_barra_afiliado'] ;
          }
          
          console.log(resp[i]['fecha_cobro']);
          i++;
        });
        this.sumarValores(resp);
          this.elementosPreFactura = resp;
         console.log(this.elementosPreFactura);
          
          this.loading = false;
          
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}



sumarValores(vals:any) {
  let i:number;

  console.log(vals);
  this.total_facturado = 0;
  this.cantidad = 0;
  for (i = 0; i < vals.length;i++) {
      this.cantidad = this.cantidad + Number(vals[i]['cant_orden']);
      this.total_facturado = this.total_facturado + Number(vals[i]['total']);
  }

}

public exportarExcelResumen() {

  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm' , 'es-Ar');  
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {

    seleccionados['expediente'] = element['id'];
    seleccionados['obra_social_nombre'] = element['obra_social_nombre'] ;
    seleccionados['nivel'] = element['nivel'];
    seleccionados['medico_nombre'] = element['medico_nombre'];
    seleccionados['entidad_nombre'] = element['entidad_nombre'];
    seleccionados['fecha_desde'] = formatDate(element['fecha_desde'], 'dd/MM/yyy' , 'es-Ar');
    seleccionados['fecha_hasta'] = formatDate(element['fecha_hasta'], 'dd/MM/yyy' , 'es-Ar');
    seleccionados['cant_orden'] =  element['cant_orden'];
    seleccionados['total'] = element['total'];
    seleccionados['cantidad'] = element['cant_orden'];
    seleccionados['nombreyapellido'] = element['nombreyapellido'];

    exportar[i] = seleccionados;

    seleccionados = [];
    i++;
  });

  this.liquidacionService.exportAsExcelFile(  exportar, 'listado_presentacion' + fecha_impresion);


}

sumarValoresSeleccionados(vals:any) {
  // SUMO LO FILTRADO
  this.selecteditems = [];
  console.log(vals);
  let i:number;
  let total_seleccionado = 0;
  this.selecteditems = vals;
  console.log(this.selecteditems);
for (i=0;i<vals.length;i++) {

      this.cantidad = this.cantidad + Number(vals[i]['cant_orden']);
      this.total_seleccionado = this.total_seleccionado+ Number(vals[i]['total']);
}

}


filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;  
    this.sumarValores(this.elementosFiltrados);
}


actualizarRegistrosObraSocial() {


if (this.selecteditems) {

  this.loading = true;
  console.log(this.selecteditems);
  try {
      this.practicaService.actualizarValoresPracticasByConvenio(this.selecteditems)    
      .subscribe(resp => {
        
          
        this.throwAlert('success' , 'Se actualizaron los registros con éxito' , '' , '');
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  
}else{
  this.throwAlert('warning' , 'No se selecciono ninguna ficha' , '' , '');
}
}



loadPresentacionMedicoACLISA() {
  
}

desafectarPresentacion() {
  console.log(this.selecteditemRegistro);
   try {
    this.practicaService.desafectarPresentacion(this.selecteditemRegistro['id'])    
    .subscribe(resp => {
      
        
      this.throwAlert('success' , 'Se desafecto el registro  con éxito' , '' , '');
        this.loading = false;
        console.log(resp);
        this.loadlist();
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
     });    
} catch (error) {
this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
}   

}



exportarExcel() {

  this.loading = true;

  try {
      this.miServicio.getListadoPreFactura(this.selecteditems)    
      .subscribe(resp => {
        let i:number = 0;
        let resultado = resp;
        resultado.forEach(element => {
          
          resp[i]['fecha_cobro'] = formatDate( element['fecha_cobro'], 'dd/MM/yyyy' , 'en');
          if (( resp[i]['paciente_barra_afiliado'] !== '0')) {
            resp[i]['numero_afiliado'] = resp[i]['numero_afiliado']+ '/' +resp[i]['paciente_barra_afiliado'] ;
          }         
          i++;
        });
        this.sumarValores(resp);
          this.elementosPreFactura = resp;
         console.log(this.elementosPreFactura);     
          this.loading = false;
          const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm' , 'es-Ar');  
          this.miServicio.exportAsExcelFile(  this.elementosPreFactura, 'listado_presentacion' +fecha_impresion);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error' , 'Error: ' +error.status+ '  Error al cargar los registros' , error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert('error' , 'Error al cargar los registros' , error, error.status);
  }  

  
}




removeDuplicateUsingSet(arr) {
  let unique_array = arr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
});
return unique_array
}












showToast(estado:string ,mensaje:string, encabezado:string) {

  if (estado =='exito') {
      this.messageService.add({severity:'success' , summary: mensaje, detail:encabezado});
  }
  if (estado =='info') {
      this.messageService.add({severity:'info' , summary: 'El campo no es correcto' , detail:'Los datos del campo son incorrectos'});
  }
  if (estado =='warning') {
      this.messageService.add({severity:'warning' , summary: 'El campo no es correcto' , detail:'Los datos del campo son incorrectos'});
  }
  if (estado =='error') {
      this.messageService.add({severity:'error' , summary: 'Error' , detail:'No se pudo modificar el registro'});
  }

}

throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string) {
    let tipoerror:string;

    if (estado== 'success') {
        swal({
            type: 'success' ,
            title: 'Exito' ,
            text: mensaje
          })
    }

    if (errorNumero =='422') {
      mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
      swal({   
          type: 'warning' ,
          title: 'Atención..' ,
          text: mensaje,
          footer: motivo
        })
  }
    
    if ((estado== 'error')&&(errorNumero!='422')) {
      if (errorNumero =='422') {
          mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
      }
      if (errorNumero =='400 ') {
          mensaje ='Bad Request ';
      }
      if (errorNumero =='404') {
          mensaje ='No encontrado ';
      }
      if (errorNumero =='401') {
          mensaje ='Sin autorización';
      }
      if (errorNumero =='403') {
          mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
      }
      if (errorNumero =='405') {
          mensaje ='Método no permitido';
      }
      if (errorNumero =='500') {
          mensaje ='Error interno en el servidor';
      }
      if (errorNumero =='503') {
          mensaje ='Servidor no disponible';
      }
      if (errorNumero =='502') {
          mensaje ='Bad gateway';
      }
      
        swal({   
            type: 'error' ,
            title: 'Oops...' ,
            text: mensaje,
            footer: motivo
          })
    }


}


realizarFiltroBusqueda(resp: any[]){
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA

  this._entidad_nombre = [];
  this._nivel = [];
  this._fecha_desde = [];
  this._fecha_hasta = [];
  this._medico_nombre = [];
  this._numero = [];
  this._obra_social_nombre = [];
  
  resp.forEach(element => {
    this._entidad_nombre.push(element['entidad_nombre']);
    this._nivel.push(element['nivel']);
   this._fecha_desde.push(element['fecha_desde']);
   this._fecha_hasta.push(element['fecha_hasta']);
   this._medico_nombre.push(element['medico_nombre']);
   this._numero.push(element['numero']);
   this._obra_social_nombre.push(element['obra_social_nombre']);
  });
  
  // ELIMINO DUPLICADOS
  this._entidad_nombre = this.filter.filterArray(this._entidad_nombre);  
  this._nivel = this.filter.filterArray(this._nivel);  
  this._fecha_desde = this.filter.filterArray(this._fecha_desde);
  this._fecha_hasta = this.filter.filterArray(this._fecha_hasta);
  this._medico_nombre = this.filter.filterArray(this._medico_nombre);
  this._numero = this.filter.filterArray(this._numero);
  this._obra_social_nombre = this.filter.filterArray(this._obra_social_nombre);

}

  }

