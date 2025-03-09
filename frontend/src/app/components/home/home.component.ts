import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService,private router: Router) {}
  ngOnInit() {
    // Écouter les changements de l'état de la connexion
    this.authService.getIsLoggedIn().subscribe((loggedInStatus) => {
     this.isLoggedIn = loggedInStatus;  // Mettre à jour l'état de connexion
   });
     }
   
}
