# Functionalities of Portal Library

This table details the functionalities of the `ng-hub-ui-portal` library and indicates which ones are covered by interactive examples.

## Portal (`hub-ui-portal`)

| Category                | Functionality                                                  | Example Covered |
| :---------------------- | :------------------------------------------------------------- | :-------------: |
| **Content Rendering**   | Component Rendering                                            |       ✅        |
|                         | TemplateRef Rendering                                          |       ✅        |
|                         | String Content Rendering                                       |       ✅        |
|                         | Data Passing to Components (`componentInstance`)               |       ✅        |
|                         | Content Projection (Header/Footer Slots)                       |       ✅        |
| **Opening Strategies**  | `open()` (Progressive/Stacked)                                 |       ✅        |
|                         | `toggle()` (Exclusive)                                         |       ✅        |
| **Container Targeting** | Default (Body)                                                 |       ✅        |
|                         | Custom Container (CSS Selector)                                |       ✅        |
|                         | Custom Container (`HTMLElement`)                               |       ✅        |
| **Overlay Management**  | Scroll Blocking                                                |       [x]       |
|                         | Auto-Focus Management                                          |       [x]       |
|                         | `aria-hidden` on Everything Outside the Window                 |       [x]       |
| **Interaction**         | Close with Result (`close()`)                                  |       ✅        |
|                         | Dismiss with Reason (`dismiss()`)                              |       ✅        |
|                         | Escape Key Dismiss (`keyboard`)                                |       [x]       |
|                         | Custom Dismiss Selector                                        |       [x]       |
|                         | Custom Close Selector                                          |       [x]       |
| **Lifecycle**           | `beforeDismiss` Guard                                          |       [x]       |
|                         | Event Subscriptions (`shown`, `hidden`, `closed`, `dismissed`) |       ✅        |

---

_Note: ✅ indicates an active interactive example is available in the documentation. [x] indicates it is pending implementation._

> The library is headless and structural: it appends the portal window to a container and manages
> the stack, the focus and the lifecycle. It draws no backdrop and applies no positioning — both
> are yours to write, through the classes `windowClass`, `portalDialogClass` and
> `portalContentClass` attach to the generated elements.
