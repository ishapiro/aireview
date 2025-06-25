import crypto from 'crypto'
import https from 'https'

export default defineEventHandler(async (event) => {
  console.log('=== AMAZON LOOKUP API START ===')
  
  try {
    const body = await readBody(event)
    const { searchTerm, searchIndex = 'All' } = body

    console.log('Request body:', body)
    console.log('Search term:', searchTerm)

    if (!searchTerm) {
      console.log('No search term provided')
      throw createError({
        statusCode: 400,
        statusMessage: 'Search term is required'
      })
    }

    // Amazon PA-API credentials
    const accessKey = "AKIAION5E3UKLCLTSXIQ"
    const secretKey = "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"
    const partnerTag = "drvax-20"
    
    // Amazon PA-API endpoint (US region)
    const host = "webservices.amazon.com"
    const region = "us-east-1"
    const service = "ProductAdvertisingAPI"
    const path = "/paapi5/searchitems"
    
    const now = new Date()
    // Format timestamp as YYYYMMDDTHHMMSSZ
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')    // Remove dashes and colons
      .replace(/\.\d{3}/, '')  // Remove milliseconds
    
    const datestamp = timestamp.slice(0, 8) // YYYYMMDD

    const payload = {
      SearchIndex: searchIndex,
      Keywords: searchTerm,
      ItemCount: 10,
      Resources: [
        "Images.Primary.Medium",
        "Images.Primary.Large",
        "ItemInfo.Title",
        "ItemInfo.Features",
        "Offers.Listings.Price",
        "CustomerReviews.Count",
        "CustomerReviews.StarRating"
      ],
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
      Operation: "SearchItems"
    }

    const headers = {
      'Host': host,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'Content-Encoding': 'amz-1.0'
    }

    console.log("Request timestamp:", timestamp)
    console.log("Request datestamp:", datestamp)

    const canonicalRequest = createCanonicalRequest('POST', path, payload, headers)
    const stringToSign = createStringToSign(timestamp, datestamp, region, service, canonicalRequest)
    const signature = calculateSignature(datestamp, region, service, stringToSign, secretKey)
    
    const authHeader = [
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${datestamp}/${region}/${service}/aws4_request`,
      `SignedHeaders=${Object.keys(headers).map(h => h.toLowerCase()).sort().join(';')}`,
      `Signature=${signature}`
    ].join(', ')

    console.log('Making request to Amazon API...')

    const response = await makeRequest(host, path, payload, {
      ...headers,
      'Authorization': authHeader
    })

    console.log('Amazon API response received, processing...')
    
    // Process the response to add affiliate links
    if (response.SearchResult && response.SearchResult.Items) {
      response.SearchResult.Items = response.SearchResult.Items.map(item => ({
        ...item,
        affiliateLink: `https://www.amazon.com/dp/${item.ASIN}?tag=${partnerTag}`
      }))
      console.log('Processed', response.SearchResult.Items.length, 'products')
    }
    
    console.log('=== AMAZON LOOKUP API SUCCESS ===')
    return response
    
  } catch (error) {
    console.error('=== AMAZON LOOKUP API ERROR ===')
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      stack: error.stack
    })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to search Amazon products'
    })
  }
})

function createCanonicalRequest(method, path, payload, headers) {
  const payloadHash = crypto.createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')

  const canonicalHeaders = Object.entries(headers)
    .map(([key, value]) => `${key.toLowerCase()}:${value}`)
    .sort()
    .join('\n') + '\n'

  const signedHeaders = Object.keys(headers)
    .map(h => h.toLowerCase())
    .sort()
    .join(';')

  return [
    method,
    path,
    '', // canonical query string (empty for POST)
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n')
}

function createStringToSign(timestamp, datestamp, region, service, canonicalRequest) {
  const hash = crypto.createHash('sha256')
    .update(canonicalRequest)
    .digest('hex')

  return [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${datestamp}/${region}/${service}/aws4_request`,
    hash
  ].join('\n')
}

function calculateSignature(datestamp, region, service, stringToSign, secretKey) {
  let key = `AWS4${secretKey}`
  const dateKey = hmac(key, datestamp)
  const regionKey = hmac(dateKey, region)
  const serviceKey = hmac(regionKey, service)
  const signingKey = hmac(serviceKey, 'aws4_request')
  return hmac(signingKey, stringToSign, 'hex')
}

function hmac(key, string, encoding) {
  return crypto.createHmac('sha256', Buffer.from(key))
    .update(string)
    .digest(encoding)
}

function makeRequest(host, path, payload, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      path: path,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json' // Add Content-Type here instead
      }
    }

    console.log("Full request details:", {
      url: `https://${options.hostname}${options.path}`,
      method: options.method,
      headers: {
        ...options.headers,
        Authorization: options.headers.Authorization.substring(0, 50) + '...'
      },
      payload: JSON.stringify(payload, null, 2)
    })

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject({
              statusCode: 502,
              message: 'Invalid response from Amazon API',
              details: { parseError: e.message, rawData: data }
            })
          }
        } else {
          reject({
            statusCode: res.statusCode,
            message: `Amazon API error: ${res.statusCode}`,
            details: { response: data }
          })
        }
      })
    })

    req.on('error', (error) => {
      reject({
        statusCode: 502,
        message: 'Network error while contacting Amazon API',
        details: { error: error.message }
      })
    })

    req.write(JSON.stringify(payload))
    req.end()
  })
} 