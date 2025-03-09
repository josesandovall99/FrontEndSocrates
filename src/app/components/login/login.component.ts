  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AuthService } from 'src/app/services/auth.service';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `


<div class="login-container">
  <div class="left-section">
    <h1>Aplicacion Socrates</h1>
    <button class="official-page">Pagina Oficial</button>
  </div>
  <div class="right-section">
    <img src="assets/logo.png" alt="Servinet Logo" class="logo">
    <h2>Bienvenido</h2>
    <p>Empleado de Servinet</p>
    <form (ngSubmit)="login()">
      <input type="text" placeholder="Nombre de Usuario" [(ngModel)]="numeroDocumento" name="numeroDocumento" required>
      <input type="password" placeholder="Contraseña" [(ngModel)]="password" name="password" required>
      <button type="submit">Ingresar</button>
    </form>
    <div class="social-icons">
      <i class="fab fa-facebook"></i>
      <i class="fab fa-instagram"></i>
      <i class="fab fa-x"></i>
      <i class="fab fa-linkedin"></i>
    </div>
  </div>
</div>
`,
    styles: [`
    .login-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.left-section {
  background: url('/assets/background.png') no-repeat center center;
  background-size: cover;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
}

.right-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 150px;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 300px;
}

input {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #1a1a8f;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.social-icons {
  margin-top: 20px;
}

.social-icons i {
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
}
    `]
  })
  export class LoginComponent {
    numeroDocumento: string = '123';
    password: string = '123';
    message: string = '';
  
    constructor(private authService: AuthService, private router: Router) {}
  
    login() {
      // Verifica si el username y el password son "123"
      if (this.numeroDocumento === '123' && this.password === '123') {
        // Simula una respuesta exitosa del servidor
        const response = {
          message: 'Login successful',
          userType: 'admin'  // Puedes cambiar a 'student' o 'teacher' según necesites
        };
    
        localStorage.setItem('authToken', 'true'); // Guarda el token
        localStorage.setItem('userType', response.userType); // Guarda el tipo de usuario
    
        // Actualiza el estado de autenticación en AuthService
        this.authService.updateAuthStatus(true);
    
        // Redirige al dashboard adecuado según el tipo de usuario
        if (response.userType === 'admin') {
          this.router.navigate(['/empleado-dashboard']);
        } else if (response.userType === 'Secretaria') {
          this.router.navigate(['/solicitud-servicio']);
        }
      } else {
        // Si las credenciales son incorrectas
        this.message = 'Credenciales ERRONEAS';
      }
    }
    

    isPasswordVisible: boolean = false;

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
    
  }