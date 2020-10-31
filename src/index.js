import 'dotenv/config'
import App from './app'

const app = new App()

app.server.listen(process.env.PORT, () => {
  console.log('Listening to port ' + process.env.PORT)
})
