# LAB01: Introduction to Git #

##  Create GitHub Repository using GitHub CLI ##

What You Are Doing:<br>
You are creating a new repository on GitHub for your Lab API project directly from your terminal using the GitHub CLI (gh). This eliminates the need to manually create a repo via the web interface and streamlines the process. After all GitOps is all about efficiency. 

## Steps ##

### Step 1: Create and Clone Directory ##
- First we need to update our GITHUB_TOKEN with the version stored in our CodeSpaces Secrets. You do this by running the following command in the Terminal. 

    ```zsh
    GITHUB_TOKEN=$CONFIG_GITHUB_TOKEN
    ```

-   Use the gh repo create command to create a new repository named lab-api:

    ```zsh
    gh repo create lab-api --public
    ```

    - --public makes the repository public (you can omit this if you want it private).
    - **(OPTIONAL)** --clone tells GitHub CLI to clone the repository to your local environment immediately after creating it. 

-   Now lets collect the Repo URL so we can use git to clone it down to our local system: 
    
    ```zsh
    gh repo view lab-api --json url --jq '.url'
    ```

    The output should look like this

    ```cli
    @BenTheBuilder-MSFTLabs ➜ /workspaces $ gh repo view lab-api --json url --jq '.url'
    https://github.com/BenTheBuilder-MSFTLabs/lab-api
    ```
    - repo view: This tells GitHub CLI to view details about a repository.
    - lab-api: This is the name of the repository you are trying to view. In this case, it's a repository named     
    lab-api. It could be a repository in your GitHub account or an organization, depending on your context.
    - --json: This option specifies that you want to get the repository's data in JSON format.
    - url: This tells GitHub CLI that you only want to retrieve the URL of the repository in the JSON output.
    - --jq '.url': This flag is used to filter the JSON output using a JQ expression. jq is a lightweight and flexible command-line JSON processor that allows you to extract and manipulate JSON data easily. It tells jq to extract the value of the url key from the JSON response.

-   This step explains how to clone the repository you created on GitHub to your local development environment and add it to your Visual Studio Code workspace. Here's a breakdown of the commands:

    ```zsh
    cd ..
    git clone https://github.com/BenTheBuilder-MSFTLabs/lab-api
    cd lab-api
    code -a $PWD
    ```
    - cd ..: This command moves you up one directory level in your current file system. It ensures you're not inside a directory that might conflict with the cloning process.
    - git clone https://github.com/BenTheBuilder-MSFTLabs/lab-api: This command uses Git to clone the repository from the specified URL (https://github.com/BenTheBuilder-MSFTLabs/lab-api) to your local machine. Cloning creates a local copy of the repository, including all its files and history.
    - cd lab-api: After cloning, this command navigates into the newly created lab-api directory, which contains the cloned repository.
    - code -a $PWD: This command opens the current directory ($PWD, which stands for "Present Working Directory") in Visual Studio Code and adds it to the existing workspace. The -a flag ensures that the directory is added to the current workspace instead of replacing it.

### Step 2: Create our Working Branch ###

In this step we are going to create a new branch in our local repository called 'setup-repo'. It is important to not commit directly to main (most organizations prevent this). So we need to create a branch for any features/environments we want. We'll use this branch for the next few steps. 


### Step 3: Creating README ###

-   Let's start by creating our README.md file using touch: 

    ```zsh
    touch README.md
    ```

-   Add the Following to the README.md

    ```md
    # Hello World API

    Welcome to the Hello World API! This project is a simple API designed to help you learn and practice essential GitOps concepts, including Git, Docker, and Ansible. The API serves as a foundation for exploring modern development workflows and tools.


    ## Features

    - A simple "Hello World" endpoint to demonstrate API functionality.
    - Designed for hands-on learning with GitOps workflows.
    - Easily containerized with Docker for portability.
    - Configurable and deployable using Ansible.


    ## Project Structure

    lab-api/
    ├── Dockerfile       # Docker configuration for containerizing the API
    ├── README.md        # Project documentation
    ├── .gitignore       # Files and directories to ignore in Git
    ├── src/             # Source code for the API
    └── tests/           # Unit tests for the API

    ## Getting Started

    ### Prerequisites

    Before you begin, ensure you have the following installed:

    - [Git](https://git-scm.com/)
    - [Docker](https://www.docker.com/)
    - [Ansible](https://www.ansible.com/)
    - [GitHub CLI](https://cli.github.com/)

    ### Clone the Repository

    To get started, clone the repository to your local machine. 
   
    ## License

    This project is licensed under the MIT License. See the `LICENSE` file for details.
    ```

-   add and commit

-   Preview README - notice the output error? 
    - Fix by adding ``` around the text. 
    - Add README.md and Commit with -m 'Fixed formatting' 
    - Lets push to our Remote Repository:  ``` git push --set-upstream origin setup-repo ```



- Create .gitignore 

```zsh
# Ignore Docker-related files
*.log
*.pid
*.sock
*.tmp
docker-compose.override.yml
.env
.env.*

# Ignore Ansible-related files
*.retry
*.vault
*.cfg
*.log
*.tmp
inventory/
secrets.yml
```