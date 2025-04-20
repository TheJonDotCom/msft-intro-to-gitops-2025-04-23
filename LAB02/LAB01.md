# Lab Guide #

This lab is designed to introduce you to Docker by validating its installation, running your first container, and exploring basic Docker commands. You'll start by confirming that Docker is installed and operational, then proceed to pull and run the hello-world container to understand how Docker images and containers work. You'll also learn how to list images, check container statuses, and interact with running containers. Additionally, you'll practice stopping and removing containers, as well as cleaning up unused Docker images to manage system resources effectively. By the end of this lab, you'll have a solid foundation in using Docker for containerized application development.


## Validate Docker Install ##

Before we dive into building our dockerApp, we should validate that docker is installed and working. 

```sh
# Validate Docker is installed
docker --version
```
```sh
# TERMINAL OUTPUT: 
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker --version
Docker version 28.0.4, build b8034c0
```

---
## Running our First Container ##

This step introduces you to running your first Docker container, helping you understand the basic workflow of pulling and running images. You will start by pulling the hello-world image from Docker Hub and verifying its presence using Docker commands like docker images. Then, you'll run the container using docker run, which demonstrates how Docker creates and executes containers. This step provides a hands-on experience with essential Docker commands and lays the foundation for working with more complex containers in the future.

1. Pull down hello-world docker image.
    ```sh
    docker pull hello-world
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker pull hello-world
    Using default tag: latest
    latest: Pulling from library/hello-world
    e6590344b1a5: Pull complete 
    Digest: sha256:424f1f86cdf501deb591ace8d14d2f40272617b51b374915a87a2886b2025ece
    Status: Downloaded newer image for hello-world:latest
    docker.io/library/hello-world:latest
    ```
2. Check to see if the image is downloaded. You can use either ```docker images``` or ```docker image list```. Either one will work and do the samething. 
    ```sh
    docker images
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker images
    REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
    hello-world   latest    74cc54e27dc4   2 months ago   10.1kB
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker image list
    REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
    hello-world   latest    74cc54e27dc4   2 months ago   10.1kB
    ```
---
3. Now that the image is pulled down and verified, you are ready to run it. <br>
    the ```-it``` paramenter is a combination of two flags: <br>
     - ```-i```: Keeps STDIN open, allowing interaction with container.<br>
     -  ```-t```: Allocates a seudo-TTY (Terminal Interface)
    
    <br>
    
    ```sh
    docker run -it hello-world:latest
    ```
    ```sh
    # TERMINAL OUTPUT
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker run -it hello-world:latest 

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
    1. The Docker client contacted the Docker daemon.
    2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
    3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
    4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.

    To try something more ambitious, you can run an Ubuntu container with:
    $ docker run -it ubuntu bash

    Share images, automate workflows, and more with a free Docker ID:
    https://hub.docker.com/

    For more examples and ideas, visit:
    https://docs.docker.com/get-started/
    ```
---
4.  Now that we have run a container we can use ```docker ps -a``` to see the status of our containers. Tje 'PS' in ```docker ps``` stands for *Process Status*, and ```-a``` tells docker to show *ALL* container statuses vs just active/running containers.
    ```sh
    docker ps -a
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps -a
    CONTAINER ID   IMAGE                COMMAND    CREATED         STATUS                     PORTS     NAMES
    08da131eccfe   hello-world:latest   "/hello"   2 minutes ago   Exited (0) 2 minutes ago             priceless_burnell
    ```
    
    You can see from the OUTPUT that the status of the conatiner was "existed" since it doesn't stay running. Also the Name of each container is randomly generated unless specified during ```docker run``` using ```--name``` property. Take a minute to look at the values returned as this output gives alot of important information. 
---
5.  Suppose we want to our container to run in the background and stay running. Let's run Ubuntu Docker Image.<br>
    You'll see we changed our command and added ```-d``` parameter. This tells Docker to run the container in *detached* mode or in the background. 
    ```sh
    docker run -d -it ubuntu:latest
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker run -d -it ubuntu:latest 
    Unable to find image 'ubuntu:latest' locally
    latest: Pulling from library/ubuntu
    2726e237d1a3: Pull complete 
    Digest: sha256:1e622c5f073b4f6bfad6632f2616c7f59ef256e96fe78bf6a595d1dc4376ac02
    Status: Downloaded newer image for ubuntu:latest
    caf31c883d698c666f8385d0f5c42615ef4f78da1ef79bc5e75b5f74e136fc19
    ```
    >Notice that we didn't have to pull down the docker image first. When execute ```docker run``` it is intelligent enough to try and download the image if it isn't already pulled down locally. It is a good ideal to do ```docker pull``` first, but it isn't a hard requirement. If we want to verify the image is pulled down we simply run ```docker images``` again. 
    ```sh
    docker images
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker images
    REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
    ubuntu        latest    602eb6fb314b   8 days ago     78.1MB
    hello-world   latest    74cc54e27dc4   2 months ago   10.1kB
    ```
    > You can see that ubuntu(latest) was pulled down and added to our list of docker images. 
---
5.  Let's check to see what the status of our containers are. Run ```docker ps``` to see what is running. 
    ```sh
    docker ps
    ```
    ```sh
    # TERMINAL OUTPUT: 
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps
    CONTAINER ID   IMAGE           COMMAND       CREATED          STATUS          PORTS     NAMES
    caf31c883d69   ubuntu:latest   "/bin/bash"   12 minutes ago   Up 12 minutes             priceless_elbakyan
    ```

    > As you can see we have 1 container running and it our 'ubuntu:latest'. 
---
6.  If you want to interact or connect to a running container. You need use ```docker exec```. 
    ```sh
    docker exec -it <replace-with-container-name> /bin/bash
    ```
    ```sh
    # TERMINAL OUTPUT: 
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker exec -it priceless_elbakyan /bin/bash
    root@caf31c883d69:/# 
    ```

    > The terminal changed because you are now logged into the container's bash session. And you can perform any activity that you would on a normal Ubuntu machine. 
---
7. Let's update Ubuntu and install some tools
    ```sh
    # First lets make sure our packages are updated
    apt-get update -y && apt-get upgrade -y

    # Now let's install some usefule tools. Run each of these in your containers terminal. 
    apt-get install net-tools -y
    apt-get install curl -y
    ```
    > Once we have some tools installed we can verify the systems IPAddress and Internet access. 
    ```sh
    # Get Containers IP Info
    ifconfig
    ```
    ```sh
    # TERMINAL OUTPUT:
    root@caf31c883d69:/# ifconfig
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
            inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
            ether 0e:e0:b0:5e:0f:7d  txqueuelen 0  (Ethernet)
            RX packets 3259  bytes 35024193 (35.0 MB)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 2936  bytes 202514 (202.5 KB)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
            inet 127.0.0.1  netmask 255.0.0.0
            inet6 ::1  prefixlen 128  scopeid 0x10<host>
            loop  txqueuelen 1000  (Local Loopback)
            RX packets 0  bytes 0 (0.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 0  bytes 0 (0.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    ```
    > The eth0: IP is the internal docker network running on the host. Think of it as a virtual network switch just for Docker. 
    ```sh
    curl icanhazip.com
    ```
    ```sh
    # TERMINAL OUTPUT:
    root@caf31c883d69:/# curl icanhazip.com
    20.42.11.29
    ```
    > Using curl we can verify that we have access to the internet and get the Public IP associated with our Egress Traffic. 
---
8. Let's stop our ubuntu container. <br>
    First we have to exit our interactive session. You can do this by typing ```exit``` and being returned to our default terminal. 
    ```sh
    exit
    ```
    ```sh
    # TERMINAL OUTPUT:
    root@caf31c883d69:/# exit
    exit
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ 
    ```

    Next we need to run ```docker stop``` to stop the container. It can take a few moments for a container to stop. 
    ```sh
    docker stop <replace-with-container-name>
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker stop priceless_elbakyan 
    priceless_elbakyan
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ 
    ```

    We can verify the container is stopped using ```docker ps``` and/or ```docker ps -a```
    ```sh
    # Display status of running containers
    docker ps

    # Display status of all containers.
    docker ps -a
    ```
    ```sh
    # TERMINAL OUTPUT
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps
    CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps -a
    CONTAINER ID   IMAGE                COMMAND       CREATED          STATUS                        PORTS     NAMES
    caf31c883d69   ubuntu:latest        "/bin/bash"   30 minutes ago   Exited (137) 30 seconds ago             priceless_elbakyan
    08da131eccfe   hello-world:latest   "/hello"      42 minutes ago   Exited (0) 42 minutes ago               priceless_burnell
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ 
    ```
    > You can see that our container status is "Existed (137) 30 seconds ago", indicating that it was stopped.     
---

## Remove Docker Images ##

This step focuses on cleaning up your Docker environment by removing unused containers and images to free up system resources. First, you will identify and remove stopped containers using the docker rm command. Once the containers are removed, you will list all downloaded images with docker images and delete them using docker image rm or its shorthand docker rmi. This ensures your system remains organized and avoids unnecessary storage consumption from unused Docker artifacts.

1.  Before we can remove the images we need to remove the deployed containers. Let's get a list of all containers deployed on our system using ```docker ps -a```. 
    ```sh
    docker ps -a
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps -a
    CONTAINER ID   IMAGE                COMMAND       CREATED          STATUS                       PORTS     NAMES
    caf31c883d69   ubuntu:latest        "/bin/bash"   36 minutes ago   Exited (137) 6 minutes ago             priceless_elbakyan
    08da131eccfe   hello-world:latest   "/hello"      48 minutes ago   Exited (0) 48 minutes ago              priceless_burnell
    ```
    Once we have a list of stopped containers, we can remove them. Just remember they need to be *STOPPED* before you can remove them. 
    ```sh
    docker rm <container-id or container-name>
    ```
    ```sh 
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker rm caf31c883d69
    caf31c883d69
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker rm priceless_burnell
    priceless_burnell
    ``` 
    > In the above example we used the containerId for the first remove operation and the container name for the second remove operation. 

    Let's verify the containers are gone:
    ```sh
    docker ps -a
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker ps -a
    CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ 
    ```
    > As we can see the containers are no longer listed meaning they have been removed. 
--- 
2. Now that the container deployments are gone we can clean up the images we pulled down. First use ```docker images``` to see what images we have pulled down.
    ```sh
    docker images
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker images
    REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
    ubuntu        latest    602eb6fb314b   8 days ago     78.1MB
    hello-world   latest    74cc54e27dc4   2 months ago   10.1kB
    ```

    Once we have the list of images we can remove them using ```docker image rm <image-id>``` or ```docker rmi <image-id>```:
    ```sh
    docker image rm <image-id>
    ```
    ```sh
    # TERMINAL OUTPUT: 
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker image rm 602eb6fb314b
    Untagged: ubuntu:latest
    Untagged: ubuntu@sha256:1e622c5f073b4f6bfad6632f2616c7f59ef256e96fe78bf6a595d1dc4376ac02
    Deleted: sha256:602eb6fb314b5fafad376a32ab55194e535e533dec6552f82b70d7ac0e554b1c
    Deleted: sha256:3abdd8a5e7a8909e1509f1d36dcc8b85a0f95c68a69e6d86c6e9e3c1059d44b3
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker rmi 74cc54e27dc4 
    Untagged: hello-world:latest
    Untagged: hello-world@sha256:424f1f86cdf501deb591ace8d14d2f40272617b51b374915a87a2886b2025ece
    Deleted: sha256:74cc54e27dc41bb10dc4b2226072d469509f2f22f1a3ce74f4a59661a1d44602
    Deleted: sha256:63a41026379f4391a306242eb0b9f26dc3550d863b7fdbb97d899f6eb89efe72
    ```
    > In this example we used both ```docker image rm``` and ```docker rmi``` to demonstrate that they perform the exact same action. Infact ```docker rmi``` is just an alias for ```docker image rm```. The shorthand of ```docker rmi``` is often used and referenced, but it is important to understand that it is really just executing ```docker image rm```. 

    Verify images are removed: 
    ```sh
    docker images
    ```
    ```sh
    # TERMINAL OUTPUT:
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ docker images
    REPOSITORY   TAG       IMAGE ID   CREATED   SIZE
    @BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api (main) $ 
    ```


---
# End of Lab 
   
[⬅ Back to LABGUIDE](LABGUIDE.md) | [Next to LAB02 ➡](LAB02.md)