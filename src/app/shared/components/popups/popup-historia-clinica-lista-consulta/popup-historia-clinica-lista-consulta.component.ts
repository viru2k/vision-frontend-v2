import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { PopupEstudiosImagenComponent } from '../popup-estudios-imagen/popup-estudios-imagen.component';
import { Paciente } from '../../../../models/paciente.model';

@Component({
  selector: 'app-popup-historia-clinica-lista-consulta',
  templateUrl: './popup-historia-clinica-lista-consulta.component.html',
  styleUrls: ['./popup-historia-clinica-lista-consulta.component.css']
})
export class PopupHistoriaClinicaListaConsultaComponent implements OnInit {

  elementos:HistoriaClinica[];
  loading;
  constructor(private miServico:CirugiaService ,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) { }

  ngOnInit() {
    console.log(this.config.data);  
    this.elementos = this.config.data;
  }

  

  verEstudios(estudio_id:string){

    let data:any; 
    data =  estudio_id;
    const ref = this.dialogService.open(PopupEstudiosImagenComponent, {
    data,
     header: 'Estudios', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupEstudiosImagenComponent: Paciente) => {
        if (PopupEstudiosImagenComponent) {
          console.log(PopupEstudiosImagenComponent);
      
        }
    });
  
  }
  
}
