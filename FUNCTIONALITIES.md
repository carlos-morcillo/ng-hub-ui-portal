# Functionalities of Portal Library

This table details the functionalities of the `ng-hub-ui-portal` library and indicates which ones are covered by interactive examples.

## Portal (`hub-ui-portal`)

| Category               | Functionality                                                  | Example Covered |
| :--------------------- | :------------------------------------------------------------- | :-------------: |
| **Content Rendering**  | Component Rendering                                            |       [x]       |
|                        | TemplateRef Rendering                                          |       [x]       |
|                        | String Content Rendering                                       |       [x]       |
|                        | Data Passing to Components (`componentInstance`)               |       [x]       |
|                        | Content Projection (Header/Footer Slots)                       |       [x]       |
| **Opening Strategies** | `open()` (Progressive/Stacked)                                 |       [x]       |
|                        | `toggle()` (Exclusive)                                         |       [x]       |
| **Positioning**        | Default (Body Overlay)                                         |       [x]       |
|                        | Custom Container (Selector)                                    |       [x]       |
|                        | Custom Container (ElementRef/HTMLElement)                      |       [x]       |
| **Overlay Management** | Backdrop Creation                                              |       [x]       |
|                        | Backdrop Click Dismiss                                         |       [x]       |
|                        | Static Backdrop                                                |       [x]       |
|                        | Scroll Blocking                                                |       [x]       |
|                        | Auto-Focus Management                                          |       [x]       |
| **Interaction**        | Close with Result (`close()`)                                  |       [x]       |
|                        | Dismiss with Reason (`dismiss()`)                              |       [x]       |
|                        | Escape Key Dismiss                                             |       [x]       |
|                        | Custom Dismiss Selector                                        |       [x]       |
|                        | Custom Close Selector                                          |       [x]       |
| **Lifecycle**          | `beforeDismiss` Guard                                          |       [x]       |
|                        | Event Subscriptions (`shown`, `hidden`, `closed`, `dismissed`) |       [x]       |

---

_Note: ✅ indicates an active interactive example is available in the documentation. [x] indicates it is pending implementation._
