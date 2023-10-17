class Atributo {
    constructor (nombre="attrib", tipo=null) {
      this._nombre = nombre;
      this._tipo=tipo;
      
    }

    // Getter
    get nombre() {
       return this._nombre;
    }

    set nombre(nom) {
        return this._nombre=nom;
    }

    get tipo() {
        return this._tipo;
    }

    set tipo(tipo) {
        return this._tipo=tipo;
    }

    

}




