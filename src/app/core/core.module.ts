import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [NavComponent, FooterComponent],
  imports: [CommonModule, HttpClientModule, RouterModule],
  exports: [NavComponent],
})
export class CoreModule {}
