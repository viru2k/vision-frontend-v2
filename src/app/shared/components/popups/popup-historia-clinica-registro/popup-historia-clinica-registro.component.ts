import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';

@Component({
  selector: 'app-popup-historia-clinica-registro',
  templateUrl: './popup-historia-clinica-registro.component.html',
  styleUrls: ['./popup-historia-clinica-registro.component.css']
})
export class PopupHistoriaClinicaRegistroComponent implements OnInit {

  elemento:HistoriaClinica;
  constructor(private miServico:CirugiaService ,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) { }

  ngOnInit() {
    console.log(this.config.data);  
    this.elemento = this.config.data;
  }
}
