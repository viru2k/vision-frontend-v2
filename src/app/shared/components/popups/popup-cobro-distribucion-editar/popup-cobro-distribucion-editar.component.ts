import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { DialogService } from 'primeng/components/common/api';
import { DynamicDialogRef, MessageService, DynamicDialogConfig } from 'primeng/api';
import { PracticaService } from '../../../../services/practica.service';
@Component({
  selector: 'app-popup-cobro-distribucion-editar',
  templateUrl: './popup-cobro-distribucion-editar.component.html',
  styleUrls: ['./popup-cobro-distribucion-editar.component.css']
})
export class PopupCobroDistribucionEditarComponent implements OnInit {
  elementos:any[] = null;
  total_suma:number = 0;
  categorizacion:number = 0;
  cols:any[];
  constructor(public config: DynamicDialogConfig, private miServicio:PracticaService ,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {

    this.cols = [
      { field: 'apellido', header: 'Apellido',  width: '15%' },
      { field: 'nombre', header: 'Nombre',  width: '10%' },
      {field: 'codigo', header: 'Códgo' , width: '8%' },
      { field: 'descripcion', header: 'Descripcion',  width: '15%' },
      { field: 'obra_social_nombre', header: 'O.S',  width: '15%' },
      { field: 'obra_social_practica_nombre', header: 'Distribución',  width: '15%' },
      { field: 'distribucion_porcentaje', header: '%' , width: '8%'},
      { field: 'distribucion_valor', header: 'Valor' , width: '8%'},
      { field: 'distribucion_total', header: 'Total' , width: '8%'},
      
   ];       
  }
  ngOnInit() {
    console.log(this.config.data); 
    this.loadList();
  }


  async loadList(){

    //console.log(this.updateDataForm.value);

    try {
     let resp = await    this.miServicio.getOperacionCobroDistribucionById(this.config.data.operacion_cobro_id,this.config.data.estado_liquidacion,this.config.data.obra_social_id)    
     
        console.log(resp);
       
 
          resp.forEach(element => {            
            if(element['obra_social_id']!= 1)  {
              element['distribucion_valor'] =   (Number(element['distribucion_valor'])*20 )/80;
              element['distribucion_total'] =   (Number(element['distribucion_total'])*20 )/80;
              this.total_suma = (Number(resp[0]['operacion_cobro_total_coseguro'])*20 )/80;
              this.categorizacion = Number(resp[0]['categorizacion']);
            }else{
              this.total_suma = Number(resp[0]['valor_facturado']);
              this.categorizacion = Number(resp[0]['categorizacion']);
            }
           
        
       //   resp[0]['operacion_cobro_total_coseguro'];
        this.elementos = resp;
       // this.ref.close();
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
  
  
  

