class Diagrama {
    constructor (nombre="modelo de dominio", clases=[],relaciones=[]) {
      this._nombre = nombre;
      this._clases=clases;
      this._relaciones=relaciones;
      
    }

    // Getter
    get nombre() {
       return this._nombre;
    }

    set nombre(nom) {
        return this._nombre=nom;
    }

    get clases() {
        return this._clases;
    }

    set clases(obj) {
        return this._clases=obj;
    }

    get relaciones() {
        return this._relaciones;
    }

    set relaciones(obj) {
        return this._relaciones=obj;
    }
    

}


function addClass(diagrama,obj){
     
    diagrama.clases.push(obj);
    
}

function addRelacions(diagrama,obj){
     
    diagrama.relaciones.push(obj);
    
}

function cargarDiagrama(diagrama,xml){

    var parser, xmlDoc;         

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml,"text/xml");

    diagrama.nombre= xmlDoc.getElementsByTagName("UMLClassDiagram")[0]["attributes"]["name"]["nodeValue"];//diagram name

    let listaClases=xmlDoc.getElementsByTagName("UMLClass");
    cargarListaClases(diagrama,listaClases);

    let listaGeneralizacion=xmlDoc.getElementsByTagName("UMLGeneralization");
    cargarListaGeneralizacion(diagrama,listaGeneralizacion);

    let listaAsociacion=xmlDoc.getElementsByTagName("UMLAssociation");
    cargarListaAsociacion(diagrama,listaAsociacion);

    let listaComposicion=xmlDoc.getElementsByTagName("UMLComposition");
    cargarListaComposicion(diagrama,listaComposicion);

    let listaAgregacion=xmlDoc.getElementsByTagName("UMLAggregation");
    cargarListaAgregacion(diagrama,listaAgregacion);
    

}

function cargarListaClases(diagrama, lista){

    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

         let clase=new Clase();
        cargarClase(clase,element);
        addClass(diagrama,clase);
        
    }

}


function cargarListaGeneralizacion(diagrama,lista){

    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

        let relacion=new Generalizacion();

        cargarRelacion1(relacion,element,diagrama.clases);
        addRelacions(diagrama,relacion);

        let aux=relacion.origen;
        relacion.origen=relacion.destino;
        relacion.destino=aux;

    }

}

function cargarListaAsociacion(diagrama,lista){

    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

        let relacion=new Asociacion();

        cargarRelacion2(relacion,element,diagrama.clases);
        addRelacions(diagrama,relacion);

    }

}

function cargarListaComposicion(diagrama,lista){

    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

        let relacion=new Composicion();

        cargarRelacion2(relacion,element,diagrama.clases);
        addRelacions(diagrama,relacion);

    }

}

function cargarListaAgregacion(diagrama,lista){

    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];

        let relacion=new Agregacion();

        cargarRelacion2(relacion,element,diagrama.clases);
        addRelacions(diagrama,relacion);

    }

}


function generarDataBase(diagrama,nombre,tipo){

    var contenido="";
    
    if(nombre!=""){

        if(tipo==="oracle"){
            contenido= generarDataBaseOracle(diagrama,nombre);
        }else if(tipo==="postgressql"){
            contenido= generarDataBasePostgreSQL(diagrama,nombre)
        }else{
            //ninguna
        }

    }

    return contenido;

}

function generarDataBaseOracle(diagrama, nombre){

    let texto="CREATE DATABASE "+nombre +";\n\n";//.sql  
    
    diagrama.clases.forEach(element => {

        var relaciones=diagrama.relaciones.filter((relacion) => relacion.destino===element.nombre);

       texto+= generarDataTableOracle(element,relaciones,diagrama.clases);
        
    });

    return texto;

}

function generarDataBasePostgreSQL(diagrama,nombre){


    let texto="CREATE DATABASE "+nombre +";\n\n";//.sql  
    
    diagrama.clases.forEach(element => {

        var relaciones=diagrama.relaciones.filter((relacion) => relacion.destino===element.nombre);

       texto+= generarDataTablePostgreSQL(element,relaciones,diagrama.clases);
        
    });

    return texto;

}

function generarVistas(diagrama){

    diagrama.clases.forEach(element => {

        var relaciones=diagrama.relaciones.filter((relacion) => relacion.destino===element.nombre);

        let tabla= obtenerTablaClase(element,relaciones,diagrama.clases);

        let cabezera=encabezado(element.nombre);

        let contenido=generarLista(tabla,element.nombre);
        let listado=vista(cabezera,contenido);
        downloadHTML(listado,"listado"+element.nombre);
        
        contenido=generarNuevo(tabla,element.nombre);
        let Nuevo=vista(cabezera,contenido);
        downloadHTML(Nuevo,"nuevo"+element.nombre);
       
        contenido=generarEditar(tabla,element.nombre);
        let Editar=vista(cabezera,contenido);
        downloadHTML(Editar,"editar"+element.nombre);
        
        
    });

}

function vista(cabezera,contenido){

    let htmlopen='<!DOCTYPE html><html>';
    let htmlclose='</html>';

    let headopen='<head>';
    let headclose='</head>';

    let bodyopen='<body>';
    let bodyclose='</body>';

    let resltado='';

    resltado+=htmlopen+headopen+cabezera+headclose;
    resltado+=bodyopen+contenido+bodyclose+htmlclose

    return resltado;

}

function encabezado(nombre){
   
    let titleopen='<title>';
    let titleclose='</title>';

    return titleopen+nombre+titleclose;

}

function generarLista(tabla,nombre){

    let contenido='';

    let h3open='<h3>';
    let h3close='</h3>';

    let tableopen='<table>';
    let tableclose='</table>';

    let theadopen='<thead>';
    let theadclose='</thead>';

    let thopen='<th>';
    let thclose='</th>';

    let tropen='<tr>';
    let trclose='</tr>';

    let tdopen='<td>';
    let tdclose='</td>';

    let buttonopen='<button>';
    let buttonclose='</button>';

    let aopen='<a href="">';
    let aclose='</a>';
    

    var aux='';

    aux+=tableopen+theadopen;

tabla.forEach(element => {

    aux+=thopen+element+thclose;  
    
});

aux+=thopen+'Accion...'+aopen+buttonopen+'Nuevo'+buttonclose+aclose+thclose;
aux+=theadclose+tropen;

tabla.forEach(element => {

    aux+=tdopen+'something'+tdclose;
    
});

aux+=tdopen+aopen+buttonopen+'Editar'+buttonclose+aclose;
aux+=aopen+buttonopen+'Borrar'+buttonclose+aclose+tdclose;

aux+=trclose+tableclose;

    contenido+=h3open+'Listado de '+nombre+h3close+aux;

  return contenido;          

}

function label(nombre){

    let labelopen='<label form="'+nombre+'">';
    let labelcloes='</label>';

    return labelopen+nombre+labelcloes;

}

function input(type,name,value,placeholder){

    let input='<input type="'+type+'" name="'+name+'" value="'+value+'"  placeholder="'+placeholder+'">';

    return input;

}

function generarNuevo(tabla,nombre){

    let formopen='<form action="/" method="POST" >';
    let formclose='</form>';

    let divopen='<div>';
    let divclose='</div>';

    let buttonsubmitopen='<button type="submit">';
    let buttonclose='</button>';

    let buttonresetopen='<button type="reset">';

    let contenido='';

    let h3open='<h3>';
    let h3close='</h3>';


    var aux='';

    aux+=h3open+'Registrar '+nombre+h3close;

    aux+=formopen;

tabla.forEach(element => {

    aux+=divopen+label(element)+input("text",element,"","")+divclose;  
    
});

aux+=divopen;

aux+=buttonsubmitopen+"Guardar"+buttonclose; 
aux+=buttonresetopen+"Cancelar"+buttonclose;

aux+=divclose+formclose;

contenido=aux;

  return contenido;
                             
}

function generarEditar(tabla,nombre){

    let formopen='<form action="/" method="POST" >';
    let formclose='</form>';

    let divopen='<div>';
    let divclose='</div>';

    let buttonsubmitopen='<button type="submit">';
    let buttonclose='</button>';

    let buttonresetopen='<button type="reset">';

    let contenido='';

    let h3open='<h3>';
    let h3close='</h3>';


    var aux='';

    aux+=h3open+'Editar '+nombre+h3close;

    aux+=formopen;

tabla.forEach(element => {

    aux+=divopen+label(element)+input("text",element,"","")+divclose;  
    
});

aux+=divopen;

aux+=buttonsubmitopen+"Guardar"+buttonclose; 
aux+=buttonresetopen+"Cancelar"+buttonclose;

aux+=divclose+formclose;

contenido=aux;

  return contenido;
                          
}
