# Lab Guide #

This lab sets up the Ansible environment by validating the installation of Ansible and configuring it for managing remote servers. It begins by checking the installed version of Ansible to ensure it is properly set up. The working directory is then set to the appropriate location for Ansible configurations. Following this, Azure Bastion tunnels are configured to enable secure SSH connections to virtual machines, with each VM assigned a unique local port. This ensures secure and efficient communication between the Ansible control node and the target hosts.

### Setting up Ansible Environment ###

Validate Ansible is installed..
```sh
ansible --version
```
```sh
# TERMINAL OUTPUT:
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible --version
ansible 2.10.17
  config file = None
  configured module search path = ['/home/vscode/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3/dist-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.9.2 (default, Mar 20 2025, 02:07:39) [GCC 10.2.1 20210110]
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

Set Working Directory to ansible:
```sh
cd /workspaces/lab-api/infra/ansible
```

#### Configure Bastion Tunnels ####

Setting up our Bastion Tunnel that we'll use for Secure SSH connections. This command will loop through each element in the $VMS_ID Varible we created out of the Terraform Output and establish an Azure Bastion Tunnel binding ports 10022 and 20022 to port 22 on each of the Azure VMs (hosts). The ```&```` at the end of the command told Linux to run the command as a background job. 
```sh
# Create Bastion Tunnels for each VM
PORT=10022
for vm_resource_id in $VMS_ID; do
  az network bastion tunnel \
    --name $BASTIONNAME \
    --resource-group $RESGROUP \
    --target-resource-id "$vm_resource_id" \
    --resource-port "22" \
    --port "$PORT" &
  echo "Tunnel created for $vm_resource_id on port $PORT"
  PORT=$((PORT + 10000)) # Increment port for the next VM
done
```
```sh
# TERMINAL OUTPUT
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ # Create Bastion Tunnels for each VM
PORT=10022
for vm_resource_id in $VMS_ID; do
  az network bastion tunnel \
    --name $BASTIONNAME \
    --resource-group $RESGROUP \
    --target-resource-id "$vm_resource_id" \
    --resource-port "22" \
    --port "$PORT" &
  echo "Tunnel created for $vm_resource_id on port $PORT"
  PORT=$((PORT + 10000)) # Increment port for the next VM
done
[1] 21917
Tunnel created for /subscriptions/f5cc0b2b-b4ba-437f-b770-863a80cf9da0/resourceGroups/rg_bmmudtyw4/providers/Microsoft.Compute/virtualMachines/webapp0 on port 10022
[2] 21918
Tunnel created for /subscriptions/f5cc0b2b-b4ba-437f-b770-863a80cf9da0/resourceGroups/rg_bmmudtyw4/providers/Microsoft.Compute/virtualMachines/webapp1 on port 20022
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ Opening tunnel on port: 20022
Tunnel is ready, connect on port 20022
Ctrl + C to close
Opening tunnel on port: 10022
Tunnel is ready, connect on port 10022
Ctrl + C to close
## JUST PRESS ENTER WHEN YOU SEE 'Ctrl + C to close' and that'll bring back your prompt like below. 
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

>**NOTE**  
> If your Variables are nolonger set (which can happen if CodeSpaces timesout or logs you out.), simply run these 3 commands to reinitialize them. Don't worry if the command take a moment to execute as it is running the ```terraform output``` three times.
```sh
# Extract Output to Variables
VMS_ID=$(terraform -chdir=/workspaces/lab-api/infra/terraform output -json vm_resourceId | jq -r '.[]')
BASTIONNAME=$(terraform -chdir=/workspaces/lab-api/infra/terraform output -json BastionName | jq -r '.')
RESGROUP=$(terraform -chdir=/workspaces/lab-api/infra/terraform output -json ResourceGroupName | jq -r '.')
```

Check to see the jobs are running:
```sh
jobs
```
```sh
# TERMINAL OUTPUT:
[1]-  Running  az network bastion tunnel --name $BASTIONNAME --resource-group $RESGROUP --target-resource-id "$vm_resource_id" --resource-port "22" --port "$PORT" &
[2]+  Running  az network bastion tunnel --name $BASTIONNAME --resource-group $RESGROUP --target-resource-id "$vm_resource_id" --resource-port "22" --port "$PORT" &
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 

```

#### Setup Ansible Inventory File #### 

This step involves setting up an Ansible inventory file, which defines the remote servers that Ansible will manage. The inventory.yml file is created and populated with details for two web servers (webserver1 and webserver2). Each server is configured with its local IP address (127.0.0.1), unique SSH port (10022 and 20022), username (labAdmin), and the path to the private SSH key (~/.ssh/docker). This inventory file is essential for Ansible to identify and connect to the target hosts during automation tasks.

Create new inventory file:
```sh
touch inventory.yml
```

Add the following to your ```inventory.yml``` file:
```yml
---
webservers:
  hosts:
    webserver1:
      ansible_host: 127.0.0.1
      ansible_port: 10022
      ansible_user: labAdmin
      ansible_key_file: ~/.ssh/ansible
    webserver2:
      ansible_host: 127.0.0.1
      ansible_port: 20022
      ansible_user: labAdmin
      ansible_key_file: ~/.ssh/ansible
```

#### Set Host Key Checking to False ####

This step disables SSH host key checking to simplify the lab setup process. It provides two methods: the first sets the ```ANSIBLE_HOST_KEY_CHECKING``` environment variable to False and adds it to .bashrc for persistence across sessions. The second method involves creating an ```ansible.cfg``` file in the working directory, where host key checking is disabled, and paths to the inventory file and private SSH key are specified. This configuration streamlines Ansible's ability to connect to remote hosts without manual SSH key approval, which is useful for lab environments but not recommended for production.

There are a few options to configure this - the first is setting the environment variable ```ANSIBLE_HOST_KEY_CHECKING``` to ```False```. Which is not recommended for Production environments for obvious secureity reasons.. If you go this route be sure to add it to your ```.bashrc``` like the others so it is retained between reboots. Remember to run the ```source . ``` command after setting the value in ```.bashrc```. 

```sh
echo "export ANSIBLE_HOST_KEY_CHECKING=False" >> ~/.bashrc
source ~/.bashrc
```

The second way to set it is to put it in an ```ansible.cfg``` file, and that's a really useful option because you can either set that globally (at system or user level, in ```/etc/ansible/ansible.cfg``` or ```~/.ansible.cfg```), or in an config file in the same directory as the playbook you are running which is what we'll be doing in our lab. 

To save typing and time you can add the path to your ```inventory.yml``` and ```private_key_file``` to the ```ansible.cfg``` file as well.
```ini
[defaults]
host_key_checking = False
inventory = /workspaces/lab-api/infra/ansible/inventory.yml
private_key_file = ~/.ssh/ansible
```

>**NOTE**  
> You can also set a lot of other handy defaults there, like whether or not to gather facts at the start of a play, whether to merge hashes declared in multiple places or replace one with another, and so on. There's a whole big list of options here in the Ansible docs.


### Ad-Hoc Ansible Commands ###

This section demonstrates how to use ad-hoc Ansible commands to interact with remote hosts defined in the inventory file. The ```ansible webservers -m ping``` command tests connectivity by logging into the remote systems and executing a ping module. If errors occur due to directory permissions, setting the ```ANSIBLE_CONFIG``` environment variable resolves the issue by explicitly pointing to the configuration file. Additional commands like ```ansible all --list-hosts``` list all managed hosts, while ```ansible all -m gather_facts``` retrieves detailed system information. These commands are essential for verifying connectivity and gathering data about the target systems.

Run Ping Command. This is not ```ping``` in the sense that you would typically see. This actually logs into the remote system and issues the ping from that location. So it is a great command to do a quick can I talk to my hosts test. 

>**NOTE**  
> The 'webservers' is the top level header in my ```inventory.yml```. 
```sh
ansible webservers -m ping
```

 Running the command gets us an interesting error: 
```sh
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible webservers -m ping
[WARNING]: Ansible is being run in a world writable directory (/workspaces/lab-api/infra/ansible), ignoring it as an ansible.cfg source. For more information see
https://docs.ansible.com/ansible/devel/reference_appendices/config.html#cfg-in-world-writable-dir
[WARNING]: No inventory was parsed, only implicit localhost is available
[WARNING]: provided hosts list is empty, only localhost is available. Note that the implicit localhost does not match 'all'
[WARNING]: Could not match supplied host pattern, ignoring: webservers
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible webservers -m ping
[WARNING]: Ansible is being run in a world writable directory (/workspaces/lab-api/infra/ansible), ignoring it as an ansible.cfg source. For more information see
https://docs.ansible.com/ansible/devel/reference_appendices/config.html#cfg-in-world-writable-dir
[WARNING]: No inventory was parsed, only implicit localhost is available
[WARNING]: provided hosts list is empty, only localhost is available. Note that the implicit localhost does not match 'all'
[WARNING]: Could not match supplied host pattern, ignoring: webservers
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

This is because our ansible directory is writable (CHMOD 0777). The easy fix for this is to simply add an EnvironmentVariable called ```ANSIBLE_CONFIG``` that points to the one you just created. 

```sh
export ANSIBLE_CONFIG='/workspaces/lab-api/infra/ansible/ansible.cfg'
```

Now when you run the command you should get something like this:
```sh
# TERMINAL OUTPUT:
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible webservers -m ping
webserver1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
webserver2 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

To get a list of hosts using our ```inventory.yml``` simply use ```ansible all --list-hosts```
```sh
ansible all --list-hosts
```
```sh
# TERMINAL OUTPUT:
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible all --list-hosts
  hosts (2):
    webserver1
    webserver2
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```

One of the most useful commands for us Operations/Admin people is ```gather_facts```. It gives you pretty much everything you want to know about that server. 

Try it out:
```sh
ansible all -m gather_facts
```

This will dump a ton of information to your stdout stream. So lets make this a bit more useful. This one is only polling ```webserver``` and filtering the output to Ansilbe_EnvVars... 
```sh
ansible all -m gather_facts --limit webserver1 -a 'filter=ansible_env'
```
```sh
# TERMINAL OUTPUT:
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ ansible all -m gather_facts --limit webserver1 -a 'filter=ansible_env'
webserver1 | SUCCESS => {
    "ansible_facts": {
        "ansible_env": {
            "DBUS_SESSION_BUS_ADDRESS": "unix:path=/run/user/1000/bus",
            "HOME": "/home/labAdmin",
            "LANG": "C",
            "LC_ALL": "C",
            "LC_NUMERIC": "C",
            "LOGNAME": "labAdmin",
            "MOTD_SHOWN": "pam",
            "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin",
            "PWD": "/home/labAdmin",
            "SHELL": "/bin/bash",
            "SHLVL": "0",
            "SSH_CLIENT": "10.0.0.5 49598 22",
            "SSH_CONNECTION": "10.0.0.5 49598 10.0.0.68 22",
            "SSH_TTY": "/dev/pts/0",
            "TERM": "xterm-256color",
            "USER": "labAdmin",
            "XDG_RUNTIME_DIR": "/run/user/1000",
            "XDG_SESSION_CLASS": "user",
            "XDG_SESSION_ID": "57",
            "XDG_SESSION_TYPE": "tty",
            "_": "/bin/sh"
        },
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "deprecations": [],
    "warnings": []
}
@BenTheBuilder-MSFTLabs ➜ /workspaces/lab-api/infra/ansible (main) $ 
```
You will find any number of ways to use this. 

---
# End of Lab 
   
[⬅ Back to LABGUIDE](LABGUIDE.md) | [Next to LAB02 ➡](LAB02.md)
