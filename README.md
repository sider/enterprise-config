# Sider Enterprise Configuration

We provide the following tools to help Sider Enterprise setup.

1. Generator for Sider Enterprise configuration.
2. Generator for Sider Enterprise configuration using Docker Compose (this helps starting Sider Enterprise with minimal effort).
3. A docker image to run configuration generator.

## Requirements

1. You need Docker to build the configuration generator
2. You need Docker compose to use the Quickstart configuration

## Quickstart

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

```
$ docker-compose up -d mysql
$ docker-compose run sideci_web bundle exec rake db:setup db:seed_fu
$ docker-compose run catpost_web bundle exec rake db:setup
$ docker-compose run setaria_web bundle exec rake db:setup
```

## Configuration Generator

You can scaffold the config files for Sider Enterprise.

```
$ bin/build
$ bin/generate
```
