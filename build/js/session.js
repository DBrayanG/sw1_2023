
class Session {
    constructor (usuario, password, rol) {
      this._usuario = usuario;
      this._password = password;
      this._rol = rol;
      this._registro=-1;
    }

    // Getter
    get usuario() {
       return this._usuario;
    }

    set usuario(user) {
        return this._usuario=user;
    }

    get password() {
        return this._password;
    }

    set password(pass) {
        return this._password=pass;
    }

    get rol() {
        return this._rol;
    }

    set rol(rol) {
        return this._rol=rol;
    }

    get registro() {
        return this._registro;
    }

    set registro(reg) {
        return this._registro=reg;
    }

    // Método
    validarSession() {

        if(this._usuario!=null && this._password!=null)
            return true;
        else
            return false;

    }

    isAnfitrion() {
        

        if(this._rol==="anfitrion")
        return true;
            else
        return false;

    }

    cargar(){

        if(this.validarSession()){

            if(this.isAnfitrion()){
                
              this._registro=0;
      
            }
           
            
        }  

    }

    

}


function addUsuario(sala,session){
     
    sala.push(session.registro);
    
}

function addUsuario2(sala,reg){
     
    sala.push(reg);
    
}





