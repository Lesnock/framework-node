import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import * as viewFunctions from './functions'

class Views {
  load(name, data = {}) {
    const viewPath = path.resolve(__dirname, '..', '..', 'views', name + '.hbs')

    if (!this.viewExists(viewPath)) {
      throw new Error(`View ${viewPath} not found`)
    }

    const content = this.loadViewContent(viewPath)

    const template = Handlebars.compile(content)

    return this.parseView(template({ ...data, ...viewFunctions }))
  }

  viewExists(viewPath) {
    return fs.existsSync(viewPath)
  }

  loadViewContent(viewPath) {
    return fs.readFileSync(viewPath, { encoding: 'utf-8' })
  }

  parseView(view = '') {
    let viewContent = view

    const functionRegex = /\@\@([a-zA-Z0-9]+)\(([a-zA-Z0-9\'\"\,]{0,})\)/g
    const results = [...view.matchAll(functionRegex)]

    results.forEach((result) => {
      const expression = result[0]
      const functionName = result[1]
      const args = result[2]

      viewContent = viewContent.replace(
        expression,
        viewFunctions[functionName](eval(args))
      )
    })

    return viewContent
  }
}

export default Views
