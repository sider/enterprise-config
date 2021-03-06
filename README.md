# Sider Enterprise Configuration

We provide the following tools to help Sider Enterprise setup.

1. Generator for Sider Enterprise configuration.
2. Generator for Sider Enterprise configuration using Docker Compose (this helps starting Sider Enterprise with minimal effort).
3. A docker image to run configuration generator.

## Requirements

1. You need Docker to build the configuration generator
2. You need Docker compose to use the Quickstart configuration

## Quickstart

### Setup authentication

Use `docker login` command to authorize your account.
Sider team sends you the account and password to get authenticated to `quay.io`.

````
$ docker login -u=$account -p=$password quay.io
````

### Pusher Account

Sign up to Pusher to set up Sider Enterprise. You may also required to configure your network to allow the access from sideci to Pusher.

We assume free plan is more than enough for Sider Enterprise, but you may need to upgrade to paid plan depending on the number of the developers.

### Generate the configuration

Build the Docker image and generate a configuration.

```
$ bin/build
$ bin/quickstart http://localhost:3000
```

You will find the `quickstart` directory and four `.env` files in the directory.

### Register applications to GitHub Enterprise

Sider requires two applications integrated with GitHub Enterprise.
Visit your GitHub Enterprise and register OAuth App and GitHub App.

The generator prints the URLs required to the registration.

### Configure for your environment

Edit the four `.env` files for your environment.
Required configurations are marked as `[REQUIRED]`.

### Setup Database

Start MySQL and run the database setup commands.

```
$ docker-compose up -d mysql
$ docker-compose run sideci_web bundle exec rake db:setup db:seed_fu
$ docker-compose run catpost_web bundle exec rake db:setup
$ docker-compose run setaria_web bundle exec rake db:setup
$ docker-compose kill
```

### Start Sider Enterprise

```
$ docker-compose up
```

And everything will work. 🎉

### Webhook Note

If your GitHub Enterprise can access to your Sider Enterprise, everything will go fine.
However, if not, webhook cannot be sent to Sider Enterprise.
When you specify something like `http://localhost:3000`, your GitHub Enterprise cannot send webhooks.

Instead of receiving webhook to start event handler, you can simulate receiving webhooks with the following command.
This is usually required at the following points:

* When you are adding new organization
* When you open new pull request

When you try to add a new organization, you will be waiting on Sider after GitHub app installation step.
Run the following command to continue, and go to Sider dashboard.
Then you will see the organization you have installed Sider on.

```
# Simulate GitHub app installation
$ docker-compose run sideci_web bundle exec rake github_app:sync
```

When you open new pull request or push a new commit to existing pull request, Sider will receive a webhook and automatically start an analysis.
Run the following command to let Sider know it and start an analysis.

```
# Detect new commit on a pull request and run analysis
# Assume the repository is acme/server, and the number of the pull request is 123
$ docker-compose run sideci_web bundle exec rake 'pull_request:sync[acme/server,123]'
```

### Admin Note

Sider Enterprise provides an admin console at `/admin`.
To allow a Sider Enterprise account to access the console, you have to promote the account to an admin.

```
# Make an account with `sider-admin` GitHub login name an admin.
$ docker-compose run sideci_web bundle exec rake 'admin:promote[sider-admin]'
```

You can also promote an account to admin from the admin console, but you have to promote the first admin from the command line.

## Configuration Generator

You can scaffold the config files, four `.env` files, for Sider Enterprise.

```
$ bin/build
$ bin/generate .
```

Edit the generated files.
Required configurations are marked as `[REQUIRED]`.
