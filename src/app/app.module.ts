import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ChannelsComponent } from './pages/channels/channels.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { MediaService } from './services/media.service';
import { NgModule } from '@angular/core';
import { PreferencesService } from './services/preferences.service';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';
import { routing } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    ChannelsComponent,
    MainLayoutComponent,
    VideoPlayerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    routing
  ],
  providers: [
    MediaService,
    PreferencesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
