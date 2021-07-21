import { ObraSocial } from 'src/app/models/obra-social.model';
export class Medico {

    
    
    public apellido:string;
    public nombre:string;
    public domicilio:string;
    public fecha_matricula:Date;
    public telefono:string;
    public telefono_cel:string;
    public email:string;
    public email_laboral:string;
    public cuit:string;
    public ing_brutos:string;
    public usuario_id:string;
    public id:string;
    public obra_social:ObraSocial[];
    public codigo_old:string;
    public categoria_iva_id:string;
    public factura_documento_comprador_id:string;
    public punto_vta_id:string; 
    public factura_comprobante_id:string; 
    public fecha_alta_afip:string; 
    public factura_key:string; 
    public factura_crt:string; 

    constructor(
         apellido:string,
         nombre:string,
         domicilio:string,
         fecha_matricula:Date,
         telefono:string,
         telefono_cel:string,
         email:string,
         email_laboral:string,
         cuit:string,
         ing_brutos:string,
         usuario_id:string,
         id:string,
         obra_social:ObraSocial[],
         codigo_old:string,
         categoria_iva_id:string,
         factura_documento_comprador_id:string,
         punto_vta_id:string,
         factura_comprobante_id:string,
         fecha_alta_afip:string,
         factura_key:string, 
         factura_crt:string
    ) {
        
       
        this.apellido = apellido;
        this.nombre = nombre;     
        this.domicilio = domicilio;      
        this.email = email;
        this.email_laboral= email_laboral;
        this.fecha_matricula= fecha_matricula;
        this.id = id;
        this.cuit = cuit;
        this.ing_brutos= ing_brutos;
        this.telefono= telefono;
        this.telefono_cel= telefono_cel;
        this.usuario_id = usuario_id;
        this.obra_social = obra_social;
        this.codigo_old = codigo_old;
        this.categoria_iva_id = categoria_iva_id ;
        this.factura_documento_comprador_id = factura_documento_comprador_id ;
        this.punto_vta_id = punto_vta_id ;
        this.factura_comprobante_id = factura_comprobante_id ;
        this.fecha_alta_afip = fecha_alta_afip;
        this.factura_key = factura_key;
        this.factura_crt = factura_crt;
    }
}