require('dotenv').config();

const app = require('./app');

app.listen(process.env.PORT, () => {
    console.log(`SERVER IS LISTENING ON http://${process.env.HOST}:${process.env.PORT}`);
})