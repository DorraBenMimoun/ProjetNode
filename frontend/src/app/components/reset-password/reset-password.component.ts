import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.toastr.success('Mot de passe réinitialisé avec succès.', 'Succès');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error('Erreur lors de la réinitialisation.', 'Erreur');
      }
    });
  }
}
