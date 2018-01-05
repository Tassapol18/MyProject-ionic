import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

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

//FirebaseModule
import { Facebook } from '@ionic-native/facebook';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';

//Providers
import { FirebaseProvider } from '../providers/firebase/firebase';
import { PostsProvider } from '../providers/posts/posts';
import { MapsProvider } from '../providers/maps/maps';
import { ChatsProvider } from '../providers/chats/chats';




const firebase = {
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
    ViewpostPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule,
    AngularFireDatabaseModule,
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
    ViewpostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    FirebaseProvider,
    PostsProvider,
    MapsProvider,
    ChatsProvider
  ]
})
export class AppModule { }
