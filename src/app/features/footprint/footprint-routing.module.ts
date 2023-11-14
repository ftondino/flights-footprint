import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FootprintComponent } from './footprint.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: FootprintComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule],
})
export class FootprintRoutingModule {}
