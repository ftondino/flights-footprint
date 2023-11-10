import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { LineString, Point } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import Feature, { FeatureLike } from 'ol/Feature';
import * as olProj from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import { Text as TextStyle } from 'ol/style';

import { FootprintService } from '../../services/footprint.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: Map | undefined;

  constructor(private footprintService: FootprintService) {}

  ngOnInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([12.8333, 42.8333]),
        zoom: 1,
      }),
      controls: [],
    });

    this.footprintService.currentTravel.subscribe((data) => {
      console.log(data);
      if (data) {
        let start = olProj.fromLonLat([
          data.partenzaData.lon,
          data.partenzaData.lat,
        ]);
        let end = olProj.fromLonLat([
          data.destinazioneData.lon,
          data.destinazioneData.lat,
        ]);

        let points = [start];
        let numPoints = 100;

        for (let i = 1; i <= numPoints; i++) {
          let t = i / numPoints;
          let interpolatedLon = start[0] + t * (end[0] - start[0]);
          let interpolatedLat = start[1] + t * (end[1] - start[1]);
          points.push([interpolatedLon, interpolatedLat]);
        }

        points.push(end);

        let animLineString = new LineString([start]);

        let lineFeature = new Feature({
          geometry: animLineString,
          finished: false,
        });

        let lineLayer = new VectorLayer({
          source: new VectorSource({
            features: [lineFeature],
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#010C80',
              width: 1.5,
              lineDash: [2, 5],
            }),
          }),
        });

        this.map?.addLayer(lineLayer);

        let extent = boundingExtent([start, end]);
        this.map
          ?.getView()
          .fit(extent, { padding: [50, 50, 50, 50], duration: 2000 });

        setTimeout(() => {
          let t = 0;
          let interval = setInterval(() => {
            if (t > points.length - 1) {
              clearInterval(interval);
            } else {
              animLineString.appendCoordinate(points[t]);
              let source = lineLayer.getSource();
              if (source) {
                source.clear();
                source.addFeature(new Feature(animLineString));
              }
              t += 1;
            }
          }, 50);
        }, 2000);

        let startMarker = new Feature({
          geometry: new Point(start),
        });

        let endMarker = new Feature({
          geometry: new Point(end),
        });

        let markerStyle = function (feature: FeatureLike): Style {
          return new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({ color: '#010C80' }),
            }),
            text: new TextStyle({
              text: feature.get('name'),
              offsetY: -20,
              fill: new Fill({
                color: '#010C80',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
              font: '13px Calibri,sans-serif',
            }),
          });
        };

        startMarker.set(
          'name',
          `${data.partenzaData.city},${data.partenzaData.country}`
        );
        startMarker.setStyle(markerStyle(startMarker));

        endMarker.set(
          'name',
          `${data.destinazioneData.city},${data.destinazioneData.country}`
        );
        endMarker.setStyle(markerStyle(endMarker));

        let markerLayer = new VectorLayer({
          source: new VectorSource({
            features: [startMarker, endMarker],
          }),
        });

        this.map?.addLayer(markerLayer);
      }
    });

    this.footprintService.resetMap.subscribe(() => {
      this.reset();
    });
  }

  reset() {
    this.map
      ?.getLayers()
      .getArray()
      .slice()
      .forEach((layer) => this.map?.removeLayer(layer));

    this.map?.addLayer(
      new TileLayer({
        source: new OSM(),
      })
    );

    this.map?.getView().setCenter(olProj.fromLonLat([12.8333, 42.8333]));
    this.map?.getView().setZoom(1);
  }
}
