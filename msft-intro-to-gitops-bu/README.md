# msft-intro-to-gitops

Instructions on how to clone this repo and launch CodeSpaces. 

Introduction to GitOps with Github.

1. Intro to GitOps
2. Intro to Git
    - build repo
3. Intro to Docker
    - build API Container
    - NodeJS 18 App
    - Store image in GH Registry
        - docker build -t ghcr.io/benthebuilder-msftlabs/webapi:latest .
        - echo $GITHUB_TOKEN | docker login ghcr.io -u BenTheBuilder-MSFTLabs --password-stdin
        - docker push ghcr.io/benthebuilder-msftlabs/webapi
4. Intro to Terraform
    - use Terraform to deply Infrastructure
      - VNET /24
      - BASTION Service (bastion tunnel for SSH)
      - Pair of VMs behind LB
5. Intro to Ansible
    - use Ansible to configure infrastructure
6. Intro to CI/CD (Github Actions)
    - wrap it all together Github Actions
