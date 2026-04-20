# 🏥 Plataforma de Gestion Clinica y Seguimiento de Pacientes

## Tecnologias utilizadas

**Back-end:**
- Node.js + Express 5
- PostgreSQL + Sequelize
- MongoDB Atlas + Mongoose
- JWT
- Socket.io
- GraphQL + graphql-http
- Faker
- bcryptjs
- Docker

**Front-end:**
- HTML5 + JavaScript vanilla
- Bootstrap 5 + Bootstrap Icons
- Socket.io Client

---

## Instalacion

### 1. Clonar el repositorio

```bash
https://github.com/carloospg/GestionClinicaNode
```

### 2. Levantar PostgreSQL con Docker

```bash
docker compose up -d
```

### 3. Configurar el Back-end

```bash
cd server
npm install
cp .env.example .env
```

Edita el archivo `.env` y configura las variables:

```
# Servidor
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinica_db
DB_USER=admin
DB_PASSWORD=admin

# MongoDB Atlas
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/clinica_historiales?retryWrites=true&w=majority

# JWT
JWT_SECRET=admin1234
JWT_EXPIRES_IN=8h
```

### 4. Arrancar el servidor

```bash
npm run dev
```

Al arrancar por primera vez el seeder creara automaticamente todos los datos de prueba.

---

## Arrancar el proyecto

```bash
cd server
npm run dev
```

El cliente es HTML vanilla — abre directamente `client/pages/login.html` abras la pagina que abras si no has hecho login. Usa Live Server.

---

## Credenciales de acceso

| Rol | Email | Contrasena |
|-----|-------|------------|
| Administrador | admin@admin.com | admin |
| Medico | usuario1@medico.com | 1234 |
| Recepcionista | usuario2@recepcionista.com | 1234 |

---

## Funcionalidades por rol

### Administrador
- Registro de nuevos usuarios (medicos y recepcionistas)
- Listar todos los usuarios del sistema
- Eliminar usuarios
- Modificar el rol de cualquier usuario
- Crear y listar pacientes
- Eliminar pacientes
- Generar N pacientes aleatorios automaticamente
- Crear y cancelar citas
- Ver metricas generales en el panel principal (usuarios, pacientes, citas del dia)

### Medico
- Ver sus citas asignadas
- Cambiar el estado de una cita a `en_curso` o `finalizada`
- Al finalizar una cita se añade automaticamente una entrada al historial clinico del paciente
- Consultar el historial clinico completo de un paciente
- Ver sus citas pendientes del dia en el panel principal
- Recibe notificaciones en tiempo real cuando se le asigna una nueva cita
- Recibe notificaciones en tiempo real cuando una de sus citas cambia de estado

### Recepcionista
- Crear pacientes
- Crear citas (seleccionando paciente, medico, fecha y motivo)
- Cancelar citas pendientes
- Consultar la agenda general de citas
- Ver citas pendientes del dia en el panel principal
- La agenda se actualiza automaticamente en tiempo real

---

## API REST

El servidor expone los siguientes endpoints:

```
POST   /api/auth/login                          # Login (publico)
POST   /api/auth/registro                       # Registrar usuario (admin)
GET    /api/auth/usuarios                       # Listar usuarios (admin)
DELETE /api/auth/usuarios/:id                   # Eliminar usuario (admin)
PUT    /api/auth/usuarios/:id                   # Modificar rol (admin)
GET    /api/auth/medicos                        # Listar medicos (autenticado)

POST   /api/pacientes                           # Crear paciente (admin + recepcionista)
GET    /api/pacientes                           # Listar pacientes (autenticado)
DELETE /api/pacientes/:id                       # Eliminar paciente (admin)
POST   /api/pacientes/generar/:cantidad         # Generar N pacientes (admin)

POST   /api/citas                               # Crear cita (admin + recepcionista)
GET    /api/citas                               # Listar citas (autenticado)
PATCH  /api/citas/:id/cancelar                 # Cancelar cita (admin + recepcionista)
GET    /api/citas/mis-citas                     # Ver mis citas (medico)
PATCH  /api/citas/:id/estado                   # Cambiar estado (medico)

POST   /api/historial/:id_paciente             # Añadir entrada historial (medico)
GET    /api/historial/:id_paciente             # Ver historial (medico)
```

---

## GraphQL

El servidor expone un endpoint GraphQL en `POST /graphql` con las siguientes consultas:

```graphql
# Numero total de citas finalizadas por cada medico
{ citasFinalizadasPorMedico { id_medico total } }

# Citas pendientes del dia actual
{ citasPendientesHoy { id id_paciente id_medico fecha_hora motivo estado } }

# Duracion promedio de citas por medico (en minutos)
{ duracionPromedioPorMedico { id_medico duracion_promedio_minutos } }

# Historial completo de un paciente desde MongoDB
{ historialPaciente(id_paciente: 1) { id_paciente entradas { fecha id_medico observaciones diagnostico tratamiento } } }
```

---

## WebSockets

El servidor emite los siguientes eventos en tiempo real:

| Evento | Descripcion | Destinatario |
|--------|-------------|--------------|
| `cita-asignada` | Nueva cita asignada al medico | Medico asignado |
| `cita-cancelada` | Una cita ha sido cancelada | Todos |
| `cita-estado-cambiado` | La cita ha cambiado de estado | Todos |
| `actualizar-citas` | Recarga la agenda | Todos |

---
