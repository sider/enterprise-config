import Configuration from "./Configuration";
import ConfigFile from "./ConfigFile";

function generateSideCIConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("sideci.env")
  
  file.newSection(["General Configuration"], section => {
    section.requiredConfig("BASE_URL")
      .withDescription("URL to allow end users to access Sider.")
    section.requiredConfig("DOCS_PAGE_URL")
      .withDescription("URL which points to document page.")
      .withValue("https://help.sider.review")
    section.requiredConfig("EXCEPTION_NOTIFIER_RECIPIENT_EMAILS")
      .withDescription("Comma-separated list of recipients for error reporting emails.")
    section.requiredConfig("GITHUB_OAUTH_HEAD_ENCRYPTION_KEY").withValue(config.sideci.githubTokenEncryptionKey)
      .withDescription(
        "Random string to encrypt GitHub credential.",
        "Note that changing this value will make all organizations invalid."
      )
    section.requiredConfig("STATUS_PAGE_URL")
      .withDescription("URL to share service status.")
      .withValue("https://status.sider.review")
    section.requiredConfig("SECRET_KEY_BASE")
      .withDescription("Secret for encryption required by Rails.")
      .withValue(config.sideci.secretKeyBase)
    section.requiredConfig("RAILS_ENV")
      .withDescription(
        "The *environment* for Rails framework.",
        "You cannot change the value from `onprem`."
      )
      .withValue("onprem")
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of sideci is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/sideci?charset=utf8mb4`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for sideci.",
    "* The charset parameter must be `utf8mb4`.",
    "",
    "Read the Rails documentation for the detail.",
    "",
    "* https://guides.rubyonrails.org/configuring.html#configuring-a-database",
    "",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/0`.",
    "",
    "* You should specify path (0 in the example above) which is dedicated to sideci.",
    "",
    "Read the IANA documentation for the detail.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
    ""
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
  })
  
  file.newSection(["Catpost Configuration"], section => {
    section.requiredConfig("CATPOST_BASE_URL")
      .withDescription("URL which points to catpost endpoint.")
    section.requiredConfig("CATPOST_SECRET")
      .withDescription("Random string used to authorize requests to catpost.")
      .withValue(config.catpost.apiSecret)
  })
  
  file.newSection(["Setaria Configuration"], section => {
    section.requiredConfig("SETARIA_BASE_URL")
      .withDescription("URL which points to setaria endpoint.")
    section.requiredConfig("SETARIA_SECRET")
      .withDescription("Random string used to authorize requests to setaria.")
      .withValue(config.setaria.apiSecret)
  })
  
  file.newSection([
    "GitHub Enterprise Configuration",
    "",
    "Configure access to your GitHub Enterprise.",
    "Visit the GitHub application page to see the values.",
    ""
  ], section => {
    section.requiredConfig("GITHUB_END_POINT")
      .withDescription("URL which points to GitHub Enterprise web page.")
    section.requiredConfig("GITHUB_API_ENDPOINT")
      .withDescription("URL which points to GitHub Enterprise API endpoint.")
    section.requiredConfig("GITHUB_CLIENT_ID")
    section.requiredConfig("GITHUB_CLIENT_SECRET")
  })
  
  file.newSection([
    "Integration Configuration",
    "",
    "Sider uses Pusher to implement a push notification to web browser.",
    "Put the PUSHER_* values obtained from Pusher web page.",
    "",
    "You can optionally setup Loggly and Bugsnag integration.",
    "",
  ], section => {
    section.requiredConfig("PUSHER_API_ID")
      .withDescription("Pusher API Configuration.")
    section.requiredConfig("PUSHER_API_KEY")
      .withDescription("Pusher API Configuration.")
    section.requiredConfig("PUSHER_API_SECRET")
      .withDescription("Pusher API Configuration.")
    section.requiredConfig("PUSHER_CLUSTER")
      .withDescription("Pusher API Configuration.")
    section.optionalConfig("LOGGLY_URL")
      .withDescription("Loggly URL for debugging.")
    section.optionalConfig("BUGSNAG_API_KEY")
      .withDescription("Bugsnag API Key.")
  })
  
  return file
}

function generateEmailConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("email.env")
  
  file.newSection([
    "SMTP Configuration to send email from Sider",
    "",
    "You can see the detail of the configuration at Sider GitHub page and Ruby net/http library document.",
    "",
    "* https://github.com/sider/configure",
    "* https://docs.ruby-lang.org/en/trunk/Net/SMTP.html",
    "",
    "Sider sends emails for operation and error reporting.",
    "While you can skip email configuration, we strongly recommend to set up email for production environment.",
  ], section => {
    section.requiredConfig("ACTION_MAILER_SMTP_ADDRESS")
      .withDescription("SMTP server address.")
    section.requiredConfig("ACTION_MAILER_DEFAULT_FROM_EMAIL")
      .withDescription("From address of emails sent from Sider.")
    
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
  
    section.requiredConfig("EXCEPTION_NOTIFIER_RECIPIENT_EMAILS")
      .withDescription("Comma-separated list of recipients for error reporting emails.")
  
    section.requiredConfig("RAILS_ENV").withValue("onprem")
      .withDescription(
        "The *environment* for Rails framework.",
        "You cannot change the value from `onprem`."
      )
    section.requiredConfig("TERM_CHILD").withValue("1")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
    section.requiredConfig("QUEUE").withValue("*")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of sideci is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/catpost?charset=utf8mb4`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for catpost.",
    "* The charset parameter must be `utf8mb4`.",
    "",
    "Read the Rails documentation for the detail.",
    "",
    "* https://guides.rubyonrails.org/configuring.html#configuring-a-database",
    "",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/1`.",
    "",
    "* You should specify path (1 in the example above) which is dedicated to catpost.",
    "",
    "Read the IANA documentation for the detail.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
    ""
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
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
    "",
  ], section => {
    section.requiredConfig("S3_ENDPOINT")
      .withDescription(
        "Minio endpoint, something like `http://object_storage:9000`.",
        "Remove the configuration if you use AWS S3."
      )
    section.requiredConfig("S3_BUCKET_NAME")
      .withDescription(
        "Object storage bucket name.",
        "Sider automatically creates the bucket if it doesn't exist on Minio.",
        "Specify the name of an existing bucket if you use AWS S3.",
      )
      .withValue("sider")
    section.requiredConfig("S3_REGION_NAME")
      .withDescription(
        "Object storage region name.",
        "If you are using Minio, you can use any region name.",
        "Specify correct region name if you use AWS S3."
      )
      .withValue("sider")
    section.requiredConfig("AWS_ACCESS_KEY_ID")
      .withDescription(
        "Authorization for object storage.",
        "If you use AWS S3, you can authorize using IAM role and remove this configuration."
      )
    section.requiredConfig("AWS_SECRET_ACCESS_KEY")
      .withDescription(
        "Authorization for object storage.",
        "If you use AWS S3, you can authorize using IAM role and remove this configuration."
      )
  })
  
  file.newSection([
    "Integration Configuration",
    "",
    "You can optionally setup Loggly and Bugsnag integration."
  ], section => {
    section.optionalConfig("LOGGLY_URL")
      .withDescription("Loggly URL for debugging.")
    section.optionalConfig("BUGSNAG_API_KEY")
      .withDescription("Bugsnag API Key.")
  })
  
  return file
}

function generateSetariaConfig(config: Configuration): ConfigFile {
  const file = new ConfigFile("setaria.env")
  
  file.newSection([
    "General Configuration"
  ], section => {
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
    section.requiredConfig("TERM_CHILD").withValue("1")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
    section.requiredConfig("QUEUE").withValue("*")
      .withDescription(
        "An option for Resque.",
        "You cannot change the value."
      )
  })
  
  file.newSection([
    "Database Configuration",
    "",
    "Database configuration of setaria is given through this environment variable.",
    "Sider supports MySQL 5.7 and assumes `mysql2` driver.",
    "It will look like `mysql2://sider:topsecret@mysql:3306/setaria?charset=utf8mb4`.",
    "",
    "* The username and password must be given if your server requires authentication.",
    "* You can choose arbitrary database name but the database should be dedicated for sideci.",
    "* The charset parameter must be `utf8mb4`.",
    "",
    "Read the Rails documentation for the detail.",
    "",
    "* https://guides.rubyonrails.org/configuring.html#configuring-a-database",
    "",
  ], section => {
    section.requiredConfig("DATABASE_URL")
      .withDescription("URL to connect database.")
  })
  
  file.newSection([
    "Redis Configuration",
    "",
    "Redis configuration of sideci is given through this environment variable.",
    "It will look like `redis://redis:7372/2`.",
    "",
    "* You should specify path (2 in the example above) which is dedicated to setaria.",
    "",
    "Read the IANA documentation for the detail.",
    "",
    "* http://www.iana.org/assignments/uri-schemes/prov/redis",
    ""
  ], section => {
    section.requiredConfig("REDIS_URL")
      .withDescription("URL to connect Redis.")
  })
  
  file.newSection([
    "Docker Configuration",
    "",
    "setaria needs to authenticate to Quay docker image repository.",
    "Sider provides the login name and password to access Quay repositories."
  ], section => {
    section.requiredConfig("QUAY_ROBOT_NAME")
      .withDescription("Quay account name.")
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
      .withDescription("Bugsnag API Key.")
  })
  
  return file
}

interface ConfigSet {
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
