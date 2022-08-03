'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');

const intents = require('../services/intents');
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
        intents.consultaPaisesEnvio,
    );

    intentMap.set(
        `listProducts`,
        intents.listProducts,
    );

    intentMap.set(
        `ResName`,
        intents.ResName,
    );
    intentMap.set(
        `ProductNotEspecific`,
        intents.ProductNotEspecific,
    );
    
    agent.handleRequest(intentMap);
};

module.exports = {
    handler,
};