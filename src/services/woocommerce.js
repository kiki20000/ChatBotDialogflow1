'use strict';

const  WooCommerceRestApi = require ('@woocommerce/woocommerce-rest-api').default; 

const { Payload } = require('dialogflow-fulfillment');

const WooCommerce = new WooCommerceRestApi({
    url: 'http://shop-test.1millionbot.com/',
    consumerKey: 'ck_f612670b17d0d8acdc74cee624702250b0ffddce',
    consumerSecret: 'cs_7f744341814cd5819f6f4c7acf8e0e700dd9b893',
    version: 'wc/v3'
});


const existUser = async (emailFormUser) => {
    
    try {
        const clientsList = await WooCommerce.get("customers");

        for(const client of clientsList.data){
            const {email} = client;
            console.log(email);
            console.log(emailFormUser);
            if(email === emailFormUser){
                return true;
            }
        }
        return false;
    } catch (e) {
        console.log('error', e);
        agent.add('Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.');
    }
};

const createUserWoo = async (data) => {
    
    try {

        console.log(data);
        const newClient = await WooCommerce.post("customers", data);

        console.log(newClient);

        return newClient;


    } catch (e) {
        console.log('error', e);
        agent.add('Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.');
    }
};


module.exports = {
    existUser,
    createUserWoo,
};