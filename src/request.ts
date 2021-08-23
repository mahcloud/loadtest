import http from 'k6/http'

const baseUrl = __ENV.PYVOTT_URL || 'http://localhost:4000'
const graphqlUrl = `${baseUrl}/graphql`

export function query (query: string, variables: Record<string, unknown> = {}, token: string): null {
  return http.post(
    graphqlUrl,
    JSON.stringify({ query, variables }),
    {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  )
}

export function queryWithoutAuth (query: string, variables: Record<string, unknown> = {}): null {
  return http.post(
    graphqlUrl,
    JSON.stringify({ query, variables }),
    {
      headers: {
        'Content-type': 'application/json',
      },
    }
  )
}
