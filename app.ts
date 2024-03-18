import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {
    SearchRoutes,
    UsersRoutes,
    BeersRoutes,
    ImagesRoutes
} from '@/routes/index'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/users', UsersRoutes)
app.use('/api/beers', BeersRoutes)
app.use('/api/search', SearchRoutes)
app.use('/api/images', ImagesRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server started')
})

