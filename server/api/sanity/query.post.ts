export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { query, params = {} } = body

  if (!query) {
    throw createError({
      statusCode: 400,
      message: 'Query is required'
    })
  }

  const config = useRuntimeConfig()
  const projectId = config.public.sanity?.projectId || 'kpljrloc'
  const dataset = config.public.sanity?.dataset || 'production'
  const useCdn = true
  
  const baseUrl = useCdn 
    ? `https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`
    : `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}`

  try {
    const result = await $fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        params,
      }),
    })
    
    return result
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to query Sanity'
    })
  }
})

