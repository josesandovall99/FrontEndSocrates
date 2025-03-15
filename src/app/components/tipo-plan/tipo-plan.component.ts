import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoPlanService } from 'src/app/services/TipoPlanService';
import { TipoPlan } from 'src/app/models/TipoPlan';


/// Este componente es similar al anterior, pero con un formulario para gestionar tipos de plan
/// y una tabla para mostrar los tipos de plan existentes.
/// También se puede agregar, editar y eliminar tipos de plan.
@Component({
  selector: 'app-tipo-plan-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tipo-plan-management">
      <div class="header">
        <h1>Gestionar Tipos de Plan</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Tipo de Plan
        </button>
      </div>

      <div *ngIf="showForm" class="tipo-plan-form">
        <h2>{{ editingTipoPlan ? "Editar" : "Agregar" }} Tipo de Plan</h2>

        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input id="nombre" formControlName="nombre" required />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <input id="descripcion" formControlName="descripcion" required />
          </div>

          <div class="form-group">
            <label for="precio">Precio:</label>
            <input id="precio" formControlName="precio" required type="number" />
          </div>

          <div class="form-group">
            <label for="estado">Estado:</label>
            <input id="estado" formControlName="estado" type="checkbox" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="tipo-plan-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tipoPlan of tipoPlanes">
              <td>{{ tipoPlan.nombre }}</td>
              <td>{{ tipoPlan.descripcion }}</td>
              <td>{{ tipoPlan.precio }}</td>
              <td>{{ tipoPlan.estado ? 'Activo' : 'Inactivo' }}</td>
              <td class="actions">
                <button (click)="editTipoPlan(tipoPlan)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteTipoPlan(tipoPlan.id)" class="btn-delete">
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
    /* Estilos similares a los del componente anterior */
  `]
})
export class TipoPlanComponent implements OnInit {
  tipoPlanes: TipoPlan[] = [];
  showForm = false;
  editingTipoPlan: TipoPlan | null = null;
  form: FormGroup;

  private tipoPlanService = inject(TipoPlanService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nombre: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
      precio: ["", [Validators.required, Validators.min(0)]],
      estado: [true],
    });
  }

  ngOnInit(): void {
    this.loadTipoPlanes();
  }

  loadTipoPlanes() {
    this.tipoPlanService.list().subscribe({
      next: (tipoPlanes) => (this.tipoPlanes = tipoPlanes),
      error: (err) => console.error("Error al cargar tipos de plan:", err),
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingTipoPlan = null;
    this.form.reset({ estado: true });
  }

  create() {
    if (this.form.valid) {
      const tipoPlanData = this.form.value;
      if (this.editingTipoPlan) {
        this.tipoPlanService.update(this.editingTipoPlan.id, tipoPlanData).subscribe({
          next: () => {
            alert("Tipo de plan actualizado con éxito");
            this.loadTipoPlanes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el tipo de plan");
          },
        });
      } else {
        this.tipoPlanService.create(tipoPlanData).subscribe({
          next: () => {
            alert("Tipo de plan creado con éxito");
            this.loadTipoPlanes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el tipo de plan");
          },
        });
      }
    }
  }

  editTipoPlan(tipoPlan: TipoPlan) {
    this.showForm = true;
    this.editingTipoPlan = tipoPlan;
    this.form.patchValue(tipoPlan);
  }

  deleteTipoPlan(id: number) {
    if (confirm("¿Estás seguro de eliminar este tipo de plan?")) {
      this.tipoPlanService.delete(id).subscribe({
        next: () => {
          alert("Tipo de plan eliminado con éxito");
          this.loadTipoPlanes();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el tipo de plan");
        },
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingTipoPlan = null;
    this.form.reset();
  }
}