import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { GoogleMaps } from '@ionic-native/google-maps';
import { GooglePlus } from '@ionic-native/google-plus';

//Page
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ChatPage } from '../pages/chat/chat';
import { MapPage } from '../pages/map/map';
import { ProfilePage } from '../pages/profile/profile';
import { PostPage } from '../pages/post/post';
import { NewMapPage } from '../pages/new-map/new-map';
import { ViewpostPage } from '../pages/viewpost/viewpost';
import { SearchPage } from '../pages/search/search';
import { ViewmapPage } from '../pages/viewmap/viewmap';
import { EditpostPage } from '../pages/editpost/editpost';
import { NearbymapPage } from '../pages/nearbymap/nearbymap';
import { EditmapPage } from '../pages/editmap/editmap';
import { ViewchatPage } from '../pages/viewchat/viewchat';
import { MapownPage } from '../pages/mapown/mapown';
import { ViewMapDirectionsPage } from '../pages/view-map-directions/view-map-directions';


//FirebaseModule
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireStorageModule } from 'angularfire2/storage';

//Providers
import { FirebaseProvider } from '../providers/firebase/firebase';
import { SearchmapPage } from '../pages/searchmap/searchmap';


export const firebase = {
  apiKey: "AIzaSyD-6a8U6dQ2zwOaRNIw-rEjWPSiBTcFgcc",
  authDomain: "countrytrip-31ea9.firebaseapp.com",
  databaseURL: "https://countrytrip-31ea9.firebaseio.com",
  projectId: "countrytrip-31ea9",
  storageBucket: "countrytrip-31ea9.appspot.com",
  messagingSenderId: "499658526274"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    WelcomePage,
    ChatPage,
    MapPage,
    ProfilePage,
    PostPage,
    NewMapPage,
    SearchPage,
    ViewpostPage,
    ViewmapPage,
    EditpostPage,
    NearbymapPage,
    EditmapPage,
    ViewchatPage,
    MapownPage,
    ViewMapDirectionsPage,
    SearchmapPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    WelcomePage,
    ChatPage,
    MapPage,
    ProfilePage,
    PostPage,
    NewMapPage,
    SearchPage,
    ViewpostPage,
    ViewmapPage,
    EditpostPage,
    NearbymapPage,
    EditmapPage,
    ViewchatPage,
    MapownPage,
    ViewMapDirectionsPage,
    SearchmapPage
  ],
  providers: [
    StatusBar,
    Camera,
    SplashScreen,
    FirebaseProvider,
    Geolocation,
    Facebook,
    GoogleMaps,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
