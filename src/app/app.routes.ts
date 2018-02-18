import { Route, RouterModule } from '@angular/router';

import { ChannelsComponent } from './pages/channels/channels.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { ModuleWithProviders } from '@angular/core';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';

export const routes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'channels',
      },
      {
        path: 'video/:channel/:index/:video',
        component: VideoPlayerComponent
      },
      {
        path: 'channels',
        component: ChannelsComponent
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
