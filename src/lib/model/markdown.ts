import { ConfigSet } from "./Generator"
import { default as ConfigFile } from "./ConfigFile"

function configToMarkdown(lines: string[], config: ConfigFile): void {
  config.sections.forEach(section => {
    if (section.header.length > 1) {
      lines.push(`## ${section.header[0]}`)
      section.header.slice(1).forEach(headerLine => {
        lines.push(headerLine)
      })
    } else {
      lines.push(`## ${section.header[0]}`)
    }

    lines.push("")

    section.configs.forEach(config => {
      const cells: string[] = []

      lines.push(`### \`${config.key}\` (${config.optional ? "Optional" : "Required"})`)

      lines.push("")

      config.description.forEach(line => {
        lines.push(line)
      })

      lines.push("")
    })

    lines.push("")
  })
}

export default function markdown(configSet: ConfigSet): string {
	const lines: string[] = []

  lines.push("# Email Configuration")
  lines.push("")
  configToMarkdown(lines, configSet.email)
  lines.push("")

  lines.push("# sideci Configuration")
  lines.push("")
  configToMarkdown(lines, configSet.sideci)
  lines.push("")

  lines.push("# catpost Configuration")
  lines.push("")
  configToMarkdown(lines, configSet.catpost)
  lines.push("")

  lines.push("# setaria Configuration")
  lines.push("")
  configToMarkdown(lines, configSet.setaria)
  lines.push("")

  return lines.join("\n") + "\n"
}
