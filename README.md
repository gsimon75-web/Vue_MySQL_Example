# Vue MySQL Example
A simple VueJS frontend for a minimal MySQL database

## Bootstrap the backend

Install MySQL, then:

```
CREATE DATABASE dbTest2;
USE dbTest2;
SOURCE sql/00_create.sql
SOURCE sql/01_add_data.sql
GRANT ALL PRIVILEGES ON `dbTest2`.* TO 'test'@'%' IDENTIFIED BY 'VerySecret' WITH GRANT OPTION;
```

## Bootstrap the frontend

* `npm install`
* `npm run buildprod`
* (alternatively: `npm run builddev`)
* `./server.sh start`

And you're good to go.

