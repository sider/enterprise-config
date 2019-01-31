export interface EmailConfig {

}

export interface MinioConfig {
  readonly endpoint: string
  readonly accessKeyId: string
  readonly secretAccessKey: string
  readonly bucketName: string
  readonly regionName: string
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
  readonly minio: MinioConfig | undefined
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

export default interface Configuration {
  readonly endpoint: string | undefined
  readonly email: EmailConfig
  readonly sideci: SideCI
  readonly catpost: Catpost
  readonly setaria: Setaria
  readonly mysqlHost: string | undefined
  readonly redisHost: string | undefined
}

export function generateRandomConfiguration(): Configuration {
  return {
    endpoint: undefined,
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
      minio: undefined
    },
    setaria: {
      secretKeyBase: randomString(128),
      apiSecret: randomString(32),
      sshSecretKeyEncryptionKey: randomString(32),
    },
    mysqlHost: undefined,
    redisHost: undefined
  }
}

