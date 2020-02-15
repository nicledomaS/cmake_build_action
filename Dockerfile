# Container image that runs your code
FROM mcr.microsoft.com/windows/nanoserver:10.0.14393.953

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY main.py /main.py

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/main.py"]
