class Relacion {
    constructor (tipo=null,rol=null, origen=null,destino=null, multiplicidadA=null,multiplicidadB=null) {
      this._tipo = tipo;
      this._rol=rol;

      this._origen=origen;
      this._destino=destino;
      this._multiplicidadA=multiplicidadA;
      this._multiplicidadB=multiplicidadB;
      
    }

    // Getter
    get tipo() {
       return this._tipo;
    }

    set tipo(valor) {
        return this._tipo=valor;
    }

    get rol() {
      return this._rol;
    }

    set rol(valor) {
       return this._rol=valor;
    }

    get origen() {
      return this._origen;
    }

    set origen(valor) {
        return this._origen=valor;
    }

    get destino() {
      return this._destino;
    }

    set destino(valor) {
        return this._destino=valor;
    }

    get multiplicidadA() {
      return this._multiplicidadA;
    }

    set multiplicidadA(valor) {
        return this._multiplicidadA=valor;
    }

    get multiplicidadB() {
      return this._multiplicidadB;
    }

    set multiplicidadB(valor) {
        return this._multiplicidadB=valor;
    }
    

}



function cargarRelacion2(relacion,xml,clases){
  

  cargarRelacion1(relacion,xml,clases);

  let child=xml.childNodes;

  
  let src=child[6]["attributes"]["value"]["nodeValue"];//multiplicidadA
  let dest=child[7]["attributes"]["value"]["nodeValue"];//multiplicidadB

  relacion.multiplicidadA=src;
  relacion.multiplicidadB=dest;

  
}

function cargarRelacion1(relacion,xml,clases){//clases.filter((tabla) => tabla.alias===src);
  
  let atributos=xml["attributes"]
  let child=xml.childNodes;

  let rol=child[3]["attributes"]["value"]["nodeValue"];//rol

  //let nombre=(atributos["id"]["nodeValue"]).split(":");//nombre
  let src=(atributos["side_A"]["nodeValue"]).split(":");//origen
  let dest=(atributos["side_B"]["nodeValue"]).split(":");//destino
 
  let aux=clases.filter((tabla) => tabla.alias===src[1]);
  let aux2=clases.filter((tabla) => tabla.alias===dest[1]);
  

  relacion.rol=rol;
  relacion.origen=aux[0].nombre;
  relacion.destino=aux2[0].nombre;


}

