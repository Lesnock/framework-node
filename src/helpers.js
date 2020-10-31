export function route(controller, method) {
  return controller[method].bind(controller)
}
