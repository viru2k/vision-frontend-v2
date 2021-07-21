import { Convenio } from './../../../../../models/convenio.model';
import { MessageService, DialogService, DynamicDialogRef } from 'primeng/api';
import { ConvenioService } from './../../../../../services/convenio.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { PracticaDistribucionRegistro } from '../../../../../models/practica-distribucion-registro.model';

@Component({
  selector: 'app-popup-combinada-item',
  templateUrl: './popup-combinada-item.component.html',
  styleUrls: ['./popup-combinada-item.component.css']
})
export class PopupCombinadaItemComponent implements OnInit {

  loading: boolean;
  cols: any[];
  selectedItem: Convenio;
  elemento:Convenio = null;
  elementos:Convenio[] = null;
  porcentaje:number = 100;
  valorRenglon:number=0;
  totalcalculado:number = 0;
  item: PracticaDistribucionRegistro =null;
  constructor(private miServico:ConvenioService ,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {
  
    this.cols = [
    { field: 'obra_social_nombre', header: 'Obra Social',  width: '20%' },
        {field: 'codigo', header: 'Codigo' , width: '10%' },
        { field: 'pmo_descripcion', header: 'Descripción',  width: '30%' },
        { field: 'complejidad', header: 'Nivel',  width: '10%' },        
        { field: 'valor', header: 'Valor' , width: '10%'}        
       
     ];

    
  }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
   
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
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert("error","Error al cargar los registros",error,error.status);
    }  
}

onRowSelect(event) {  
    this.selectedItem = event.data;
    console.log(this.totalcalculado);
    console.log(this.selectedItem);
    this.valorRenglon= this.selectedItem.valor;
    this.calcularPorcentaje();
}

calcularPorcentaje(){    
  
    this.totalcalculado = (this.valorRenglon* this.porcentaje)/ 100;
}

guardarDato(){
    if(this.selectedItem != null){
    var item:PracticaDistribucionRegistro;
    item = new PracticaDistribucionRegistro("0",this.selectedItem.id, this.selectedItem.id ,this.porcentaje, this.selectedItem.valor, this.totalcalculado,this.selectedItem.codigo, this.selectedItem.complejidad, this.selectedItem.es_habilitada,
     this.selectedItem.obra_social_id, this.selectedItem.obra_social_nombre, this.selectedItem.pmo_descripcion, this.selectedItem.pmo_id );
    console.log(item);
    this.ref.close(item);
    }else{
        this.throwAlert("alerta","Error en el tipo de dato seleccionado", "¿Selecciono un registro para combinar?","sin error");
    }
}

eliminarRegistro(){
    console.log(this.selectedItem);
    
}

throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
  let tipoerror:string;

     if(estado== "success"){
          swal({
              type: 'success',
              title: 'Exito',
              text: mensaje
            })
      }
      if(estado== "error"){
        if(errorNumero =="422"){
            mensaje ="Los datos que esta tratando de guardar son iguales a los que ya poseia";
        }
        if(errorNumero =="400 "){
            mensaje ="Bad Request ";
        }
        if(errorNumero =="404"){
            mensaje ="No encontrado ";
        }
        if(errorNumero =="401"){
            mensaje ="Sin autorización";
        }
        if(errorNumero =="403"){
            mensaje =" Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ";
        }
        if(errorNumero =="405"){
            mensaje ="Método no permitido";
        }
        if(errorNumero =="500"){
            mensaje ="Error interno en el servidor";
        }
        if(errorNumero =="503"){
            mensaje ="Servidor no disponible";
        }
        if(errorNumero =="502"){
            mensaje ="Bad gateway";
        }

          swal({   
              type: 'error',
              title: 'Oops...',
              text: mensaje,
              footer: motivo
            })
      }
      if(estado== "alerta"){
        swal({   
            type: 'warning',
            title: 'Cuidado!',
            text: mensaje,
            footer: motivo
          })
    }
    }
}
