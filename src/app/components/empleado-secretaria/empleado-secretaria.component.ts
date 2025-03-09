import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Secretaria } from "src/app/models/secretaria.model";
import { SecretariaService } from 'src/app/services/secretaria.service';

@Component({
  selector: "app-aula-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `<div class="aula-management">
  <h1>Gestión de Aulas</h1>
  <button (click)="showAddForm()">Agregar Aula</button>

  <div *ngIf="showForm">
    <h2>{{ editingAula ? 'Editar Aula' : 'Nueva Aula' }}</h2>
    <form [formGroup]="form" (ngSubmit)="saveAula()">
      <div>
        <label>Nombre:</label>
        <input formControlName="nombre" />
      </div>
      <div>
        <label>Código:</label>
        <input formControlName="codigo" />
      </div>
      <div>
        <label>Bloque:</label>
        <input formControlName="bloque" />
      </div>
      <div>
        <label>Estado:</label>
        <select formControlName="estado">
          <option [ngValue]="true">Activo</option>
          <option [ngValue]="false">Inactivo</option>
        </select>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" (click)="cancelForm()">Cancelar</button>
    </form>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Código</th>
        <th>Bloque</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let aula of aulas">
        <td>{{ aula.id }}</td>
        <td>{{ aula.nombre }}</td>
        <!--
        <td><span
                  [class]="
                    'status-badge ' +
                    (Secretaria.estado ? 'active' : 'inactive')
                  "
                >
                  {{ aula.estado ? "Activo" : "Inactivo" }}
                </span></td>
                <td class="actions">
                <button (click)="editAula(aula)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  (click)="deleteAula(aula.id)"
                  class="btn-delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
            </td>
        -->
      </tr>
    </tbody>
  </table>
</div>
`,
  styles: [
    `.aula-management {
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
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .aula-form {
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
    .aula-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
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
    .btn-edit,
    .btn-delete {
      padding: 0.5rem;
      border-radius: 4px;
    }
    .btn-edit {
      color: #1a237e;
    }
    .btn-delete {
      color: #dc3545;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      font-size: 0.875rem;
    }
    .status-badge.active {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .status-badge.inactive {
      background: #ffebee;
      color: #c62828;
    }
    .btn-add:hover,
    .btn-save:hover,
    .btn-cancel:hover,
    .btn-edit:hover,
    .btn-delete:hover,
    .status-badge.active:hover,
    .status-badge.inactive:hover {
      transition: background-color 0.3s ease, color 0.3s ease;
    }`,
  ],
})
export class EmpleadoSecretariaComponent implements OnInit {
    aulas: Secretaria[] = [];
    showForm = false;
    editingAula: Secretaria | null = null;
  
    form: FormGroup;
  
    private aulaService = inject(SecretariaService);
    private fb = inject(FormBuilder);
  
    constructor() {
      this.form = this.fb.group({
        nombre: ['', Validators.required],
        codigo: ['', Validators.required],
        bloque: ['', Validators.required],
        estado: [true, Validators.required],
      });
    }
  
    ngOnInit(): void {
      this.loadAulas();
    }
  
    loadAulas() {
      this.aulaService.list().subscribe((aulas) => (this.aulas = aulas));
    }
  
    showAddForm() {
      this.showForm = true;
      this.editingAula = null;
      this.form.reset({ estado: true });
    }
  
    cancelForm() {
      this.showForm = false;
      this.form.reset();
    }
  
    saveAula() {
      if (this.form.invalid) {
        alert('Completa todos los campos.');
        return;
      }
  
      const aula: Secretaria = this.form.value;
  
      if (this.editingAula) {
        this.aulaService.update(this.editingAula.id, aula).subscribe(() => {
          alert('Aula actualizada.');
          this.loadAulas();
          this.cancelForm();
        });
      } else {
        this.aulaService.create(aula).subscribe(() => {
          alert('Aula creada.');
          this.loadAulas();
          this.cancelForm();
        });
      }
    }
  
    editAula(aula: Secretaria) {
      this.showForm = true;
      this.editingAula = aula;
      this.form.patchValue(aula);
    }
  
    deleteAula(id: number) {
      if (confirm('¿Seguro que deseas eliminar esta aula?')) {
        this.aulaService.delete(id).subscribe(() => {
          alert('Aula eliminada.');
          this.loadAulas();
        });
      }
    }
  }
