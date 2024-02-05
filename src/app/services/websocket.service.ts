import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus: boolean;

  constructor(private socket:Socket) { 
    this.socketStatus = false;
    this.checkStatus();
    //Cargamos el usuario del localStorage cada vez que instanciamos por primera vez, es decir, cuando refresquemos o inciemos la app.
    //Si iniciamos la app, el localStorage estará vacio. Si ya hemos introducido el usuario, si refrescamos estara el usuario correspondiene. 
    //Esto se hace en la funcion de abajo. La funcion cargarStorage, esta tambien dentro de checkStatus, pero la ponemos tambien en el constructor
    //porque necesitamos que cuando se recarge la pagina mensajes, se ejecute rapidamente esta funcion para asignar un valor a usuarios, 
    //ya que sino redirige otra vez al login.
  }

  checkStatus(){
    //Cuando se realiza un reseteo de angular se realiza la conexion con el servidor y luego se ejecutaria el constructor, y por tanto, esta
    //funcion. Al ejecutarse el .on (escucha) y ya estar conectado, se ejecutara inmediatamente la callback.
    this.socket.on('connect', ()=>{
      console.log('Conectado al servidor');
      this.socketStatus = true;
    })

    this.socket.on('disconnect', ()=>{
      console.log('Desconectado del servidor');
      this.socketStatus = false;
      
    })
  }

  //payload es el mensaje que se envia. Tanto el mensaje como el callback son opcionales.
  emitir(evento: string, payload?:any, callback?:Function){
    this.socket.emit(evento, payload, callback);
  }

  listen(evento: string){
    //fromEvent es para escuchar un evento. Devuelve un observable.
    return this.socket.fromEvent(evento);
  }
}
