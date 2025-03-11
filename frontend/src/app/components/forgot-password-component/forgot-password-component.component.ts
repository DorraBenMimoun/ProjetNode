import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service'; // Adapter chemin
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password-component.component.html',
})
export class ForgotPasswordComponent {
  
  email: string = '';

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.toastr.success('Un email de réinitialisation a été envoyé.', 'Succès');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error('Email introuvable.', 'Erreur');
      }
    });
  }
}
