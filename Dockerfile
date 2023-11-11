FROM python:3.10-alpine
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /backend

# install psycopg2 dependencies
RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev


COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "gunicorn", "--bind", ":8000", "--workers", "4", "backend.wsgi:application" ]