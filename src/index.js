export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case '/':
          return new Response(getEducationalHomePage(), {
            headers: { 
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache'
            },
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

// Educational homepage explaining KV operations
function getEducationalHomePage() {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Cloudflare Workers KV Learning Lab</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }
        .container { 
            max-width: 900px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            text-align: center; 
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 40px;
            font-size: 1.2em;
        }
        .endpoint { 
            margin: 25px 0; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 8px; 
            border-left: 4px solid #3498db;
        }
        .endpoint h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        .method { 
            display: inline-block;
            background: #3498db; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px;
            font-weight: bold;
            margin-right: 10px;
        }
        .link { 
            color: #2980b9; 
            text-decoration: none; 
            font-family: 'Monaco', 'Menlo', monospace;
            background: #ecf0f1;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            margin: 5px 0;
        }
        .link:hover { 
            background: #d5dbdb;
            text-decoration: underline; 
        }
        .technical {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
        }
        .technical h4 {
            margin: 0 0 8px 0;
            color: #856404;
        }
        .technical p {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        .background {
            background: #e8f5e8;
            border: 1px solid #c3e6c3;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
        }
        .background h4 {
            margin: 0 0 8px 0;
            color: #155724;
        }
        .background p {
            margin: 0;
            color: #155724;
            font-size: 14px;
        }
        .concepts {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .concepts h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .concept-item {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #e74c3c;
        }
        .concept-item strong {
            color: #c0392b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Cloudflare Workers KV Learning Lab</h1>
        <p class="subtitle">Interactive testing environment for understanding KV namespace operations</p>
        
        <h2>🧪 Test Endpoints</h2>
        
        <div class="endpoint">
            <h3><span class="method">GET</span> Automatic KV Test</h3>
            <a href="/kv-test" class="link">/kv-test</a>
            
            <div class="technical">
                <h4>🔧 What it does:</h4>
                <p>Performs a complete set/get cycle automatically with a timestamped value</p>
            </div>
            
            <div class="background">
                <h4>⚙️ Behind the scenes:</h4>
                <p>Calls <code>env.MY_KV.put()</code> to store data, then <code>env.MY_KV.get()</code> to retrieve it. Demonstrates eventual consistency and basic CRUD operations.</p>
            </div>
        </div>

        <div class="endpoint">
            <h3><span class="method">GET</span> Set Key-Value Pair</h3>
            <a href="/kv/set?key=username&value=john_doe" class="link">/kv/set?key=username&value=john_doe</a>
            <br>
            <a href="/kv/set?key=session&value=abc123" class="link">/kv/set?key=session&value=abc123</a>
            
            <div class="technical">
                <h4>🔧 What it does:</h4>
                <p>Stores a key-value pair in the KV namespace using URL parameters</p>
            </div>
            
            <div class="background">
                <h4>⚙️ Behind the scenes:</h4>
                <p>Executes <code>await env.MY_KV.put(key, value)</code>. Data is replicated to 300+ edge locations globally. Write operations have eventual consistency (~60 seconds).</p>
            </div>
        </div>

        <div class="endpoint">
            <h3><span class="method">GET</span> Get Value by Key</h3>
            <a href="/kv/get?key=username" class="link">/kv/get?key=username</a>
            <br>
            <a href="/kv/get?key=session" class="link">/kv/get?key=session</a>
            <br>
            <a href="/kv/get?key=nonexistent" class="link">/kv/get?key=nonexistent</a> <em>(test 404 handling)</em>
            
            <div class="technical">
                <h4>🔧 What it does:</h4>
                <p>Retrieves a stored value by its key, returns 404 if key doesn't exist</p>
            </div>
            
            <div class="background">
                <h4>⚙️ Behind the scenes:</h4>
                <p>Calls <code>await env.MY_KV.get(key)</code>. Reads are strongly consistent from the edge location. Returns <code>null</code> for missing keys.</p>
            </div>
        </div>

        <div class="concepts">
            <h2>📚 KV Concepts Explained</h2>
            
            <div class="concept-item">
                <strong>Global Edge Storage:</strong> Your data is automatically replicated to Cloudflare's 300+ edge locations worldwide for ultra-low latency reads.
            </div>
            
            <div class="concept-item">
                <strong>Eventual Consistency:</strong> Write operations (PUT/DELETE) may take up to 60 seconds to propagate globally. Reads are immediately consistent from the same edge location.
            </div>
            
            <div class="concept-item">
                <strong>Key Limitations:</strong> Keys can be up to 512 bytes, values up to 25MB. Perfect for configuration, user sessions, and cached API responses.
            </div>
            
            <div class="concept-item">
                <strong>Namespace Binding:</strong> The <code>env.MY_KV</code> object is injected by Cloudflare Workers runtime, configured in your <code>wrangler.jsonc</code> file.
            </div>
            
            <div class="concept-item">
                <strong>Error Handling:</strong> Always wrap KV operations in try-catch blocks. Network issues or quota limits can cause operations to fail.
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #ecf0f1; border-radius: 8px;">
            <h3>🎯 Learning Exercise</h3>
            <p>Try the endpoints above in sequence:</p>
            <p>1. Set a username → 2. Get the username → 3. Try getting a non-existent key</p>
            <p>Watch the JSON responses to understand the data flow!</p>
        </div>
    </div>
</body>
</html>`;
}

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
