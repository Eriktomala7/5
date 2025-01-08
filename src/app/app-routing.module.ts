import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dignidades',
    loadChildren: () => import('./paginas/dignidades/dignidades.module').then( m => m.DignidadesPageModule)
  },
  {
    path: 'juntas',
    loadChildren: () => import('./paginas/juntas/juntas.module').then( m => m.JuntasPageModule)
  },
  {
    path: 'votos',
    loadChildren: () => import('./paginas/votos/votos.module').then( m => m.VotosPageModule)
  },
  {
    path: 'candidato',
    loadChildren: () => import('./paginas/candidato/candidato.module').then( m => m.CandidatoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
