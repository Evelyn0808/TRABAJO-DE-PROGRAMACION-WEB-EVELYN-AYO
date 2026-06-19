# Autenticación con JWT y Passport

Este documento registra, paso a paso, la implementación de autenticación basada en JWT (JSON Web Tokens) usando Passport en el proyecto `nest3-arquitectura`. Se irá completando progresivamente a medida que se avance en cada etapa: instalación de dependencias, generación de módulos, DTOs, interfaces, estrategia JWT, guard de protección de rutas y pruebas mediante archivos `.rest`.

## Resumen de la implementación

### Paquetes instalados

- `passport-jwt`, `bcrypt` — `@types/passport-jwt` como dev dependency. (Se omitió el paquete `jwt` de npm: está deprecado y su script de instalación `install.sh` rompe en Windows; no es necesario porque `@nestjs/jwt` cubre la firma/verificación de tokens).
- `class-validator`, `class-transformer` — validación de DTOs.
- `@nestjs/jwt` — `JwtService` para firmar y verificar tokens.
- `@nestjs/passport`, `passport` — integración de estrategias Passport con Nest.

### Estructura de carpetas creada

```
src/modules/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── dto/
│   │   ├── login-auth.dto.ts
│   │   └── register-auth.dto.ts
│   └── interfaces/
│       └── user.interface.ts
└── users/
    ├── users.module.ts
    ├── users.controller.ts
    ├── users.service.ts
    ├── dto/
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    └── entities/
        └── user.entity.ts

docs/
├── auth-jwt-Passport.md
└── rest/
    └── auth.rest
```

### DTOs

- `LoginAuthDto` (`email`, `password`) implementa la interfaz `User` y valida con `class-validator`:
  - `email`: `@IsEmail()`, `@IsNotEmpty()`
  - `password`: `@MinLength(6)`, `@MaxLength(25)`, `@IsNotEmpty()`
- `RegisterAuthDto` extiende `PartialType(LoginAuthDto)` (de `@nestjs/swagger`) y agrega `nombre: string`.

### Interfaces

- `User` (`src/modules/auth/interfaces/user.interface.ts`): obliga a `email` y `password`, implementada por `LoginAuthDto`.

### Validación global

- `ValidationPipe` registrado globalmente en `main.ts` con `app.useGlobalPipes(new ValidationPipe())`, antes de `app.listen()`.

### Flujo de autenticación

- `POST /auth/register`: recibe `RegisterAuthDto` y por ahora devuelve el mismo objeto recibido (placeholder, sin persistencia en base de datos todavía).
- `POST /auth/login`: recibe `LoginAuthDto`, llama a `AuthService.login(email, password)`, que:
  1. Construye un `payload` simulado `{ email, id: 1 }` (no hay validación real contra base de datos aún).
  2. Firma el token con `JwtService.sign(payload, { expiresIn: '60s' })`.
  3. Retorna el token.
- `JwtModule` se configuró con `JwtModule.register({ secret: 'secretoDePrueba123' })` en `auth.module.ts` (sin esto, `JwtService` no tiene proveedor y la app falla en runtime al inyectarlo en `AuthService`).

### JwtStrategy y JwtAuthGuard

- `JwtStrategy` (`src/modules/auth/jwt.strategy.ts`) extiende `PassportStrategy(Strategy)` de `passport-jwt`. Extrae el token del header `Authorization: Bearer <token>` (`ExtractJwt.fromAuthHeaderAsBearerToken()`), no ignora la expiración (`ignoreExpiration: false`) y usa el mismo secreto de prueba (`secretoDePrueba123`) que `JwtModule`. Su método `validate(payload)` retorna el payload decodificado, que Nest adjunta a `request.user`.
- Registrada como provider en `auth.module.ts`.
- `JwtAuthGuard` (`src/modules/auth/jwt-auth.guard.ts`) extiende `AuthGuard('jwt')` y se usa con `@UseGuards(JwtAuthGuard)`.
- Aplicado actualmente sobre `GET /users` en `users.controller.ts` — esa ruta ahora requiere un token válido.

### Cómo probar (archivo `docs/rest/auth.rest`)

1. **Registro** — `POST http://localhost:3000/auth/register` con body `{ email, password, nombre }`. Devuelve el mismo objeto (no persiste aún).
2. **Login** — `POST http://localhost:3000/auth/login` con body `{ email, password }`. Devuelve un token JWT firmado, válido por 60 segundos.
3. **Ruta protegida** — `GET http://localhost:3000/users` requiere el header `Authorization: Bearer <token>` obtenido del login. Sin el header, o con un token inválido/expirado, `JwtAuthGuard` rechaza la petición con 401.

### Pendiente / notas

- El registro y el login todavía no validan contra una base de datos real (no hay tabla de usuarios ni hash de contraseñas con `bcrypt` integrado al flujo aún).
- La conexión a Postgres en `app.module.ts` usa credenciales hardcodeadas (`postgres` / `1234`) que actualmente fallan en este entorno local; esto no bloquea el flujo de JWT/Passport descrito arriba, pero sí bloquea cualquier endpoint que dependa de TypeORM (por ejemplo `productos`).
- El secreto JWT (`secretoDePrueba123`) está hardcodeado en el código; en un entorno real debería moverse a variables de entorno.
