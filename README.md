# MyProject-ionic

To run this app:
Clone this repo
    #Run npm install
    #Run ionic cordova platform add android or ionic cordova platform add ios
    #Run ionic cordova run android or ionic cordova run ios

error
npm unlink typescript
npm install typescript@2.3.4 

authen
https://gist.github.com/codediodeio/5e02b605f2ab015f2fb1e60497bd46bf#gistcomment-2125844



Error com.google.android.gms
1. ionic cordova platform remove android
2. ionic cordova platform add android
3. ไปที่ไฟล์ platforms -> project.properties
4. แก้ไขในส่วนนี้ (com.google.android.gms) ให้เป็น Version 11.+ 
    cordova.system.library.2=com.google.android.gms:play-services-auth:11.+
    cordova.system.library.3=com.google.android.gms:play-services-identity:11.+
    cordova.system.library.4=com.google.android.gms:play-services-location:11.+