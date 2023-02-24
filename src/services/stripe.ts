import Stripe from 'stripe'
import { version } from '../../package.json' //Pegar a version do package

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY, //primeiro paramentro chave da API
    {
        apiVersion: '2020-08-27', //Segundo paramento version da api
        appInfo: { // informações para saber quem ta fazendo as requisições nao muito importante
            name: 'vlnews',
            version,
        },
    }
)