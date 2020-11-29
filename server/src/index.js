const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');

app.set('port', 3000)

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use(require('./router'))

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
})

