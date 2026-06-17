# ng-hub-ui-portal

**Español** | [English](./README.md)

Una librería de portales para Angular ligera y flexible que permite renderizar dinámicamente componentes y plantillas en cualquier contenedor del DOM. Forma parte de la suite de componentes ng-hub-ui y ofrece una forma simplificada de gestionar el renderizado de contenido dinámico con control total sobre el posicionamiento y la interacción.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de librerías de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/portal/overview/
- Ejemplos en vivo: https://hubui.dev/portal/examples/
- Hub UI: https://hubui.dev/

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleta — usa ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal) ← Estás aquí
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📋 Tabla de contenidos

- [🚀 Inicio rápido](#-inicio-rápido)
- [✨ Inspiración](#-inspiración)
- [📦 Descripción general](#-descripción-general)
- [🎯 Características principales](#-características-principales)
- [🚀 Instalación](#-instalación)
- [⚙️ Uso básico](#️-uso-básico)
- [📂 Gestión de contenedores](#-gestión-de-contenedores)
- [🪟 Estrategias de apertura de portales](#-estrategias-de-apertura-de-portales)
- [🔗 Trabajar con datos del componente](#-trabajar-con-datos-del-componente)
- [⚙️ Opciones de configuración](#️-opciones-de-configuración)
- [🪄 Referencia del portal](#-referencia-del-portal)
- [🌐 Configuración global](#-configuración-global)
- [🧱 Gestión de la pila de portales](#-gestión-de-la-pila-de-portales)
- [🪄 Referencia de la API](#-referencia-de-la-api)
- [🧩 Estilos](#-estilos)
- [♿ Accesibilidad](#-accesibilidad)
- [📊 Registro de cambios](#-registro-de-cambios)
- [🤝 Contribución](#-contribución)
- [☕ Apoyar el proyecto](#-apoyar-el-proyecto)
- [📄 Licencia](#-licencia)

---

## 🚀 Inicio rápido

Empieza a usar ng-hub-ui-portal en menos de 5 minutos.

### 1. Instalación

```bash
npm install ng-hub-ui-portal ng-hub-ui-utils
```

### 2. Inyecta el servicio

```typescript
import { Component } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({
	selector: 'app-root',
	standalone: true,
	template: `<button (click)="open()">Abrir portal</button>`
})
export class AppComponent {
	constructor(private portal: HubPortal) {}

	open(): void {
		this.portal.open(MyContentComponent, { container: '#portalHost' });
	}
}
```

### 3. Cierra desde el propio contenido

```typescript
import { Component } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

@Component({
	template: `
		<div class="portal-body">¡Hola desde un portal!</div>
		<button (click)="activePortal.close('done')">Cerrar</button>
	`
})
export class MyContentComponent {
	constructor(public activePortal: HubActivePortal) {}
}
```

**💡 ¡Y listo!** Ya tienes un portal renderizado dinámicamente que puedes abrir, cerrar y descartar de forma programática.

---

## ✨ Inspiración

Esta librería se inspira en el diseño de API probado y consolidado del servicio de modales de `ng-bootstrap`, reinterpretado como un portal genérico e independiente del contenedor. Mientras que un modal clásico encierra el contenido en un diálogo centrado sobre un fondo oscuro, `ng-hub-ui-portal` mantiene el mismo flujo ergonómico de `open()` / `dismiss()` / `result`, pero te permite renderizar cualquier componente o plantilla en **cualquier** contenedor del DOM, habilitando paneles apilados, superposiciones en línea, cajones laterales y flujos tipo asistente sin salir del modelo de inyección de dependencias de Angular.

## 📦 Descripción general

`ng-hub-ui-portal` permite crear ventanas de portal dinámicas que pueden renderizar componentes, plantillas o contenido de texto simple. A diferencia de los diálogos modales tradicionales, los portales pueden renderizarse en cualquier contenedor del DOM, lo que los hace más versátiles para requisitos de interfaz complejos.

La librería es **headless y estructural** por diseño: gestiona el renderizado, el foco, la pila de portales y las promesas/observables del ciclo de vida, dejando la presentación visual completamente en manos de tus componentes de contenido y tus propios estilos.

## 🎯 Características principales

- Renderizado dinámico de componentes y plantillas
- Selección de contenedor personalizado (selector CSS o `HTMLElement`)
- Animaciones de apertura/cierre integradas
- Soporte de accesibilidad con atributos ARIA
- Gestión del foco
- Plantillado de cabecera y pie mediante selectores personalizados
- Disparadores de descarte y cierre personalizables
- Ciclo de vida basado en promesas y observables (`result`, `closed`, `dismissed`, `shown`, `hidden`)
- Gestión de la pila de portales para portales apilados o exclusivos

## 🚀 Instalación

```bash
npm install ng-hub-ui-portal ng-hub-ui-utils
```

> **Dependencia de pares (peer dependency):** `ng-hub-ui-portal` depende de [`ng-hub-ui-utils`](https://www.npmjs.com/package/ng-hub-ui-utils) (`^1.0.0`) para utilidades compartidas de superposición/contenido, junto con `@angular/common` y `@angular/core` (`>=16.0.0`). Asegúrate de tenerla instalada en tu aplicación.

## ⚙️ Uso básico

Empieza inyectando el servicio `HubPortal` en tu componente:

```typescript
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class YourComponent {
	constructor(private portal: HubPortal) {}

	openPortal() {
		this.portal.open(YourContentComponent);
	}
}
```

### Portales basados en componentes

Crea un componente para mostrarlo en el portal:

```typescript
@Component({
	template: `
		<div class="portal-header">
			<h4>Título del portal</h4>
			<button type="button" data-dismiss="portal">Cerrar</button>
		</div>
		<div class="portal-body">Tu contenido aquí</div>
		<div class="portal-footer">
			<button data-close="portal">Cerrar</button>
		</div>
	`
})
export class PortalContentComponent {
	constructor(private activePortal: HubActivePortal) {}

	// Cierra el portal con un resultado
	close() {
		this.activePortal.close('Closed');
	}

	// Descarta el portal con un motivo
	dismiss() {
		this.activePortal.dismiss('Dismissed');
	}
}
```

### Portales basados en plantillas

También puedes usar referencias a plantillas:

```typescript
@Component({
	template: `
		<ng-template #content>
			<div class="portal-header"><h4>Portal de plantilla</h4></div>
			<div class="portal-body">Contenido de la plantilla aquí</div>
		</ng-template>

		<button (click)="openPortal(content)">Abrir portal</button>
	`
})
export class YourComponent {
	constructor(private portal: HubPortal) {}

	openPortal(content: TemplateRef<any>) {
		this.portal.open(content);
	}
}
```

> **Nota:** Al abrir un portal, conviene especificar un contenedor donde se renderizará. Aunque por defecto es `body`, se recomienda definir tu contenedor explícitamente para tener mejor control y organización.

## 📂 Gestión de contenedores

La opción `container` del portal determina dónde se renderizará en el DOM. Aunque por defecto es el `body` del documento, especificar un contenedor personalizado te da mejor control sobre la ubicación y la gestión del portal.

### Especificar un contenedor

Puedes especificar un contenedor mediante un selector CSS o una referencia directa a un `HTMLElement`:

```typescript
// Usando un selector CSS
const portalRef = this.portal.open(YourComponent, {
	container: '#myContainer'
});

// O usando toggle
const portalRef = this.portal.toggle(YourComponent, {
	container: '#portalHost'
});

// Usando una referencia a un HTMLElement
const containerElement = document.querySelector('.portal-container');
const portalRef = this.portal.open(YourComponent, {
	container: containerElement
});
```

### Buenas prácticas

1. **Definición explícita del contenedor** — Aunque el `body` está disponible por defecto, se recomienda especificar tu contenedor explícitamente:

```typescript
// Recomendado
const portalRef = this.portal.toggle(YourComponent, {
	container: '#specificContainer'
});

// Menos ideal: depende del contenedor body por defecto
const portalRef = this.portal.toggle(YourComponent);
```

2. **Preparación del contenedor** — Asegúrate de que tu contenedor exista en el DOM antes de abrir el portal:

```html
<div id="portalContainer" class="portal-host">
	<!-- Los portales se renderizarán aquí -->
</div>
```

3. **Estilos del contenedor** — Considera dar estilo a tu contenedor de forma adecuada:

```css
.portal-host {
	position: relative;
	min-height: 100px;
}
```

## 🪟 Estrategias de apertura de portales

La librería ofrece dos métodos distintos para abrir portales, cada uno con su comportamiento específico.

### Método Open: renderizado progresivo

El método `open()` utiliza una estrategia de renderizado progresivo. Al llamar a `open()`, el nuevo portal se renderiza manteniendo visibles los portales existentes. Esto crea un efecto en capas en el que los portales se apilan unos sobre otros.

```typescript
const portal1 = this.portal.open(Component1);
const portal2 = this.portal.open(Component2); // encima del primero
const portal3 = this.portal.open(Component3); // encima de ambos
```

Este enfoque es especialmente útil cuando:

- Necesitas mostrar una jerarquía de información
- Los usuarios necesitan consultar información de portales anteriores
- Implementas interfaces tipo asistente donde hay que preservar el contexto

### Método Toggle: renderizado exclusivo

El método `toggle()` implementa una estrategia de renderizado exclusivo. Al invocarlo, se asegura de gestionar adecuadamente los portales previos antes de renderizar el nuevo, para una experiencia más limpia de un solo portal:

```typescript
this.portal.toggle(Component1);
this.portal.toggle(Component2);
this.portal.toggle(Component3);
```

Este método es ideal cuando:

- Quieres asegurar que solo un portal sea visible a la vez
- Necesitas limpiar los estados de portales previos antes de mostrar contenido nuevo
- Implementas vistas o flujos mutuamente excluyentes

### Elegir entre Open y Toggle

- Usa `open()` cuando la información de varios portales deba estar visible simultáneamente
- Usa `toggle()` cuando quieras asegurar una transición limpia entre contenidos de portal
- Ten en cuenta las implicaciones de UX: varios portales apilados pueden resultar abrumadores en algunos casos
- Piensa en la memoria y el rendimiento: `toggle()` favorece la limpieza de los portales previos

## 🔗 Trabajar con datos del componente

La librería de portales ofrece una forma sencilla de pasar datos a los componentes renderizados mediante la propiedad `componentInstance` de la referencia del portal.

### Pasar datos a los componentes del portal

```typescript
@Component({
	template: `
		<div class="portal-header"><h4>Detalles del usuario</h4></div>
		<div class="portal-body">
			<p>Nombre: {{ userName }}</p>
			<p>Rol: {{ userRole }}</p>
		</div>
	`
})
export class UserDetailsComponent {
	userName: string;
	userRole: string;

	updateUser(role: string) {
		this.userRole = role;
	}
}

@Component({
	template: `
		<button (click)="openUserPortal()">Mostrar detalles del usuario</button>
		<button (click)="updateUserRole()">Promocionar usuario</button>
	`
})
export class ParentComponent {
	private portalRef: HubPortalRef;

	constructor(private portal: HubPortal) {}

	openUserPortal() {
		this.portalRef = this.portal.open(UserDetailsComponent);

		if (this.portalRef.componentInstance) {
			this.portalRef.componentInstance.userName = 'John Doe';
			this.portalRef.componentInstance.userRole = 'User';
		}
	}

	updateUserRole() {
		if (this.portalRef.componentInstance) {
			this.portalRef.componentInstance.updateUser('Admin');
		}
	}
}
```

Este enfoque te da acceso completo a la instancia del componente, permitiéndote establecer propiedades directamente, llamar a métodos del componente, acceder a su estado y disparar su funcionalidad.

El mismo patrón funciona con el método `toggle`:

```typescript
const portalRef = this.portal.toggle(UserDetailsComponent);
portalRef.componentInstance.userName = 'John Doe';
portalRef.componentInstance.userRole = 'User';
```

### Seguridad de tipos con la instancia del componente

Para un mejor soporte de TypeScript, puedes tipar tu referencia del portal:

```typescript
private portalRef: HubPortalRef & { componentInstance: UserDetailsComponent };

openUserPortal() {
	this.portalRef = this.portal.open(UserDetailsComponent);

	// Ahora TypeScript conoce todas las propiedades y métodos disponibles
	this.portalRef.componentInstance.userName = 'John Doe';
	this.portalRef.componentInstance.updateUser('Admin');
}
```

## ⚙️ Opciones de configuración

El portal puede configurarse con varias opciones (`HubPortalOptions`):

```typescript
this.portal.open(YourComponent, {
	animation: true, // Activa/desactiva las animaciones
	container: 'body', // Selector CSS o HTMLElement para el contenedor del portal
	injector: customInjector, // Injector personalizado para el contenido del portal
	keyboard: true, // Cerrar al pulsar la tecla Escape
	scrollable: true, // Activa el contenido con desplazamiento
	windowClass: 'custom-portal', // Clase CSS adicional para la ventana del portal
	portalDialogClass: 'custom-dialog', // Clase CSS adicional para el diálogo del portal
	portalContentClass: 'custom-content', // Clase CSS adicional para el contenido del portal
	headerSelector: '.portal-header', // Selector de cabecera personalizado
	footerSelector: '.portal-footer', // Selector de pie personalizado
	dismissSelector: '[data-dismiss="portal"]', // Selector personalizado del disparador de descarte
	closeSelector: '[data-close="portal"]', // Selector personalizado del disparador de cierre
	beforeDismiss: () => boolean, // Callback antes de descartar el portal
	ariaLabelledBy: 'title-id', // Atributo ARIA labelledby
	ariaDescribedBy: 'desc-id' // Atributo ARIA describedby
});
```

## 🪄 Referencia del portal

Los métodos `open()` y `toggle()` devuelven un `HubPortalRef` que puedes usar para controlar el portal:

```typescript
const portalRef = this.portal.open(YourComponent);

// Cierra el portal con un resultado (resuelve portalRef.result)
portalRef.close('result');

// Descarta el portal con un motivo (rechaza portalRef.result)
portalRef.dismiss('reason');

// Actualiza las opciones del portal
portalRef.update({
	ariaLabelledBy: 'new-title-id',
	portalContentClass: 'updated-content'
});

// Esperando la promesa del ciclo de vida
portalRef.result.then(
	(result) => console.log('Cerrado con:', result),
	(reason) => console.log('Descartado con:', reason)
);

// Suscríbete a los eventos del portal
portalRef.closed.subscribe((result) => console.log('Portal cerrado:', result));
portalRef.dismissed.subscribe((reason) => console.log('Portal descartado:', reason));
portalRef.hidden.subscribe(() => console.log('Portal oculto'));
portalRef.shown.subscribe(() => console.log('Portal mostrado'));
```

## 🌐 Configuración global

Puedes proporcionar opciones por defecto para todos los portales configurando `HubPortalConfig`:

```typescript
import { HubPortalConfig } from 'ng-hub-ui-portal';

@NgModule({
	providers: [
		{
			provide: HubPortalConfig,
			useValue: {
				animation: true,
				keyboard: true,
				scrollable: false,
				dismissSelector: '[data-dismiss="portal"]',
				closeSelector: '[data-close="portal"]'
			}
		}
	]
})
export class AppModule {}
```

## 🧱 Gestión de la pila de portales

La librería incluye métodos para gestionar múltiples portales:

```typescript
// Comprueba si hay portales abiertos
if (this.portal.hasOpenPortals()) {
	// Gestiona los portales abiertos
}

// Toggle del portal (gestiona los portales existentes antes de abrir uno nuevo)
this.portal.toggle(NewComponent);

// Descarta todos los portales abiertos
this.portal.dismissAll('reason');

// Suscríbete a las instancias de portal activas
this.portal.activeInstances.subscribe((portals) => {
	console.log('Portales activos:', portals.length);
});
```

## 🪄 Referencia de la API

### `HubPortal` (servicio, `providedIn: 'root'`)

| Miembro           | Firma                                                  | Descripción                                                                       |
| ----------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `open`            | `(content: any, options?: HubPortalOptions) => HubPortalRef` | Abre un portal con el contenido dado (tipo de componente o `TemplateRef`).         |
| `toggle`          | `(content: any, options?: HubPortalOptions) => HubPortalRef` | Abre un portal con comportamiento de renderizado exclusivo.                        |
| `activeInstances` | `Observable<HubPortalRef[]>`                           | Observable con las referencias de portal actualmente activas.                      |
| `dismissAll`      | `(reason?: any) => void`                               | Descarta todos los portales mostrados con el motivo indicado.                      |
| `hasOpenPortals`  | `() => boolean`                                        | Indica si hay actualmente algún portal abierto.                                    |

### `HubActivePortal`

Inyectable dentro del componente de contenido para controlar su propio portal.

| Miembro   | Firma                                           | Descripción                                            |
| --------- | ----------------------------------------------- | ------------------------------------------------------ |
| `update`  | `(options: HubPortalUpdatableOptions) => void`  | Actualiza las opciones del portal abierto.             |
| `close`   | `(result?: any) => void`                        | Cierra el portal, resolviendo `HubPortalRef.result`.   |
| `dismiss` | `(reason?: any) => void`                        | Descarta el portal, rechazando `HubPortalRef.result`.  |

### `HubPortalRef`

Devuelto por `open()` / `toggle()`.

| Miembro             | Tipo                                            | Descripción                                                                  |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `result`            | `Promise<any>`                                  | Se resuelve al cerrar el portal y se rechaza al descartarlo.                 |
| `componentInstance` | `any`                                           | La instancia del componente de contenido (`undefined` para plantillas/cerrado). |
| `closed`            | `Observable<any>`                               | Emite cuando el portal se cierra mediante `.close()`.                        |
| `dismissed`         | `Observable<any>`                               | Emite cuando el portal se descarta mediante `.dismiss()`.                    |
| `shown`             | `Observable<void>`                              | Emite cuando el portal es totalmente visible y la animación de apertura terminó. |
| `hidden`            | `Observable<void>`                              | Emite cuando el portal se cierra y la animación de cierre terminó.           |
| `close`             | `(result?: any) => void`                        | Cierra el portal con un resultado opcional.                                  |
| `dismiss`           | `(reason?: any) => void`                        | Descarta el portal con un motivo opcional.                                   |
| `update`            | `(options: HubPortalUpdatableOptions) => void`  | Actualiza las opciones del portal abierto.                                   |

### Interfaces y tipos

- **`HubPortalOptions`** — opciones aceptadas por `open()` / `toggle()` (consulta [Opciones de configuración](#️-opciones-de-configuración)).
- **`HubPortalUpdatableOptions`** — subconjunto de opciones que pueden actualizarse en un portal abierto: `ariaLabelledBy`, `ariaDescribedBy`, `windowClass`, `portalDialogClass`, `portalContentClass`.

### Otras exportaciones

- **`HubPortalConfig`** — servicio inyectable que proporciona opciones por defecto a nivel de aplicación (consulta [Configuración global](#-configuración-global)).
- **`HubPortalStack`** — servicio de bajo nivel que gestiona la pila de portales (usado internamente por `HubPortal`).
- **`PortalDismissReasons`** — enumeración de motivos de descarte integrados: `BACKDROP_CLICK`, `ESC`.
- **`HubPortalModule`** — `NgModule` que registra el proveedor `HubPortal` (opcional en aplicaciones standalone, ya que `HubPortal` es `providedIn: 'root'`).

## 🧩 Estilos

`ng-hub-ui-portal` es una librería **headless / estructural**: no incluye un diseño con tema ni expone variables CSS personalizadas. Los únicos estilos integrados son reglas estructurales mínimas (por ejemplo, un host de contenido con desplazamiento). Tienes control total sobre la presentación visual mediante:

- El marcado y los estilos de tus **componentes de contenido**.
- Las opciones `windowClass`, `portalDialogClass` y `portalContentClass`, que te permiten asignar tus propias clases CSS a los elementos del portal generados.

```typescript
this.portal.open(MyContentComponent, {
	windowClass: 'app-portal',
	portalDialogClass: 'app-portal__dialog',
	portalContentClass: 'app-portal__content'
});
```

```css
.app-portal__dialog {
	max-width: 480px;
	margin: 2rem auto;
}

.app-portal__content {
	background: #fff;
	border-radius: 0.5rem;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

## ♿ Accesibilidad

La librería implementa características de accesibilidad:

- Soporte de atributos ARIA (`ariaLabelledBy`, `ariaDescribedBy`)
- Navegación por teclado, incluyendo el descarte con la tecla `Escape` (opción `keyboard`)
- Gestión del foco
- Compatibilidad con lectores de pantalla

## 📊 Registro de cambios

Todos los cambios relevantes de esta librería se documentan en [CHANGELOG.md](./CHANGELOG.md), siguiendo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) y [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

La versión actual es la **0.3.4**.

## 🤝 Contribución

¡Toda contribución es bienvenida! Así puedes ayudar.

### Configuración del entorno de desarrollo

1. Clona el repositorio

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-portal.git
cd ng-hub-ui-portal
```

2. Instala las dependencias

```bash
npm install
```

3. Arranca el servidor de desarrollo

```bash
npm start
```

### Pruebas

```bash
# Pruebas unitarias
npm run test

# Cobertura de pruebas
npm run test:coverage
```

### Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nuevas funcionalidades
- `fix:` Corrección de errores
- `docs:` Cambios en la documentación
- `style:` Cambios de estilo de código (formato, etc.)
- `refactor:` Refactorizaciones de código
- `test:` Añadir o actualizar pruebas
- `chore:` Tareas de mantenimiento

Ejemplo:

```bash
git commit -m "feat: add custom divider support"
```

### Proceso de Pull Request

1. Haz un fork del repositorio
2. Crea una nueva rama: `git checkout -b feat/my-new-feature`
3. Realiza tus cambios
4. Añade pruebas para cualquier funcionalidad nueva
5. Actualiza la documentación si es necesario
6. Envía un Pull Request

### Directrices de desarrollo

- Escribe pruebas unitarias para las nuevas funcionalidades
- Sigue la guía de estilo de Angular
- Actualiza la documentación ante cambios en la API
- Mantén la compatibilidad hacia atrás
- Añade comentarios JSDoc para la lógica compleja

### Reportar incidencias

Antes de crear una incidencia, por favor:

- Revisa las incidencias existentes
- Incluye los pasos para reproducir el problema
- Especifica tu entorno (versión de Angular, navegador)

## ☕ Apoyar el proyecto

Si este proyecto te resulta útil y quieres apoyar su desarrollo, puedes invitarme a un café:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

¡Tu apoyo es muy apreciado y ayuda a mantener y mejorar este proyecto!

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT — consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Hecho con ❤️ por [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)
