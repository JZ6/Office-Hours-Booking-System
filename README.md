Office hours booking system.

[Use Cases](https://docs.google.com/document/d/1pIAb_yHoHQygp31I1gV69eHaMwOaWXZtDMfVHg3q5eQ/edit#)  

[Documentation](https://docs.google.com/document/d/1-VHavoGppWTVAineryO-NlzCJdTgDJ3_fJS8DzKlwZM/edit?usp=sharing)

## Docker Compose (API and DB Services)
Build the images on first run and on code changes:
```
docker-compose build
```
Spin up the container:
```
docker-compose up
```
Now we can send requests to the API service that will send CRUD operations to the
DB service.
