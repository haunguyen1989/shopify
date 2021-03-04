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

var bodyParser = require('koa-bodyparser');


const topic = require('./services/webhook');
const installer = require('./services/init');

//const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST
} = process.env;



global.accessTokenShopify = '';
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(bodyParser());

  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      accessMode: 'offline',
      scopes: ['read_fulfillments', 'write_fulfillments', 'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders', 'read_shipping', 'write_shipping', 'read_orders', 'write_orders', 'read_products', 'write_products', 'write_merchant_managed_fulfillment_orders',
        'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders', 'read_third_party_fulfillment_orders', 'write_third_party_fulfillment_orders', 'write_script_tags', 'read_script_tags'],
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

        const registration4 = await registerWebhook({
          address: `${HOST}/webhooks/app/uninstalled`,
          topic: 'APP_UNINSTALLED',
          accessToken,
          shop,
          apiVersion: ApiVersion.October20
        });
        if (registration4.success) {
          console.log('Successfully registered webhook APP_UNINSTALLED!');
        } else {
          console.log('Failed to register webhook APP_UNINSTALLED', registration4.result);
          console.log(registration4.result.data.webhookSubscriptionCreate.userErrors);
        }

        console.log('afterAuth accessToken:' + accessToken);
        console.log('HOST:' + `${HOST}/webhooks/products/create`);

        await installer.initialize(shop, accessToken);

        global.shopify = new Shopify({
          shopName: 'isobar-demo',
          accessToken
        });
       /* shopify.order
            .list({ limit: 5 })
            .then((orders) => console.log(orders))
            .catch((err) => console.error(err));*/
        //await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect('/');
      }
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  const responseResult = (ctx, res) => {
    ctx.response.status = 200;
    ctx.response.body = res;
  };
  router.post('/webhooks/products/create', webhook, (ctx) => {
    console.log('received webhook: ', ctx.state.webhook);
  });

  router.post('/webhooks/app/uninstalled', webhook, async (ctx) => {
    console.log('received app/uninstalled');

    const res = await topic.process(ctx.state.webhook.topic, ctx.state.webhook.payload);
  });

  router.post('/webhooks/orders/create', webhook, async (ctx) => {
    /*if(!ctx.state.webhook.payload.fulfillment_status) {
      console.log('received webhooks/orders/create');
      console.log(ctx.state.webhook.payload);
      const res = await topic.process(ctx.state.webhook.topic, ctx.state.webhook.payload);
      console.log('result:');
      console.log(res);
      responseResult(ctx, res);
    }
    else {
      responseResult(ctx, false);
    }*/

  });

  router.post('/webhooks/fulfillments/create', webhook, async (ctx) => {
    /*if(ctx.state.webhook.payload.status === 'pending') {
      console.log('received webhooks/fulfillments/create');
      console.log(ctx.state.webhook.payload);
      const res = await topic.process(ctx.state.webhook.topic, ctx.state.webhook.payload);
      console.log('result:');
      console.log(res);
      responseResult(ctx, res);
    }
    else {
      responseResult(ctx, false);
    }*/
  });

  router.post('/ninjavan/received', async ctx => {
    console.log('received ninjavan');
    console.log(ctx.request.body.rate);
    let rate = {
      "rates": [
        {
          "service_name": "Giao hàng nhanh",
          "service_code": "Express",
          "total_price": "5000",
          "description": "This is the fastest option by far",
          "currency": "USD",
          "min_delivery_date": "2021-01-05 14:48:45 -0400",
          "max_delivery_date": "2021-01-07 14:48:45 -0400"
        },
        {
          "service_name": "Giao hàng tiêu chuẩn",
          "service_code": "Standard",
          "total_price": "1000",
          "currency": "USD",
          "min_delivery_date": "2021-01-05 14:48:45 -0400",
          "max_delivery_date": "2021-01-07 14:48:45 -0400"
        },
        {
          "service_name": "Giao ngày mai",
          "service_code": "Nextday",
          "total_price": "1500",
          "currency": "USD",
          "min_delivery_date": "2021-01-04 14:48:45 -0400",
          "max_delivery_date": "2021-01-05 14:48:45 -0400"
        },
        {
          "service_name": "Giao trong ngày",
          "service_code": "Sameday",
          "total_price": "2000",
          "currency": "USD",
          "min_delivery_date": "2021-01-04 14:48:45 -0400",
          "max_delivery_date": "2021-01-04 14:48:45 -0400"
        }
      ]
    };
    const shippingAddress = ctx.request.body.rate.destination;

    ctx.response.status = 200;
    ctx.response.body = rate;
    //return rate;
  });


  router.post('/test/received', async (ctx) => {
    let payload = {
      admin_graphql_api_id: 'gid://shopify/Order/3158470394033'
    };
    const res = await topic.process('ORDERS_CREATE', payload);
    ctx.response.status = 200;
    ctx.response.body = {data: res};

  });

  router.post('/carrier/received', async (ctx) => {
    console.log('received carrier/received');
    const res = {
      price: 100
    };
    ctx.response.status = 200;
    ctx.response.body = {data: res};

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
