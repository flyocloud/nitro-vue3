// Integration guard: every other test suite mocks @flyo/nitro-typescript, so a breaking
// change in the generated SDK (renamed API class, changed method signature, retyped model)
// would go unnoticed. This suite drives the real SDK against a stubbed fetch instead.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import initFlyoApi from '../src/helpers/api'
import { useFlyoConfig } from '../src/composables/useFlyoConfig'
import { useFlyoPage } from '../src/composables/useFlyoPage'
import { useFlyoEntity } from '../src/composables/useFlyoEntity'
import { useFlyoSitemap } from '../src/composables/useFlyoSitemap'

let lastRequest = null

const stubFetch = (body, status = 200) => {
  globalThis.fetch = vi.fn((url, init) => {
    lastRequest = { url: String(url), init }
    return Promise.resolve(new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' }
    }))
  })
}

beforeEach(() => {
  lastRequest = null
  initFlyoApi({
    apiToken: 'TOKEN',
    apiBasePath: 'https://example.test',
    defaultHeaders: { 'X-Custom': '1' }
  })
})

describe('SDK integration', () => {
  it('sends the token and the default headers', async () => {
    stubFetch({ nitro: { version: '2.30' }, containers: {} })

    const { response, error } = await useFlyoConfig().fetch()

    expect(error).toBe(null)
    expect(response).toEqual({ nitro: { version: '2.30' }, containers: {} })
    expect(lastRequest.url).toBe('https://example.test/config?token=TOKEN')
    expect(lastRequest.init.headers).toMatchObject({ 'X-Custom': '1' })
  })

  it('deserializes a page', async () => {
    stubFetch({ id: 1, title: 'Home', json: [{ uid: 'a', component: 'x' }], meta_json: { image: false } })

    const { response, error } = await useFlyoPage('home').fetch()

    expect(error).toBe(null)
    expect(response.title).toBe('Home')
    expect(response.json).toEqual([{ uid: 'a', component: 'x' }])
    // regression guard for the SDK 1.6 meta_json fix: `image: false` must survive
    expect(response.meta_json.image).toBe(false)
  })

  it('deserializes an entity including its routes map', async () => {
    stubFetch({
      entity: { entity_unique_id: 'foo', entity_title: 'Foo', routes: { detail: '/foo', _empty: false } },
      model: 'news',
      language: 'en'
    })

    const { response, error } = await useFlyoEntity('foo').fetch()

    expect(error).toBe(null)
    expect(response.entity.entity_title).toBe('Foo')
    expect(response.entity.routes).toEqual({ detail: '/foo', _empty: false })
    expect(lastRequest.url).toBe('https://example.test/entities/uniqueid/foo?token=TOKEN')
  })

  it('passes the sitemap routes map through untouched', async () => {
    stubFetch([
      { uniqueid: 'a', href: '/a', routes: { detail: '/a', _empty: false } },
      { uniqueid: 'b', href: '/b', routes: { _empty: null } }
    ])

    const { response, error } = await useFlyoSitemap().fetch()

    expect(error).toBe(null)
    expect(response[0].routes).toEqual({ detail: '/a', _empty: false })
    // SDK >= 1.7 keeps an explicit null instead of dropping the key
    expect(response[1].routes).toEqual({ _empty: null })
  })

  it('reports an http error instead of a response', async () => {
    stubFetch({ message: 'not found' }, 404)

    const { response, error } = await useFlyoPage('missing').fetch()

    expect(response).toBe(null)
    expect(error.name).toBe('ResponseError')
  })
})
