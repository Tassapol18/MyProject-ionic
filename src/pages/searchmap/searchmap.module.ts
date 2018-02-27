import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchmapPage } from './searchmap';

@NgModule({
  declarations: [
    SearchmapPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchmapPage),
  ],
})
export class SearchmapPageModule {}
