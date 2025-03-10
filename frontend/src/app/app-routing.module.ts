import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { ProjetComponent } from './projet/projet.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Dashboard2Component } from './components/dashboard2/dashboard2.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path:'tasks', component: TasksPageComponent},
  { path: 'project', component: ProjetComponent},
  { path: 'login', component: UserComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'dashboard2', component: Dashboard2Component},
  { path: 'dashboard/project', component: ProjetComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
