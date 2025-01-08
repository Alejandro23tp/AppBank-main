import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }
  async logout() {
    // Confirmación antes de cerrar sesión
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salir',
          handler: () => {
            // Limpiar datos almacenados (opcional)
            localStorage.clear();
            sessionStorage.clear();

            // Redirigir a la página de inicio de sesión
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }
}
