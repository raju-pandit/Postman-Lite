const express = require('express');
const axios   = require('axios');
const router  = express.Router();

router.all('/', async (req, res) => {
  const { url, method, headers, body, params } = req.body;

  if (!url || !method) {
    return res.status(400).json({ error: 'URL and method are required' });
  }

  const startTime = Date.now();

  try {
    const response = await axios({
      url,
      method: method.toLowerCase(),
      headers: headers || {},
      data:    body    || null,
      params:  params  || {},
      validateStatus: () => true,  
    });

    res.json({
      status:     response.status,
      statusText: response.statusText,
      headers:    response.headers,
      data:       response.data,
      time:       Date.now() - startTime,
      size:       JSON.stringify(response.data).length,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;   