# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir flask flask-socketio eventlet

# Set environment variables for Flask
ENV FLASK_APP=minimal_webserver.py
ENV FLASK_ENV=development

# Run the application
CMD ["python", "minimal_webserver.py"]