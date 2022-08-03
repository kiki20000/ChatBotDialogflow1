'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('', routes);

module.exports.wh_wordpress = app;

