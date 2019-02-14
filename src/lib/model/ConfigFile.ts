export type SupportedVersion = { readonly introduced: string, readonly deprecated: string }
                             | { readonly introduced: string }
                             | { readonly deprecated: string }

export class Config {
  description: string[]
  key: string
  value: string
  optional: boolean
  example: string | undefined
  support: SupportedVersion | undefined
  
  constructor(description: string[], key: string, value: string, optional: boolean) {
    this.description = description
    this.key = key
    this.value = value
    this.optional = optional
  }

  continue(k: (option: Config) => void): Config {
    k(this)
    return this
  }
  
  withValue(value: string): Config {
    this.value = value
    return this
  }
  
  withDescription(...description: string[]): Config {
    this.description = description
    return this
  }

  withExample(example: string | undefined): Config {
    this.example = example
    return this
  }

  withSupport(support: SupportedVersion | undefined): Config {
    this.support = support
    return this
  }

  withSupportIntroduced(introduced: string): Config {
    return this.withSupport({ introduced: introduced })
  }
}

export class Section {
  readonly header: string[]
  readonly configs: Config[]
  
  constructor(header: string[]) {
    this.header = header
    this.configs = []
  }
  
  requiredConfig(key: string): Config {
    const config = new Config([], key, "[REQUIRED]", false)
    this.configs.push(config)
    return config
  }
  
  optionalConfig(key: string): Config {
    const config = new Config([], key, "", true)
    this.configs.push(config)
    return config
  }
}

export default class ConfigFile {
  readonly name: string
  readonly sections: Section[]
  
  constructor(name: string) {
    this.name = name
    this.sections = []
  }
  
  newSection(header: string[], k: (section: Section) => void): void {
    const section = new Section(header)
    this.sections.push(section)
    k(section)
  }
  
  toString(): string {
    const secs = this.sections.map(section => {
      const buf: string[] = []
      
      buf.push("####")
      section.header.forEach(line => {
        buf.push(`# ${line}`)
      })
      buf.push("####")
      buf.push("")
      
      section.configs.forEach(config => {
        config.description.forEach(message => {
          buf.push(`# ${message}`)
        })
        
        if (!config.optional) {
          buf.push(`${config.key}=${config.value}`)
        } else {
          buf.push(`# ${config.key}=${config.value}`)
        }
        
        buf.push("")
      })
      
      return buf.join("\n")
    })
    
    return secs.join("\n")
  }
}
