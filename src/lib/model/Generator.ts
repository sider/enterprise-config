import {default as Configuration } from "./Configuration";
import ConfigFile from "./ConfigFile";

function databaseURL(host: string, dbname: string): string {
  return `mysql2://${host}/${dbname}`
}

function redisURL(host: string, index: number): string {
  return `redis://${host}/${index}`
}

function generateSideCIConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("sideci.env")
  
  file.newSection(["General Configuration"], section => {
    section.requiredConfig("BASE_URL")
      .withDescription("URL to allow end users to access Sider.")
      .continue(option => {
        if (config.endpoint) {
          option.withValue(config.endpoint)
        }
      })
      .withExample("https://sider.example.com")
    section.requiredConfig("EXCEPTION_NOTIFIER_RECIPIENT_EMAILS")
      .withDescription("Comma-separated list of recipients for error reporting emails.")
      .withExample("foo@example.com,bar@example.com")
    section.requiredConfig("GITHUB_OAUTH_HEAD_ENCRYPTION_KEY").withValue(config.sideci.githubTokenEncryptionKey)
      .withDescription(
        "Random string to encrypt GitHub credential.",
        "Note that changing this value will make all organizations invalid."
      )
    section.requiredConfig("SECRET_KEY_BASE")
      .withDescription("Secret for encryption required by Rails.")
      .withValue(config.sideci.secretKeyBase)
    section.requiredConfig("RAILS_ENV")
      .withDescription(
        "The *environment* for Rails framework.",
        "You cannot change the value from `onprem`."
      )
      .withValue("onprem")
      .withExample("onprem")
    section.optionalConfig("RESTRICT_SIGN_UP")
      .withDescription(
        "Set `true` to this to disable _self sign up_ to Sider.",
        "If self sign up is disabled, administrator should register each user account."
      )
      .withSupportIntroduced("201902")
      .withExample("true")
      .withValue("true")
     section.optionalConfig("SIDECI_TIMEZONE")
      .withDescription(
        "Set the timezone used for admin console.",
        "This does not affect the time formats for Sider Enterprise end users.",
        "It depends on `ActiveSupport::TimeZone` class.",
        "See the reference manual for available options.",
        "",
        "- https://api.rubyonrails.org/classes/ActiveSupport/TimeZone.html"
      )
      .withSupportIntroduced("201903")
      .withExample("Asia/Tokyo")
      .withValue("Asia/Tokyo")
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of sideci is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/sideci`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for sideci.",
    "",
    "Read the database configuration guide for the details.",
    "",
    "* https://help.sider.review/onprem/database",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
      .continue(option => {
        if (config.mysqlHost) {
          option.withValue(databaseURL(config.mysqlHost, "sideci"))
        }
      })
      .withExample("onprem")
      .withExample("mysql2://sider:topsecret@mysql:3306/sideci")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/0`.",
    "",
    "* You should specify path (0 in the example above) which is dedicated to sideci.",
    "",
    "Read the IANA documentation for the details.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
      .continue(option => {
        if (config.redisHost) {
          option.withValue(redisURL(config.redisHost, 0))
        }
      })
      .withExample("redis://redis:7372/0")
  })
  
  file.newSection(["Catpost Configuration"], section => {
    section.requiredConfig("CATPOST_BASE_URL")
      .withDescription("URL which points to catpost endpoint.")
      .continue(option => {
        if (config.catpost.endpoint) {
          option.withValue(config.catpost.endpoint)
        }
      })
      .withExample("https://catpost.example.com:3000")
    section.requiredConfig("CATPOST_SECRET")
      .withDescription("Random string used to authorize requests to catpost.")
      .withValue(config.catpost.apiSecret)
  })
  
  file.newSection(["Setaria Configuration"], section => {
    section.requiredConfig("SETARIA_BASE_URL")
      .withDescription("URL which points to setaria endpoint.")
      .continue(option => {
        if (config.setaria.endpoint) {
          option.withValue(config.setaria.endpoint)
        }
      })
      .withExample("https://setaria.example.com:3000")
    section.requiredConfig("SETARIA_SECRET")
      .withDescription("Random string used to authorize requests to setaria.")
      .withValue(config.setaria.apiSecret)
  })
  
  file.newSection([
    "GitHub Enterprise Configuration",
    "",
    "Configure access to your GitHub Enterprise.",
    "",
    "Sider requires two GitHub integration; OAuth App and GitHub App.",
    "Visit the GitHub Enterprise, register two applications, and fill the credentials.",
  ], section => {
    section.requiredConfig("GITHUB_ENDPOINT")
      .withDescription(
        "URL which points to GitHub Enterprise web page.",
        "Example: https://github.example.com"
       )
      .withExample("https://github.example.com")
    section.requiredConfig("GITHUB_API_ENDPOINT")
      .withDescription(
        "URL which points to GitHub Enterprise API endpoint.",
        "Example: https://github.example.com/api/v3/"
      )
      .withExample("https://github.example.com/api/v3")

    section.requiredConfig("GITHUB_CLIENT_ID")
      .withDescription("Client ID of the OAuth App.")
    section.requiredConfig("GITHUB_CLIENT_SECRET")
      .withDescription("Client secret of the OAuth App.")

    section.requiredConfig("GITHUB_APP_ID")
      .withDescription("Application ID of the GitHub App.")
    section.requiredConfig("GITHUB_APP_NAME")
      .withDescription(
        "Application name of the GitHub App.",
        "You can find the name in the `Public link` of the GitHub App.",
        "When the `Public link` is `https://github.example.com/apps/sider-enterprise`, the name is `sider-enterprise`."
      )
      .withExample("sider-enterprise")
    section.requiredConfig("GITHUB_APP_PRIVATE_KEY")
      .withDescription(
        "Base64 encoded private key of the GitHub App.",
        "Generate and download the key from GitHub Enterprise and use `base64` command like:",
        "  $ base64 downloaded-private-key.pem"
       )
    section.requiredConfig("GITHUB_APP_OAUTH2_CLIENT_ID")
      .withDescription("Client ID of the GitHub App.")
    section.requiredConfig("GITHUB_APP_OAUTH2_CLIENT_SECRET")
      .withDescription("Client secret of the GitHub App.")
    section.requiredConfig("GITHUB_APP_WEBHOOK_SECRET")
      .withDescription("Webhook secret of the GitHub App.")
  })
  
  file.newSection([
    "Integration Configuration",
    "",
    "Sider uses Pusher to implement a push notification to web browser.",
    "Put the PUSHER_* values obtained from Pusher web page.",
    "",
    "You can optionally setup Loggly and Bugsnag integration.",
  ], section => {
    section.requiredConfig("PUSHER_API_ID")
      .withDescription("Pusher API configuration.")
    section.requiredConfig("PUSHER_API_KEY")
      .withDescription("Pusher API configuration.")
    section.requiredConfig("PUSHER_API_SECRET")
      .withDescription("Pusher API configuration.")
    section.requiredConfig("PUSHER_CLUSTER")
      .withDescription("Pusher API configuration.")
    section.optionalConfig("LOGGLY_URL")
      .withDescription("Loggly URL for debugging.")
    section.optionalConfig("BUGSNAG_API_KEY")
      .withDescription("Bugsnag API key.")
    section.optionalConfig("BUGSNAG_ENDPOINT")
      .withDescription("Bugsnag On-Premises endpoint.")
      .withSupportIntroduced("201902")
    section.optionalConfig("BUGSNAG_SESSION_ENDPOINT")
      .withDescription("Bugsnag On-Premises session endpoint.")
      .withSupportIntroduced("201902")
  })
  
  return file
}

function generateEmailConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("email.env")
  
  file.newSection([
    "SMTP Configuration to send email from Sider",
    "",
    "You can see the detail of the configuration at Sider GitHub page and Ruby net/http library documents.",
    "",
    "* https://github.com/sider/configure",
    "* https://docs.ruby-lang.org/en/trunk/Net/SMTP.html",
    "",
    "Sider sends emails for operation and error reporting.",
    "While you can skip email configuration, we strongly recommend to set up email for production environment.",
  ], section => {
    section.requiredConfig("ACTION_MAILER_SMTP_ADDRESS")
      .withDescription("SMTP server address.")
      .withExample("smtp.example.com")
    section.requiredConfig("ACTION_MAILER_DEFAULT_FROM_EMAIL")
      .withDescription("From address of emails sent from Sider.")
      .withExample("sider@example.com")
    
    section.optionalConfig("ACTION_MAILER_SMTP_PORT")
      .withDescription("SMTP server port number.")
      .withValue("25")
    section.optionalConfig("ACTION_MAILER_SMTP_AUTHENTICATION").withValue("plain")
      .withDescription(
        "SMTP server authentication method (choose one from: plain, login, and cram_md5).",
      )
    section.optionalConfig("ACTION_MAILER_SMTP_USER_NAME")
      .withDescription("User name for SMTP authentication.")
    section.optionalConfig("ACTION_MAILER_SMTP_USER_PASSWORD")
      .withDescription("User password for SMTP authentication.")
    section.optionalConfig("ACTION_MAILER_SMTP_DOMAIN")
      .withDescription("Domain name for HELO command.")
    section.optionalConfig("ACTION_MAILER_SMTP_ENABLE_STARTSSL_AUTO").withValue("no")
      .withExample("no")
  })
  
  return file
}

function generateCatpostConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("catpost.env")
  
  file.newSection(["General Configuration"], section => {
    section.requiredConfig("SECRET_KEY_BASE")
      .withDescription("Secret for encryption required by Rails.")
      .withValue(config.catpost.secretKeyBase)
  
    section.requiredConfig("API_TOKEN").withValue(config.catpost.apiSecret)
      .withDescription("Random string to authenticate API access.")
    
    section.requiredConfig("GIT_REPOS_DIR")
      .withDescription("Path to put git repository cache.")
      .withValue("/repos")
      .withExample("/repos")
  
    section.requiredConfig("EXCEPTION_NOTIFIER_RECIPIENT_EMAILS")
      .withDescription("Comma-separated list of recipients for error reporting emails.")
      .withExample("foo@example.com,bar@example.com")
  
    section.requiredConfig("RAILS_ENV").withValue("onprem")
      .withDescription(
        "The *environment* for Rails framework.",
        "You cannot change the value from `onprem`."
      )
      .withExample("onprem")
    section.requiredConfig("TERM_CHILD").withValue("1")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
      .withExample("1")
    section.requiredConfig("QUEUE").withValue("*")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
      .withExample("*")
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of sideci is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/catpost`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for catpost.",
    "",
    "Read the database configuration guide for the details.",
    "",
    "* https://help.sider.review/onprem/database",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
      .continue(option => {
        if (config.mysqlHost) {
          option.withValue(databaseURL(config.mysqlHost, "catpost"))
        }
      })
      .withExample("mysql2://sider:topsecret@mysql:3306/catpost")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/1`.",
    "",
    "* You should specify path (1 in the example above) which is dedicated to catpost.",
    "",
    "Read the IANA documentation for the details.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
      .continue(option => {
        if (config.redisHost) {
          option.withValue(redisURL(config.redisHost, 1))
        }
      })
      .withExample("redis://redis:7372/1")
  })
  
  file.newSection([
    "Encryption Configuration"
  ], section => {
    section.requiredConfig("URL_ENCRYPTION_KEY").withValue(config.catpost.archiveURLEncryptionKey)
      .withDescription(
        "32 bytes of random string to encrypt URL pointing to repositories.",
        "You cannot change this value once you set up."
      )
    section.requiredConfig("ARCHIVE_ENCRYPTION_KEY").withValue(config.catpost.archiveEncryptionKey)
      .withDescription("Random string to make archive encrypted.")
    section.requiredConfig("ARCHIVE_NAME_SECRET").withValue(config.catpost.archiveNameSalt)
      .withDescription("Random string to make archive name more unpredictable.")
  })
  
  file.newSection([
    "Object Storage Configuration",
    "",
    "Sider supports Minio and AWS S3 for object storage.",
    "Setup the following variables for Minio.",
    "",
    "If you want to use AWS S3, comment out S3_ENDPOINT configuration.",
    "You may also comment out AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY when you use IAM role for authorization.",
  ], section => {
    section.requiredConfig("S3_ENDPOINT")
      .withDescription(
        "Minio endpoint, something like `http://object_storage:9000`.",
        "Remove the configuration if you use AWS S3."
      )
      .continue(option => {
        if (config.catpost.minio) {
          option.withValue(config.catpost.minio.endpoint)
        }
      })
      .withExample("http://minio:9000")
    section.requiredConfig("S3_BUCKET_NAME")
      .withDescription(
        "Object storage bucket name.",
        "Sider automatically creates the bucket if it doesn't exist on Minio.",
        "Specify the name of an existing bucket if you use AWS S3.",
      )
      .continue(option => {
        if (config.catpost.minio) {
          option.withValue(config.catpost.minio.bucketName)
        }
      })
      .withExample("sider-example")
    section.requiredConfig("S3_REGION_NAME")
      .withDescription(
        "Object storage region name.",
        "If you are using Minio, you can use any region name.",
        "Specify correct region name if you use AWS S3."
      )
      .continue(option => {
        if (config.catpost.minio) {
          option.withValue(config.catpost.minio.regionName)
        }
      })
      .withExample("us-east-1")
    section.requiredConfig("AWS_ACCESS_KEY_ID")
      .withDescription(
        "Authorization for object storage.",
        "If you use AWS S3, you can authorize using IAM role and remove this configuration."
      )
      .continue(option => {
        if (config.catpost.minio) {
          option.withValue(config.catpost.minio.accessKeyId)
        }
      })
    section.requiredConfig("AWS_SECRET_ACCESS_KEY")
      .withDescription(
        "Authorization for object storage.",
        "If you use AWS S3, you can authorize using IAM role and remove this configuration."
      )
      .continue(option => {
        if (config.catpost.minio) {
          option.withValue(config.catpost.minio.secretAccessKey)
        }
      })
  })
  
  file.newSection([
    "Integration Configuration",
    "",
    "You can optionally setup Loggly and Bugsnag integration."
  ], section => {
    section.optionalConfig("LOGGLY_URL")
      .withDescription("Loggly URL for debugging.")
    section.optionalConfig("BUGSNAG_API_KEY")
      .withDescription("Bugsnag API key.")
    section.optionalConfig("BUGSNAG_ENDPOINT")
      .withDescription("Bugsnag On-Premises endpoint.")
      .withSupportIntroduced("201902")
    section.optionalConfig("BUGSNAG_SESSION_ENDPOINT")
      .withDescription("Bugsnag On-Premises session endpoint.")
      .withSupportIntroduced("201902")
  })
  
  return file
}

function generateSetariaConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("setaria.env")
  
  file.newSection([
    "General Configuration"
  ], section => {
    section.requiredConfig("SECRET_KEY_BASE")
      .withDescription("Secret for encryption required by Rails.")
      .withValue(config.setaria.secretKeyBase)

    section.requiredConfig("API_SECRET").withValue(config.setaria.apiSecret)
      .withDescription("Random string to authenticate API access from sideci.")
  
    section.requiredConfig("SSH_KEY_ENCRYPTION_KEY").withValue(config.setaria.sshSecretKeyEncryptionKey)
      .withDescription(
        "32 bytes of random string to encrypt SSH secret key associated to repositories.",
        "You cannot change this value once you set up."
      )
    
    section.requiredConfig("EXCEPTION_NOTIFIER_RECIPIENT_EMAILS")
      .withDescription("Comma-separated list of recipients for error reporting emails.")
  
    section.requiredConfig("RAILS_ENV").withValue("onprem")
      .withDescription(
        "The *environment* for Rails framework.",
        "You cannot change the value from `onprem`."
      )
      .withExample("onprem")
    section.requiredConfig("TERM_CHILD").withValue("1")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
      .withExample("1")
    section.requiredConfig("QUEUE").withValue("*")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
      .withExample("*")
    section.optionalConfig("RUNNER_USE_DEFAULT_NETWORK")
      .withDescription(
        "Specify any value if you want to run the analyzers in `default` network of Docker."
      )
      .withSupportIntroduced("201902")
      .withExample("1")
      .withValue("1")
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of setaria is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/setaria`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for sideci.",
    "",
    "Read the database configuration guide for the details.",
    "",
    "* https://help.sider.review/onprem/database",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
      .continue(option => {
        if (config.mysqlHost) {
          option.withValue(databaseURL(config.mysqlHost, "setaria"))
        }
      })
      .withExample("mysql2://sider:topsecret@mysql:3306/setaria")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/2`.",
    "",
    "* You should specify path (2 in the example above) which is dedicated to setaria.",
    "",
    "Read the IANA documentation for the details.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
      .continue(option => {
        if (config.redisHost) {
          option.withValue(redisURL(config.redisHost, 2))
        }
      })
      .withExample("redis://redis:7372/2")
  })
  
  file.newSection([
    "Docker Configuration",
    "",
    "setaria needs to authenticate to Quay docker image repository.",
    "Sider provides the login name and password to access Quay repositories."
  ], section => {
    section.requiredConfig("QUAY_ROBOT_NAME")
      .withDescription("Quay account name.")
      .withExample("actcat+example")
    section.requiredConfig("QUAY_ROBOT_PASSWORD")
      .withDescription("Quay account password.")
  })
  
  file.newSection([
    "Integration Configuration",
    "",
    "You can optionally setup Loggly and Bugsnag integration."
  ], section => {
    section.optionalConfig("LOGGLY_URL")
      .withDescription("Loggly URL for debugging.")
    section.optionalConfig("BUGSNAG_API_KEY")
      .withDescription("Bugsnag API key.")
    section.optionalConfig("BUGSNAG_ENDPOINT")
      .withDescription("Bugsnag On-Premises endpoint.")
      .withSupportIntroduced("201902")
    section.optionalConfig("BUGSNAG_SESSION_ENDPOINT")
      .withDescription("Bugsnag On-Premises session endpoint.")
      .withSupportIntroduced("201902")
  })
  
  return file
}

export interface ConfigSet {
  email: ConfigFile,
  sideci: ConfigFile,
  catpost: ConfigFile,
  setaria: ConfigFile
}

export function generate(config: Configuration): ConfigSet {
  const email = generateEmailConfig(config)
  const sideci = generateSideCIConfig(config)
  const catpost = generateCatpostConfig(config)
  const setaria = generateSetariaConfig(config)
  
  return { email, sideci, catpost, setaria }
}
