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
        agent.add("Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.");
    }
}

const listProducts = async (agent) => {

    try {

        const productsList = await WooCommerce.get('products',{
            orderby: 'rating'
        });


        //const sizeList = productsList.data.length;
        //let CountProductsList = 0; // Create a counter to count the products in the list

        let message = "En nuestra tienda podrá comprar los siguientes productos: ";
        const cards = [];
        let imageUrl = "";
        let text = "";
        let linkProduct;

        for(const product of productsList.data){

            const {name, price, regular_price, description, permalink, stock_quantity, average_rating, images} = product;

            /*if(sizeList-2 == CountProductsList){
                message = message + name + " por " + price + "€ y ";
            }
            else if(sizeList-1 == CountProductsList){
                message = message + name + " por " + price + "€.";
            }
            else{
                message = message + name + " por " + price + "€, ";
            }

            CountProductsList++;*/

            console.log(name);
            console.log(price);
            console.log(regular_price);
            console.log(description);
            console.log(permalink);
            console.log(stock_quantity);
            console.log(average_rating);
            


            let subtitle = `${description}\n Rating: ${average_rating}\n\n <br> Precio: ${price}€`;

            if(images.length > 0){
                imageUrl = images[0].src;
            }
            else{
                imageUrl = "https://gancedo1945.com/fotos/N/IMAGEN-PRODUCTO-NO-ENCONTRADO_N.jpg";
            }

            if(price < regular_price){
                text = "¡Oferta!";
            }
            else{
                text = "Ver";
            }

            if(stock_quantity == 0){
                text = "Agotado";
                linkProduct = "";
            }
            else{
                linkProduct = permalink;
            }

            cards.push(
                {
                    title: name,
                    imageUrl: imageUrl,
                    buttons: [
                      {
                        value: linkProduct,
                        type: "url",
                        text: text
                      }
                    ],
                    subtitle: subtitle
                }
            );

        }

        

        agent.add(message);

        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', {
                cards: cards
            })
        );
        
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

const createUser = async (agent) => {


    try {
        // console.log(agent.parameters);
        // const name = agent.parameters.name.name;
        // const lastName = agent.parameters.lastName.name;
        // const {email, address, city, country, phone} = agent.parameters;

        // console.log(name);
        // console.log(email);
        // console.log(address);
        // console.log(lastName);
        // console.log(city);
        // console.log(country);
        // console.log(phone);

        console.log("hola");
        agent.add("hola");
        

        const form = [];

        form.push(
            {
                headers: {
                "Content-Type": "application/json"
                },
                title: "Crear usuario", 
                inputs: [
                {
                    type: "text",
                    labelText: "",
                    placeholder: "Vicente",
                    name: "Nombre",
                    helperText: "",
                    required: true
                },
                ],
                url: "",
                method: "POST",
                button: {
                text: "Crear"
                }
            
          }
        );

        console.log(form);

        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', {
                form: form
            })
        );
        
        // const clientsList = await WooCommerce.get("customers");
        
        // for(const client of clientsList.data){

        //     const {email} = client;
        //     console.log(email);
        //     if(email == agent.parameters.email){
        //         agent.add("Este usuario ya existe.");
        //         return;
        //     }
        // }

        // const data = {
        //     "email": email,
        //     "first_name": name,
        //     "last_name": lastName,
        //     "username": `${name}.${lastName}`,
        //     "billling": {
        //         "first_name": name,
        //         "last_name": lastName,
        //         "company": "",
        //         "address_1": address,
        //         "address_2": "",
        //         "city": city,
        //         "state": "",
        //         "postcode": "",
        //         "country": country,
        //         "email": email,
        //         "phone": phone
        //     },
        //     "shipping": {
        //         "first_name": name,
        //         "last_name": lastName,
        //         "company": "",
        //         "address_1": address,
        //         "address_2": "",
        //         "city": city,
        //         "state": "",
        //         "postcode": "",
        //         "country": country
        //     }
        // };

        // console.log(data);

        // const newClient = await WooCommerce.post("customers", data); 
        
        // console.log(newClient);
        // agent.add("Usuario creado correctamente.");
        
    } catch (error) {
        console.log(error);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
        
    }

}

const searchProduct = async (agent) => {

    const requestedProduct = agent.parameters.products.toLowerCase();

    try {

        const productsList = await WooCommerce.get('products', {
            search: requestedProduct
        });

        console.log("numero de productos");
        console.log(productsList.data.length);

        let message = "Estos son los resultados que he encontrado con tu búsqueda: ";
        const cards = [];

        let imageUrl = "https://cdn.dribbble.com/users/721524/screenshots/4117132/untitled-1-_1_.png";

        for(const product of productsList.data){

            const {name, permalink, description, price, average_rating, images} = product;
             
            let subtitle = `${description}\n Rating: ${average_rating}\n\n <br> Precio: ${price}€`;

            if(images.length > 0){
                imageUrl = images[0].src;
            }

            cards.push(
                {
                    title: name,
                    imageUrl: imageUrl,
                    buttons: [
                      {
                        value: permalink,
                        type: "url",
                        text: "Ver"
                      }
                    ],
                    subtitle: subtitle
                }
            );

        }

        message = message + "¿qué producto deseas?";

        agent.add(message);

        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', {
                cards: cards
            })
        );

        console.log(cards);
        
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

const showStatusOrder = async (agent) => {

    const {name} = agent.parameters.person;
    console.log(name);
    const requestedName = name.toLowerCase();

    //El usuario previamente se ha identificado

    try {

        const ordersList = await WooCommerce.get('orders');

        for(const order of ordersList.data){

            const {id, status, billing, line_items } = order;

            console.log(id);
            console.log(status);
            console.log(requestedName);
            console.log(billing);
            console.log(line_items);

            const {first_name} = billing;

            let userNameList = first_name.toLowerCase();

            if(requestedName === userNameList){

                let numberItemsList = 0;

                let message = `${name} tus productos: `;

                for(const product of line_items){

                    const {name} = product;

                    if(numberItemsList === line_items.length-2){
                        message = message + name + " y ";
                    }
                    else if(numberItemsList === line_items.length-1){
                        message = message + name + ".";
                    }
                    else{
                        message = message + name + ", ";
                    }

                    numberItemsList++;

                }

                message = message + `Se encuentran en un estado de: ${status}`;

                
                agent.add(message);
            }
        }
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
}

const deleteOrder = async (agent) => {

    const {name} = agent.parameters.person;
    console.log(name);
    const requestedName = name.toLowerCase();

    //El usuario previamente se ha identificado

    try {

        const ordersList = await WooCommerce.get('orders');

        for(const order of ordersList.data){

            const {id, status ,billing, line_items } = order;

            console.log(id);
            console.log(requestedName);
            console.log(billing);
            console.log(line_items);

            const {first_name} = billing;

            let userNameList = first_name.toLowerCase();

            if(requestedName === userNameList){

                console.log(status)

                if(status === "pending"){
                    const productDelete = await WooCommerce.delete(`orders/${id}`, {force: true});
                    console.log(productDelete);
                    agent.add(`Se ha eliminado tu pedido con exito.`);
                }
                else{
                    agent.add(`No se puede eliminar un pedido que no esté en estado de pendiente de pago.`);
                }
            }
        }
    } catch (e) {
        console.log("error", e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
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
    showStatusOrder,
    deleteOrder,
    createUser,
};