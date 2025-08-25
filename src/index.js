export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        try {
            switch (path) {
                case '/':
                    return new Response('2025-08-25', {
                        headers: { 'Content-Type': 'text/plain' },
                    });

                case '/kv-test':
                    return handleKVTest(request, env);

                case '/kv/set':
                    return handleKVSet(request, env);

                case '/kv/get':
                    return handleKVGet(request, env);

                default:
                    return new Response('Not Found', { status: 404 });
            }
        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
        }
    },
};

// Simple KV test with automatic key-value operations
async function handleKVTest(request, env) {
    try {
        const testKey = 'test-key';
        const testValue = `Hello from KV! Time: ${new Date().toISOString()}`;

        // Set a value
        await env.MY_KV.put(testKey, testValue);

        // Get the value back
        const retrievedValue = await env.MY_KV.get(testKey);

        return new Response(JSON.stringify({
            success: true,
            stored: testValue,
            retrieved: retrievedValue,
            message: 'KV test completed successfully!'
        }), {
                headers: { 'Content-Type': 'application/json' }
            });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'KV test failed',
            message: error.message
        }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
    }
}

// Set key-value pair via URL parameters
async function handleKVSet(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const value = url.searchParams.get('value');

    // Input validation
    if (!key || !value) {
        return new Response(JSON.stringify({
            error: 'Missing parameters',
            message: 'Please provide both key and value parameters'
        }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
    }

    try {
        await env.MY_KV.put(key, value);

        return new Response(JSON.stringify({
            success: true,
            message: `Key '${key}' set successfully`
        }), {
                headers: { 'Content-Type': 'application/json' }
            });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to set key',
            message: error.message
        }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
    }
}

// Get value by key via URL parameter
async function handleKVGet(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
        return new Response(JSON.stringify({
            error: 'Missing parameter',
            message: 'Please provide a key parameter'
        }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
    }

    try {
        const value = await env.MY_KV.get(key);

        if (value === null) {
            return new Response(JSON.stringify({
                found: false,
                message: `Key '${key}' not found`
            }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
        }

        return new Response(JSON.stringify({
            found: true,
            key: key,
            value: value
        }), {
                headers: { 'Content-Type': 'application/json' }
            });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to get key',
            message: error.message
        }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
    }
}
