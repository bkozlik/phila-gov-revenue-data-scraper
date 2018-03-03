const express = require('express');
const app = express();
const config = require('./config/config.js');
const port = config.port;

var realEstateRoutes = require('./routes/real_estate_tax');
app.get('/real-estate-tax-data/brt/:brt', realEstateRoutes.getTaxDataByBRT)

app.listen(port);
console.log(`Phila.gov data service listening on port ${port}`)