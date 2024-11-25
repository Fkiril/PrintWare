const express = require('express');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars');
const route = require('./routes');
const SPSO = require('./models/SPSO');
app.use(express.urlencoded({ extended: true }));
const spso = new SPSO();

route(app);
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
