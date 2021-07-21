export class CirugiaFichaAnestesia {

    id:string;
    medico_id:string;
    practica:string;
    paciente_id:string;
    fecha_realizacion:string;
    paciente_peso:string;
    lab_g_r:string;
    lab_g_b:string;
    lab_hto:String;
    lab_gluc:string;
    lab_uremia:string;
    lab_got:string;
    lab_gpt:string;
    lab_fa:string;
    lab_kppt:string;
    lab_t_coag:string;
    lab_t_sangria:string;
    lab_t_protromb:string;
    lab_plaq:string;
    lab_ecg:string;        
    lab_r_quirurgico:string;
    lab_ta:String;
    lab_fc:string;
    lab_antecedentes_quirurgicos:string;
    lab_app:string;
    lab_antecedentes_alergicos:string;
    lab_antecedentes_toxicos:string;        
    lab_medicamentos:string;
    lab_observaciones:String;
    apto:string;


    constructor( 
    id:string,
    medico_id:string,
    practica:string,
    paciente_id:string,
    fecha_realizacion:string,
    paciente_peso:string,
    lab_g_r:string,
    lab_g_b:string,
    lab_hto:String,
    lab_gluc:string,
    lab_uremia:string,
    lab_got:string,
    lab_gpt:string,
    lab_fa:string,
    lab_kppt:string,
    lab_t_coag:string,
    lab_t_sangria:string,
    lab_t_protromb:string,
    lab_plaq:string,
    lab_ecg:string,
    lab_r_quirurgico:string,
    lab_ta:String,
    lab_fc:string,
    lab_antecedentes_quirurgicos:string,
    lab_app:string,
    lab_antecedentes_alergicos:string,
    lab_antecedentes_toxicos:string,
    lab_medicamentos:string,
    lab_observaciones:String,
    apto:string
        ) {

            this.id = id;
            this.medico_id = medico_id;
            this.practica = practica;
            this.paciente_id = paciente_id;
            this.fecha_realizacion = fecha_realizacion;
            this.paciente_peso = paciente_peso;
            this.lab_g_r = lab_g_r;
            this.lab_g_b = lab_g_b;
            this.lab_hto = lab_hto;
            this.lab_gluc = lab_gluc;
            this.lab_uremia = lab_uremia;
            this.lab_got = lab_got;
            this.lab_gpt = lab_gpt;
            this.lab_fa = lab_fa;
            this.lab_kppt = lab_kppt;
            this.lab_t_coag = lab_t_coag;
            this.lab_t_sangria = lab_t_sangria;
            this.lab_t_protromb = lab_t_protromb;
            this.lab_plaq = lab_plaq;
            this.lab_ecg = lab_ecg;
            this.lab_r_quirurgico = lab_r_quirurgico;
            this.lab_ta = lab_ta;
            this.lab_fc = lab_fc;
            this.lab_antecedentes_quirurgicos = lab_antecedentes_quirurgicos;
            this.lab_app = lab_app;
            this.lab_antecedentes_alergicos = lab_antecedentes_alergicos;
            this.lab_antecedentes_toxicos = lab_antecedentes_toxicos;
            this.lab_medicamentos = lab_medicamentos;
            this.lab_observaciones = lab_observaciones;
            this.apto = apto;
       
   }
}