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
Activate the virtualenv with
```bash
source $(pipenv --venv)/bin/activate
```
or, for a sub-process shell, `pipenv shell`.

Now you can run the service with:
```
python api.py
```
Service runs on `localhost:5000`

## Build With Docker
Not ready yet.