export interface EmailConfig {

}

export interface SideCI {
  readonly secretKeyBase: string
  readonly githubTokenEncryptionKey: string
}

export interface Catpost {
  readonly secretKeyBase: string
  readonly apiSecret: string
  readonly archiveURLEncryptionKey: string
  readonly archiveEncryptionKey: string
  readonly archiveNameSalt: string
}

export interface Setaria {
  readonly secretKeyBase: string
  readonly apiSecret: string
  readonly sshSecretKeyEncryptionKey: string
}

function randomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array<undefined>(length).fill(undefined).map(_ => chars.charAt(Math.floor(Math.random() * chars.length))).join("")
}

export function generateRandomConfiguration(): Configuration {
  return {
    email: {},
    sideci: {
      secretKeyBase: randomString(128),
      githubTokenEncryptionKey: randomString(32),
    },
    catpost: {
      secretKeyBase: randomString(128),
      apiSecret: randomString(32),
      archiveURLEncryptionKey: randomString(32),
      archiveEncryptionKey: randomString(16),
      archiveNameSalt: randomString(16),
    },
    setaria: {
      secretKeyBase: randomString(128),
      apiSecret: randomString(32),
      sshSecretKeyEncryptionKey: randomString(32),
    }
  }
}

export default interface Configuration {
  readonly email: EmailConfig
  readonly sideci: SideCI
  readonly catpost: Catpost
  readonly setaria: Setaria
}
