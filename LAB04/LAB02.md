# Lab Guide #

This lab guides users through 

write a short paragraph that summarizes what this step in the lab is performing

## Custom App Role  ##

Roles let you automatically load related vars, files, tasks, handlers, and other Ansible artifacts based on a known file structure. After you group your content into roles, you can easily reuse them and share them with other users. An Ansible role has a defined directory structure with seven main standard directories. You must include at least one of these directories in each role. You can omit any directories the role does not use. 

Create an Ansible role structure:

```sh
# Create default roles directory
mkdir roles

# Create web_api_server directory
mkdir roles/web_api_server

# Create tasks directory
mkdir roles/web_api_server/tasks

# Create vars directory
mkdir roles/web_api_server/vars

# Create tasks/main.yml
touch roles/web_api_server/tasks/main.yml

# Create vars/main.yml
touch roles/web_api_server/vars/main.yml
```

It should look like this when done. 
```sh 
roles/
└── web_api_server/
    ├── tasks/
    │   ├── main.yml
    ├── vars/
    └──── main.yml
```


#### 01. tasks/main.yml ####

```yml
---

- name: Update apt cache and upgrade packages
  apt:
    update_cache: yes
    upgrade: dist
  become: yes

- name: Install Docker
  apt:
    name: docker.io
    state: present
  become: yes

- name: Add user to docker group
  user:
    name: "{{ ansible_user }}"
    append: yes
    groups: "docker"
  become: yes

- name: Install Python3 and pip
  apt:
    name:
      - python3
      - python3-pip
    state: present
  become: yes
  when: ansible_distribution == "Ubuntu"

- name: Install Python Docker SDK
  pip:
    name: docker
    state: present
  become: yes

- name: Install Docker Compose
  apt:
    name: docker-compose
    state: present
  become: yes

- name: Login to Docker registry
  docker_login:
    registry_url: ghcr.io
    username: "{{ github_user }}"
    password: "{{ github_token }}"
  register: login_result
  become: yes

- name: Pull Docker image
  docker_image:
    name: "{{ dockerimage }}"
    tag: latest
    source: pull
  register: docker_image
  when: login_result is not failed
  become: yes

- name: Run Docker container exposing app on port 80
  docker_container:
    name: demo-app
    image: "{{ dockerimage }}:latest"
    state: started
    ports:
      - "80:80"
  become: yes
```


#### 02. vars/main.yml ####

```yml
---

github_user: "{{ lookup('env', 'GITHUB_USER') }}"
github_token: "{{ lookup('env', 'GITHUB_TOKEN') }}"
dockerimage: "{{ lookup('env', 'DOCKER_IMAGE') }}"
```

--- 

## Setup Main Ansible File ##

Create ```web_api.yml``` in root of Ansible directory:
```sh
touch web_api.yml
```


The ```web_api.yml``` Ansible file calls the role and executes. Copy this content into it: 

```yml
---

- hosts: webservers
  gather_facts: yes
  roles:
    - role: web_api_server
```

Now run the ```web_api.yml``` playbook. You should get results like the following. 

```sh
ansible-playbook web_api.yml
```
```sh
# TERMINAL OUTPUT:
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible-playbook web_api.yml

PLAY [webservers] *****************************************************************************************************************************************************************************************************************************************************************************************************************

TASK [Gathering Facts] ************************************************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Update apt cache and upgrade packages] *********************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Install Docker] ********************************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Add user to docker group] **********************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Install Python3 and pip] ***********************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Install Python Docker SDK] *********************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver2]
changed: [webserver1]

TASK [web_api_server : Install Docker Compose] ************************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Login to Docker registry] **********************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Pull Docker image] *****************************************************************************************************************************************************************************************************************************************************************************************
changed: [webserver1]
changed: [webserver2]

TASK [web_api_server : Run Docker container exposing app on port 80] **************************************************************************************************************************************************************************************************************************************************************
[DEPRECATION WARNING]: The container_default_behavior option will change its default value from "compatibility" to "no_defaults" in community.general 3.0.0. To remove this warning, please specify an explicit value for it now. This feature will be removed from community.general in version 3.0.0. Deprecation warnings can 
be disabled by setting deprecation_warnings=False in ansible.cfg.
changed: [webserver1]
changed: [webserver2]

PLAY RECAP ************************************************************************************************************************************************************************************************************************************************************************************************************************
webserver1                 : ok=10   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
webserver2                 : ok=10   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

---

## Checking the Server ##

Get Public IP of LoadBalancer
```sh
terraform -chdir=/workspaces/lab-api/infra/terraform output lb_public_ip
```
```sh
# TERMINAL OUTPUT: YOURS WILL BE DIFFERENT! 
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ terraform -chdir=/workspaces/lab-api/infra/terraform output lb_public_ip
"52.179.129.62"
```

Using curl let's call our API and validate we get a response:
```sh
curl http://52.179.129.62/server
```
```sh
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ curl http://52.179.129.62/server
{"hostname":"22730a723d29","platform":"linux","architecture":"x64","uptime":114254.41,"memory":{"total":8324276224,"free":7421132800},"cpus":2}
```
---

## Idempotentcy ##

Validate that the script is Idempotent by running it again and validating the results:
```sh
ansible-playbook web_api.yml
```
```sh
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible-playbook web_api.yml

PLAY [webservers] *****************************************************************************************************************************************************************************************************************************************************************************************************************

TASK [Gathering Facts] ************************************************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Update apt cache and upgrade packages] *********************************************************************************************************************************************************************************************************************************************************************
ok: [webserver1]
ok: [webserver2]

TASK [web_api_server : Install Docker] ********************************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Add user to docker group] **********************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Install Python3 and pip] ***********************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Install Python Docker SDK] *********************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Install Docker Compose] ************************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Login to Docker registry] **********************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Pull Docker image] *****************************************************************************************************************************************************************************************************************************************************************************************
ok: [webserver2]
ok: [webserver1]

TASK [web_api_server : Run Docker container exposing app on port 80] **************************************************************************************************************************************************************************************************************************************************************
[DEPRECATION WARNING]: The container_default_behavior option will change its default value from "compatibility" to "no_defaults" in community.general 3.0.0. To remove this warning, please specify an explicit value for it now. This feature will be removed from community.general in version 3.0.0. Deprecation warnings can 
be disabled by setting deprecation_warnings=False in ansible.cfg.
ok: [webserver2]
ok: [webserver1]

PLAY RECAP ************************************************************************************************************************************************************************************************************************************************************************************************************************
webserver1                 : ok=10   changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
webserver2                 : ok=10   changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```
>**NOTE**  
> Notice that the output is differnt this time.. They just say ```ok``` vs ```changed```. 

---
# End of Lab 
   
[⬅ Back to LABGUIDE](LABGUIDE.md) | 