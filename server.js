require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Shopify = require('shopify-api-node');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
//const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
  HOST_NINJAVAN,
  CLIENT_ID,
  CLIENT_SECRET
} = process.env;

const shopify = new Shopify({
  shopName: 'isobar-demo',
  apiKey: '78da6c5e6d51c9e3ee7e797132fb53fd',
  password: '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'
});

global.accessTokenShopify = '';
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_fulfillments', 'write_fulfillments', 'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders', 'read_shipping', 'write_shipping', 'read_orders', 'write_orders', 'read_products', 'write_products', 'write_merchant_managed_fulfillment_orders',
        'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders', 'read_third_party_fulfillment_orders', 'write_third_party_fulfillment_orders'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        accessTokenShopify = accessToken;
        const registration = await registerWebhook({
          address: `${HOST}/webhooks/products/create`,
          topic: 'PRODUCTS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October20
        });

        if (registration.success) {
          console.log('Successfully registered webhook product!');
        } else {
          console.log('Failed to register webhook product', registration.result);
          console.log(registration.result.data.webhookSubscriptionCreate.userErrors);
        }

        const registration2 = await registerWebhook({
          address: `${HOST}/webhooks/fulfillments/create`,
          topic: 'FULFILLMENTS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October20
        });

        if (registration2.success) {
          console.log('Successfully registered webhook fullfillment!');
        } else {
          console.log('Failed to register webhook fullfillment', registration2.result);
          console.log(registration2.result.data.webhookSubscriptionCreate.userErrors);
        }

        const registration3 = await registerWebhook({
          address: `${HOST}/webhooks/orders/create`,
          topic: 'ORDERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October20
        });

        if (registration3.success) {
          console.log('Successfully registered webhook order create!');
        } else {
          console.log('Failed to register webhook order create', registration3.result);
          console.log(registration3.result.data.webhookSubscriptionCreate.userErrors);
        }

        console.log('afterAuth accessToken:' + accessToken);
        console.log('HOST:' + `${HOST}/webhooks/products/create`);
        //await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect('/');
      }
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post('/webhooks/products/create', webhook, (ctx) => {
    console.log('received webhook: ', ctx.state.webhook);
  });

  router.post('/webhooks/orders/create', webhook,  (ctx) => {
    //console.log('received webhook: ', ctx.state.webhook);
    //const data = JSON.parse(ctx.state.webhook);

    //console.log('order ID: ', ctx.state.webhook.payload.id);
    const orderId = ctx.state.webhook.payload.id;
    console.log('FETCH assigned_fulfillment_orders');
    const url = 'https://78da6c5e6d51c9e3ee7e797132fb53fd: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@isobar-demo.myshopify.com/admin/api/2020-10/assigned_fulfillment_orders.json';
    fetch(url, { method: "GET", })
        .then(response => response.json()).then(json => {
          //console.log(json.fulfillment_orders);
          const fulfillment_orders = json.fulfillment_orders;

      /*const shopify = new Shopify({
        shopName: 'isobar-demo',
        accessToken: accessTokenShopify
      });*/
     // console.log('Token:' + accessTokenShopify);

      /*shopify.order
          .list({ limit: 1 })
          .then((orders) => console.log(orders))
          .catch((err) => console.error(err));*/

          fulfillment_orders.forEach(fulfillment => {
              if(fulfillment.order_id === orderId) {
                console.log('CREATE REQUEST FULLFILLMENT:' + fulfillment.id);

               /* (async () => {
                  const dataFullFill = await shopify.fulfillmentRequest
                      .create(fulfillment.id,{ message: 'Fulfill this ASAP please' });

                  console.log('DATA FULLFILL');
                  console.log(dataFullFill);
                    console.log('CALL GET ACCESS TOKEN ');
                    const tokenBear = await generateOAuthAccessToken();
                    console.log('CALL CREATE ORDER:' + tokenBear.access_token);
                    const result = await createOrder(tokenBear.access_token, dataFullFill);

                     console.log(result);

                })().catch(console.error);*/

                /*shopify.fulfillmentRequest
                    .create(fulfillment.id,{ message: 'Fulfill this ASAP please' })
                    .then((result) => {
                      console.log(result);
                    })
                    .catch((err) => console.error(err));*/
                /*shopify.order
                    .list({ limit: 1 })
                    .then((orders) => console.log(orders))
                    .catch((err) => console.error(err));*/

              }


          });
    })
  });

  router.post('/webhooks/fulfillments/create', webhook, async (ctx) => {
    /*console.log('received webhook: ', ctx.state.webhook);
    const dataFullFill = ctx.state.webhook;
    console.log(dataFullFill);
    console.log('CALL GET ACCESS TOKEN ');
    const tokenBear = await generateOAuthAccessToken();
    console.log('CALL CREATE ORDER:' + tokenBear.access_token);
    const result = await createOrder(tokenBear.access_token, dataFullFill);

    console.log(result.tracking_number);
    console.log('MAKE FULLFILLED ');

    const orderID = dataFullFill.payload.order_id;
    const paras = {
      "location_id": dataFullFill.payload.location_id,
      "tracking_number": result.tracking_number,
      "tracking_urls": [
        "https://shipping.xyz/track.php?num=" + result.tracking_number
      ],
      "notify_customer": true
    };
    console.log('ORDER_ID:'  + orderID);
    console.log(paras);
    shopify.fulfillment
        .create(orderID, paras)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.error(err));*/
  });

  router.post('/ninjavan/create', create);
  async function create(ctx) {
    console.log('CALL GET ACCESS TOKEN ');
    const tokenBear = await generateOAuthAccessToken();
    console.log('CALL CREATE ORDER:' + tokenBear.access_token);
    const result = await createOrder(tokenBear.access_token);
    console.log(result);
    ctx.response.status = 200;
    ctx.response.body = result;

  }

  async function generateOAuthAccessToken(){
    const body = {
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "grant_type": "client_credentials"
    };

    const response = await fetch(`${HOST_NINJAVAN}/VN/2.0/oauth/access_token`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    });
    console.log(response);
    const json = await response.json();



    return json;
  }

  async function createOrder(token, dataFullFill){
    const payload = dataFullFill.payload;
    const body = {
      "service_type": "Parcel",
      "service_level": "Standard",
      "requested_tracking_number": "1234-56789",
      "reference": {
        "merchant_order_number": "SHIP" + payload.order_id
      },
      "from": {
        "name": payload.destination.first_name,
        "phone_number": payload.destination.phone,
        "email": payload.email,
        "address": {
          "address1": payload.destination.address1,
          "address2": "",
          "area": "Taman Sri Delima",
          "city": payload.destination.city,
          "state": payload.destination.province,
          "address_type": "office",
          "country": payload.destination.country_code,
          "postcode": payload.destination.zip
        }
      },
      "to": {
        "name": payload.destination.first_name,
        "phone_number": payload.destination.phone,
        "email": payload.email,
        "address": {
          "address1": payload.destination.address1,
          "address2": "Jalan Medan Merdeka Selatan No. 10",
          "kelurahan": "Kelurahan Gambir",
          "kecamatan": "Kecamatan Gambir",
          "city": payload.destination.city,
          "province": payload.destination.province,
          "country": payload.destination.country_code,
          "postcode": payload.destination.zip
        }
      },
      "parcel_job": {
        "is_pickup_required": true,
        "pickup_address_id": 98989012,
        "pickup_service_type": "Scheduled",
        "pickup_service_level": "Premium",
        "pickup_date": "2018-01-18T00:00:00.000Z",
        "pickup_timeslot": {
          "start_time": "09:00",
          "end_time": "12:00",
          "timezone": "Asia/Singapore"
        },
        "pickup_instructions": "Pickup with care!",
        "delivery_instructions": "If recipient is not around, leave parcel in power riser.",
        "delivery_start_date": "2018-01-19",
        "delivery_timeslot": {
          "start_time": "09:00",
          "end_time": "22:00",
          "timezone": "Asia/Singapore"
        },
        "items": [
          {
            "item_description": "item description 1",
            "quantity": 1,
            "is_dangerous_good": false
          }
        ]
      }
    };

    const response = await fetch(`${HOST_NINJAVAN}/VN/4.1/orders`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const json = await response.json();

    console.log(json);

    return json;
  }

  router.post('/ninjavan/received', (ctx) => {
    console.log('received ninjavan');
    ctx.respond = 'OK';
    ctx.res.statusCode = 200;
  });

  server.use(graphQLProxy({ version: ApiVersion.October20 }));

  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
