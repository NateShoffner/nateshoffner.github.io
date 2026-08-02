export interface Certification {
  name: string
  issuer: string
  issuer_logo?: string
  issued: string
  expires?: string
  credential_url?: string
  skills?: string[]
  resume?: boolean
}
