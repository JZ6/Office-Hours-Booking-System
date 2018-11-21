# Build/Run
## Local Environment (Without Docker)
Ensure you have Python 3.7 installed. `pyenv` is recommended for managing multiple versions.
### **Install Pipenv**
We use `pipenv` to manage python package dependencies.

```bash
$ pip install --user pipenv
```

### **Install and Run MongoDB**
Either install it as a package on your local machine, or run a Docker image. I recommend the alpine-based image by user `mvertes`.

Docker instructions:
```
$ docker run --name mongo_service -v mongo:/data/db -p 27017:27017 mvertes/alpine-mongo
```

### **Install Dependencies**
`pipenv` will create and manage a virtual environment that contains all the application's dependencies. \
In the project root, run: 
```bash
$ pipenv install
```

### **Run**
Before running, ensure you set the `FLASK_ENV` environment variable (as it is not currently automated) and initialize the database.
```bash
$ export FLASK_APP=api  # for Flask CLI
$ export FLASK_ENV=dev  # for development
```

To use a different database name from the default, set the `MONGO_DBNAME` environment variable.

Activate the virtual environment in a shell subprocess with 
```bash
$ pipenv shell
```

Now you can run the service in the sub-shell with:
```bash
(APIService) $ flask init-db  # on first run
(APIService) $ flask run
```


Service runs on `http://localhost:5000`

### **Testing**
Ensure your CWD is `APIService`. Within a virtualenv shell (or using `pipenv run <command>`), run all unit tests with
```bash
$ python -m unittest
```
See `unittest` documentation for further options.

## With Docker

Make sure Docker is installed.
* If running a GNU/Linux OS, you'll need to install docker-compose separately as well.
* If running using WSL with Windows 10, the discrepancy in drive mounts between WSL and Docker's MobyLinux VM can cause problems with the use of `$PWD` environment variabl. Ensure your `C:` drive has a bind mount at `/c` and execute `docker-compose` commands from that path.

Depending on whether you want a production or development environment, set `FLASK_ENV=prod` or `FLASK_ENV=dev`. At the moment there isn't much difference, but `dev` will drop databases if `flask init-db` is run.

Using `docker-compose` will stand up a fully configured local development server and database.

To build containers with the current repository state, run (in this directory):
```bash
$ docker-compose build
```

And to start the service,
```bash
$ docker-compose up
```

Application will be available at `http://localhost:5001`

### Data Volume
On the first run of a MongoDB docker container, a docker volume `mongo` will be created. If you wish to clear the data and start fresh, stop the mongo container and run command:
```bash
$ docker volume rm mongo
```

Alternatively, if you wish to only drop and reinitialize the database (named in `$DB_NAME`) in a running container, run 
```bash
$ docker exec mongoservice flask init-db
```
