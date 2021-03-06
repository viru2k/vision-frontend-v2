import { PopupOperacionCobroEditarComponent } from './../popup-operacion-cobro-editar/popup-operacion-cobro-editar.component';


import { ObraSocial } from 'src/app/models/obra-social.model';
import { Component, OnInit,Output, EventEmitter,ViewChild, PipeTransform, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { PracticaService } from 'src/app/services/practica.service';
import { OperacionCobroDetalle } from 'src/app/models/operacion-cobro-detalle.model';
import { formatDate, CurrencyPipe } from '@angular/common';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { PopupObraSocialComponent } from 'src/app/shared/components/popups/popup-obra-social/popup-obra-social.component';


import { ObraSocialService } from 'src/app/services/obra-social.service';

import { logo_clinica,calendarioIdioma } from './../../../../config/config';
import { PopupOperacionCobroRegistroEditarComponent } from './../popup-operacion-cobro-registro-editar/popup-operacion-cobro-registro-editar.component';
import { Paciente } from '../../../../models/paciente.model';


@Component({
  selector: 'app-popup-operacion-cobro-registro-buscar',
  templateUrl: './popup-operacion-cobro-registro-buscar.component.html',
  styleUrls: ['./popup-operacion-cobro-registro-buscar.component.css']
})
export class PopupOperacionCobroRegistroBuscarComponent implements OnInit {

  busquedaForm:FormGroup;
  busqueda: string = 'operacion_cobro.id';
  textoBusqueda:string = "";
  cantidad_practica:number=0;
  total_facturado:number=0;
  total_original:number=0;
  cols: any[];
  selectedItem: OperacionCobroDetalle;
  selectedItemPaciente: Paciente;
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
  _id:number = 0;
  columns: any[];
  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;
  DateForm:FormGroup;
  popItemObraSocial:ObraSocial;
  internacion_tipo:string = 'A';

    constructor(private miServicio:PracticaService,private messageService: MessageService ,public dialogService: DialogService,private cp: CurrencyPipe,public ref: DynamicDialogRef, public config: DynamicDialogConfig  ) {

          this.cols = [
              { field: '', header: '',  width: '6%' },
              { field: 'liquidacion_numero', header: 'Liq.',  width: '5%' },
              { field: 'operacion_cobro_id', header: 'Cobro N??',  width: '5%' },
              { field: 'apellido', header: 'Apellido',  width: '10%' },
              {field: 'nombre', header: 'Nombre' , width: '10%' },
              { field: 'dni', header: 'DNI',  width: '7%' },
              { field: 'obra_social_nombre', header: 'O.S',  width: '15%' },
              { field: 'gravado_adherente', header: 'G/A',  width: '4%' },
              { field: 'descripcion', header: 'Descrpici??n',  width: '20%' },
              { field: 'complejidad', header: 'nivel' , width: '5%'},
              { field: 'codigo', header: 'Codigo' , width: '8%'},
              { field: 'medico_nombre', header: 'M??dico' , width: '10%'},
              { field: 'usuario_cobro_nombre', header: 'Usuario' , width: '8%'},
              { field: 'fecha_cobro' , header: 'Fecha' , width: '8%'},
              { field: 'cantidad', header: 'Cant.' , width: '6%'},
              { field: 'valor_original', header: 'Orig.' , width: '6%'},
              { field: 'valor_facturado', header: 'Fact.' , width: '6%'},
              { field: 'distribucion', header: 'dist' , width: '6%'},
              { field: 'forma_pago', header: 'Medio' , width: '10%'} ,
              { field: 'internacion_tipo', header: 'Int' , width: '6%'}
           ];


           this.columns = [
            {title: 'Apellido', dataKey: 'apellido'},
            {title: 'Nombre', dataKey: 'nombre'},
            {title: 'DNI', dataKey: 'dni'},
            {title: 'Obra social', dataKey: 'obra_social_nombre'},
            {title: 'C??digo', dataKey: 'codigo'},
            {title: 'Descripci??n', dataKey: 'descripcion'},
            {title: 'Cant', dataKey: 'cantidad'},
            {title: 'Valor', dataKey: 'valor_facturado'},
            {title: 'Dist', dataKey: 'distribucion'},
            {title: 'Medio', dataKey: 'forma_pago'},
            {title: 'Usuario', dataKey: 'usuario_cobro_nombre'}
        ];


        this.DateForm = new FormGroup({
            'fecha_desde': new FormControl('', Validators.required),
            'fecha_hasta': new FormControl('', Validators.required),
            'presentacion_nro': new FormControl(''),
            'obra_social': new FormControl('')
            });

          }
            ngOnInit() {
              this.es = calendarioIdioma;
              this.fechaDesde = new Date();
              this.fechaHasta = new Date();
              this.DateForm.patchValue({fecha_desde: this.fechaDesde});
              this.DateForm.patchValue({fecha_hasta: this.fechaHasta});
              this.popItemOperacionCobro =  new OperacionCobroDetalle('','',0,0,0,'','','','','','','','','','','',0,0,0,'','','',0);

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

buscar(){
  if((this.busqueda !=undefined)&&(this.busqueda.length >=1)){
    if(this.busqueda === 'operacion_cobro_practica.es_anulado'){
      this.textoBusqueda = 'SI';
    }
  this.loadList();
  }else{
      this.throwAlert('warning','error','La busqueda debe tener mas de tres caracteres','100');
  }
}

loadList(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {

      this.miServicio.getOperacionCobroByConsulta(this.busqueda,this.textoBusqueda)
      .subscribe(resp => {
        console.log(resp);
      this.elementos = resp;
          console.log(this.elementos);
          this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);

       });
  } catch (error) {
      this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
  }
}


anular(){

  swal({
    title:'Anular operaci??n de cobro',
    text: '??Desea anular la operaci??n de cobro?',
    type: 'warning',
    showCancelButton: false,
    confirmButtonColor: '#0288D1',

        confirmButtonText: 'Anular',
  }).then((result) => {
    if (result.value) {
      this.anularRegistro();
    }
  })

}


accion(event:OperacionCobroDetalle,overlaypanel: OverlayPanel,elementos:OperacionCobroDetalle){
  if(elementos){
    this.selecteditemRegistro = elementos;
  }

    console.log(this.selecteditemRegistro);
    overlaypanel.toggle(event);
  }


  onRowSelect(event) {
    this.elemento = event.data;
    console.log(this.elemento);
    this.loadList();
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
      //  this.formObraSocial.patchValue({id: this.popItemObraSocial.id});
       // this.formObraSocial.patchValue({nombre: this.popItemObraSocial.nombre});

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
  ref.onClose.subscribe((PopupOperacionCobroEditarComponent:OperacionCobroDetalle) => {
    this.loadList();
      if (PopupOperacionCobroEditarComponent) {
        console.log(PopupOperacionCobroEditarComponent);
      //  this.popItemOperacionCobro = PopupOperacionCobroEditarComponent;

      //  this.formObraSocial.patchValue({id: this.popItemObraSocial.id});
       // this.formObraSocial.patchValue({nombre: this.popItemObraSocial.nombre});

      }
  });
}


filtered(event){
  console.log(event.filteredValue);
  this.elementosFiltrados  = event.filteredValue;

}

anularRegistro(){
  try {
    this.elementos[0]['es_anulado'] = 'SI';
    this.miServicio.putOperacionCobroRegistroAnular(this.elementos[0], this.textoBusqueda)
    .subscribe(resp => {
      console.log(resp);
    this.elementos = resp;
        console.log(this.elementos);
        this.loading = false;
        this.throwAlert('success','Se anul?? el registro con ??xito','','');
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);

     });
} catch (error) {
    this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
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

  doc.text(pageWidth-60, 15, 'M??dico : ' + this.selecteditems[0]['medico_nombre']);
  doc.text(pageWidth-60, 20, 'Usuario : ' + userData['nombreyapellido']);
  doc.text(pageWidth-60, 25, 'Desde : ' + _fechaDesde);
  doc.text(pageWidth-60, 30, 'Hasta : ' + _fechaHasta);

  doc.text(pageWidth-100, 15, 'Pr??cticas : ' +this.cp.transform(testudio_medico, '', 'symbol-narrow', '1.2-2') );
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
  doc.text(pageWidth/2, 30, 'Pr??cticas : ' +this.cp.transform(testudio_medico, '', 'symbol-narrow', '1.2-2') );

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





    colorRow(estado:string){


      if(estado == 'EFECTIVO') {
        return {'es-efectivo'  :'null' };
      }
      if(estado == 'TARJETA - DEBITO') {
        return {'es-tarjeta-debito'  :'null' };
      }
      if(estado == 'TARJETA - CREDITO') {
        return {'es-tarjeta-credito'  :'null' };
      }
      if(estado == 'TRANSFERENCIA') {
        return {'es-transferencia'  :'null' };
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
        title: 'Atenci??n..',
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
        mensaje ='Sin autorizaci??n';
    }
    if(errorNumero =='403'){
        mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if(errorNumero =='405'){
        mensaje ='M??todo no permitido';
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
