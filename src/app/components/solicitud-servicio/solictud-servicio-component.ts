import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioService } from 'src/app/services/servicio.service';
import { Servicio } from 'src/app/models/servicio.model';
import { TipoPlan } from 'src/app/models/TipoPlan';
import { Tecnico } from 'src/app/models/tecnico.model';
import { Cliente } from 'src/app/models/cliente.model'; // Comentado porque aún no existe

@Component({
  selector: 'app-servicio-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="servicio-management">
      <div class="header">
        <h1>Gestionar Servicios</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Servicio
        </button>
      </div>

      <div *ngIf="showForm" class="servicio-form">
        <h2>{{ editingServicio ? "Editar" : "Agregar" }} Servicio</h2>

        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="form-group">
            <label for="fechaServicio">Fecha del Servicio:</label>
            <input id="fechaServicio" formControlName="fechaServicio" required type="date" />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <input id="descripcion" formControlName="descripcion" required />
          </div>

          <div class="form-group">
            <label for="horaServicio">Hora del Servicio:</label>
            <input id="horaServicio" formControlName="horaServicio" required type="time" />
          </div>

          <div class="form-group">
            <label for="estado">Estado:</label>
            <input id="estado" formControlName="estado" required />
          </div>

          <div class="form-group">
            <label for="tipoPlan">Tipo de Plan:</label>
            <select id="tipoPlan" formControlName="tipoPlan" required>
              <option *ngFor="let plan of tipoPlanes" [value]="plan.id">{{ plan.nombre }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tecnico">Técnico:</label>
            <select id="tecnico" formControlName="tecnico" required>
              <option *ngFor="let tecnico of tecnicos" [value]="tecnico.id">{{ tecnico.nombre +" - " +tecnico.numeroDocumento}}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <select id="cliente" formControlName="cliente">
              <option *ngFor="let cliente of clientes" [value]="cliente.id">{{ cliente.nombre +" - "+cliente.numeroDocumento}}</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="servicio-table">
        <table>
          <thead>
            <tr>
              <th>Fecha del Servicio</th>
              <th>Descripción</th>
              <th>Hora del Servicio</th>
              <th>Estado</th>
              <th>Tipo de Plan</th>
              <th>Técnico</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let servicio of servicios">
              <td>{{ servicio.fechaServicio | date }}</td>
              <td>{{ servicio.descripcion }}</td>
              <td>{{ servicio.horaServicio }}</td>
              <td>{{ servicio.estado }}</td>
              <td>{{ servicio.tipoPlan.nombre }}</td>
              <td>{{ servicio.tecnico.nombre }}</td>
              <td>{{ servicio.cliente?.nombre }}</td>
              <td class="actions">
                <button (click)="editServicio(servicio)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteServicio(servicio.id)" class="btn-delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .servicio-management {
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .btn-add {
      background: #1a237e;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .servicio-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .btn-save {
      background: #1a237e;
      color: white;
    }
    .btn-cancel {
      background: #666;
      color: white;
    }
    .btn-save,
    .btn-cancel {
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .servicio-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f5f5f5;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-edit {
      color: #1a237e;
    }
    .btn-delete {
      color: #dc3545;
    }
  `]
})
export class ServicioComponent implements OnInit {
  servicios: Servicio[] = [];
  tipoPlanes: TipoPlan[] = [];
  tecnicos: Tecnico[] = [];
  clientes: Cliente[] = []; // Comentado porque aún no existe
  showForm = false;
  editingServicio: Servicio | null = null;
  form: FormGroup;

  private servicioService = inject(ServicioService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      fechaServicio: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
      horaServicio: ["", [Validators.required]],
      estado: ["", [Validators.required]],
      tipoPlan: [null, [Validators.required]],
      tecnico: [null, [Validators.required]],
      cliente: [null]
    });
  }

  ngOnInit(): void {
    this.loadServicios();
    this.loadTipoPlanes();
    this.loadTecnicos();
    this.loadClientes(); // Comentado porque aún no existe
  }

  loadServicios() {
    this.servicioService.list().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (err) => console.error("Error al cargar servicios:", err)
    });
  }

  loadTipoPlanes() {
    this.servicioService.listTipoPlanes().subscribe({
      next: (tipoPlanes) => {
        this.tipoPlanes = tipoPlanes;
        console.log("Tipos de planes cargados:", this.tipoPlanes); // Debug para verificar
      },
      error: (err) => console.error("Error al cargar tipos de plan:", err)
    });
  }
  

  loadTecnicos() {
    this.servicioService.listTecnicos().subscribe({
      next: (tecnicos) => (this.tecnicos = tecnicos),
      error: (err) => console.error("Error al cargar técnicos:", err)
    });
  }

  loadClientes() {
    this.servicioService.listClientes().subscribe({
      next: (clientes) => (this.clientes = clientes),
      error: (err) => console.error("Error al cargar clientes:", err)
    });
  }
  showAddForm() {
    this.showForm = true;
    this.editingServicio = null;
    this.form.reset();
  }
  
  create() {
    if (this.form.valid) {
      // Extraer IDs correctamente para ser enviados al backend
      const servicioData = {
        ...this.form.value,
        tipoPlan: this.form.value.tipoPlan, // Enviamos solo el ID
        tecnico: this.form.value.tecnico,   // Enviamos solo el ID
        cliente: this.form.value.cliente    // Enviamos solo el ID
      };
  
      if (this.editingServicio) {
        this.servicioService.update(this.editingServicio.id, servicioData).subscribe({
          next: () => {
            alert("Servicio actualizado con éxito");
            this.loadServicios();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el servicio");
          },
        });
      } else {
        this.servicioService.create(servicioData).subscribe({
          next: () => {
            alert("Servicio creado con éxito");
            this.loadServicios();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el servicio");
          },
        });
      }
    }
  }
  
  editServicio(servicio: Servicio) {
    this.showForm = true;
    this.editingServicio = servicio;
  
    // Asignar los valores con el ID correcto
    this.form.patchValue({
      fechaServicio: servicio.fechaServicio,
      descripcion: servicio.descripcion,
      horaServicio: servicio.horaServicio,
      estado: servicio.estado,
      tipoPlan: servicio.tipoPlan?.id,  // Asegurar que se asigna el ID del tipo de plan
      tecnico: servicio.tecnico.id,
      cliente: servicio.cliente?.id
    });
  }
  
  
  deleteServicio(id: number) {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      this.servicioService.delete(id).subscribe({
        next: () => {
          alert("Servicio eliminado con éxito");
          this.loadServicios();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el servicio");
        },
      });
    }
  }
  
  cancelForm() {
    this.showForm = false;
    this.editingServicio = null;
    this.form.reset();
  }
}