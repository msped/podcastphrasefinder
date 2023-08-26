# PodFinder

PodFinder is a Django Rest Framework and NextJS application created to make transcripts searchable. It also has the added functionlity of being able to search for guest names.

## Requirements

- To be able to search through transcripts and return results to user.

- Search through to find podcasts under guest names.

- Automatically add back catalogue of podcast transcripts to database.

- Check that the podcast videos are still public at least once a month via a schedule task.

- Obtain new transcripts from podcasts that are uploaded.

### Potentional Features

- Display the text match on the EpisodePanel with the estimated times they quote occurs.

- Creator account to upload own transcripts, request transcripts to send to 3rd party service for exclusive episodes.

## Technologies Used

- [Django Rest Framework](https://www.django-rest-framework.org/)
- [Youtube Transcript API](https://pypi.org/project/youtube-transcript-api/)
- [Celery](https://docs.celeryq.dev/en/stable/index.html)
- [NextJS](https://nextjs.org/)
- [Material UI](https://mui.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [YouTube API](https://developers.google.com/youtube/v3)
- [Docker](https://www.docker.com/)

## Local Development

To run this site locally you will first need to install Docker. You can find the installation guide [here](https://www.docker.com/get-started/).

1. Create the Python virtual environment and enter it

    `python3 -m venv ENV_NAME`
    `source ENV_NAME/bin/activate`

    Your console will now show (ENV_NAME) in front of the current path.

2. Install Backend dependencies

    `pip install -r requirements.txt`

3. Rename `.env.example` to `.env` and populate your environment variables.

4. Run docker-compose.

    `docker-compose up -d`

5. Run Django Migrations

    `python3 manage.py migrate`

6. In another terminal start, enter the vitural environment and start the Celery Worker

    `celery -A backend worker -l INFO`

7. Start the Django Development Server

    `python3 manage.py runserver`

8. Open another terminal and type `cd frontend/` then hit enter.

9. Install the npm dependencies

    `npm i`

10. Run the NextJS Server

    `npm run dev`

You should now be able to view the site at `127.0.0.1:3000/`.

If the wish to access the Django admin panel you will require to create a super user `python3 manage.py createsuperuser` then go to `127.0.0.1:8000/admin/`.
