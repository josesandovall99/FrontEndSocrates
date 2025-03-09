import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface StatCard {
  icon: string;
  count: number;
  label: string;
  route: string; 
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>ADMINISTRADOR</h1>
      <p>Bienvenido a la sección principal</p>
      
      <div class="stats-grid">
        <div *ngFor="let stat of stats" class="stat-card" (click)="navigate(stat)">
          <i class="fas {{ stat.icon }}"></i>
          <div class="stat-info">
            <h3>{{ stat.count }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer; /* Hacer toda la tarjeta clicable */
      transition: background-color 0.3s ease; /* Agregar transición */
    }
    .stat-card:hover {
      background-color: #f0f0f0; /* Efecto al hacer hover sobre la tarjeta */
    }
    .stat-card i {
      font-size: 2rem;
      color: #1a237e;
    }
    .stat-info h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1a237e;
    }
    .stat-info p {
      margin: 0.5rem 0 0;
      color: #666;
    }
  `]
})
export class EmpleadoDashboard {
  stats: StatCard[] = [
    { icon: 'fa-user-graduate', count: 298, label: 'Gestionar Secretaria', route: '/empleado-secretaria' },
    { icon: 'fa-book', count: 56, label: 'Gestionar Tecnico', route: '/empleado-tecnico' },

  ];
  
  

  constructor(private router: Router) {}

  // Método de navegación, redirige según la ruta asociada a cada tarjeta
  navigate(stat: StatCard) {
    this.router.navigate([stat.route]);
  }
}
