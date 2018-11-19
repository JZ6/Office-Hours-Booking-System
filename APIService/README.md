## Build Without Docker
### Install Dependencies
Install pipenv with

```bash
pip install --user pipenv
```
Ensure you have Python 3.7 installed.
In the project folder, run 
```bash
pipenv install
```
to install dependencies.

### Run
#### With virtualenv shell
Activate the virtualenv with
```bash
source $(pipenv --venv)/bin/activate
```
or, for a sub-process shell, `pipenv shell`.

Now you can run the service with:
```
python run.py
```
#### Directly with Pipenv
```
pipenv run python run.py
```

Service runs on `http://localhost:5000`

## Build/Run With Docker

Install Docker. If running linux, you'll need to install docker-compose separately as well.

To build container(s) with your changes, run (in this directory):
```
docker-compose build
```

And to start the service,
```
docker-compose up
```

Application will be available at `http://localhost:5001`

### Data Volume
On the first run, a docker volume `mongo` will be created. If you wish to clear the data and start fresh, run command:
```
docker volume rm mongo
```
