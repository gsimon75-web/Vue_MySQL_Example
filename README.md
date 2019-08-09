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

For the official example it works, for a somewhat heavier project (like this, with all the VueJS build-deps) the
`npm build` step gets killed off by the OOM killer. I don't really know why, the memory limit is 2 GBs, and with the
same versions (npm@6.4.1, node@v8.16.0) it seems to require some 300 MBs, but it does get killed.

Fortunately, we can [override](https://docs.openshift.com/online/dev_guide/builds/build_strategies.html#override-builder-image-scripts)
the default scripts, either by modifying the template .json, or by adding `.s2i/bin/assemble`.

This latter file is based on the official one, the only difference (apart from fixing some un-quoted var references) is
that it installs the npm packages one by one. Definitely slower, but at least it survives to do the job...


### Creating the DB service

```
$ oc new-app mariadb -e MYSQL_ROOT_PASSWORD='verysecret'
--> Found image 0bc796f (12 days old) in image stream "openshift/mariadb" under tag "10.2" for "mariadb"
...
--> Success
    Application is not exposed. You can expose services to the outside world by executing one or more of the commands below:
     'oc expose svc/mariadb' 
    Run 'oc status' to view your app.
```

Don't run that `oc expose ...`, it wouldn't do us any good.

It would create a **Route**, which is actually an HTTP or TLS reverse proxy: it would dispatch HTTP traffic by the path part
of its URL or TLS traffic by its SNI option to various services.

The MySQL protocol is neither HTTP-, nor TLS-based, so *routes* are useless for us.


### Initialising the DB

We should
1. Add a DB user and set its password and privileges
2. Create the table structure
3. (Optionally) Insert some example data content

We have the `sql/00_create.sql` and `01_add_data.sql` scripts for this, but we need to access the DB to run them, and
this is not that trivial on RHOO as it seems.

Exposing HTTP or TLS-based services would be easy, it seems to me that this is the primary application area that RHOO was
designed for, but for any other protocols like MySQL/MariaDB it seems impossible.

[Here](https://docs.openshift.com/container-platform/3.6/dev_guide/expose_service/index.html) is the
documentation, and here are the problems I encountered:

1. Routers work with HTTP or TLS, out of question for us.
2. ExternalIP and NodePort needs access to the external IP pool of the cluster, that needs admin rights, what we don't
   have on RHOO.
3. LoadBalancers, well, they almost work, but the documentation about this seems somewhat bogus...

#### LoadBalancer issues

[Here](https://docs.openshift.com/container-platform/3.6/dev_guide/expose_service/expose_internal_ip_load_balancer.html#expose-lb-project)
is the documentation.

1. "You must expose the service as a route using the oc expose command."

    Nope. We are talking about a non-HTTP/TLS protocol, why on Earth would we create a `Route` for it?!
    I've actually tested it, and the LoadBalancer functionality (as much as actually works of it) doesn't need this.

2. "On the master ..."

    On RHOO I don't have any masters, so let's read this as 'On any pods in the cluster'.

3. `curl <pod-ip>:<port>`

    Or rather `<cluster-ip-of-service>:<port>`, as we are talking to **services** and not to **pods**.

4. "Example 1. Sample load balancer configuration file"

    The `selector` is a **pod** selector (sigh), so it must match the label of the DB **pod** and not of the DB
    **service**, so it's not `name: mysql`, but rather `app: mysql` (or `app:mariadb` in our case)

5. "On the master ... `curl <public-ip>:<port>`"

    On any within-cluster pod ... `curl <cluster-ip-of-loadbalancer>:<port>`.
    
    And **up to this point** it actually works, the problems come when trying this from the outside world.

6. "On the node ... Restart the network to make sure the network is up."

    It is already up. First: why would it be down, and second: we have just tested it via the DB service IP and via the
    LoadBalancer as well, and it worked.

    This is like the joke tech-support response of "Restart your computer. If it is switched off, then switch it on and then restart it."

7. "Add a route between the IP address of the exposed service on the master..."

    What? That's why the LoadBalancer comes into the picture, so the world will access the LB and the LB will access
    the DB service, now from within the cluster.
    
    Btw., even adding a 'free for all' allow-everything rule doesn't change anything.

8. "...to make sure you can reach the service using the public IP address..."

    Whose 'public IP address'? The one of the DB service, or the one of the LB service (because that's a service
    too)? And to reach which service, the DB or the LB?

9. "On the system that is not in the cluster: Restart the network to make sure the network is up."

    Have the client restart *their* network? Ehmm... the most polite word I have for this is 'ridiculous'.

10. "Add a route between the IP address..."

    What? On the not-in-cluster client?! Oh, I see, it's a copy-paste of the 'On the node' section...

11. And here ends the section, in the middle of nowhere.

    And it isn't working.


What I actually managed to achieve:

* From within the cluster, the DB was reachable both via the DB service cluster IP and via the LB service cluster IP.

* From outside the cluster via the External-IP (`loadBalancer.ingress.hostname` in resource yaml on the web ui) it hasn't responded,
    neither on the `port` (3306), nor on the `nodePort` (the one above 30000).

From within the cluster it is accessible via the LoadBalancer, so that (as a functionality) works fine, but from the world it
isn't accessible, so

* Either there is something with the firewalling between the world and the External-IP of the LB, and the traffic doesn't reach the LB
* Or it does, but there's some problem with some source ACLs of the LB, and it discards the from-world traffic it gets

As I don't have access neither to the LB nor to the firewall, I can't investigate this issue further.
I tried to look it up in the docs, but... as you saw, they aren't that useful on this level of details.

Btw, [someone else](https://stackoverflow.com/questions/46422255/how-to-get-and-external-ip-for-mongodb-in-openshift-3#comment79830853_46422255)
seems to have reached a similar conclusion.


#### Via `port-forward`

Using the good old Kubernetes feature we can open a port on the local machine and tunnel its traffic to a given port on
a pod through the Kubernetes management channels, see `kubectl port-forward --help`.

This way we can access the 3306/tcp port on the first (and now only) pod of the DB service, and finally do that DB
initialisation.

First of all, **edit** `sql/00_create.sql` and

1. Replace that `127.0.0.1/8` with `%` so the user can connect from anywhere

2. I know it would be nicer to enable only the cluster subnet, but on RHOO we don't have the rights to
   get that info (`oc get clusternetworks`, I think)

3. Enter a more elaborate DB user password (I'll use `SsBYnFOIatxos-U4No8J` in this example)

4. `/oc-mysql.sh -h svc/mariadb -u root < sql/00_create.sql`

5. `/oc-mysql.sh -h svc/mariadb -u root < sql/01_add_data.sql`


Please note that we haven't used the DB root password, because from the viewpoint of the DB we are connecting from
localhost to localhost (because of the tunneling), and that is a different case than connecting from other hosts.

If we tried connect to localhost with password, we'd get an Access Denied, because that password is for connecting
from outside.  If we tried to connect to the cluster IP of the DB service, then we'd need the password, and it would
indeed work.

Well, that was the DB initialisation.

(Plus 2 days of investigating for me, while I chewed through all the docs and all the articles on the Net and tried and
checked every f...ine possible approach and option... No, I don't think too high of the documentation of this part.)


#### That `oc-mysql.sh` script

A small bash trickery about argument manipulating and async coproc handling, because after all this struggle
I really needed something that actually *works*.

To maintain the tunnel, the command `oc port-forward` stays running until we shut it down, so it must be running in the
background.

But the port number of the local endpoint of the tunnel is known only when the tunnel has been established, and it's
written to the output in a human-readable form only, so we need to

1. Launch `oc port-forward` asynchronously
2. Wait for this output line
3. Parse the port number from it
4. Leave the `oc port-forward` running
5. Do what we want to do through the tunnel
6. Finally shut the `oc port-forward` down

Rarely used, but that's exacly what the `coproc` command of `bash` is for.

As of the commandline parameters, I wanted to pass everything to the `mysql` cli, except for two: the destination host
and port. So we copy the arguments to a temporary array, filtering and parsing the `-h`, `--host`, `--host=...`, `-P`,
`--port`, `--port=...`, and finally overwriting the positional parameters with this array.

(Quite simple, as long as we're careful about when to trigger word splitting and when not, like noting those subtle
differences between `$*` and `$@`, double-quoted and not.)

Then, we just invoke `mysql` with the host and port of the tunnel local endpoint and the rest of the parameters, and
finally we shut down the tunnel by killing the `oc port-forward` command.


### Directing the app to the DB service

Just set its environment variables:

`oc set env dc/vuemysqlexample DB_SERVER=mariadb DB_PASSWORD='SsBYnFOIatxos-U4No8J'`


