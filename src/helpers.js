export function action(controller, method) {
  return controller[method].bind(controller)
}
