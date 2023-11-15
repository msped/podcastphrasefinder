FROM python:3.10-alpine
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN adduser --system --no-create-home worker

# install psycopg2 dependencies
RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY backend/ backend/
COPY podcasts/ podcasts/
COPY .env manage.py ./

RUN python3 manage.py collectstatic --no-input --settings-backend.settings.production

EXPOSE 8000

USER worker

CMD [ "gunicorn", "--bind", ":8000", "--workers", "4", "backend.wsgi:application" ]