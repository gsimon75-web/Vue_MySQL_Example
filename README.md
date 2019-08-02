# Vue MySQL Example
A simple VueJS frontend for a minimal MySQL database

## Manual / local-dev installation

### Bootstrap the backend

Install MySQL, then:

```
CREATE DATABASE dbTest2;
USE dbTest2;
SOURCE sql/00_create.sql
SOURCE sql/01_add_data.sql
GRANT ALL PRIVILEGES ON `dbTest2`.* TO 'test'@'%' IDENTIFIED BY 'VerySecret' WITH GRANT OPTION;
```

### Bootstrap the frontend

* `npm install`
* `npm run buildprod`
* (alternatively: `npm run builddev`)
* `./server.sh start`

And you're good to go.


## Building a Docker image

`docker image build --build-arg DB_SERVER="yadda" --build-arg DB_PASSWD="verysecret" -t frontend:latest . `

For the details see `Dockerfile`.


## Building by Jenkins

Just wraps a regular Docker build, with Jenkins parameters for the connection settings and a Jenkins credential for the name+password of the DB user.

NOTE: These are the parameters that will be built into the image as defaults. If needed, they can be overridden on a per-instance basis by regular environment variables.


## Testing

As the DB is not part of this build, `npm test` will only test the server connectivity by checking `http://127.0.0.1:8080/rest/healthz`.

Another test route is `http://127.0.0.1:8080/rest/healthz/hostname`, which returns 200 + the hostname, so we can use it to test load
balancer setups.


## Building for RHOO

Before anything else, [here](https://docs.openshift.com/online/getting_started/beyond_the_basics.html) is the official
example project, it is very well documented and it gives a known-good starting point to start from.

RHOO builder pods are also running in containers (and without root privileges), so a usual Docker build is out of question.

Instead of that, the build image is chosen according to the 'type' of the sources (see [here](https://github.com/openshift-s2i)),
and in case of the .js build, the [image](https://github.com/sclorg/s2i-nodejs-container) contains another tooling layer, the
[source-to-image](https://github.com/openshift/source-to-image).

Basically, it's a minimalistic framework that employs [4 shell scripts](https://github.com/sclorg/s2i-nodejs-container/tree/master/8/s2i/bin)
to build ('assemble'), and to run ('run') the application (the other two are for artifact re-use and usage messages).

The [build process of s2i](https://docs.openshift.com/online/creating_images/s2i.html#build-process) collects the
sources and the scripts and the artifacts to a tarball, transfers it to a pristine container, then executes the scripts,
and then the image of this container will be the result of the build process. (And will be tracked by an ImageStream,
but that's another story.)

This whole process starts when we choose the [Source-to-Image build strategy](https://docs.openshift.com/online/dev_guide/builds/build_strategies.html).
(Again, the other strategy, 'pipeline' [*won't work*](https://stackoverflow.com/questions/52786732/openshift-jenkins2-docker-command-not-found),
because its Jenkins cannot execute `docker`.)

Technically, the command would be `oc new-app https://github.com/...`, and all the details would be deduced/guessed by
`oc`, which is usually OK if the things are working and there are no bugs left in our project, and when it is guessed right.

Here, the presence of `Jenkinsfile` fools the mechanism to treat it as a 'pipeline' strategy build, which it is not,
so we must specify this explicitely: `oc new-app --strategy=source https://github.com/gsimon75-web/Vue_MySQL_Example`

On the other hand, during development we may need some more precise control, so we may use a *template file*:
`oc new-app -f openshift/templates/app.json`.

So, basically, this template file will describe the build environment, and the actual build process will be described
by the 'assemble' s2i-script. To which our next problem is related...


### Build process vs. OOM killer

The core of the [default](https://github.com/sclorg/s2i-nodejs-container/blob/master/8/s2i/bin/assemble) assemble script 
is 3 commands:

1. `NODE_ENV=development npm install`
2. `npm run build --if-present`
3. `npm prune`

For the official example it works, for a somewhat heavier project (like this, with all the VueJS build-deps) the first
step gets killed off by the OOM killer. I don't really know why, the memory limit is 2 GBs, and with the same versions
(npm@6.4.1, node@v8.16.0) it seems to require some 300 MBs, but it does get killed.

Fortunately, we can [override](https://docs.openshift.com/online/dev_guide/builds/build_strategies.html#override-builder-image-scripts)
the default scripts, either by modifying the template .json, or by adding `.s2i/bin/assemble`.

This latter file is based on the official one, the only difference (apart from fixing some un-quoted var references) is
that it installs the npm packages one by one. Definitely slower, but at least it survives to do the job...


