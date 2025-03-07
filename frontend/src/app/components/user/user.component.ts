import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  isSignup = false;
  errorMessage = '';
  successMessage = '';

  signupData = { username: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if (!this.signupData.username || !this.signupData.email || !this.signupData.password) {
      this.errorMessage = 'Tous les champs sont obligatoires !';
      return;
    }

    this.authService.onSignup(this.signupData).subscribe({
      next: (res) => {
        console.log('Inscription réussie :', res);
        this.successMessage = 'Inscription réussie ! Vérifiez votre email pour l’activation.';
        this.errorMessage = '';
        this.signupData = { username: '', email: '', password: '' };
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Échec de l’inscription';
        this.successMessage = '';
      }
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Email et mot de passe sont requis !';
      return;
    }
  
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Connexion réussie :', res);
        // Connexion réussie
        if (res.token) {
          console.log('Connexion réussie :', res);
          this.authService.saveToken(res.token);  // Sauvegarder le token uniquement si la connexion est réussie
          this.errorMessage = '';  // Effacer le message d'erreur
          this.successMessage = 'Connexion réussie ! Redirection...';
  
          // Redirection vers le dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.log('Erreur de connexion :', err);
        // Si la connexion échoue, afficher un message d'erreur
        this.errorMessage = err.error.message || 'Échec de la connexion';
        this.successMessage = '';  // Réinitialiser le message de succès
      }
    });
  }
  
}
