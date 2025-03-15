import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Tecnico } from "src/app/models/tecnico.model";

@Component({
  selector: "app-tecnico-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
      <div class="tecnico-management">
      <div class="header">
        <h1>Gestionar Técnicos</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Técnico
        </button>
      </div>

      <div *ngIf="showForm" class="tecnico-form">
        <h2>{{ editingTecnico ? "Editar" : "Agregar" }} Técnico</h2>

        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input id="nombre" formControlName="nombre" required />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input id="telefono" formControlName="telefono" required />
          </div>

          <div class="form-group">
            <label for="correo">Correo:</label>
            <input id="correo" formControlName="correo" required />
          </div>

          <div class="form-group">
            <label for="especialidad">Especialidad:</label>
            <input id="especialidad" formControlName="especialidad" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="tecnico-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tecnico of tecnicos">
              <td>{{ tecnico.nombre }}</td>
              <td>{{ tecnico.telefono }}</td>
              <td>{{ tecnico.especialidad }}</td>
              <td class="actions">
                <button (click)="editTecnico(tecnico)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteTecnico(tecnico.id)" class="btn-delete">
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
        .tecnico-management {
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
    .tecnico-form {
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
    .form-group input {
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
    .tecnico-table {
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
export class EmpleadoTecnicoComponent implements OnInit {
  tecnicos: Tecnico[] = [];
  showForm = false;
  editingTecnico: Tecnico | null = null;
  form: FormGroup;

  private tecnicoService = inject(TecnicoService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nombre: ["", [Validators.required]],
      telefono: ["", [Validators.required]],
      correoPersonal: ["", [Validators.required, Validators.email]],
      fechaNacimiento: ["", [Validators.required]],
      numeroDocumento: ["", [Validators.required]],
      tipoDocumentoId: [null, [Validators.required]],
      generoId: [null, [Validators.required]],
      especialidad: ["", [Validators.required]],
      estado: [true],
    });
  }

  ngOnInit(): void {
    this.loadTecnicos();
  }

  loadTecnicos() {
    this.tecnicoService.list().subscribe({
      next: (tecnicos) => (this.tecnicos = tecnicos),
      error: (err) => console.error("Error al cargar técnicos:", err),
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingTecnico = null;
    this.form.reset({ estado: true });
  }

  create() {
    if (this.form.valid) {
      const tecnicoData = this.form.value;
      if (this.editingTecnico) {
        this.tecnicoService.update(this.editingTecnico.id, tecnicoData).subscribe({
          next: () => {
            alert("Técnico actualizado con éxito");
            this.loadTecnicos();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el técnico");
          },
        });
      } else {
        this.tecnicoService.create(tecnicoData).subscribe({
          next: () => {
            alert("Técnico creado con éxito");
            this.loadTecnicos();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el técnico");
          },
        });
      }
    }
  }

  editTecnico(tecnico: Tecnico) {
    this.showForm = true;
    this.editingTecnico = tecnico;
    this.form.patchValue(tecnico);
  }

  deleteTecnico(id: number) {
    if (confirm("¿Estás seguro de eliminar este técnico?")) {
      this.tecnicoService.delete(id).subscribe({
        next: () => {
          alert("Técnico eliminado con éxito");
          this.loadTecnicos();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el técnico");
        },
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingTecnico = null;
    this.form.reset();
  }
}
