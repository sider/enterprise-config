import { generate } from "./model/Generator"
import Configuration, {generateRandomConfiguration} from "./model/Configuration"
import * as fs from "fs"
import {promisify} from 'util'
import * as path from 'path'
import ConfigFile from "./model/ConfigFile";

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

async function writeConfigFile(dir: string, file: ConfigFile) {
  const p = path.join(dir, file.name)
  console.info(`Writing ${p}...`)
  return writeFile(p, file.toString())
}

async function main(argv: string[]) {
  const config: Configuration = generateRandomConfiguration()
  const { email, sideci, catpost, setaria } = generate(config)
  
  const dir = path.join(process.cwd(), argv[2] || ".")
  
  if (!fs.existsSync(dir)) {
    console.info(`Making dir: ${dir}...`)
    await mkdir(dir)
  }
  
  await writeConfigFile(dir, email)
  await writeConfigFile(dir, sideci)
  await writeConfigFile(dir, catpost)
  await writeConfigFile(dir, setaria)
}

main(process.argv)
