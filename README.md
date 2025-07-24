## Article AI Full stack app

### How to setup
There are few different to build this app. Need to create account on them to get required token and other credential. All of them has free package.
The env variables structure is shared in example.env file.

1. [Neon](https://neon.tech/): Neon is used for the postgres database. It has 500mb free tire.
2. [OpenRouterAi](https://openrouter.ai/docs/quickstart): OpenRouterAi is used to summarize, ai enable search features. It has some free credit.
3. [Upstash](https://upstash.com/): Upstash and [qstash](https://qstash.upstash.io) is used to rate limit api call.

After creating account in the above services, need to generate an auth secret key. 
`openssl rand -base64 32`

After this step, we will have all the secret env var and need to create .env.local file from the example.env file.

Next need to run this command.
`npm i` to install packages. 
`npm run db:generate` to generate db migration and
`npm run db:migrate` to push the migrate files.
`npm run dev` to run it locally.

For vercel deployments, need to set this env var in the project setup.
