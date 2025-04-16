# Lab Guide #

Dockerfiles are used to automate the creation of Docker images. They are text files that contain a set of instructions for building a Docker image. Each instruction in a Dockerfile defines a step by step in the image creation process, such as specifying the base image, copying files, installing dependencies, or running commands. 

We'll use a Dockerfile to create our custom image that contains our Demo WebAPI.


## Setup App and /src Directory ##
In this step, you prepare the repository for your application by setting up the necessary directory structure and copying the required files. First, ensure you are in the lab-api directory using the cd command. Then, create a new src directory within the lab-api directory using the mkdir command. Finally, copy the server.js file from the msft-intro-to-gitops repository (src) into the newly created src directory. This setup organizes your application files and ensures the server.js file is in the correct location for further development. After completing these steps, your lab-api repository should have a structure with a src folder containing the server.js file.

1. First step is preparing our repo for our app. To do this we need to be sure we are in our ```lab-api``` directory. And we need to create our ```src``` directory and copy the required files into it. The ```server.js``` and ```packages.json``` files can be found in the ```msft-intro-to-gitops``` repo under ```LAB02/src/```. 

    1. Make sure we are in the correct directory:
        ```sh
        cd /workspaces/lab-api
        ```
    
    2. Create ```/src``` directory:
        ```sh
        mkdir src
        ```
    
    3. Copy ```server.js``` to ```/src```:
        ```sh
        cp -r ../msft-intro-to-gitops/LAB02/src/ src/
        ```

    What the ```lab-api``` repo should look like: 
    ```sh
    .
    ├── Dockerfile
    ├── README.md
    └── src
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
    >[!NOTE]
    > The name of the Dockerfile is case-sensative. ```docker build``` expects that the name to be ```Dockerfile``` not ```dockerfile```. 
---
2. Copy following content into your ```Dockerfile``` and save the file. 
    ```Dockerfile
    FROM node:18

    # Set the working directory
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json
    COPY package*.json ./

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
    > ![alt text](imgs/lab02-202.jpg)

---

## Build our first Image ##




---
# End of Lab 
   
[⬅ Back to LABGUIDE](LABGUIDE.md) | [Next to LAB03 ➡](LAB03.md)