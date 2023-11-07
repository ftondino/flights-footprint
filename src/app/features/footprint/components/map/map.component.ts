import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { LineString, Point } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import * as olProj from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { boundingExtent } from 'ol/extent';

import * as arc from 'arc';

import { FootprintService } from '../../services/footprint.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private footprintService: FootprintService) {}

  ngOnInit() {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([12.8333, 42.8333]),
        zoom: 2,
      }),
      controls: [],
    });

    this.footprintService.currentTravel.subscribe((data) => {
      if (data) {
        let arcGenerator = new arc.GreatCircle(
          { x: data.partenzaData.lon, y: data.partenzaData.lat },
          { x: data.destinazioneData.lon, y: data.destinazioneData.lat }
        );

        let lineString = new LineString([]);
        let n = 100;

        let arcLine = arcGenerator.Arc(n);
        if (arcLine.geometries.length === 1) {
          let lineCoords = arcLine.geometries[0].coords;
          for (let i = 0; i < lineCoords.length; i++) {
            lineString.appendCoordinate(olProj.fromLonLat(lineCoords[i]));
          }
        }

        let lineFeature = new Feature({
          geometry: lineString,
          finished: false,
        });

        let lineLayer = new VectorLayer({
          source: new VectorSource({
            features: [lineFeature],
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#010C80',
              width: 3,
              lineDash: [10, 10],
            }),
          }),
        });

        map.addLayer(lineLayer);
        let extent = boundingExtent([
          olProj.fromLonLat([data.partenzaData.lon, data.partenzaData.lat]),
          olProj.fromLonLat([
            data.destinazioneData.lon,
            data.destinazioneData.lat,
          ]),
        ]);
        map
          .getView()
          .fit(extent, { padding: [50, 50, 50, 50], duration: 2000 });
        let points: Coordinate[] = [];
        let line = new LineString(points);

        setTimeout(() => {
          let t = 0;
          let interval = setInterval(() => {
            if (t > 1) {
              clearInterval(interval);
            } else {
              let lat =
                data.partenzaData.lat * (1 - t) +
                data.destinazioneData.lat * t +
                Math.sin(Math.PI * t) * 0.1;
              let lon =
                data.partenzaData.lon * (1 - t) + data.destinazioneData.lon * t;
              let coord: Coordinate = olProj.fromLonLat([lon, lat]) as [
                number,
                number
              ];
              points.push(coord);
              line.setCoordinates(points);
              t += 0.02;
            }
          }, 50);
        }, 2000);

        let startMarker = new Feature({
          geometry: new Point(
            olProj.fromLonLat([data.partenzaData.lon, data.partenzaData.lat])
          ),
        });

        let endMarker = new Feature({
          geometry: new Point(
            olProj.fromLonLat([
              data.destinazioneData.lon,
              data.destinazioneData.lat,
            ])
          ),
        });

        let markerLayer = new VectorLayer({
          source: new VectorSource({
            features: [startMarker, endMarker],
          }),
        });

        map.addLayer(markerLayer);
      }
    });
  }
}
