require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const router = require('@koa/router')();
const koaBody = require('koa-body');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
    const server = new Koa();
    server.use(session({ secure: true, sameSite: 'none' }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(koaBody());

    router.get('/app/ninjavan', view_ninjavan)
        .post('/app/ninjavan', create_ninjavan);

    server.use(router.routes());

    async function view_ninjavan(ctx) {
        ctx.respond = 'Hello ban con2';
    }

    async function create_ninjavan(ctx) {
        ctx.respond = 'Hello ban con';
    }

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'write_products'],
            afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                });
                console.log('afterAuth accessToken:' + accessToken);
                ctx.redirect('/');
            },
        }),
    );
    server.use(graphQLProxy({version: ApiVersion.October20}));
    server.use(verifyRequest());

    server.use(async (ctx) => {
        console.log('REQUEST to');
        console.log(ctx.req);
        await handle(ctx.req, ctx.res);
        ctx.respond = 'Hello ban con';
        ctx.res.statusCode = 200;
        return true;
    });
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
