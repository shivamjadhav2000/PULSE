require('module-alias/register')

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
mongoose.promise = global.Promise
const dotenv =require('dotenv');
dotenv.config()
const dbConnect = require('@config/database')
const app = express();
app.use(express.json())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
require('@models/models')
app.use(require('./src/routes'))

dbConnect().then(() => {
    console.log('Database connected successfully')
    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    }
    );
}).catch((err) => {
    console.log('Database connection failed', err)
}
)

