import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData = { username: '', email: '', password: '', currentPassword: '', newPassword: '' };
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getProfile();
 
  }

  // Récupérer les informations du profil
  getProfile() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.userData.username = res.username;
        this.userData.email = res.email;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors du chargement du profil';
      }
    });
  }

  // Mise à jour du profil (nom d'utilisateur et email)
  onUpdateProfile() {
    this.userService.updateProfile(this.userData).subscribe({
      next: (res) => {
        this.successMessage = 'Profil mis à jour avec succès !';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Échec de la mise à jour du profil';
        this.successMessage = '';
      }
    });
  }

  // Mise à jour du mot de passe
  onUpdatePassword() {
    if (!this.userData.currentPassword || !this.userData.newPassword) {
      this.errorMessage = 'Tous les champs de mot de passe doivent être remplis';
      return;
    }

    const passwordData = {
      currentPassword: this.userData.currentPassword,
      newPassword: this.userData.newPassword
    };

    this.userService.updatePassword(passwordData).subscribe({
      next: (res) => {
        this.successMessage = 'Mot de passe mis à jour avec succès !';
        this.errorMessage = '';
        this.userData.currentPassword = '';
        this.userData.newPassword = ''; // Clear password fields after successful update
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Échec de la mise à jour du mot de passe';
        this.successMessage = '';
      }
    });
  }

  // Suppression du compte utilisateur
  onDeleteAccount() {
    if (confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Échec de la suppression du compte';
        }
      });
    }
  }
}
