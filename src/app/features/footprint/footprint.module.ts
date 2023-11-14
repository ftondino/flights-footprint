import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FootprintRoutingModule } from './footprint-routing.module';
import { FootprintComponent } from './footprint.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { ResultsBoxComponent } from './components/results-box/results-box.component';
import { MapComponent } from './components/map/map.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    FootprintComponent,
    SearchBoxComponent,
    ResultsBoxComponent,
    MapComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FootprintRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class FootprintModule {}
