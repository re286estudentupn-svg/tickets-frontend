# ServiceDesk-TI — Frontend (Angular SPA)

Aplicación web de una sola página (SPA) para la **Gestión, Monitoreo y Trazabilidad de Incidencias de TI en Entornos Corporativos (ServiceDesk-TI)**, conectada a la API REST en Spring Boot.

## Stack Tecnológico
* **Framework:** Angular 22 (componentes *standalone*, *Signals*, rutas protegidas e interceptor JWT)
* **Estilos e Iconografía:** Bootstrap 5.3.3 y Bootstrap Icons 1.11.3
* **Lenguaje:** TypeScript

## Requisitos Previos
* Node.js 22 LTS y npm
* Angular CLI 22
* Backend de `ServiceDesk-TI` ejecutándose en `http://localhost:8080`

## Ejecución Local
1. Instalar las dependencias del proyecto:

        npm install

2. Iniciar el servidor de desarrollo:

        ng serve

3. Abrir el navegador en `http://localhost:4200/`.

## Funcionalidades por Rol
* **Usuario Final:** Autorregistro corporativo (`@empresa.pe`), apertura de tickets en 9 categorías (con prioridad inicial `Sin asignar`), seguimiento en tiempo real y comentarios colaborativos en bitácora.
* **Soporte Técnico TI:** Consulta de cola global y bandeja de tickets libres, autoasignación directa (*Tomar ticket*), clasificación de prioridad, actualización de estados y registro de anotaciones técnicas.
* **Jefe de TI:** Supervisión global con métricas KPI en tiempo real, asignación/reasignación opcional de especialistas y módulo completo de **Gestión de Usuarios y Roles** (con política de contraseñas y cambio obligatorio en el primer inicio de sesión).