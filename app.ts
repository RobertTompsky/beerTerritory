import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './routes/users'
import beerRoutes from './routes/beers'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/users', userRoutes)
app.use('/api/beers', beerRoutes)

app.listen(process.env.PORT, ()=> {
    console.log('Server started')
})

