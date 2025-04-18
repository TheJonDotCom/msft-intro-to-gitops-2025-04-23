# LAB01: Deploy Infrastructure #

What You Are Doing:<br>
Deploy Infrastructure in Azure using Terraform. 

### Architecture ###
![alt text](../Files/lab_architecture.jpg)


---
## Lab Guides ##

### LAB01 ###

In LAB01, you will set up the foundational environment for using Terraform to manage Azure infrastructure. This includes validating the installation of the Azure CLI (az) and Terraform, logging into Azure, and verifying account details to ensure access to the correct subscription. You will create a directory structure for managing infrastructure as code, including Terraform and Ansible folders, and configure a .gitignore file to exclude sensitive or unnecessary files. Additionally, you will generate a random string for resource naming, store it as an environment variable, and create an Azure Resource Group and Storage Account for managing Terraform state files. By the end of this lab, you will have a fully configured environment ready for deploying infrastructure using Terraform.

[BEGIN LAB01 ➡](LAB01.md)

--- 

### LAB02 ###

In LAB02, you will create and configure the foundational Terraform files required to define and manage Azure infrastructure. This includes setting up files such as provider.tf, data.tf, locals.tf, variables.tf, outputs.tf, and main.tf to structure your Terraform configuration. You will define input variables, local values, and outputs to ensure modularity and scalability. Additionally, you will create a lab.tfvars file to provide specific input values for resource naming, tagging, and application server configurations. By the end of this lab, you will have a complete and organized Terraform configuration ready for deployment, enabling you to manage infrastructure as code effectively.

[BEGIN LAB02 ➡](LAB02.md)

---

### LAB03  ###

In LAB03, you will deploy Azure infrastructure using the Terraform configuration created in the previous labs. You will initialize the Terraform environment with terraform init, format the configuration files with terraform fmt, and preview the planned changes using terraform plan. After reviewing the execution plan, you will apply the changes with terraform apply to provision resources such as virtual networks, network security groups, Azure Bastion, load balancers, and virtual machines. Finally, you will use terraform output to retrieve critical details about the deployed infrastructure, such as resource IDs and IP addresses, and validate the deployment in the Azure Portal. By the end of this lab, you will have a fully deployed and functional Azure environment managed through Terraform.

[BEGIN LAB03 ➡](LAB03.md)

---