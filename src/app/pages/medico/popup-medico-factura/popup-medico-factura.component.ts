import { AlertServiceService } from "./../../../services/alert-service.service";
import { UserService } from "./../../../services/user.service";
import {
  DynamicDialogConfig,
  MessageService,
  DialogService,
} from "primeng/api";
import { Component, OnInit } from "@angular/core";
import { FacturacionService } from "../../../services/facturacion.service";

@Component({
  selector: "app-popup-medico-factura",
  templateUrl: "./popup-medico-factura.component.html",
  styleUrls: ["./popup-medico-factura.component.css"],
})
export class PopupMedicoFacturaComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  modulosUsuario: any[];
  selecteditems: any;
  loading;
  userData: any;
  selectedElemento: any;
  selectedModulos: any[];
  mensaje: string;

  // tslint:disable-next-line: max-line-length
  constructor(
    public config: DynamicDialogConfig,
    private userService: UserService,
    private facturacionService: FacturacionService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    this.mensaje = "Cargando listado ...";
    try {
      this.facturacionService.Comprobante().subscribe(
        (resp) => {
          this.elementos = resp;
          console.log(this.elementos);
          this.loading = false;
          console.log(resp);
          this.loadlistFacturaUsuario();
        },
        (error) => {
          // error path
          console.log(error);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  loadlistFacturaUsuario() {
    this.loading = true;
    this.mensaje = "Cargando modulos del usuario ...";
    try {
      this.facturacionService
        .getComprobanteBymedico(this.config.data.id)
        .subscribe(
          (resp) => {
            this.modulosUsuario = resp;
            console.log(this.modulosUsuario);
            this.loading = false;
            console.log(resp);
          },
          (error) => {
            // error path
            console.log(error);
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              "",
              "500"
            );
          }
        );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  borrar(e: any) {
    console.log(e.value);

    this.loading = true;
    /*    try {
      this.userService.delModulo(e.value.user_modulo_id).subscribe(
        (resp) => {
          this.loadlistFacturaUsuario();
          console.log(resp);
        },
        (error) => {
          // error path
          console.log(error);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    } */
  }

  guardarModulos() {
    console.log(this.selectedModulos);

    this.loading = true;
    this.mensaje = "Cargando modulos del usuario ...";
    /*   try {
      this.userService
        .postUserMenu(this.selectedModulos, this.config.data.id)
        .subscribe(
          (resp) => {
            this.loadlistFacturaUsuario();
            console.log(resp);
          },
          (error) => {
            // error path
            console.log(error);
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              "",
              "500"
            );
          }
        );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    } */
  }
}
