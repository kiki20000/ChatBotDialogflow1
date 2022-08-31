'use strict';

const Prestashop = require('prestashop-api-nodejs');
const axios = require('axios');

const { Payload } = require('dialogflow-fulfillment');

const urlAPI = 'http://F3UPWT26YG2538A8YRNMKXEL164JWGLV@localhost/prestashop_tienda/api/';

const options = {
    url: 'localhost/prestashop_tienda',
    key: 'F3UPWT26YG2538A8YRNMKXEL164JWGLV',
};

//const client = new Prestashop(options);


const listProducts = async (agent) => {
    try {

        //He añadido un limite de resultados (5) para que no se haga muy largo el mensaje
        const productsList = await axios.get(`${urlAPI}/products?display=[id,name,price,description_short]&sort=[name_ASC]&limit=5&output_format=JSON`);
        
        const cards = [];

        for(const product of productsList.data.products){

            const {id,name, price,description_short, link_rewrite} = product;
            const productPrice = parseFloat(price, 10).toFixed(2);

            // const imgProduct = await axios.get(`${urlAPI}/images/products/${id}&output_format=JSON`);
            // console.log(imgProduct.data);
        
            cards.push({
                title: name,
                subtitle: `${description_short} Precio: ${productPrice}€`,
                imageUrl: ``,
                buttons: [
                    {
                        text: 'Ver producto',
                        type: 'url',
                        value: `http://localhost/prestashop_tienda/${id}-${link_rewrite}.html`,
                    },
                ],  
            });
        }

        // console.log(message);

        agent.add("Estos son los productos que tenemos actualmente: ");
        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', {
                cards: cards,
            })
        );

    } catch (e) {
        console.log('error', e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
};

const listZonesShipping = async (agent) => {
    try {
        const zonesShippingList = await axios.get(`${urlAPI}/zones?display=[id,name,active]&filter[active]=1&output_format=JSON`);

        let message = 'Estas son las zonas a las que enviamos actualmente: ';

        console.log(zonesShippingList.data.zones);

        let counterZonesShipping = 0;

        //obtener el nombre de las zonas
        zonesShippingList.data.zones.forEach(zone => {

            if(counterZonesShipping == zonesShippingList.data.zones.length - 2){
                message += `${zone.name} y `;
            }else if(counterZonesShipping == zonesShippingList.data.zones.length - 1){
                message += `${zone.name}.`;
            }else{
                message += `${zone.name}, `;
            }
            counterZonesShipping++;
        } );

        agent.add(message);
    } catch (e) {
        console.log('error', e);
        agent.add('Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.');
    }
};

/*const createUsers = async (agent) => {
    try {
        
        let usersList = await axios.get(`${urlAPI}/customers/?schema=blank&output_format=JSON`);
        console.log(usersList.data);

        console.log(usersList.data.customer.firstname);

        //usersList.data.customer.firstname = 'Juan';


        //añadir un nuevo usuario
        let newUser = await axios.post(`${urlAPI}/customers`, {
            customer: {
                id: '40',
                id_default_group: '3',
                id_lang: '1',
                newsletter_date_add: '0000-00-00 00:00:00',
                ip_registration_newsletter: '',
                last_passwd_gen: '2022-08-22 06:13:05',
                secure_key: '65ac68f8427fdb51cd7f6352506e63cd',
                deleted: '0',
                passwd: '$2y$10$tEuHi7qZrMysECmjM1UDb.1PdRM5dC0ggWHmHH0LsdWnP99yZESl6',
                lastname: 'VIC',
                firstname: 'VICENTE',
                email: 'vic@ente.can',
                id_gender: '1',
                birthday: '0000-00-00',
                newsletter: '0',
                optin: '0',
                website: '',
                company: '',
                siret: '',
                ape: '',
                outstanding_allow_amount: '0.000000',
                show_public_prices: '0',
                id_risk: '0',
                max_payment_days: '0',
                active: '0',
                note: '',
                is_guest: '0',
                id_shop: '1',
                id_shop_group: '1',
                date_add: '2022-08-22 12:13:05',
                date_upd: '2022-08-22 12:13:05',
                reset_password_token: '',
                reset_password_validity: '0000-00-00 00:00:00',
                associations: { 
                    groups: [
                        {
                            id: "3"
                        }
                    ],
                },
            },
        });

        // console.log(usersList.data.customers.firstname);


        agent.add("holi");
    } catch (e) {
        console.log('error', e);
        agent.add('Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.');
    }
};*/

const typesShipping = async (agent) => {
    try {
        
        let typesShippingList = await axios.get(`${urlAPI}/carriers?display=[id,name,deleted]&filter[deleted]=0&output_format=JSON`);
        
        let message = 'Estos son los tipos de envio que realizamos actualmente: ';

        let counterZonesShipping = 0;

        //obtener el nombre de las zonas
        for(const typeShipping of typesShippingList.data.carriers){
            const {name} = typeShipping;
            if(counterZonesShipping == typesShippingList.data.carriers.length - 2){
                message += `${name} y `;
            }else if(counterZonesShipping == typesShippingList.data.carriers.length - 1){
                message += `${name}.`;
            }else{
                message += `${name}, `;
            }
            counterZonesShipping++;
        }
        agent.add(message);

    } catch (e) {
        console.log('error', e);
        agent.add('Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.');
    }
};

const responseOurName = (agent) => {
    console.log(agent.parameters);
    console.log(agent.parameters.person);

    const { name } = agent.parameters.person[0];

    console.log(name);

    agent.add(`Buenos días ${name}, un gusto verle por nuestra tienda. ¿En qué puedo ayudarte?`);
};

const searchProduct = async (agent) => {
    
    const { products } = agent.parameters;
  
    try {

        const searchProductsList = await axios.get(`${urlAPI}/products?display=[id,name,price,description_short]&filter[name]=%[${products}]%&output_format=JSON`);

        let message = 'Estos son los productos que puedes encontrar en nuestra tienda con ese nombre: ';
        const cards = [];

        for (const product of searchProductsList.data.products) {
            const {id,name, price,description_short, link_rewrite} = product;
            const productPrice = parseFloat(price, 10).toFixed(2);

            // const imgProduct = await axios.get(`${urlAPI}/images/products/${id}&output_format=JSON`);
            // console.log(imgProduct.data);
        
            cards.push({
                title: name,
                subtitle: `${description_short} Precio: ${productPrice}€`,
                imageUrl: ``,
                buttons: [
                    {
                        text: 'Ver producto',
                        type: 'url',
                        value: `http://localhost/prestashop_tienda/${id}-${link_rewrite}.html`,
                    },
                ],  
            });
        }

        agent.add(message);
        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', {
                cards: cards,
            })
        );

    } catch (e) {
        console.log('error', e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
};

const deleteOrder = async (agent) => {
    const { name } = agent.parameters.person;
    console.log(name);
    const requestedName = name.toLowerCase();

    let idClient=0;

    //El usuario previamente se ha identificado

    try {

        const customersList = await axios.get(`${urlAPI}/customers?display=[id,firstname]&output_format=JSON`);

        console.log(customersList.data.customers);

        //Aqui se busca el id del cliente
        for(const client of customersList.data.customers){
            if(client.firstname.toLowerCase() == requestedName){
                idClient = client.id;
            }
        }


        const searchProductsList = await axios.get(`${urlAPI}/orders/?display=full&filter[id_customer]=${idClient}&output_format=JSON`);

        console.log(searchProductsList.data.orders);

        let numberOrder = 0;

        if(searchProductsList.data.orders.length === 0){
            agent.add(`No tienes ninguna orden pendiente.`);
        }else{
            for(const order of searchProductsList.data.orders){

                if(numberOrder === searchProductsList.data.orders.length - 1){
                    const deleteOrder = await axios.delete(`${urlAPI}/orders/${order.id}`);
                    agent.add(`La orden ${order.id} ha sido eliminada.`);
                }

                numberOrder++;
            }

        }

    } catch (e) {
        console.log('error', e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
};

module.exports = {
    listProducts,
    listZonesShipping,
    //createUsers,
    typesShipping,
    responseOurName,
    searchProduct,
    deleteOrder,
};
