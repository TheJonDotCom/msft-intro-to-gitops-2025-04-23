# Lab Guide #

Dockerfiles are used to automate the creation of Docker images. They are text files that contain a set of instructions for building a Docker image. Each instruction in a Dockerfile defines a step by step in the image creation process, such as specifying the base image, copying files, installing dependencies, or running commands. 

We'll use a Dockerfile to create our custom image that contains our Demo WebAPI.


## Setup App and /src Directory ##
In this step, you prepare the repository for your application by setting up the necessary directory structure and copying the required files. First, ensure you are in the lab-api directory using the cd command. Then, create a new src directory within the lab-api directory using the mkdir command. Finally, copy the server.js file from the msft-intro-to-gitops repository (src) into the newly created src directory. This setup organizes your application files and ensures the server.js file is in the correct location for further development. After completing these steps, your lab-api repository should have a structure with a src folder containing the server.js file.

1. First step is preparing our repo for our app. To do this we need to be sure we are in our ```lab-api``` directory. And we need to create our ```src``` directory and copy the required files into it. The ```server.js``` and ```package.json``` files can be found in the ```msft-intro-to-gitops``` repo under ```LAB02/src/```. 

    1. Make sure we are in the correct directory:
        ```sh
        cd /workspaces/lab-api
        ```
    2. Copy ```server.js``` to ```/src```:
        ```sh
        cp -r ../msft-intro-to-gitops/LAB02/src/ src/
        ```

    What the ```lab-api``` repo should look like: 
    ```sh
    .
    ├── Dockerfile
    ├── README.md
    └── src
        ├── packages.json
        └── server.js

    2 directories, 4 files
    ```
---

## Create Dockerfile for App ##

In this step, you create a Dockerfile to define the instructions for building a Docker image for your application. The Dockerfile starts with the node:18 base image, sets the working directory to /usr/src/app, and copies the package.json and package-lock.json files to the container. It then installs the necessary dependencies using npm install. Next, it copies the application files from the src directory into the container. The EXPOSE 80 instruction specifies the port the application will use, and the CMD instruction defines the command to run the application (node src/server.js). This Dockerfile automates the process of containerizing your Node.js application.

1. Create Dockerfile using ```touch```:
    ```sh
    touch Dockerfile
    ```
    >**NOTE**  
    > The name of the Dockerfile is case-sensative. ```docker build``` expects that the name to be ```Dockerfile``` not ```dockerfile```. 
---
2. Copy following content into your ```Dockerfile``` and save the file. 
    ```Dockerfile
    FROM node:18

    # Set the working directory
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json
    COPY ./src/package.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application files
    COPY ./src ./src

    # Expose the port the app runs on
    EXPOSE 80

    # Command to run the application
    CMD ["node", "src/server.js"]
    ```
    > It should look like this: 
    > ![alt text](imgs/lab02-201.jpg)

---

## Build our first Image ##

This step focuses on building a Docker image for your application using the docker build command. The image is created based on the instructions in the Dockerfile, which includes setting up the working directory, installing dependencies, and copying application files. The -t flag assigns a name (demo-api) to the image, making it easier to reference later. Once built, the image is stored locally and can be verified using docker images. This step is essential for containerizing your application and preparing it for deployment.

1. We are going to use ```docker build``` to build our image and store it locally for now. Later we will store the Image in Githubs Container Registry. 
    ```sh
    docker build -t demo-api .
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker build -t demo-api .
    [+] Building 8.7s (10/10) FINISHED                                                                                                                                                        docker:default
    => [internal] load build definition from Dockerfile                                                                                                                                                0.0s
    => => transferring dockerfile: 379B                                                                                                                                                                0.0s
    => [internal] load metadata for docker.io/library/node:18                                                                                                                                          0.1s
    => [internal] load .dockerignore                                                                                                                                                                   0.0s
    => => transferring context: 2B                                                                                                                                                                     0.0s
    => [1/5] FROM docker.io/library/node:18@sha256:df9fa4e0e39c9b97e30240b5bb1d99bdb861573a82002b2c52ac7d6b8d6d773e                                                                                    0.0s
    => [internal] load build context                                                                                                                                                                   0.0s
    => => transferring context: 493B                                                                                                                                                                   0.0s
    => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                                                               0.0s
    => [3/5] COPY ./src/package.json ./                                                                                                                                                                0.0s
    => [4/5] RUN npm install                                                                                                                                                                           4.9s
    => [5/5] COPY ./src ./src                                                                                                                                                                          0.0s 
    => exporting to image                                                                                                                                                                              3.6s 
    => => exporting layers                                                                                                                                                                             3.6s 
    => => writing image sha256:342167ae5aca44cebe72498d2e5cff69a0eff5d14b331b23650a737ee5d186f7                                                                                                        0.0s 
    => => naming to docker.io/library/demo-api   
    ```
    > The ```-t``` tells ```docker build``` to give the image a specific name. This is important when using remote registies. Again more on that later in this lab. 
---

2. Now that we've built our custom image that contains the required ```server.js``` application file. Let's verify it is in our ```docker images```: 
    ```sh
    docker images
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker images
    REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
    demo-api     latest    342167ae5aca   2 minutes ago   1.1GB
    ```
---
3. Another common tool used with docker is ```docker inspect```. The ```docker inspect``` command is used to retrieve detailed information about a Docker object, such as a container or image. It provides low-level metadata, including configuration, networking details, and resource usage, in JSON format.
    ```sh
    docker inspect demo-api
    ```
    ```sh
    # TERMINAL OUTPUT
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker inspect demo-api
    [
        {
            "Id": "sha256:342167ae5aca44cebe72498d2e5cff69a0eff5d14b331b23650a737ee5d186f7",
            "RepoTags": [
                "demo-api:latest"
            ],
            "RepoDigests": [],
            "Parent": "",
            "Comment": "buildkit.dockerfile.v0",
            "Created": "2025-04-16T18:11:11.769445001Z",
            "DockerVersion": "",
            "Author": "",
            "Config": {
                "Hostname": "",
                "Domainname": "",
                "User": "",
                "AttachStdin": false,
                "AttachStdout": false,
                "AttachStderr": false,
                "ExposedPorts": {
                    "80/tcp": {}
                },
                "Tty": false,
                "OpenStdin": false,
                "StdinOnce": false,
                "Env": [
                    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                    "NODE_VERSION=18.20.8",
                    "YARN_VERSION=1.22.22"
                ],
                "Cmd": [
                    "node",
                    "src/server.js"
                ],
                "ArgsEscaped": true,
                "Image": "",
                "Volumes": null,
                "WorkingDir": "/usr/src/app",
                "Entrypoint": [
                    "docker-entrypoint.sh"
                ],
                "OnBuild": null,
                "Labels": null
            },
            "Architecture": "amd64",
            "Os": "linux",
            "Size": 1096335563,
            "GraphDriver": {
                "Data": {
                    "LowerDir": "/var/lib/docker/overlay2/km2151c2cc1g5sx9uj7xmkjgy/diff:/var/lib/docker/overlay2/82so4mg3orjnfv9q3opzqpxrn/diff:/var/lib/docker/overlay2/2gkbecy0ntuwovxnbmuh6i15g/diff:/var/lib/docker/overlay2/2405b3726e14f53c107c9de069aa7b3584af58088f23a953cc9dd44d3055aa74/diff:/var/lib/docker/overlay2/a384c39aa0cef26d3a0d6c39e0e43a2d13126c36c838e33b58266952b0fe073f/diff:/var/lib/docker/overlay2/752ad9fc0a5d2ad3776260af0d4e1649096802bea525655cad53948f027ef7e3/diff:/var/lib/docker/overlay2/b636b55e13c4a6634830651a5c4fa1a3369651802efb5ada3f2b638632aabdaf/diff:/var/lib/docker/overlay2/9a3779c9e5c69145e1ca58ef6e5ad82dcebfd5f7b2dd2b1d3dad5548dfb9749e/diff:/var/lib/docker/overlay2/efb9e9cd323393c7a34bedc79101c4f8ff26dcde385c3df8d59b1b35372a361e/diff:/var/lib/docker/overlay2/e1b520d153e9656e86abdc66ba8c3bc3384541e07587891379cc2c04da666a2f/diff:/var/lib/docker/overlay2/49a3ebddb797c8f6c57b5770416905440da1c0a21a0e889cefa58beb52256dbf/diff",
                    "MergedDir": "/var/lib/docker/overlay2/ocxfwo8e8pbw9tb197d69zg2y/merged",
                    "UpperDir": "/var/lib/docker/overlay2/ocxfwo8e8pbw9tb197d69zg2y/diff",
                    "WorkDir": "/var/lib/docker/overlay2/ocxfwo8e8pbw9tb197d69zg2y/work"
                },
                "Name": "overlay2"
            },
            "RootFS": {
                "Type": "layers",
                "Layers": [
                    "sha256:f7f2b929d8a55112a2db1bc16fb8731045c9572b84d6dfbbdbd5dc6dd2bd9fe4",
                    "sha256:7f0053786e6e2411ce577e795ef6c278601de3faa0817c071801b11a3f83fd0d",
                    "sha256:b2bcbd8ebb2be9869ca3198b4c521f18b612b4287ee4b705678d7b85383b71af",
                    "sha256:6c7c1b88da61a2ad4efd3cb93b6e31b0937d3f4121050a9d1c4ddd00485c7c68",
                    "sha256:adab8b21d9fee78dd3e4cb405d83619dbdbd7b6eb2c6800bc5c288929d4c64d4",
                    "sha256:07f183d69b10a578338dd38e550879233f89618d14cd14cc25e76a0779ee0d8e",
                    "sha256:659ae354f8ac5f9a926958977e3c2f77f9f9aec034603afb2d5bcbd2260aebf0",
                    "sha256:46dec0992c2d732e5cdd3e1c858de02fcd2270d113df14aba65be543bb51a161",
                    "sha256:ec7f8dca8155d5a3050fecb13f48a230312d0afd643b6ebb9727d6c8800c0271",
                    "sha256:80a8ae23549028e9f25e1c5fb007c0809c5319b502a18a2f7ab31184b2435892",
                    "sha256:11b31ac7717ea760607aab98b7a8c76cf63aa4769654c942325f4730b63c59f6",
                    "sha256:c1d2563fb0b0cf2e7e525a244bd92b83d5fabcd7f600ac8874c2e1a261d9af8c"
                ]
            },
            "Metadata": {
                "LastTagTime": "2025-04-16T18:11:15.372268841Z"
            }
        }
    ]
    ```

    >This command can tell you alot about an image. You can pipe it to ```jq``` to query specific information such as current tag and Create date/time:
    
    ```sh
    docker inspect demo-api | jq '.[].RepoTags[0], .[].Created'
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker inspect demo-api | jq '.[].RepoTags[0], .[].Created'
    "demo-api:latest"
    "2025-04-16T18:11:11.769445001Z"
    ```




---
# End of Lab 
   
[⬅ Back to LABGUIDE](LABGUIDE.md) | [Next to LAB03 ➡](LAB03.md)