# DevOps Toolbox Docker Container


## Overview

This container is designed to provide a robust development environment for DevOps workflows. It includes a variety of tools and packages to streamline infrastructure management, automation, and development tasks. Below is a breakdown of everything installed via the Dockerfile, along with a description of each package and tool.

---

## Installed Packages and Tools

### Core Packages
- **Git**: A distributed version control system for tracking changes in source code during software development.
- **apt-utils**: Provides utilities for managing APT packages in Debian-based systems.
- **openssh-client**: A secure shell client for remote server access and file transfers.
- **gnupg2 & dirmngr**: Tools for secure communication and data storage using encryption.
- **iproute2 & net-tools**: Networking utilities for managing and troubleshooting network configurations.
- **procps & psmisc**: Tools for monitoring and managing system processes.
- **curl & wget**: Command-line tools for transferring data from or to a server.
- **rsync**: A utility for efficiently transferring and synchronizing files across systems.
- **nano, vim, less**: Text editors and file viewers for editing and reading files in the terminal.
- **jq**: A lightweight and flexible command-line JSON processor.
- **build-essential**: A package that includes essential tools for building software.
- **software-properties-common**: Provides utilities for managing software repositories.
- **lsb-release**: Displays Linux Standard Base distribution information.
- **dialog**: A utility for creating interactive dialog boxes in shell scripts.
- **libc6, libgcc1, libstdc++6**: Core libraries required for running applications.
- **libssl-dev & libffi-dev**: Libraries for SSL/TLS and Foreign Function Interface development.
- **zlib1g**: A compression library used for data compression.
- **locales**: Tools for managing language and regional settings.
- **sudo**: Allows users to execute commands with elevated privileges.
- **ncdu**: A disk usage analyzer for the command line.
- **man-db & manpages**: Tools for viewing and managing manual pages.
- **strace**: A diagnostic tool for monitoring system calls.
- **init-system-helpers**: Utilities for managing system initialization.

### Python
- **Python 3**: A versatile programming language for scripting and application development.
- **python3-venv**: Provides support for creating isolated Python environments.
- **python3-dev**: Includes headers and libraries for Python development.
- **python3-pip**: A package manager for installing Python libraries.
- **python3-setuptools & python3-wheel**: Tools for building and distributing Python packages.

### PowerShell
- **PowerShell Core**: A cross-platform automation and configuration management framework.
- **Azure PowerShell Modules**:
  - **Az**: Manages Azure resources.
  - **AzureAD**: Manages Azure Active Directory.
  - **Microsoft.Graph**: Interacts with Microsoft Graph APIs.
  - **powershell-yaml**: Parses and generates YAML files.

### Azure Tools
- **Azure CLI**: A command-line tool for managing Azure resources, with the `bastion` extension pre-installed.

### HashiCorp Tools
- **Terraform**: A tool for infrastructure as code, enabling consistent and repeatable deployments.
- **Packer**: A tool for creating machine images for multiple platforms.

### Ansible
- **Ansible**: A configuration management tool for automating application deployment and system configuration.
- **azure.azcollection**: An Ansible collection for managing Azure resources.

### GitHub CLI
- **GitHub CLI (gh)**: A command-line tool for interacting with GitHub repositories, issues, and workflows.

### Docker
- **Docker CE**: A containerization platform for building, sharing, and running applications in isolated environments.
- **docker-compose-plugin**: Manages multi-container Docker applications.

### VSCode Server
- **VSCode Server**: A lightweight server for running Visual Studio Code in a browser.
- **Extensions**:
  - `4ops.terraform`, `4ops.packer`, `hashicorp.terraform`: Tools for managing infrastructure as code.
  - `ms-azuretools.vscode-azureterraform`, `ms-azuretools.vscode-bicep`: Extensions for Azure resource management.
  - `ms-vscode.powershell`: PowerShell scripting support.
  - `ms-vscode.azurecli`: Azure CLI integration.
  - `ms-dotnettools.vscode-dotnet-runtime`: .NET runtime support.
  - `ms-azuretools.vscode-docker`: Docker management.
  - `github.codespaces`, `github.copilot`, `github.copilot-chat`: GitHub integration and AI-powered coding assistance.
  - `github.vscode-github-actions`, `github.vscode-pull-request-github`: GitHub Actions and pull request management.
  - `redhat.ansible`: Ansible support.
  - `bierner.markdown-preview-github-styles`, `bierner.github-markdown-preview`: Markdown preview with GitHub styles.

---

## Version Tracking Table

| Version | Build Date   | Commit Notes                                   |
|---------|--------------|-----------------------------------------------|
| 1.0.0   | 2025-04-20   | Initial setup with core packages and Docker CE. |
| 1.0.1   | 2025-04-22   | **PENDING** |