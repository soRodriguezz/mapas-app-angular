import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  centerMap: [number, number] = [-72.545794, -36.278996];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMap,
      zoom: this.zoomLevel,
    });

    this.leerLocalStogare();
    
  }

  ngOnDestroy(): void {
    // para destruir listeners
    this.mapa.off('dragend', () => {});
  }

  irMarker(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat(),
      zoom: this.zoomLevel,
    });
  }

  agregarMarker() {
    // genera un codigo hexadecimal aleatorio
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const nuevoMarker = new mapboxgl.Marker({
      draggable: true,
      color, // color: color
    })
      .setLngLat(this.centerMap)
      .addTo(this.mapa);

    this.marcadores.push({
      color,
      marker: nuevoMarker,
    });

    nuevoMarker.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });

    this.guardarMarcadoresLocalStorage();
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach((marcador) => {
      const color = marcador.color;
      const { lng, lat } = marcador.marker!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerLocalStogare() {
    if( !localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')! );

    lngLatArr.forEach((marcador) => {
      const nuevoMarker = new mapboxgl.Marker({
        draggable: true,
        color: marcador.color,
      })
        .setLngLat(marcador.centro!)
        .addTo(this.mapa);

      this.marcadores.push({
        color: marcador.color,
        marker: nuevoMarker,
      });

      nuevoMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

    });

  }

  borrarMarcador (i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
