import { generate } from "./model/Generator"
import Configuration, {generateRandomConfiguration} from "./model/Configuration"
import * as fs from "fs"
import {promisify} from 'util'
import * as path from 'path'
import ConfigFile from "./model/ConfigFile";
import yargs from "yargs";

const args = yargs.usage("Usage: $0 [options] <destination>")
  .describe("baseurl", "URL to access Sider (example: http://localhost:3000)")
  .describe("mysql", "MySQL host (example: user:password@host:port)")
  .describe("redis", "Redis host (example: host:port)")
  .describe("catpost", "catpost endpoint (example: catpost.local)")
  .describe("setaria", "setaria endpoint (example: setaria.local)")
  .describe("minio", "Minio configuration (example: endpoint:key-id:secret-access-key:region:bucket")
  .demandCommand(1)

const argv = args.argv

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

async function writeConfigFile(dir: string, file: ConfigFile) {
  const p = path.join(dir, file.name)
  console.info(`Writing ${p}...`)
  return writeFile(p, file.toString())
}

async function main() {
  let config: Configuration = generateRandomConfiguration()
  if (argv.mysql) {
    config = { ...config, mysqlHost: argv.mysql as string }
  }
  if (argv.redis) {
    config = { ...config, redisHost: argv.redis as string }
  }
  if (argv.baseurl) {
    config = { ...config, endpoint: argv.baseurl as string }
  }
  if (argv.catpost) {
    config = {
      ...config,
      catpost: {
        ...config.catpost,
        endpoint: argv.catpost as string
      }
    }
  }
  if (argv.setaria) {
    config = {
      ...config,
      setaria: {
        ...config.setaria,
        endpoint: argv.setaria as string
      }
    }
  }
  if (argv.minio) {
    const components = (argv.minio as string).split(":")
    if (components.length != 5) {
      console.error("--minio should be colon separated 5 items of string.")
      return
    }
    config = {
      ...config,
      catpost: {
        ...config.catpost,
        minio: {
          endpoint: components[0],
          accessKeyId: components[1],
          secretAccessKey: components[2],
          regionName: components[3],
          bucketName: components[4]
        }
      }
    }
  }

  const { email, sideci, catpost, setaria } = generate(config)
  
  const dir = path.join(process.cwd(), argv._[0] || ".")
  
  if (!fs.existsSync(dir)) {
    console.info(`Making dir: ${dir}...`)
    await mkdir(dir)
  }
  
  await writeConfigFile(dir, email)
  await writeConfigFile(dir, sideci)
  await writeConfigFile(dir, catpost)
  await writeConfigFile(dir, setaria)
}

main()
