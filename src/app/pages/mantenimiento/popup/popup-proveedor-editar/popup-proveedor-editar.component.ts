import { Component, OnInit } from "@angular/core";

import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MovimientoCajaService } from "../../../../services/movimiento-caja.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { FacturacionService } from "../../../../services/facturacion.service";

import swal from "sweetalert2";

@Component({
  selector: "app-popup-proveedor-editar",
  templateUrl: "./popup-proveedor-editar.component.html",
  styleUrls: ["./popup-proveedor-editar.component.css"],
})
export class PopupProveedorEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  elementosCondicionIva: any[] = [];
  elementosTipoDocumento: any[] = [];
  elementoCondicionIva: string;
  elementoTipoDocumento: string;

  constructor(
    private facturacionService: FacturacionService,
    public config: DynamicDialogConfig,
    private movimientoCajaService: MovimientoCajaService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id: new FormControl(""),
      proveedor_nombre: new FormControl("", Validators.required),
      proveedor_cuit: new FormControl("", Validators.required),
      proveedor_direccion: new FormControl("", Validators.required),
      descripcion: new FormControl(),
      categoria_iva: new FormControl(),
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    if (!!this.config.data) {
      console.log("es editable");
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    } else {
      this.es_nuevo = true;
      console.log("es nuevo");
    }

    this.getTipoDocumento();
    this.getCondicionIva();
  }

  getTipoDocumento() {
    this.loading = true;
    try {
      this.facturacionService.Documento().subscribe(
        (resp) => {
          this.elementosTipoDocumento = resp;
          if (!!this.config.data) {
            this.updateDataForm
              .get("descripcion")
              .setValue(
                this.elementosTipoDocumento.find(
                  (elem) => elem.descripcion === this.config.data.tipo_documento
                )
              );

            /*    this.elementoTipoDocumento = this.elementosTipoDocumento.find(
              (x) => x.descripcion === this.config.data.descripcion
            );
            this.updateDataForm.patchValue({
              descripcion: this.config.data.descripcion,
            }); */
            console.log(this.updateDataForm.value);
          } else {
            this.elementoTipoDocumento = this.elementosTipoDocumento[4];
          }

          this.loading = false;
          console.log(resp);
        },
        (error) => {
          // error path
          this.loading = false;
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: "error",
            text: error.message,
            title: "error.status",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } catch (error) {}
  }

  getCondicionIva() {
    this.loading = true;
    try {
      this.facturacionService.CategoriaIva().subscribe(
        (resp) => {
          this.elementosCondicionIva = resp;
          if (!!this.config.data) {
            this.updateDataForm
              .get("categoria_iva")
              .setValue(
                this.elementosCondicionIva.find(
                  (elem) =>
                    elem.categoria_iva === this.config.data.condicion_iva
                )
              );
            /*   this.elementoCondicionIva = this.elementosCondicionIva.find(
              (x) => x.categoria_iva === this.config.data.condicion_iva
            );
            this.updateDataForm.patchValue({
              categoria_iva: this.config.data.condicion_iva,
            }); */
            console.log(this.updateDataForm.value);
          } else {
            this.elementoCondicionIva = this.elementosCondicionIva[4];
          }

          this.loading = false;
          console.log(resp);
        },
        (error) => {
          // error path
          this.loading = false;
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: "error",
            text: error.message,
            title: "error.status",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } catch (error) {}
  }

  guardarDatos() {
    if (this.es_nuevo) {
      this.nuevaUnidad();
    } else {
      this.editarUnidad();
    }
  }

  nuevaUnidad() {
    this.loading = true;
    try {
      this.movimientoCajaService
        .setProveedor(this.updateDataForm.value)
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
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

  editarUnidad() {
    console.log(this.updateDataForm);
    try {
      this.movimientoCajaService
        .putProveedor(this.updateDataForm.value, this.updateDataForm.value.id)
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
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

  changeElementoTipoDocumento(event: any) {
    console.log(event);
  }

  changeElementoCondicionIva(event: any) {
    console.log(event);
  }
}
