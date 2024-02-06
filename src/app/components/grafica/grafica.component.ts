import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { WebsocketService } from '../../services/websocket.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent implements OnInit{

  public lineChartData: ChartConfiguration['data']; 

  public opciones: string[];
  public opcionSeleccionada: string;
  public valor: number | null;
  public gastos: any;
  public descripcionInput: string;
  public mesSeleccionado: string;
  public gastosAMostrar:any;

  constructor(private http: HttpClient, public wsService: WebsocketService){
    this.lineChartData = {
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          label: 'Gastos',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        }
      ],
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

    this.opciones = ['Seleccione un mes', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; 

    this.opcionSeleccionada = 'Seleccione un mes'; 

    this.valor = null;

    this.descripcionInput = '';

    this.mesSeleccionado = 'Seleccione un mes';

  }

  ngOnInit(){

    this.getData();
    this.getGastos();
    this.escucharGrafica();
    this.escucharGasto();
  }

  getData(){
    this.http.get('http://localhost:5000/grafica').subscribe((data:any)=>this.lineChartData = data);
  }

  getGastos(){
    this.http.get('http://localhost:5000/gastos').subscribe((data:any)=>{
      console.log(data);
      this.gastos = data;
      this.gastosAMostrar = data;
      console.log(data);
    });
  }

  // actualizarDatos(mes:string, valor:number){
  //   var body = {mes, valor}
  //   this.http.post('http://localhost:5000/grafica', body).subscribe((data:any)=>this.lineChartData = data);
  // }

  escucharGrafica(){
    this.wsService.listen('actualizacion-grafica').subscribe((data:any)=>this.lineChartData = data);
  }

  escucharGasto(){
    this.wsService.listen('actualizacion-gastos').subscribe((data:any)=>{

      this.gastos = data;

      if(this.mesSeleccionado == 'Seleccione un mes'){
        this.gastosAMostrar = data;
      }else{
        this.gastosAMostrar = data.filter((gastoFiltrado:any) => gastoFiltrado.mes == this.mesSeleccionado);
      }

      console.log(data);
    })
  }

  enviarGasto(form:any){
    var body = {mes:this.opcionSeleccionada, valor: this.valor, descripcion: this.descripcionInput};
    this.http.post('http://localhost:5000/gasto', body).subscribe((data:any)=>{
      console.log(data)
     
      form.reset();
      this.opcionSeleccionada = 'Seleccione un mes';
      
      console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      
    })
  }

  eliminarGasto(gasto:any){
    console.log('funcionEliminar', )
    this.http.delete('http://localhost:5000/gasto/' + gasto.mes + '/' + gasto.gasto + '/' + gasto.descripcion).subscribe((res:any)=>{
      console.log('Gasto borrado', res);   
    })
  }

  seleccionarMes(event:any){
    this.mesSeleccionado = event.target.value;

    if(this.mesSeleccionado == 'Seleccione un mes'){
      this.gastosAMostrar = this.gastos;
    }else{
      this.gastosAMostrar = this.gastos.filter((gastoFiltrado:any) => gastoFiltrado.mes == this.mesSeleccionado);
    }
  }


}
