import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
 
import { MedicoService } from '../../../../services/medico.service';
import { formatDate, DecimalPipe } from '@angular/common';
import { PopupHistoriaClinicaListaConsultaComponent } from '../popup-historia-clinica-lista-consulta/popup-historia-clinica-lista-consulta.component';
@Component({
  selector: 'app-popup-historia-clinica-registro-nuevo',
  templateUrl: './popup-historia-clinica-registro-nuevo.component.html',
  styleUrls: ['./popup-historia-clinica-registro-nuevo.component.css'],
  providers: [MessageService,DialogService]
  
})
export class PopupHistoriaClinicaRegistroNuevoComponent implements OnInit {

  loading: boolean;
  dataForm:FormGroup;
  elemento:HistoriaClinica;
  elemento_temp:HistoriaClinica;
  fecha:Date;
  _fecha:string; 
  historia_clinica_resumen:string;
  agregar:number; 
  diagnostico_receta:string;
  valor_agregar:number = 0;
  listarecetas:any[];
  listaindicacionesmedicas:any[];
  selectedReceta:string[] = [];
  selectedIndicaciones:string;
  display:boolean;

  constructor(private miServicio:MedicoService ,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService,private cp: DecimalPipe ) { 

    this.listarecetas = [
      {label:'TEXTO', value:{id:1, name: 'TEXTO', code: 'TEXTO'}},
      {label:'RG', value:{id:2, name: 'RG', code: 'RG'}},
      {label:'RFG', value:{id:3, name: 'RFG', code: 'RFG'}},
      {label:'CVC', value:{id:4, name: 'CVC', code: 'CVC'}},
      {label:'PAQUIMETRIA CORNEAL', value:{id:5, name: 'PAQUIMETRIA CORNEAL', code: 'PAQUIMETRIA CORNEAL'}},
      {label:'TOPOGRAFIA CORNEAL', value:{id:6, name: 'TOPOGRAFIA CORNEAL', code: 'TOPOGRAFIA CORNEAL'}},
      {label:'RECUENTO ENDOTELIAL', value:{id:7, name: 'RECUENTO ENDOTELIAL', code: 'RECUENTO ENDOTELIAL'}},
      {label:'OCT DE MACULA', value:{id:8, name: 'OCT DE MACULA', code: 'OCT DE MACULA'}},
      {label:'OCT DE PAPILA', value:{id:9, name: 'OCT DE PAPILA', code: 'OCT DE PAPILA'}},
      {label:'VERION', value:{id:10, name: 'VERION', code: 'VERION'}},
      
      
     
  ];

  this.listaindicacionesmedicas = [
    {label: 'SIN RECETAS', value: 'SIN RECETAS'},
    {label: 'E NECESITAN RECETAS ', value: 'SE NECESITAN RECETAS'},
    
   
  ];
    
  }

  ngOnInit() {
    
    this._fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    console.log(this.config.data);  
    this.elemento_temp = this.config.data;
    this.elemento = this.config.data;
    console.log(this.elemento_temp);
    console.log(this.config.data);
    this.dataForm = new FormGroup({
      'edad': new FormControl('', Validators.required),
      'numero_afiliado': new FormControl('', Validators.required),
      'plan': new FormControl('', Validators.required),
      'dni': new FormControl('', Validators.required),  
      'domicilio': new FormControl('', Validators.required),  
      'paciente_id': new FormControl('', Validators.required),
      'paciente_nombre': new FormControl('', Validators.required),
      'paciente_apellido': new FormControl('', Validators.required),
      'obra_social_nombre': new FormControl('', Validators.required),
      'MEDICONOM': new FormControl(''),
      'MEDICO': new FormControl(''),
      'MC': new FormControl(''),
      'AEA': new FormControl(''),
      'APP': new FormControl(''),
      'AF': new FormControl(''),
      'BIO': new FormControl(''),
      'COMENTARIO': new FormControl(''), 
      'OBS_LENTES': new FormControl(''),
      'OBSERVACIO': new FormControl(''),
      'PIO_OD': new FormControl(''),
      'PIO_OI': new FormControl(''),
      'AV_LEJOS_O': new FormControl(''),
      'AV_LEJOS_2': new FormControl(''),
      'AV_LEJOS_3': new FormControl(''),
      'AV_LEJOS_4': new FormControl(''),
      'AV_LEJOS_5': new FormControl(''),
      'AV_LEJOS_6': new FormControl(''),
      'AV_LEJOS_7': new FormControl(''),
      'AV_LEJOS_8': new FormControl(''),
      'RFL_OD_ESF': new FormControl(''),
      'RFL_OD_CIL': new FormControl(''),
      'RFL_OD_EJE': new FormControl(''),
      'RFL_AV_OD': new FormControl(''),
      'RFL_OI_ESF': new FormControl(''),
      'RFL_OI_CIL': new FormControl(''),
      'RFL_OI_EJE': new FormControl(''),
      'RFL_AV_OI': new FormControl(''),
      'RFC_OD_ESF': new FormControl(''),
      'RFC_OD_CIL': new FormControl(''),
      'RFC_OD_EJE': new FormControl(''),
      'RFC_AV_OD': new FormControl(''),
      'RFC_OI_ESF': new FormControl(''),
      'RFC_OI_CIL': new FormControl(''),
      'RFC_OI_EJE': new FormControl(''),
      'RFC_AV_OI': new FormControl(''),
      'LEJOS_OD_E': new FormControl(''),
      'LEJOS_OD_C': new FormControl(''),
      'LEJOS_OD_2': new FormControl(''),
      'LEJOS_OD_P': new FormControl(''),
      'LEJOS_OD_B': new FormControl(''),
      'LEJOS_OI_E': new FormControl(''),
      'LEJOS_OI_C': new FormControl(''),
      'LEJOS_OI_2': new FormControl(''),
      'LEJOS_OI_P': new FormControl(''),
      'LEJOS_OI_B': new FormControl(''),
      'SINTOMAS': new FormControl(''),
      'CERCA_OD_E': new FormControl(''),
      'CERCA_OD_C': new FormControl(''),
      'CERCA_OD_2': new FormControl(''),
      'CERCA_OD_P': new FormControl(''),
      'CERCA_OD_B': new FormControl(''),
      'CERCA_OI_E': new FormControl(''),
      'CERCA_OI_C': new FormControl(''),
      'CERCA_OI_2': new FormControl(''),
      'CERCA_OI_P': new FormControl(''),
      'CERCA_OI_B': new FormControl(''),
      'PACIENTE': new FormControl(''),
      'TRATAMIENT': new FormControl(''),
      'DIAGNOSTIC': new FormControl(''),
      'FO': new FormControl(''),
      'medico_id': new FormControl(''),
      'nombreyapellido': new FormControl(''),      
      'agregar': new FormControl(0),
      'REFRACCION_OD': new FormControl("", Validators.required),
      'REFRACCION_OI': new FormControl("", Validators.required),
      'CICLOPEGIA_OD': new FormControl("", Validators.required),
      'CICLOPEGIA_OI': new FormControl("", Validators.required),
      'BIO_OD': new FormControl("", Validators.required),
      'BIO_OI': new FormControl("", Validators.required),
      'SINTOMAS_SIGNOS': new FormControl("", Validators.required),
      'FONDO_OD': new FormControl("", Validators.required),
      'FONDO_OI': new FormControl("", Validators.required),
      'DIAGNOSTICO_OD': new FormControl("", Validators.required),
      'DIAGNOSTICO_OI': new FormControl("", Validators.required),
      'TRATAMIENTO_MEDICO': new FormControl("", Validators.required),
      'TRATAMIENTO_QUIRURGICO': new FormControl("", Validators.required),
      'ESTUDIOS': new FormControl("", Validators.required),
      'obra_social_id': new FormControl('', Validators.required),    
      'barra_afiliado': new FormControl('', Validators.required),
      'historia_clinica': new FormControl([]),
      'ESTUDIOSES': new FormControl('', Validators.required),
  });
  }




guardarHistoria(){
  console.log(this.dataForm.value);
  //this.elemento = this.dataForm.value;
  this.dataForm.patchValue({PACIENTE: this.elemento_temp.PACIENTE});
  this.dataForm.patchValue({medico_id: this.elemento_temp.medico_id});
  this.dataForm.patchValue({paciente_id: this.elemento_temp.paciente_id});
  this.dataForm.patchValue({MEDICONOM: this.elemento_temp.MEDICONOM});
  this.dataForm.patchValue({MEDICO: this.elemento_temp.MEDICO});
  this.dataForm.patchValue({nombreyapellido: this.elemento_temp.nombreyapellido});
  this.dataForm.patchValue({numero_afiliado: this.elemento.numero_afiliado});
  this.dataForm.patchValue({domicilio: this.elemento.domicilio});
  this.dataForm.patchValue({edad: this.elemento.edad});
  this.dataForm.patchValue({obra_social_nombre: this.elemento.obra_social_nombre});
  this.dataForm.patchValue({paciente_nombre: this.elemento.paciente_nombre});
  this.dataForm.patchValue({plan: this.elemento.plan});
  
 try {
    this.miServicio.setHistoriaClinicaFicha(this.dataForm.value)
    .subscribe(resp => {
      swal({
        toast: false,
        type: 'success',
        title: 'Guardado',
        text: 'Se guardo la historia clínica',
        showConfirmButton: false,
        timer: 2000
      });
        this.ref.close(resp);          
        console.log(resp);      
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'warning',
          title: error.status,
          text: error.message,
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
  
}








/****************************************************************** */
// variables para contener el valor a escalar cuando se usa agregar
 LEJOS_OD_E_INT:number;
 LEJOS_OI_E_INT:number;




actualizarLEJOS_OD_E(){              
  this.LEJOS_OD_E_INT = Number(this.dataForm.value.LEJOS_OD_E); 
  this.dataForm.patchValue({LEJOS_OD_E: this.cp.transform(this.dataForm.value.LEJOS_OD_E ,  '1.2-2') });    
  
}

actualizarLEJOS_OI_E(){   
  this.LEJOS_OI_E_INT = Number(this.dataForm.value.LEJOS_OI_E);            
  this.dataForm.patchValue({LEJOS_OI_E: this.cp.transform(this.dataForm.value.LEJOS_OI_E ,  '1.2-2') });    
}

actualizarLEJOS_OD_C(){              
  this.dataForm.patchValue({LEJOS_OD_C: this.cp.transform(this.dataForm.value.LEJOS_OD_C ,  '1.2-2') });
 
}
actualizarLEJOS_OD_2(){
  console.log('eje');
  this.dataForm.patchValue({LEJOS_OD_2: this.dataForm.value.LEJOS_OD_2  });
  
 
}
actualizarLEJOS_OD_P(){
  this.dataForm.patchValue({LEJOS_OD_P: this.cp.transform(this.dataForm.value.LEJOS_OD_P ,  '1.2-2') });
  
}
actualizarLEJOS_OD_B(){
  this.dataForm.patchValue({LEJOS_OD_B: this.cp.transform(this.dataForm.value.LEJOS_OD_B ,  '1.2-2') });
  
}

actualizarLEJOS_OI_C(){              
  this.dataForm.patchValue({LEJOS_OI_C: this.cp.transform(this.dataForm.value.LEJOS_OI_C ,  '1.2-2') });
 
}
actualizarLEJOS_OI_2(){
  this.dataForm.patchValue({LEJOS_OI_2: this.dataForm.value.LEJOS_OI_2});

}
actualizarLEJOS_OI_P(){
  this.dataForm.patchValue({LEJOS_OI_P: this.cp.transform(this.dataForm.value.LEJOS_OI_P ,  '1.2-2') });

}
actualizarLEJOS_OI_B(){
 
  this.dataForm.patchValue({LEJOS_OI_B: this.cp.transform(this.dataForm.value.LEJOS_OI_B ,  '1.2-2') });

}



actualizar(event:Event){
  console.log(event);
  this.valor_agregar = this.dataForm.value.agregar;




  /** OD */
  if(this.dataForm.value.LEJOS_OD_E){
    if(this.valor_agregar != 0){
      this.dataForm.patchValue({CERCA_OD_E:Number(this.LEJOS_OD_E_INT) +this.dataForm.value.agregar});
      console.log(this.dataForm.value.CERCA_OD_E);
      this.dataForm.patchValue({CERCA_OD_E: this.cp.transform(this.dataForm.value.CERCA_OD_E ,  '1.2-2') });
      }else{
        this.dataForm.patchValue({CERCA_OD_E:Number(this.LEJOS_OD_E_INT) +this.dataForm.value.agregar});
       // this.dataForm.patchValue({CERCA_OD_E: ''});
      }
  }else{
    this.dataForm.patchValue({CERCA_OD_E:this.dataForm.value.agregar});
  }
  
  /**OI */
  if(this.dataForm.value.LEJOS_OI_E){
    if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_E: Number(this.LEJOS_OI_E_INT) +this.dataForm.value.agregar});
    this.dataForm.patchValue({CERCA_OI_E: this.cp.transform(this.dataForm.value.CERCA_OI_E ,  '1.2-2') });
  }else{
    //this.dataForm.patchValue({CERCA_OI_E: ''});
    this.dataForm.patchValue({CERCA_OI_E: Number(this.LEJOS_OI_E_INT) +this.dataForm.value.agregar});
  }
  }else{
    this.dataForm.patchValue({CERCA_OI_E: this.dataForm.value.agregar});
  }

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_B: this.dataForm.value.LEJOS_OD_E });
    }else{
      this.dataForm.patchValue({CERCA_OI_B: ''});
    }

    if(this.valor_agregar == 0){
     /*  this.dataForm.patchValue({CERCA_OI_E: this.dataForm.value.LEJOS_OI_E });
      }else{ */
        this.dataForm.patchValue({CERCA_OI_E: ''});
      }

      if(this.valor_agregar == 0){
       /*  this.dataForm.patchValue({CERCA_OD_E: this.dataForm.value.LEJOS_OD_E });
        }else{ */
          this.dataForm.patchValue({CERCA_OD_E: ''});
        }

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_B: this.dataForm.value.LEJOS_OI_B });
    }else{
      this.dataForm.patchValue({CERCA_OI_B: ''});
    }
  
  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_P: this.dataForm.value.LEJOS_OI_P  });
    }else{
      this.dataForm.patchValue({CERCA_OI_P: ''});
    }

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_2: this.dataForm.value.LEJOS_OI_2 });
    }else{
      this.dataForm.patchValue({CERCA_OI_2: ''});
    }

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OI_C: this.dataForm.value.LEJOS_OI_C  });
    }else{
      this.dataForm.patchValue({CERCA_OI_C: ''});
    }
  
    if(this.valor_agregar != 0){
      this.dataForm.patchValue({CERCA_OD_B: this.dataForm.value.LEJOS_OD_B });
    }else{
      this.dataForm.patchValue({CERCA_OD_B: ''});
    }

   if(this.valor_agregar != 0){
     this.dataForm.patchValue({CERCA_OD_P: this.dataForm.value.LEJOS_OD_P  });
     }else{
      this.dataForm.patchValue({CERCA_OD_P: ''});
    } 

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OD_2: this.dataForm.value.LEJOS_OD_2 });
    }else{
      this.dataForm.patchValue({CERCA_OD_2: ''});
    }

  if(this.valor_agregar != 0){
    this.dataForm.patchValue({CERCA_OD_C: this.dataForm.value.LEJOS_OD_C  });
    }else{
      this.dataForm.patchValue({CERCA_OD_C: ''});
    }
}






/***************************************************************** */


verHistoria(){


  let data:any; 
  data = this.config.data.historia_clinica;
  console.log(this.config.data.historia_clinica)
  const ref = this.dialogService.open(PopupHistoriaClinicaListaConsultaComponent, {
  data,
   header: 'Historia clínica', 
   width: '100%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupHistoriaClinicaListaConsultaComponent: any) => {
      
  });

}

verReceta(){
  this.historia_clinica_resumen = '';
  console.log(this.selectedReceta["label"]);
  if(this.selectedReceta["label"] === 'TEXTO'){}else{
    
  }
 // this.receta = 'Solicito: '+this.selectedReceta["name"];
  this.display = true;
}




imprimirRecetaEscrita(){
 
 
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 20;
let y:number = 40;
let haytexto:boolean= false;

  doc.setFontSize(8);
  console.log(this.elemento);

  doc.text('Nombre: '+this.elemento.paciente_nombre+'      DNI: '+this.elemento.dni, 10 +x, 5+y);  
  doc.text('Domicilio: '+this.elemento.domicilio, 10 +x, 10+y);  
  doc.text('Obra social: '+this.elemento.obra_social_nombre, 10+x, 15+y);
  
  if( this.elemento.paciente_obra_social_id == '1'){
    console.log(this.elemento.paciente_obra_social_id);
    
    if(this.elemento.plan=== '0'){
      doc.text('Numero: '+this.elemento.numero_afiliado+'/'+this.elemento.barra_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.elemento.numero_afiliado+'/'+this.elemento.barra_afiliado+'      Plan: '+this.elemento.plan, 10+x, 20+y);
    }
  }else{    
    if(this.elemento.plan=== '0'){
      doc.text('Numero: '+this.elemento.numero_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.elemento.numero_afiliado+'      Plan: '+this.elemento.plan, 10+x, 20+y);
    }
  }
  let esY:number= 0;
 
  if(this.selectedReceta["name"] === 'TEXTO'){
  
  }else{
    
   
   
    for(let j= 0;j< this.selectedReceta.length;j++){
      if(this.selectedReceta[j]["name"] ==='TEXTO'){        
        haytexto = true;
    }
    }

    if(!haytexto){
      doc.text('Solicito: ', 10 +x, 35+y);  
    for(let j= 0;j< this.selectedReceta.length;j++){
      doc.text(' - '+this.selectedReceta[j]["name"] , 15 +x, 45+esY+y);   
      esY = esY+5;
    }
  }
    console.log(this.selectedReceta);
   
  }
 

  
  //doc.text('Solicita: '+medico, 10+x, 115+y);   
  doc.text('Firma ', 70+x, 130+y);   
  doc.text( _fechaEmision, 10+x, 130+y);  

 
  var pageHeight = doc.internal.pageSize.height;
  if(haytexto){
    if(this.diagnostico_receta != ''){
    var splitTitle_texto = doc.splitTextToSize(this.diagnostico_receta, +60);
  for (var i = 0; i < splitTitle_texto.length; i++) 
  {
    doc.text(10+x, 45+esY+y, splitTitle_texto[i]);
    y = y + 5;
  }
}
  }else{
  var xy = 80;
  var xy_diagnostico = 65;
  if(this.diagnostico_receta != ''){
    var splitTitle_diagnostico = doc.splitTextToSize(this.diagnostico_receta, +60);
    doc.text('Diagnostico presuntivo :', 10+x, 60+y);   
    
  for (var i = 0; i < splitTitle_diagnostico.length; i++) {                
    
    doc.text(10+x, xy_diagnostico+y, splitTitle_diagnostico[i]);
    y = y + 5;
}

  }

  var xy_historia_clinica = 95;
  if(this.historia_clinica_resumen !==''){
 
  

  var splitTitle_historia_clinica = doc.splitTextToSize(this.historia_clinica_resumen, 90);
  doc.text('Resumen historia clínica :', 10+x, 90+y); 
  let medico:string = '';
  if(this.elemento.nombreyapellido=== undefined){
    medico= '';
  }else{
    medico = this.elemento.nombreyapellido;
  }
  for (var i = 0; i < splitTitle_historia_clinica.length; i++) {                
      if (xy > 80) {
          xy = 10;
          //doc.addPage();
      }
      doc.text(10+x, xy_historia_clinica+y, splitTitle_historia_clinica[i]);
      y = y + 5;
  }
}
}
  //doc.save('my.pdf');
 // doc.autoPrint();
 window.open(doc.output('bloburl'));
 this.historia_clinica_resumen = '';
 this.diagnostico_receta = '';
 this.selectedReceta = [];
}






imprimirReceta(){

  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  console.log(this.elemento);
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 20;
let y:number = 40;
  doc.setFontSize(8);


  let paciente_nombre:string = '';
  let paciente_apellido:string='';
  let paciente_dni:string = '';
  let numero_afiliado:string = '';
  let domicilio:string = '';
  let paciente_obra_social_nombre:string='';
  let plan:string = '';

  let OBS_LENTES_:string = '';
  let OBSERVACIO:string = '';

  if((this.dataForm.value.paciente_apellido=== null)){
    paciente_apellido = '';
  }else{
    paciente_apellido = this.dataForm.value.paciente_apellido;
  }
 
  if((this.dataForm.value.paciente_dni=== null)){
    paciente_dni = '';
  }else{
    paciente_dni = this.dataForm.value.paciente_dni;
  }

  if((this.dataForm.value.paciente_dni=== null)){
    paciente_dni = '';
  }else{
    paciente_dni = this.dataForm.value.paciente_dni;
  }
  
  if((this.dataForm.value.domicilio=== null)){
    domicilio = '';
  }else{
    domicilio = this.dataForm.value.domicilio;
  }
  console.log(this.dataForm.value.obra_social_nombre);
  if((this.dataForm.value.obra_social_nombre=== null)){
    paciente_obra_social_nombre = '';
  }else{
    paciente_obra_social_nombre = this.dataForm.value.obra_social_nombre;
  }

  if((this.dataForm.value.numero_afiliado=== null)){
    numero_afiliado = '';
  }else{
    numero_afiliado = this.dataForm.value.numero_afiliado;
  }

  if((this.dataForm.value.plan=== null)){
    plan = '';
  }else{
    plan = this.dataForm.value.plan;
  }
  
  
 

  doc.text('Nombre: '+this.elemento.paciente_nombre+'      DNI: '+this.elemento.dni, 10 +x, 5+y);  
  doc.text('Domicilio: '+this.elemento.domicilio, 10 +x, 10+y);  
  doc.text('Obra social: '+this.elemento.obra_social_nombre, 10+x, 15+y);
  console.log(this.elemento.paciente_obra_social_id);
  if( this.elemento.paciente_obra_social_id == '1'){
    console.log(this.elemento.paciente_obra_social_id);
    
    if(this.elemento.plan=== '0'){
      doc.text('Numero: '+this.elemento.numero_afiliado+'/'+this.elemento.barra_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.elemento.numero_afiliado+'/'+this.elemento.barra_afiliado+'      Plan: '+this.elemento.plan, 10+x, 20+y);
    }
  }else{    
    if(this.elemento.plan=== '0'){
      doc.text('Numero: '+this.elemento.numero_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.elemento.numero_afiliado+'      Plan: '+this.elemento.plan, 10+x, 20+y);
    }
  }
  

  /** BORDE* */
  /** HORIZONTAL */
  doc.setLineWidth(0.4);
  doc.line(10+x, 35+y, 85+x, 35+y);
  doc.line(10+x, 45+y, 85+x, 45+y);
  doc.line(10+x, 55+y, 85+x, 55+y);

  doc.line(10+x, 75+y, 85+x, 75+y);
  doc.line(10+x, 85+y, 85+x, 85+y);
  doc.line(10+x, 95+y, 85+x, 95+y);

   /** VERTICAL */
   doc.line(10+x, 35+y,10+x, 55+y);
   doc.line(25+x, 35+y,25+x, 55+y);
   doc.line(45+x, 35+y,45+x, 55+y);
   doc.line(65+x, 35+y,65+x, 55+y);
   doc.line(85+x, 35+y,85+x, 55+y);

   doc.line(10+x, 75+y,10+x, 95+y);
   doc.line(25+x, 75+y,25+x, 95+y);
   doc.line(45+x, 75+y,45+x, 95+y);
   doc.line(65+x, 75+y,65+x, 95+y);
   doc.line(85+x, 75+y,85+x, 95+y);

   /** TITULOS */
   doc.text('Lentes de lejos', 10+x, 25+y);  
   doc.text('Esférico', 30+x, 30+y);  
   doc.text('Cilíndro', 50+x, 30+y);  
   doc.text('Eje', 70+x, 30+y);  
   doc.text('Lentes de cerca', 10+x, 65+y);  
   doc.text('Esférico', 30+x,70+y );  
   doc.text('Cilíndro', 50+x, 70+y);  
   doc.text('Eje', 70+x, 70+y);  


   doc.text('OD', 15+x, 42+y);  
   doc.text('OI', 15+x, 52+y);  
   doc.text('OD', 15+x, 82+y);  
   doc.text('OI', 15+x, 92+y);  

  
   if((this.dataForm.value.OBS_LENTES=== null)){
    OBS_LENTES_ = '';
   }else{
     OBS_LENTES_ = this.dataForm.value.OBS_LENTES;
   }

   if((this.dataForm.value.OBSERVACIO=== null)){
    OBSERVACIO = '';
  }else{
    OBSERVACIO = this.dataForm.value.OBSERVACIO;
  }
  
   

   let LEJOS_OD_E:string='';
   let LEJOS_OD_C:string='';
   let LEJOS_OD_2:string='';
   let LEJOS_OI_E:string='';
   let LEJOS_OI_C:string='';
   let LEJOS_OI_2:string='';
   let CERCA_OD_E:string='';
   let CERCA_OD_C:string='';
   let CERCA_OD_2:string='';
   let CERCA_OI_E:string='';
   let CERCA_OI_C:string='';
   let CERCA_OI_2:string='';

  
   if(this.dataForm.value.LEJOS_OD_E ){
    if(this.dataForm.value.LEJOS_OD_E.charAt(0) === '-'){
      LEJOS_OD_E = (this.dataForm.value.LEJOS_OD_E);
    }else{
      LEJOS_OD_E ='+'+this.dataForm.value.LEJOS_OD_E;};
   }
   if(this.dataForm.value.LEJOS_OD_C ){
    console.log(this.dataForm.value.LEJOS_OD_C.charAt(0));
    if(this.dataForm.value.LEJOS_OD_C.charAt(0) === '-'){
      LEJOS_OD_C = (this.dataForm.value.LEJOS_OD_C);
    }else{ 
      LEJOS_OD_C ='+'+this.dataForm.value.LEJOS_OD_C;
     };
   
   }
  
   if(this.dataForm.value.LEJOS_OI_E){    
    console.log(this.dataForm.value.LEJOS_OI_E.charAt(0));
    console.log(this.dataForm.value.LEJOS_OI_E);
    let LEJOS_OI_E_T = Number(this.dataForm.value.LEJOS_OI_E);
    if(this.dataForm.value.LEJOS_OI_E.charAt(0) === '-'){
      LEJOS_OI_E = (this.dataForm.value.LEJOS_OI_E);
    }else{ LEJOS_OI_E ='+'+this.dataForm.value.LEJOS_OI_E;};
   }

   if(this.dataForm.value.LEJOS_OI_C){
    console.log(this.dataForm.value.LEJOS_OD_E.charAt(0));
    if(this.dataForm.value.LEJOS_OI_C.charAt(0) === '-'){
      LEJOS_OI_C = (this.dataForm.value.LEJOS_OI_C);
      }
      else{LEJOS_OI_C ='+'+this.dataForm.value.LEJOS_OI_C };
   }
  

   if(this.dataForm.value.CERCA_OD_E){
    let CERCA_OD_E_:string = String(this.dataForm.value.CERCA_OD_E);
    if(CERCA_OD_E_.charAt(0) === '-'){
      CERCA_OD_E = (CERCA_OD_E_);
    }else{ CERCA_OD_E ='+'+CERCA_OD_E_;};
     console.log(this.dataForm.value.CERCA_OD_E);
   /*  if(this.dataForm.value.CERCA_OD_E>0){
      CERCA_OD_E ='+'+this.dataForm.value.CERCA_OD_E;
     }else{
      CERCA_OD_E =this.dataForm.value.CERCA_OD_E;
     }*/
   
   }
      
 
  
   if(this.dataForm.value.CERCA_OI_E){
      let CERCA_OI_E_:string = String(this.dataForm.value.CERCA_OI_E);
    if(CERCA_OI_E_.charAt(0) === '-'){
      CERCA_OI_E = (CERCA_OI_E_);
    }else{ CERCA_OI_E ='+'+CERCA_OI_E_;};
   /* if(this.dataForm.value.CERCA_OI_E>0){
      CERCA_OI_E ='+'+this.dataForm.value.CERCA_OI_E;
    }else{
      CERCA_OI_E =this.dataForm.value.CERCA_OI_E;
    }*/
  }

  if(this.dataForm.value.CERCA_OD_C){
    if(this.dataForm.value.CERCA_OD_C.charAt(0) === '-'){
      CERCA_OD_C = (this.dataForm.value.CERCA_OD_C);
     
    }else{  
      CERCA_OD_C ='+'+this.dataForm.value.CERCA_OD_C;};
   }
   
   if(this.dataForm.value.CERCA_OI_C){
    if(this.dataForm.value.CERCA_OI_C.charAt(0) !== '-'){CERCA_OI_C ='+'+this.dataForm.value.CERCA_OI_C}else{ CERCA_OI_C = (this.dataForm.value.CERCA_OI_C);};
   }
   /** EJES  */
   if((this.dataForm.value.CERCA_OI_2 === null)||(this.dataForm.value.CERCA_OI_2 === '')){    
    
  }else{ 
    CERCA_OI_2 = (this.dataForm.value.CERCA_OI_2)+'°';
   }
   if((this.dataForm.value.CERCA_OD_2 === null)||(this.dataForm.value.CERCA_OD_2 === '')){    
    
  }else{ 
    CERCA_OD_2 = (this.dataForm.value.CERCA_OD_2)+'°';
   }

   if((this.dataForm.value.LEJOS_OD_2 === null)||(this.dataForm.value.LEJOS_OD_2 === '')){    
    
  }else{ 
     LEJOS_OD_2 = (this.dataForm.value.LEJOS_OD_2)+'°';
   }


   if((this.dataForm.value.LEJOS_OI_2 === null)||(this.dataForm.value.LEJOS_OI_2 === '')){    
    
   }else{
    console.log(this.dataForm.value.LEJOS_OI_2);
    LEJOS_OI_2 = (this.dataForm.value.LEJOS_OI_2)+'°';
   }

   /****DATOS */
//   pipe.transform(LEJOS_OD_E,  '1.1-1')
   doc.text(String(LEJOS_OD_E), 30+x, 42+y);  
   doc.text(String(LEJOS_OD_C), 50+x, 42+y);  
   doc.text(String(LEJOS_OD_2), 70+x, 42+y);  

   doc.text(String(LEJOS_OI_E), 30+x, 52+y);  
   doc.text(String(LEJOS_OI_C), 50+x, 52+y);  
   doc.text(String(LEJOS_OI_2), 70+x, 52+y);  

   doc.text(String(CERCA_OD_E), 30+x, 82+y);   //ok
   doc.text(String(CERCA_OD_C), 50+x, 82+y);  
   doc.text(String(CERCA_OD_2), 70+x, 82+y);  
   
   doc.text(String(CERCA_OI_E), 30+x, 92+y);  //ok 
   doc.text(String(CERCA_OI_C), 50+x, 92+y);  
   doc.text(String(CERCA_OI_2), 70+x, 92+y);  

   doc.text('Observaciones: '+OBS_LENTES_, 10+x, 105+y);  
   doc.text('Diagnostico: '+OBSERVACIO, 10+x, 115+y);  
   doc.text('Firma ', 70+x, 130+y);   
   doc.text( _fechaEmision, 10+x, 130+y);  

   
  window.open(doc.output('bloburl'));

    LEJOS_OD_E= '';
    LEJOS_OD_C= '';
    LEJOS_OD_2= '';
    LEJOS_OI_E= '';
    LEJOS_OI_C= '';
    LEJOS_OI_2= '';
    CERCA_OD_E= '';
    CERCA_OD_C= '';
    CERCA_OD_2= '';
    CERCA_OI_E= '';
    CERCA_OI_C= '';
    CERCA_OI_2= '';
    
  paciente_nombre= '';
  paciente_apellido='';
  paciente_dni= '';
  numero_afiliado= '';
  domicilio= '';
  paciente_obra_social_nombre='';
  plan= '';
  OBS_LENTES_ = '';
  OBSERVACIO = '';

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
