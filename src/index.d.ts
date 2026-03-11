import type { App, Component, Ref } from 'vue'
import type {
  Block as NitroBlock,
  Configuration,
  ConfigApi,
  EntitiesApi,
  PagesApi,
  SitemapApi
} from '@flyo/nitro-typescript'

export interface FlyoVuePluginOptions {
  apiToken: string
  apiBasePath?: string
  defaultHeaders?: Record<string, string>
  liveEdit?: boolean
  liveEditOrigin?: string
}

export interface FlyoFetchResult<T> {
  response: T | null
  error: unknown | null
}

export type FlyoConfigResponse = Awaited<ReturnType<ConfigApi['config']>>
export type FlyoPageResponse = Awaited<ReturnType<PagesApi['page']>>
export type FlyoEntityResponse = Awaited<ReturnType<EntitiesApi['entityByUniqueid']>>
export type FlyoSitemapResponse = Awaited<ReturnType<SitemapApi['sitemap']>>

export interface UseFlyoConfigReturn {
  isLoading: Ref<boolean | null>
  response: Ref<FlyoConfigResponse | null>
  error: Ref<unknown | null>
  fetch: () => Promise<FlyoFetchResult<FlyoConfigResponse>>
}

export interface UseFlyoPageReturn {
  isLoading: Ref<boolean>
  response: Ref<FlyoPageResponse | null>
  error: Ref<unknown | null>
  fetch: () => Promise<FlyoFetchResult<FlyoPageResponse>>
}

export interface UseFlyoEntityReturn {
  isLoading: Ref<boolean>
  response: Ref<FlyoEntityResponse | null>
  error: Ref<unknown | null>
  fetch: () => Promise<FlyoFetchResult<FlyoEntityResponse>>
}

export interface UseFlyoSitemapReturn {
  isLoading: Ref<boolean>
  response: Ref<FlyoSitemapResponse | null>
  error: Ref<unknown | null>
  fetch: () => Promise<FlyoFetchResult<FlyoSitemapResponse>>
}

export interface FlyoVuePlugin {
  install: (app: App, options: FlyoVuePluginOptions) => void
}

declare const FlyoVue: FlyoVuePlugin
declare const Block: Component
declare const Page: Component

export default FlyoVue
export { FlyoVue, Block, Page }

export function getFlyoConfig(): Configuration | null

export function editable(block: NitroBlock): { 'data-flyo-uid'?: string }

export function useFlyoConfig(): UseFlyoConfigReturn
export function useFlyoLiveEdit(): void
export function useFlyoPage(slug: string): UseFlyoPageReturn
export function useFlyoEntity(uniqueid: string): UseFlyoEntityReturn
export function useFlyoSitemap(): UseFlyoSitemapReturn
