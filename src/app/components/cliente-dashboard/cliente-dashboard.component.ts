import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente.model";

@Component({
  selector: "app-empleado-cliente",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="secretaria-management">
      <div class="header">
        <h1>Gestionar Clientes</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Cliente
        </button>
      </div>

      <div *ngIf="showForm" class="secretaria-form">
        <h2>{{ editingCliente ? "Editar" : "Agregar" }} Cliente</h2>

        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input id="nombre" type="text" formControlName="nombre" required />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input id="telefono" type="text" formControlName="telefono" required />
          </div>

          <div class="form-group">
            <label for="correo">Correo:</label>
            <input id="correo" type="email" formControlName="correo" required />
          </div>

          <div class="form-group">
            <label for="numeroDocumento">Número de Documento:</label>
            <input id="numeroDocumento" type="text" formControlName="numeroDocumento" required />
          </div>

          <div class="form-group">
            <label for="tipoDocumento">Tipo identificación:</label>
            <select id="tipoDocumento" formControlName="tipoDocumento" required class="form-control">
              <option value="">Seleccione una opción</option>
              <option *ngFor="let tipo of tiposDocumento" [value]="tipo.valor" [selected]="form.get('tipoDocumento')?.value === tipo.valor">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="sexo">Género:</label>
            <select id="sexo" formControlName="sexo" required class="form-control">
              <option value="">Seleccione una opción</option>
              <option *ngFor="let gen of generos" [value]="gen.valor" [selected]="form.get('sexo')?.value === gen.valor">
                {{ gen.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input id="direccion" type="text" formControlName="direccion" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="secretaria-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo documento</th>
              <th>Número documento</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes">
              <td>{{ cliente.nombre }}</td>
              <td>{{ getTipoDocumentoNombre(cliente.tipoDocumento) }}</td>
              <td>{{ cliente.numeroDocumento }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.correo }}</td>
              <td class="actions">
                <button (click)="editCliente(cliente)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteCliente(cliente.id)" class="btn-delete">
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
    .secretaria-management {
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }

    .btn-add {
      background-color: #3498db;
      color: white;
      padding: 0.5rem 1.2rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .btn-add i {
      margin-right: 0.5rem;
    }

    .secretaria-form {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
    }

    .secretaria-form h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.3rem;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.3rem;
    }

    .form-actions {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }

    .btn-save {
      background-color: #27ae60;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .btn-cancel {
      background-color: #e74c3c;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .secretaria-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .secretaria-table th, .secretaria-table td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    .secretaria-table th {
      background-color: #ecf0f1;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .btn-edit i {
      color: #f39c12;
    }

    .btn-delete i {
      color: #c0392b;
    }
  `]
})
export class clienteComponent implements OnInit {
  clientes: Cliente[] = [];
  showForm = false;
  editingCliente: Cliente | null = null;
  form: FormGroup;

  tiposDocumento = [
    { valor: 'CC', nombre: 'Cédula de ciudadanía' },
    { valor: 'PP', nombre: 'Pasaporte' }
  ];

  generos = [
    { valor: 'M', nombre: 'Masculino' },
    { valor: 'F', nombre: 'Femenino' }
  ];

  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nombre: ["", Validators.required],
      telefono: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      numeroDocumento: ["", Validators.required],
      tipoDocumento: ["", Validators.required],
      sexo: ["", Validators.required],
      direccion: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }

  loadClientes() {
    this.clienteService.list().subscribe({
      next: (clientes) => {
        this.clientes = clientes.filter(cliente => cliente.cargo === 'CLIENTE');
      },
      error: (err) => console.error("Error al cargar clientes:", err),
    });
  }
  
  showAddForm() {
    this.showForm = true;
    this.editingCliente = null;
    this.form.reset();
  }

  create() {
    if (this.form.valid) {
      const clienteData = this.form.value;

      if (this.editingCliente?.id) {
        this.clienteService.update(this.editingCliente.id, clienteData).subscribe({
          next: () => {
            alert("Cliente actualizado con éxito");
            this.loadClientes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el cliente");
          },
        });
      } else {
        this.clienteService.create(clienteData).subscribe({
          next: () => {
            alert("Cliente creado con éxito");
            this.loadClientes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el cliente");
          },
        });
      }
    }
  }

  editCliente(cliente: Cliente) {
    this.showForm = true;
    this.editingCliente = cliente;
    this.form.patchValue(cliente);
  }

  deleteCliente(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          alert("Cliente eliminado con éxito");
          this.loadClientes();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el cliente");
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingCliente = null;
    this.form.reset();
  }
}
