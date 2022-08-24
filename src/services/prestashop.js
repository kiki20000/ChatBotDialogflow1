'use strict';

const Prestashop = require('prestashop-api-nodejs');
const axios = require('axios');

const urlAPI = 'http://F3UPWT26YG2538A8YRNMKXEL164JWGLV@localhost/prestashop_tienda/api/';

const options = {
    url: 'localhost/prestashop_tienda',
    key: 'F3UPWT26YG2538A8YRNMKXEL164JWGLV',
};

const client = new Prestashop(options);

const listProducts = async (agent) => {
    try {

        const products = await axios.get(`${urlAPI}/products?output_format=JSON`);

        console.log(products.data);

        console.log(products.data.id);

        // const productsList = await client.get({
        //     resource: 'employees',
        //     output_format: 'JSON',
        //     ws_key: 'F3UPWT26YG2538A8YRNMKXEL164JWGLV',
        // });

        // console.log({productsList});

        agent.add('Lista de productos:');

        //const sizeList = productsList.data.length;
        //let CountProductsList = 0; // Create a counter to count the products in the list

        // let message = 'En nuestra tienda podrá comprar los siguientes productos: ';
        // const cards = [];
        // let imageUrl = '';
        // let text = '';
        // let linkProduct;

        // for (const product of productsList.data) {
        //     const { name, price, regular_price, description, permalink, stock_quantity, average_rating, images } =
        //         product;

        //     if(sizeList-2 == CountProductsList){
        //         message = message + name + " por " + price + "€ y ";
        //     }
        //     else if(sizeList-1 == CountProductsList){
        //         message = message + name + " por " + price + "€.";
        //     }
        //     else{
        //         message = message + name + " por " + price + "€, ";
        //     }

        //     CountProductsList++;

        //     console.log(name);
        //     // console.log(price);
        //     // console.log(regular_price);
        //     // console.log(description);
        //     // console.log(permalink);
        //     // console.log(stock_quantity);
        //     console.log(average_rating);

        //     let subtitle = `${description}\n Rating: ${average_rating}\n\n <br> Precio: ${price}€`;

        //     if (images.length > 0) {
        //         imageUrl = images[0].src;
        //     } else {
        //         imageUrl = 'https://gancedo1945.com/fotos/N/IMAGEN-PRODUCTO-NO-ENCONTRADO_N.jpg';
        //     }

        //     if (price < regular_price) {
        //         text = '¡Oferta!';
        //     } else {
        //         text = 'Ver';
        //     }

        //     if (stock_quantity == 0) {
        //         text = 'Agotado';
        //         linkProduct = '';
        //     } else {
        //         linkProduct = permalink;
        //     }

        //     cards.push({
        //         title: name,
        //         imageUrl: imageUrl,
        //         buttons: [
        //             {
        //                 value: linkProduct,
        //                 type: 'url',
        //                 text: text,
        //             },
        //         ],
        //         subtitle: subtitle,
        //     });
        // }

        // agent.add(message);

        // agent.add(
        //     new Payload('PLATFORM_UNSPECIFIED', {
        //         cards: cards,
        //     })
        // );
    } catch (e) {
        console.log('error', e);
        agent.add(`Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.`);
    }
};

module.exports = {
    listProducts,
};
