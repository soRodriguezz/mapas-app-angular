import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';

// toma todo lo que esta en la libreria y se le asigna un nombre
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa {
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    var map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-72.545794, -36.278996],
      zoom: 16
    });
  }



}


 
