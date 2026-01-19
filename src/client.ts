/**
 * Vaultix API Client
 *
 * Simple HTTP client for Vaultix API
 */

const BASE_URL = 'https://api.vaultix.global/api/v1'

export class VaultixClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    let url = `${BASE_URL}${path}`

    // Add query params
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      }
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const data: any = await response.json()

    if (!response.ok) {
      const error = new Error(data?.error?.message || 'API request failed')
      ;(error as any).code = data?.error?.code || 'api_error'
      ;(error as any).status = response.status
      throw error
    }

    return data as T
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', path, undefined, params)
  }

  async post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  async put<T>(path: string, body?: any): Promise<T> {
    return this.request<T>('PUT', path, body)
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}
