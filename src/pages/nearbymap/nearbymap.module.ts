import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearbymapPage } from './nearbymap';

@NgModule({
  declarations: [
    NearbymapPage,
  ],
  imports: [
    IonicPageModule.forChild(NearbymapPage),
  ],
})
export class NearbymapPageModule {}
