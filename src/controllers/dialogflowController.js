'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');

const intents = require('../services/intents');
const prestashop = require('../services/prestashop');

process.env.DEBUG = 'dialogflow:debug';

const handler = async (req, res) => {
    if (!req.body.queryResult.fulfillmentMessages) return;
    req.body.queryResult.fulfillmentMessages =
        await req.body.queryResult.fulfillmentMessages.map((m) => {
            if (!m.platform) m.platform = 'PLATFORM_UNSPECIFIED';
            return m;
        });

    const agent = new WebhookClient({
        request: req,
        response: res,
    });
    let intentMap = new Map();

   
    intentMap.set(
        `consulta_paises_envio`,
        prestashop.listZonesShipping,
    );

    intentMap.set(
        `listProducts`,
        prestashop.listProducts,
    );

    intentMap.set(
        `responseOurName`,
        prestashop.responseOurName,
    );
    intentMap.set(
        `searchProduct`,
        prestashop.searchProduct,
    );
    intentMap.set(
        `createReview - Product - Valoracion - no`,
        intents.createReviewNoReview,
    );
    intentMap.set(
        `createReview - Product - Valoracion - yes - custom`,
        intents.createReviewWithReview,
    );
    intentMap.set(
        `statusOrder`,
        intents.showStatusOrder,
    );
    intentMap.set(
        `shippingClasses`,
        prestashop.typesShipping,
    );
    intentMap.set(
        `deleteOrder`,
        prestashop.deleteOrder,
    );
    intentMap.set(
        `registerUser`,
        prestashop.createUsers,
    );
    
    agent.handleRequest(intentMap);
};


module.exports = {
    handler,
    
};