import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { LineString, Point } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';
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

        let animLineString = new LineString([]);
        let points: Coordinate[] = [];
        let n = 100;

        let arcLine = arcGenerator.Arc(n);
        let lineCoords: string | any[] = [];
        if (arcLine.geometries.length === 1 && arcLine.geometries[0].coords) {
          lineCoords = arcLine.geometries[0].coords;
        }

        let arcFeature = new Feature({
          geometry: animLineString,
          finished: false,
        });

        let arcLayer = new VectorLayer({
          source: new VectorSource({
            features: [arcFeature],
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#010C80',
              width: 1.5,
              lineDash: [2, 5],
            }),
          }),
        });

        map.addLayer(arcLayer);

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

        setTimeout(() => {
          let t = 0;
          let interval = setInterval(() => {
            if (t > 1) {
              clearInterval(interval);
            } else {
              let index = Math.floor(t * lineCoords.length);
              let coord: Coordinate = olProj.fromLonLat(lineCoords[index]) as [
                number,
                number
              ];
              points.push(coord);
              animLineString.setCoordinates(points);
              let source = arcLayer.getSource();
              if (source) {
                source.clear();
                source.addFeature(new Feature(animLineString));
              }
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

        let markerStyle = new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: '#010C80' }),
          }),
        });

        startMarker.setStyle(markerStyle);
        endMarker.setStyle(markerStyle);

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
