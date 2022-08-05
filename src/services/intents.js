'use strict';

const  WooCommerceRestApi = require ('@woocommerce/woocommerce-rest-api').default; 

const { Payload } = require('dialogflow-fulfillment');

const WooCommerce = new WooCommerceRestApi({
    url: 'http://shop-test.1millionbot.com/',
    consumerKey: 'ck_f612670b17d0d8acdc74cee624702250b0ffddce',
    consumerSecret: 'cs_7f744341814cd5819f6f4c7acf8e0e700dd9b893',
    version: 'wc/v3'
  });


const listCountriesShipping = async (agent) => {
    
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

        const sizeList = productsList.data.length;
        let CountProductsList = 0; // Create a counter to count the products in the list

        let message = "En nuestra tienda podrá comprar los siguientes productos: ";

        for(const product of productsList.data){

            const {name, price} = product;

            if(sizeList-2 == CountProductsList){
                message = message + name + " por " + price + "€ y ";
            }
            else if(sizeList-1 == CountProductsList){
                message = message + name + " por " + price + "€.";
            }
            else{
                message = message + name + " por " + price + "€, ";
            }

            CountProductsList++;
        }

        agent.add(message);
        
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }

}

const responseOurName = (agent) => {


    console.log(agent.parameters);
    console.log(agent.parameters.person);

    const {name} = agent.parameters.person[0];

    console.log(name);

    agent.add(`Buenos dias ${name}, un gusto verle por nuestra tienda.`);

}

const searchProduct = async (agent) => {


    console.log(agent.parameters);
    console.log(agent.parameters.products);

    try {

        const productsList = await WooCommerce.get('products');

        let message = "Estos son los resultados que he encontrado con tu búsqueda: ";

        for(const product of productsList.data){

            const {name} = product;

            const productName = name.toLowerCase();
            const requestedProduct = agent.parameters.products.toLowerCase();

            const hasProduct = productName.includes(requestedProduct); // true or false

            if(hasProduct){
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

const createReviewNoReview = async (agent) => { 

    const {name} = agent.parameters.person;
    console.log(name);

    const product = agent.parameters.products;
    let requestedProduct = product.toLowerCase();

    const assessment = agent.parameters.number;

    try {

        const productsList = await WooCommerce.get('products');

        for(const product of productsList.data){

            const {id, name} = product;

            let productName = name.toLowerCase();

            if(productName === requestedProduct){
                
                const data = {
                    product_id: id,
                    review: " ",
                    reviewer: name, 
                    reviewer_email: "email@email.email",
                    rating: assessment
                };

                console.log(data);

                const reviewed = await WooCommerce.post("products/reviews", data);

                console.log(reviewed.data);

            }
        }
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
}

const createReviewWithReview = async (agent) => {

    const {name} = agent.parameters.person;
    console.log(name);

    const reqProduct = agent.parameters.products;
    const requestedProduct = reqProduct.toLowerCase();

    const userAssessment = agent.parameters.number;
    const userReview = agent.parameters.review;

    try {

        const productsList = await WooCommerce.get('products');

        for(const product of productsList.data){

            const {id, name} = product;

            let productName = name.toLowerCase();

            if(productName === requestedProduct){
                
                const data = {
                    product_id: id,
                    review: userReview,
                    reviewer: name, 
                    reviewer_email: "email@email.email",
                    rating: userAssessment
                };

                const reviewedDoneUser = await WooCommerce.post("products/reviews", data);

                console.log(reviewedDoneUser.data);


            }
        }
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }

    agent.add(`Reseña añadida con exito.`);
            

}

const shippingClasses = async (agent) => {

try{

    const shippingClasses = await WooCommerce.get('products/shipping_classes');

    console.log(shippingClasses);

    let message = "Los tipos de envios que tenemos son:";

    for(const shippingClass of shippingClasses.data){
            
            const {name, description} = shippingClass;
    
            if(shippingClasses.data.length-2){
                message = message + name + ": "+ description + " y ";
            }
            else if(shippingClasses.data.length-1){
                message = message + name + ": " + description + ".";
            }
            else if(shippingClasses.data.length){
                message = message + name + ": "+ description + ", ";
            }
    }

    agent.add(message);

    

}catch(e){
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
    listCountriesShipping,
    defaultFallback,
    listProducts,
    responseOurName,
    searchProduct,
    createReviewNoReview,
    shippingClasses,
    createReviewWithReview,
};