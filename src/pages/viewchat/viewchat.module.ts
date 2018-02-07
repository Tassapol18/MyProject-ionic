import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewchatPage } from './viewchat';

@NgModule({
  declarations: [
    ViewchatPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewchatPage),
  ],
})
export class ViewchatPageModule {}
