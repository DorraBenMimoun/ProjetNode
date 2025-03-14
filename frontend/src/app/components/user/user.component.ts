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
  loginErrorMessage = '';
  loginSuccessMessage = '';
  signUpErrorMessage = '';
  signUpSuccessMessage = '';

  signupData = { username: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if (!this.signupData.username || !this.signupData.email || !this.signupData.password) {
      this.signUpErrorMessage = 'Tous les champs sont obligatoires !';
      return;
    }

    this.authService.onSignup(this.signupData).subscribe({
      next: (res) => {
        console.log('Inscription réussie :', res);
        this.signUpSuccessMessage = 'Inscription réussie ! Vérifiez votre email pour l’activation.';
        this.signUpErrorMessage = '';
        this.signupData = { username: '', email: '', password: '' };
      },
      error: (err) => {
        this.signUpErrorMessage = err.error.message || 'Échec de l’inscription';
        this.signUpSuccessMessage = '';
      }
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.loginErrorMessage = 'Email et mot de passe sont requis !';
      return;
    }
  
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Connexion réussie :', res);
        if (res.token) {
          console.log('Connexion réussie :', res);
          this.authService.saveToken(res.token, res.user.id);  
          this.loginErrorMessage = '';  
          this.loginSuccessMessage = 'Connexion réussie ! Redirection...';
  
          // Redirection vers le dashboard
          this.router.navigate(['/tasks']);
        }
      },
      error: (err) => {
        console.log('Erreur de connexion :', err);
        this.loginErrorMessage = err.error.message || 'Échec de la connexion';
        this.loginSuccessMessage = '';  
      }
    });
  }
  
}
