import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;  // Variable para controlar el estado de carga

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private loginService: LoginService,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      usr_correo: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;  // Activar el spinner
      const objlogin = this.loginForm.value;

      this.loginService.login(objlogin).subscribe(
        async (response) => {
          this.isLoading = false;  // Desactivar el spinner
          
          if (response.cant === 1) {
            this.errorMessage = ''; // Limpiar cualquier mensaje de error anterior
            this.navCtrl.navigateForward('/principal');
            const ObjJSON = response.data;
            console.log(ObjJSON.usr_usuario);
            this.loginService.setUsrId(ObjJSON.usr_usuario);
            const toast = await this.toastCtrl.create({
              message: "Ingreso Exitoso",
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
          } else {
            this.errorMessage = response.mensaje || 'Credenciales incorrectas';
            const toast = await this.toastCtrl.create({
              message: this.errorMessage,
              duration: 2000,
              position: 'bottom',
              color: 'danger'
            });
            await toast.present();
          }
        },
        async (error) => {
          this.isLoading = false;  // Desactivar el spinner
          this.errorMessage = 'Ha ocurrido un error. Por favor, inténtelo de nuevo.';
          const toast = await this.toastCtrl.create({
            message: this.errorMessage,
            duration: 2000,
            position: 'bottom',
            color: 'danger'
          });
          await toast.present();
        }
      );
    }
  }
}
