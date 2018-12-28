/*****************************************************************************
 BUILDING REACT-NODE- SHOPIFY APP WITH KOA (WORKSHOP)
*****************************************************************************/
import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import createShopifyAuth, {createVerifyRequest} from '@shopify/koa-shopify-auth';
import renderReactApp from './render-react-app';
import webpack from 'koa-webpack';


dotenv.config();

const app = new Koa();
app.use(session(app));

var Router = require('koa-router');
var router = Router({prefix: '/productListing'});

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY} = process.env;

app.use(
    createShopifyAuth({
        //shopify api set up
        apiKey: SHOPIFY_API_KEY,
        secret : SHOPIFY_API_SECRET_KEY,
        //permissions
        scopes: ['write_products'],
        //custom logic after authentication is completed
        afterAuth(ctx) {
            const {shop, accessToken} = ctx.session;

            console.log('We did it!', shop, accessToken);

            ctx.redirect('/');
        }
    })
)
console.log(SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY);

app.keys = [SHOPIFY_API_SECRET_KEY];

app.use(createVerifyRequest());

app.use(renderReactApp);



app.use(webpack());

export default app;
























/*****************************************************************************
 GENERAL CONNECTION TO SHOPIFY API WITH EXPRESS 
*****************************************************************************/

 /*
const dotenv = require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET_KEY;
const scopes = 'read_products';

const forwardingAddres = process.env.NGROK_FORWARD_URL;

const app = express();
const port = 3000 || process.env.PORT;


var shopifyAPI = require('shopify-node-api');
 
 
var Shopify = new shopifyAPI({
  shop: process.env.SHOPIFY_API_SHOP, // MYSHOP.myshopify.com
  shopify_api_key: apiKey, // Your API key
  access_token: process.env.SHOPIFY_API_PASSWORD // Your API password
});

app.get('/', (req,res) => {
    res.send('Hello World!');
});


//install route, sends merchant to shopify authorization promt to install or reject request.
app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    console.log(shop);
    if(shop) {
        const state = nonce();
        const redirectUri = forwardingAddres + '/shopify/callback';
        const installUrl = 'https://' + shop + 
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
            console.log(installUrl);
            res.cookie('state', state);
            res.redirect(installUrl)
    } else {
        return res.status(400).send('Missing Shop Parameter. Please add ?shop=your-development-shop.myshopify.com to request.');
    }
});



app.get('/shopify/callback', (req, res) => {
    const {shop, hmac, code, state} = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if(state !== stateCookie) return res.status(403).send('Request origin cannot be verified.')
    
    if (shop && hmac && code) {
        //Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];

        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
                'utf-8'
        );

        let hashEquals = false;

        try {
            //timingSageEqual will prevent any timing attacks. Args must be buffers.
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
        } catch (error) {
            //return error if buffers are not the same
            hashEquals = false;
        }

        if(!hashEquals) 
            return res.status(400).send('HMAC Validation failed.')

        
        //Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        request.post(accessTokenRequestUrl, {json : accessTokenPayload})
            .then( (accesstokenRes) => {

                //Use access token to make API call to 'shop' endpoint

                const accessToken = accesstokenRes.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token' : accessToken
                };
        
                request.get(shopRequestUrl, {headers: shopRequestHeaders})
                    .then(shopRes => res.end(shopRes))
                    .catch((e)=> res.status(error.statusCode).send(error.error.error_description))


            }).catch((err) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
        
    } else { 
        res.status(400).send('Required parameters missing') 
    }

})
app.listen(port, ()=> console.log(`Listening on port ${port}`));
*/