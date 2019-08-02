This directory contains a Jenkinsfile which can be used to build
vue-mysql-example using an OpenShift build pipeline.

To do this, run:

```bash
# create the nodejs example as usual
oc new-app https://github.com/gsimon75-web/Vue_MySQL_Example

# now create the pipeline build controller from the openshift/pipeline
# subdirectory
oc new-app https://github.com/gsimon75-web/Vue_MySQL_Example \
  --context-dir=openshift/pipeline --name vue-mysql-example-pipeline
```
