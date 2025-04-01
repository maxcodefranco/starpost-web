require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    starpost: {
        output: {
            mode: 'single',
            target: './src/services/generated/api.ts',
            schemas: './src/services/generated/schemas',
            client: 'react-query', // Use react-query for client-side data fetching
            override: {
                mutator: {
                    path: './src/services/apiClient.ts', // Custom API client for Next.js
                    name: 'apiClientFunction', // Use the named function
                },
            },
        },
        input: {
            target: `${process.env.NEXT_PUBLIC_API_HOST}/api/swagger.json`,
        },
    },
};
