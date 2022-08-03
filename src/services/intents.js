'use strict';

const  WooCommerceRestApi = require ('@woocommerce/woocommerce-rest-api').default; 

const { Payload } = require('dialogflow-fulfillment');

const WooCommerce = new WooCommerceRestApi({
    url: 'http://shop-test.1millionbot.com/',
    consumerKey: 'ck_f612670b17d0d8acdc74cee624702250b0ffddce',
    consumerSecret: 'cs_7f744341814cd5819f6f4c7acf8e0e700dd9b893',
    version: 'wc/v3'
  });


const consultaPaisesEnvio = async (agent) => {
    
    try {

        const shippingZones = await WooCommerce.get('shipping/zones');

        console.log(shippingZones);

        let message = "Actualmente hacemos envios a: ";

        for(const zone of shippingZones.data){

            const {id, name} = zone;

            if(id != 0 && shippingZones.data.length-2 == id){
                message = message + name + " y ";
            }
            else if(id != 0 && shippingZones.data.length-1 == id){
                message = message + name + ".";
            }
            else if(id != 0 ){
                message = message + name + ", ";
            }
        }

        agent.add(message);
        
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
}

const listProducts = async (agent) => {

    try {

        const productsList = await WooCommerce.get('products');

        console.log(productsList);

        let message = "En nuestra tienda podrá comprar los siguientes productos: ";

        for(const product of productsList.data){

            const {id, name, price} = product;

            if(id != 0 && productsList.data.length-2 == id){
                message = message + name + " por " + price + "€ y ";
            }
            else if(id != 0 && productsList.data.length-1 == id){
                message = message + name + " por " + price + "€.";
            }
            else if(id != 0 ){
                message = message + name + " por " + price + "€, ";
            }
        }

        agent.add(message);
        
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }

}

const ResName = async (agent) => {


    console.log(agent.parameters);
    console.log(agent.parameters.person);

    const {name} = agent.parameters.person[0];

    console.log(name);

    agent.add(`Buenos dias ${name}, un gusto verle por nuestra tienda.`);

}

const ProductNotEspecific = async (agent) => {


    console.log(agent.parameters);
    console.log(agent.parameters.products);

    try {

        const productsList = await WooCommerce.get('products');

        let message = "Estos son los resultados que he encontrado con tu búsqueda: ";

        for(const product of productsList.data){

            const {name} = product;

            let name2 = name.toLowerCase();

            //console.log(name2);

            let productName = name2.split(' ');
            
            let index = productName.indexOf(agent.parameters.products);

            //console.log(index);

            if(index == 0){
                console.log(name);
                message = message + name + ", ";
            }
        }

        message = message + "¿qué producto deseas?";

        agent.add(message);
        
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }

}


async function defaultFallback(agent){
    try {
        const payload = agent.consoleMessages;
        payload.map((msg) => {
            if (
                msg.platform == 'PLATFORM_UNSPECIFIED' ||
                msg.platform == undefined
            ) {
                if (msg.text) {
                    agent.add(msg.text);
                }
                if (msg.payload) {
                    agent.add(
                        new Payload(
                            'PLATFORM_UNSPECIFIED',
                            msg.payload,
                        ),
                    );
                }
            }
        });
    } catch (err) {
        console.log('Se ha producido un error', err);
        agent.add('Lo siento, ha ocurrido un error de conexión.');
    }
}

module.exports = {
    consultaPaisesEnvio,
    defaultFallback,
    listProducts,
    ResName,
    ProductNotEspecific,
};