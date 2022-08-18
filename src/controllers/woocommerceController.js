'use strict';

const { existUser, createUserWoo } = require('../services/woocommerce');

const addUserWoo = async (req, res) => {

    const formData = JSON.parse(req.body);

    console.log(formData);
    console.log(formData.name);

    const hasUser = existUser(formData.email);

    console.log(hasUser);

    if(hasUser == true){
        return res.send({
            message:[{text: 'Este usuario ya existe.'}],
        });
    } else {

        const data = {
            "email": formData.email,
            "first_name": formData.name,
            "last_name": formData.lastname,
            "username": `${formData.name}.${formData.lastname}`,
            "billling": {
                "first_name": formData.name,
                "last_name": formData.lastname,
                "company": "",
                "address_1": formData.address,
                "address_2": "",
                "city": formData.city,
                "state": "",
                "postcode": "",
                "country": formData.country,
                "email": formData.email,
                "phone": formData.phone
            },
            "shipping": {
                "first_name": formData.name,
                "last_name": formData.lastName,
                "company": "",
                "address_1": formData.address,
                "address_2": "",
                "city": formData.city,
                "state": "",
                "postcode": "",
                "country": formData.country
            }
        };

        console.log(data);
 
        const newUser = createUserWoo(data);

        if(newUser != null){
            return res.send({
                message:[{text: 'usuario creado con exito.'}],
            });
        } else {
            return res.send({
                message:[{text: 'Ha ocurrido un error al buscar el texto. Lo resolveremos lo antes posible.'}],
            });
        }

    }
};

module.exports = {
    addUserWoo,
};