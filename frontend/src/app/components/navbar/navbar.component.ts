import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
 // Écouter les changements de l'état de la connexion
 this.authService.getIsLoggedIn().subscribe((loggedInStatus) => {
  this.isLoggedIn = loggedInStatus;  // Mettre à jour l'état de connexion
});
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }


}
