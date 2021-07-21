export class Estudios {

    
    
    
    public id:string;
    public estudio:string;
    public paciente_id:string;
    public medico_id:string;
    public fecha_estudio:string;
    public usuario_realiza_id:string;
    public file_name:string;
    public url:string; 
    public file:string;
    public paciente_dni:string;
    public SINTOMAS_SIGNOS:string;

    constructor(  id:string,
        estudio:string,
         paciente_id:string,
         medico_id:string,
         fecha_estudio:string,
         usuario_realiza_id:string,
         file_name:string,
         url:string,
         file:string,
         paciente_dni:string,
         SINTOMAS_SIGNOS:string
          ) {
        
            this.estudio = estudio;
            this.paciente_id = paciente_id;
            this.medico_id = medico_id;
            this.fecha_estudio = fecha_estudio;
            this.usuario_realiza_id = usuario_realiza_id;
            this.file_name = file_name;
            this.url = url;
            this.file = file;
            this.paciente_dni = paciente_dni;
            this.SINTOMAS_SIGNOS = SINTOMAS_SIGNOS;
    }
}