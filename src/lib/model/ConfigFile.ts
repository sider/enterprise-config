export class Config {
  description: string[]
  key: string
  value: string
  optional: boolean
  
  constructor(description: string[], key: string, value: string, optional: boolean) {
    this.description = description
    this.key = key
    this.value = value
    this.optional = optional
  }
  
  withValue(value: string): Config {
    this.value = value
    return this
  }
  
  withDescription(...description: string[]): Config {
    this.description = description
    return this
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
