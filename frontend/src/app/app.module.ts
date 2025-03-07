import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UserComponent } from './components/user/user.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ProjetComponent } from './projet/projet.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectService } from './services/project.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TasksComponent,
    UserComponent,
    ProjetComponent,
    NavbarComponent,
    LandingComponent,
    ProjectsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule, 


  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
    ,ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
