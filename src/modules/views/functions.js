import View from './index'

export function loadView(viewName) {
  const view = new View()

  return view.load(viewName)
}
