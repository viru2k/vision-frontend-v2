import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { MedicoService } from '../../../../services/medico.service';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { AgendaTurno } from '../../../../models/agenda-turno.model';
import { CirugiaFicha } from 'src/app/models/cirugia-ficha.model';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-popup-derivar-asesoramiento',
  templateUrl: './popup-derivar-asesoramiento.component.html',
  styleUrls: ['./popup-derivar-asesoramiento.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupDerivarAsesoramientoComponent implements OnInit {
 
  dataForm:FormGroup
  
  TipoCirugia:any[];
  elemento:AgendaTurno;
  elemento_derivar:CirugiaFicha;
  selectedcirugia:string[] = [];
  
  constructor(private miServicio:CirugiaService ,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) { 
    
    this.TipoCirugia = [
      {label: '',value:{id:30, name: '', code: 'BLEFAROPLASTIA'}},
      {label: 'CHALAZION',value:{id:31, name: 'CHALAZION', code: 'CHALAZION'}},
      {label: 'BLEFAROPLASTIA',value:{id:1, name: 'BLEFAROPLASTIA', code: 'BLEFAROPLASTIA'}},
      {label: 'CATETERIZACION DE VÍA LAGRIMAL',value:{id:2, name: 'CATETERIZACION DE VÍA LAGRIMAL', code: 'CATETERIZACION DE VÍA LAGRIMAL'}},
      {label: 'CIRUGIA COMBINADA DE CATARATA Y GALUCOMA, CON IMPLANTE DE LIO',  value:{id:3, name: 'TARJCIRUGIA COMBINADA DE CATARATA Y GALUCOMA, CON IMPLANTE DE LIOETA', code: 'TEXTO'}},
      {label: 'CIRUGÍA CORRECTORA DEL ESTRABISMOQUE',value:{id:4, name: 'CIRUGÍA CORRECTORA DEL ESTRABISMOQUE', code: 'TEXTO'}},
      {label: 'CIRUGIA DE CATARATA CON FACOEMULSIFICACION CON IMPLANTE DE LIO',value:{id:1, name: 'CIRUGIA DE CATARATA CON FACOEMULSIFICACION CON IMPLANTE DE LIO', code: 'TEXTO'}},
      {label: 'CIRUGIA REFRACTIVA CON IMPLANTE DE ICL ',value:{id:5, name: 'CIRUGIA REFRACTIVA CON IMPLANTE DE ICL', code: 'TEXTO'}},
      {label: 'COLOCACION DE PUNCTUM PLUG',value:{id:6, name: 'COLOCACION DE PUNCTUM PLUG', code: 'TEXTO'}},
      {label: 'CONJUNTIVOPLASTIA',value:{id:7, name: 'CONJUNTIVOPLASTIA', code: 'TEXTO'}},
      {label: 'CURVA DIARIA DE PRESION OCULAR SEGÚN SAMPAOLESI',value:{id:29, name: 'CURVA DIARIA DE PRESION OCULAR SEGÚN SAMPAOLESI', code: 'TEXTO'}},
      {label: 'DACRIOCISTORRINOSTOMIA',value:{id:8, name: 'DACRIOCISTORRINOSTOMIA', code: 'TEXTO'}},
      {label: 'DESPRENDIMIENTO DE RETINA',value:{id:9, name: 'DESPRENDIMIENTO DE RETINA', code: 'TEXTO'}},
      {label: 'ENUCLEACION/ESVICERACION',value:{id:10, name: 'ENUCLEACION/ESVICERACION', code: 'TEXTO'}},
      {label: 'ESCISION DE LESION DE CONJUNTIVA',value:{id:11, name: 'ESCISION DE LESION DE CONJUNTIVA', code: 'TEXTO'}},
      {label: 'ESCISION DE LESION DE PARPADOS',value:{id:12, name: 'ESCISION DE LESION DE PARPADOS', code: 'TEXTO'}},
      {label: 'EXAMEN OFTALMOLOGICO COMPLETO BAJO ANESTESIA GENERAL',value:{id:13, name: 'EXAMEN OFTALMOLOGICO COMPLETO BAJO ANESTESIA GENERAL', code: 'TEXTO'}},
      {label: 'EXTRACCION DE CUERPO EXTRAÑO',value:{id:14, name: 'EXTRACCION DE CUERPO EXTRAÑO', code: 'TEXTO'}},
      {label: 'IMPLANTE DE LIO',value:{id:15, name: 'IMPLANTE DE LIO', code: 'TEXTO'}},
      {label: 'INTRODUCCION DE SUSTANCIA INTRAVITREA ANTIANGIOGENICA',value:{id:16, name: 'INTRODUCCION DE SUSTANCIA INTRAVITREA ANTIANGIOGENICA', code: 'TEXTO'}},
      {label: 'INTRODUCCIÓN DE SUSTANCIA TERAPÉUTICA',value:{id:17, name: 'INTRODUCCIÓN DE SUSTANCIA TERAPÉUTICA', code: 'TEXTO'}},
      {label: 'ENDOFOTOCOAGULACION CON RAYOS LASER EN QUIROFANO',value:{id:18, name: 'ENDOFOTOCOAGULACION CON RAYOS LASER EN QUIROFANO', code: 'TEXTO'}},
      {label: 'PTOSIS PALPEBRAL',value:{id:19, name: 'PTOSIS PALPEBRAL', code: 'TEXTO'}},
      {label: 'SUTURA DE CORNEA',value:{id:20, name: 'SUTURA DE CORNEA', code: 'TEXTO'}},
      {label: 'SUTURA DE CONJUNTIVA',value:{id:21, name: 'SUTURA DE CONJUNTIVA', code: 'TEXTO'}},
      {label: 'TRABECULECTOMÍA',value:{id:22, name: 'RABECULECTOMÍA', code: 'TEXTO'}},
      {label: 'TRANSPLANTE DE CORNEA',value:{id:23, name: 'TRANSPLANTE DE CORNEA', code: 'TEXTO'}},
      {label: 'VIRECTOMIA CON EXTRACCIÓN DE CRISTALINO E IMPLANTE DE LIO',value:{id:24, name: 'VIRECTOMIA CON EXTRACCIÓN DE CRISTALINO E IMPLANTE DE LIO', code: 'TEXTO'}},
      {label: 'VITRECTOMIA',value:{id:25, name: 'VITRECTOMIA', code: 'TEXTO'}},
      {label: 'VITRECTOMIA E INTRODUCCION DE SUSTANCIA INTRAVITREA ANTIANGIOGENICA',value:{id:26, name: 'VITRECTOMIA E INTRODUCCION DE SUSTANCIA INTRAVITREA ANTIANGIOGENICA', code: 'TEXTO'}},
      {label: 'VITRECTOMIA EN DEPRENDIMIENTO DE RETINA',value:{id:27, name: 'VITRECTOMIA EN DEPRENDIMIENTO DE RETINA', code: 'TEXTO'}},
      {label: 'VITRECTOMIA EN DESPRENDIMIENTO DE RETINA CON EXTRACCIÓN DE CRISTALINO E IMPLANTE DE LIO',value:{id:28, name: 'VITRECTOMIA EN DESPRENDIMIENTO DE RETINA CON EXTRACCIÓN DE CRISTALINO E IMPLANTE DE LIO', code: 'TEXTO'}},
    
  ];

  this.dataForm = new FormGroup({
    'motivo_derivacion': new FormControl('-', Validators.required),
    'selectedcirugia': new FormControl('', Validators.required),
    'ojo': new FormControl('AO', Validators.required),
  });
  console.log(this.config.data);  
  this.elemento = this.config.data;
  this.elemento.paciente_obra_social_id = this.config.data.obra_social_id;
  this.elemento.paciente_id = this.config.data.paciente_id;
}

  ngOnInit() {
    
  }

  derivar(){
    let userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.elemento);
    let cir = this.TipoCirugia.find(x => x.name === this.dataForm.value.selectedCirugia);
    console.log(cir);
    let fecha_derivacion:string = formatDate(new Date(), 'yyyy-MM-dd HH:mm', 'es-AR');
    let cirugias:string = '';
    
    console.log(this.selectedcirugia);
    console.log(this.dataForm.value.selectedcirugia);
    for(let j= 0;j< this.dataForm.value.selectedcirugia.length;j++){
      console.log(this.dataForm.value.selectedcirugia[j]["name"]);
      if(j == 0){
        cirugias = this.dataForm.value.selectedcirugia[j]["name"];
      }else{
       cirugias =cirugias+' - '+this.dataForm.value.selectedcirugia[j]["name"];
      }
    }
    
    //si no se selecciona un motivo se debe seleccionar un dato
    if((this.dataForm.value.selectedcirugia.length == 0)&&(this.dataForm.value.motivo_derivacion === '')){
      cirugias ='NO SE DEFINIO NINGUN PARAMETRO DE CIRUGIA';
     // cirugias =this.dataForm.value.motivo_derivacion+' --- '+cirugias;
    }

    if((this.dataForm.value.selectedcirugia.length != 0)&&(this.dataForm.value.motivo_derivacion !== '')){
      cirugias =this.dataForm.value.motivo_derivacion+' --- '+cirugias;
    }

    
    if((this.dataForm.value.selectedcirugia.length == 0)&&(this.dataForm.value.motivo_derivacion !== '')){
      cirugias =this.dataForm.value.motivo_derivacion;
    }

   
    this.elemento_derivar = new CirugiaFicha('' , this.elemento.paciente_id, userData['id'], fecha_derivacion,'0','0','0','0', this.dataForm.value.ojo, this.dataForm.value.motivo_derivacion, this.elemento.paciente_obra_social_id, cirugias,'0','0','0','1','','','','', userData['id'],'0');
    try {
      console.log(this.elemento_derivar);
      this.miServicio.derviarPaciente(this.elemento_derivar)
      .subscribe(resp => {
        this.throwAlert("success","Se modificó el registro con éxito","","");
        this.ref.close();
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert("error","Error al cargar los registros",error,error.status);
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
  
  if(errorNumero =='99'){
    mensaje ='Debe seleccionar un paciente antes de cargar las prácticas';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
  }
  
  if(errorNumero =='100'){
    mensaje ='El paciente posee una obra social que no esta habilitada';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
  }
    if(estado == 'warning'){
      
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
  
