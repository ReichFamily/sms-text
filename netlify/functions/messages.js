exports.handler = async (event) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  // Get API key from request headers
  const apiKey = event.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return { 
      statusCode: 401, 
      headers, 
      body: JSON.stringify({ error: 'API key required' }) 
    };
  }
  
  // GET - Fetch messages
  if (event.httpMethod === 'GET') {
    try {
      const response = await fetch('https://api.telnyx.com/v2/messages?page[size]=100', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      const data = await response.json();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
  }
  
  // POST - Send message
  if (event.httpMethod === 'POST') {
    try {
      const { from, to, text } = JSON.parse(event.body);
      
      const response = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, text })
      });
      
      const data = await response.json();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
  }
  
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
