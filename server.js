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
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products', 'read_fulfillments', 'write_fulfillments', 'read_orders', 'write_orders'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

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

  router.post('/webhooks/orders/create', webhook, (ctx) => {
    //console.log('received webhook: ', ctx.state.webhook);
    //const data = JSON.parse(ctx.state.webhook);

    //console.log('order ID: ', ctx.state.webhook.payload.id);
    const orderId = ctx.state.webhook.payload.id;
    console.log('FETCH assigned_fulfillment_orders');
    const url = 'https://78da6c5e6d51c9e3ee7e797132fb53fd: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@isobar-demo.myshopify.com/admin/api/2020-10/assigned_fulfillment_orders.json';
    fetch(url, { method: "GET", })
        .then(response => response.json()).then(json => {
          console.log(json.fulfillment_orders);
          const fulfillment_orders = json.fulfillment_orders;
     /* const shopify = new Shopify({
        shopName: 'isobar-demo',
        apiKey: '78da6c5e6d51c9e3ee7e797132fb53fd',
        password: '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'
      });*/
      const shopify = new Shopify({
        shopName: 'isobar-demo',
        accessToken: '18403cca44c691d0febf13a1f944721f'
      });
          fulfillment_orders.forEach(fulfillment => {
              if(fulfillment.order_id === orderId) {
                console.log('CREATE REQUEST FULLFILLMENT');
                shopify.fulfillmentRequest
                    .create(fulfillment_order_id,{ message: 'Fulfill this ASAP please' })
                    .then((result) => console.log(result))
                    .catch((err) => console.error(err));
              }


          });
    })
  });

  router.post('/webhooks/fulfillments/create', webhook, (ctx) => {
    console.log('received webhook: ', ctx.state.webhook);
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
