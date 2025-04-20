# LAB01: Deploy Infrastructure #

What You Are Doing:<br>
Use Ansible to deploy Application Stack. 

### Architecture ###
![alt text](../Files/lab_architecture.jpg)


---
## Lab Guides ##

### LAB01 ###

This lab guides users through setting up an Ansible environment to manage remote servers. It begins by validating the Ansible installation and configuring the working directory. Azure Bastion tunnels are then established to enable secure SSH connections to virtual machines, with each VM assigned a unique local port for communication. An Ansible inventory file is created to define the remote servers, specifying connection details like IP, SSH port, username, and private key. Host key checking is disabled for simplicity in the lab environment. Finally, ad-hoc Ansible commands are used to verify connectivity, list managed hosts, and gather system information, ensuring the environment is ready for automation tasks.

[BEGIN LAB01 ➡](LAB01.md)

--- 

### LAB02 ###

This lab guides users through creating and using a custom Ansible role to automate the setup of Web API servers. Roles in Ansible allow for modular and reusable configurations by organizing related tasks, variables, and other artifacts into a structured directory. In this lab, a web_api_server role is created to install Docker, configure Python dependencies, authenticate with a Docker registry, pull a Docker image, and run a containerized Web API application. The role is then executed using a playbook, ensuring idempotency and verifying the deployment by accessing the API through a load balancer. 

[BEGIN LAB02 ➡](LAB02.md)

---