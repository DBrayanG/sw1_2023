class Clase {
    constructor (nombre="tabla",alias="", atributos=[]) {
      this._nombre = nombre;
      this._alias=alias;
      this._atributos=atributos;
      
    }

    // Getter
    get nombre() {
       return this._nombre;
    }

    set nombre(nom) {
        return this._nombre=nom;
    }

    get alias() {
        return this._alias;
     }
 
     set alias(cad) {
         return this._alias=cad;
     }
 

    get atributos() {
        return this._atributos;
    }

    set atributos(obj) {
        return this._atributos=obj;
    }

    

}


function addAtributos(clase,atributo){
     
    clase._atributos.push(atributo);
    
}

function cargarClase(clase,xml){

    clase.nombre=xml.childNodes[1]["attributes"]["value"]["nodeValue"];//class name
    clase.alias=xml["id"].split(":")[1];//class alias

    var listaAtributos=xml.childNodes[2].childNodes//lista de atributos
    
    listaAtributos.forEach(element => { 

        let resp= element["attributes"]["value"]["nodeValue"].split(":");

        let atributo=new Atributo(resp[0],resp[1]);
        addAtributos(clase,atributo);
        
    });
      
    
}

function generarDataTableOracle(clase,relaciones,listaclases){

    var texto="create table "+clase.nombre+"(\n";

    var herencia=false;

    var primaria="";
    var foranea="";

    var listaAtributos="";
    var atributoprimarios="";
    var atributosecundarios="";

    ////lista de atributos
    for (let index = 0; index < clase.atributos.length; index++) {

        const element = clase.atributos[index];
        if(element.tipo==="int"){
            listaAtributos+="  "+element.nombre+" number,\n";         
        }else{
            listaAtributos+="  "+element.nombre+" "+element.tipo+",\n";
        }

        
        
    }
    ///lista de atributos


    if(relaciones.length>0){

        relaciones.forEach(relacion => { 

            let listaobjeto=listaclases.filter((e) => e.nombre===relacion.origen);
            let origen=listaobjeto[0];   
            
            if((relacion.tipo==="Generalizacion")||(relacion.tipo==="Composicion")){//generalizacion || Composicion
                
                if(relacion.tipo==="Generalizacion")herencia=true;

                if(origen.atributos.length>0){  
                    if(origen.atributos[0].tipo==="int"){
                        atributoprimarios+="  "+origen.atributos[0].nombre+origen.nombre+" number,\n"; //atributos insertados antes de los demas
                    }else{
                        atributoprimarios+="  "+origen.atributos[0].nombre+origen.nombre+" "+origen.atributos[0].tipo+",\n"; //atributos insertados antes de los demas
                    }
                    

                    primaria+=origen.atributos[0].nombre+origen.nombre+","; 
                   
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key ("+origen.atributos[0].nombre+origen.nombre+") references "+origen.nombre+"("+origen.atributos[0].nombre+")\n";
                }else{
                    atributoprimarios+="  id"+origen.nombre+" number,\n";

                    primaria+="id"+origen.nombre+",";  
                    
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key (id"+origen.nombre+") references "+origen.nombre+"(id"+origen.nombre+")\n";
                }

                
            }else{//agreagacion || asociacion

                if(origen.atributos.length>0){ 
                    if(origen.atributos[0].tipo==="int"){
                        atributosecundarios+="  "+origen.atributos[0].nombre+origen.nombre+" number,\n"; //atributos insertados despues de los demas
                    }else{
                        atributosecundarios+="  "+origen.atributos[0].nombre+origen.nombre+",\n"; //atributos insertados despues de los demas
                    }
                    
                   
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key ("+origen.atributos[0].nombre+origen.nombre+") references "+origen.nombre+"("+origen.atributos[0].nombre+")\n";
                }else{
                    atributosecundarios+="  id"+origen.nombre+" number,\n";
                    
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key (id"+origen.nombre+") references "+origen.nombre+"(id"+origen.nombre+")\n";
                }

            }//asocicion y agregacion////////////////////////
              
    
        });

        if(!herencia){

            if(clase.atributos.length>0){
                primaria+=clase.atributos[0].nombre+",";   
            }else{
                primaria+="id,"; 
            }

        }
 

    }else{
        

        if(clase.atributos.length>0){ //null 
            primaria+=clase.atributos[0].nombre+","; 
        }else{
            primaria+="id,"; 
        }

    }


    let primarias=primaria.slice(0,primaria.length-1);

    texto+=""+atributoprimarios+listaAtributos+atributosecundarios+"  primary key("+primarias+"),\n"+foranea;

    
    texto+=");\n\n";

    return texto; 

}


function generarDataTablePostgreSQL(clase,relaciones,listaclases){

    var texto="create table "+clase.nombre+"(\n";

    var herencia=false;

    var primaria="";
    var foranea="";

    var listaAtributos="";
    var atributoprimarios="";
    var atributosecundarios="";

    ////lista de atributos
    for (let index = 0; index < clase.atributos.length; index++) {

        const element = clase.atributos[index];
        if(element.tipo==="int"){
            listaAtributos+="  "+element.nombre+"  int4,\n";
        }else{
            listaAtributos+="  "+element.nombre+" "+element.tipo+",\n";
        }

        
        
    }
    ///lista de atributos


    if(relaciones.length>0){

        relaciones.forEach(relacion => { 

            let listaobjeto=listaclases.filter((e) => e.nombre===relacion.origen);
            let origen=listaobjeto[0];   
            
            if((relacion.tipo==="Generalizacion")||(relacion.tipo==="Composicion")){//generalizacion || Composicion
                
                if(relacion.tipo==="Generalizacion")herencia=true;

                if(origen.atributos.length>0){  

                    if(origen.atributos[0].tipo==="int"){
                        atributoprimarios+="  "+origen.atributos[0].nombre+origen.nombre+" int4,\n"; //atributos insertados antes de los demas
                    }else{
                      atributoprimarios+="  "+origen.atributos[0].nombre+origen.nombre+" "+origen.atributos[0].tipo+",\n"; //atributos insertados antes de los demas
                    }
                    

                    primaria+=origen.atributos[0].nombre+origen.nombre+","; 
                   
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key ("+origen.atributos[0].nombre+origen.nombre+") references "+origen.nombre+"("+origen.atributos[0].nombre+")\n";
                }else{
                    atributoprimarios+="  id"+origen.nombre+" int4,\n";

                    primaria+="id"+origen.nombre+",";  
                    
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key (id"+origen.nombre+") references "+origen.nombre+"(id"+origen.nombre+")\n";
                }

                
            }else{//agreagacion || asociacion

                if(origen.atributos.length>0){ 
                    if(origen.atributos[0].tipo==="int"){
                        atributosecundarios+="  "+origen.atributos[0].nombre+origen.nombre+" int4,\n"; //atributos insertados despues de los demas
                    }else{
                        atributosecundarios+="  "+origen.atributos[0].nombre+origen.nombre+" "+origen.atributos[0].tipo+",\n"; //atributos insertados despues de los demas
                    }
                   
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key ("+origen.atributos[0].nombre+origen.nombre+") references "+origen.nombre+"("+origen.atributos[0].nombre+")\n";
                }else{
                    atributosecundarios+="  id"+origen.nombre+" int4,\n";
                    
                    foranea+="  constraint fk_"+clase.nombre+"_"+origen.nombre+" foreign key (id"+origen.nombre+") references "+origen.nombre+"(id"+origen.nombre+")\n";
                }

            }//asocicion y agregacion////////////////////////
              
    
        });

        if(!herencia){

            if(clase.atributos.length>0){
                primaria+=clase.atributos[0].nombre+",";   
            }else{
                primaria+="id,"; 
            }

        }
 

    }else{
        

        if(clase.atributos.length>0){ //null 
            primaria+=clase.atributos[0].nombre+","; 
        }else{
            primaria+="id,"; 
        }

    }


    let primarias=primaria.slice(0,primaria.length-1);

    texto+=""+atributoprimarios+listaAtributos+atributosecundarios+"  primary key("+primarias+"),\n"+foranea;

    
    texto+=");\n\n";

    return texto; 

}


function obtenerTablaClase(clase,relaciones,listaclases){

    var resultado=[];
    var listaAtributos=[];
    var atributoprimarios=[];
    var atributosecundarios=[];

    ////lista de atributos
    for (let index = 0; index < clase.atributos.length; index++) {

        const element = clase.atributos[index];
        listaAtributos.push(element.nombre);     
        
    }
    ///lista de atributos


    if(relaciones.length>0){

        relaciones.forEach(relacion => { 

            let listaobjeto=listaclases.filter((e) => e.nombre===relacion.origen);
            let origen=listaobjeto[0];   
            
            if((relacion.tipo==="Generalizacion")||(relacion.tipo==="Composicion")){//generalizacion || Composicion
                
                if(relacion.tipo==="Generalizacion")herencia=true;

                if(origen.atributos.length>0){  

                    atributoprimarios.push(origen.atributos[0].nombre+origen.nombre);
 
                }else{

                    atributoprimarios.push("id"+origen.nombre);
                }
  
            }else{//agreagacion || asociacion

                if(origen.atributos.length>0){ 

                    atributosecundarios.push(origen.atributos[0].nombre+origen.nombre);
                    
                }else{

                    atributosecundarios.push("id"+origen.nombre);
  
                }

            }//asocicion y agregacion////////////////////////
              
    
        });

    }


    let aux=atributoprimarios.concat(listaAtributos);

    resultado=aux.concat(atributosecundarios);

    return resultado; 

}



