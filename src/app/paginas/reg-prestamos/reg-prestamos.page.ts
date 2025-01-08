import { formatDate } from '@angular/common';
import { SemanasService } from './../../servicios/semanas.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { SaldoanteriorService } from 'src/app/servicios/saldoanterior.service';

@Component({
  selector: 'app-reg-prestamos',
  templateUrl: './reg-prestamos.page.html',
  styleUrls: ['./reg-prestamos.page.scss'],
})
export class RegPrestamosPage implements OnInit {
  defaultInterest = 5; // Porcentaje de interés seleccionado (5% o 10%)

  prestamoData = {
    part_id: '',
    semana: null,
    prestamo: '',
    interes: '',
    prestamofecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
  };

  semanas = []; // Lista de semanas

  constructor(
    private prestamoService: PrestamoService,
    private router: Router,
    private servG: GeneralService,
    private route: ActivatedRoute,
    private sa: SaldoanteriorService,
    private SemanasService: SemanasService
  ) {}

  ngOnInit() {
    // Obtener part_id desde los parámetros
    this.route.queryParams.subscribe((params) => {
      this.prestamoData.part_id = params['part_id'] || '';
    });

    this.listarSemanas(this.prestamoData.part_id);
  }

  calcularInteres() {
    const prestamo = parseFloat(this.prestamoData.prestamo);
    const interes = this.defaultInterest / 100; // Convertir porcentaje a decimal

    if (!isNaN(prestamo) && !isNaN(interes)) {
      const interesCalculado = prestamo * interes;
      this.prestamoData.interes = interesCalculado.toFixed(2); // Actualizar el valor calculado
    }
  }

  async onSubmit() {
    const data = {
      part_id: this.prestamoData.part_id,
      semana: this.prestamoData.semana,
      prestamo: this.prestamoData.prestamo,
      interes: parseFloat(this.prestamoData.interes),
      estado: 'Pendiente',
      fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    console.log('Datos a registrar:', data);

    this.prestamoService.registrarPagoPrestamo(data).subscribe(
      async () => {
        this.servG.fun_Mensaje('Préstamo registrado con éxito.');
        this.limpiarCampos();
        this.router.navigate(['/participantes']);
      },
      async () => {
        this.servG.fun_Mensaje('Error al registrar préstamo.');
      }
    );
  }

  listarSemanas(part_id: string) {
    this.SemanasService.getSemanas_Participante(part_id).subscribe((Response) => {
      Response.data.forEach((item: any) => {
        this.semanas.push(item.nombre_semana);
      });
    });
  }

  limpiarCampos() {
    this.prestamoData.prestamo = '';
    this.prestamoData.interes = '';
    this.prestamoData.semana = null;
  }
}
