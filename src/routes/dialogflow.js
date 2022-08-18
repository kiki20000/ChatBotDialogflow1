'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const jwt = require('jsonwebtoken');

const dialogflowController = require('../controllers/dialogflowController');
const woocommerceController = require('../controllers/woocommerceController');

const allowAuthenticated = async function (req, res, next) {
    try {
        const JWT = req.headers.authorization.replace('Bearer ', '');
        const decodedToken = jwt.decode(JWT);

        await client.verifyIdToken({
            idToken: JWT,
            audience: decodedToken.aud,
        });
        next();
    } catch (error) {
        return res.status(401).send({
            message: 'Authorization header is invalid',
        });
    }
};

router.post(
    '/webhook',
    //allowAuthenticated,
    dialogflowController.handler,
);

router.post(
    '/user',
    //allowAuthenticated,
    woocommerceController.addUserWoo,
);

module.exports = router;