#!/usr/bin/env node

'use strict';

const Hapi = require('@hapi/hapi');
const NearSocial = require('./social');

require('dotenv').config()

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path: '/near_social',
        handler: async (request) => {
            let processed_events = 0;
            if (request.payload.secret === process.env.API_SECRET) {
                for (let data of request.payload.events) {
                    const app_token = process.env[`key_${data.account_id.replace(".", "_")}`];
                    if (app_token
                        && data.status === "SUCCESS"
                        && data.event.standard === "near_social"
                        && data.event.event === "post_message") {

                        for (let status of data.event.data) {
                            await NearSocial.generateApiPostRequest(
                                "statuses",
                                app_token,
                                {
                                    status: status.message
                                });
                            processed_events++;
                        }
                    }
                }
            }
            return `Events processed: ${processed_events}`;
        },
    });

    await server.start();
    console.log('Near Social event catcher is running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();