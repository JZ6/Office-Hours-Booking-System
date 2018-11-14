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

Install Docker. In this directory, execute command:

```
docker build -t api-service:dev --rm .
```

### Run Docker Container
```
docker run -p 5000:5000 --name=api-service api-service:dev
```
Application will be available at `http://localhost:5000`