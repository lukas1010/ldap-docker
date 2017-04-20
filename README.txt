1. Install Docker 
- Follow instructions at https://docs.docker.com/engine/installation/

2. Build docker image
- Open Terminal
- change directory to project folder which contains file Dockerfile
    cd where_you_put_project_source
- Build docker image using below command:
    docker build -t ldap-user-management .
- Please don't forget the "." at the end of above command. And ldap-user-management is the repository name of your image. You can change it to anything you like.

3. Export docker image to .tar file
- List all current images on your machine by:
    docker images 
  
    + Here is the output: 

    REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE    
    ldap-user-management    latest              258b78d37b28        7 days ago          869 MB

- Save image to file .tar file by:
    docker save ldap-user-management > ldap-user-management.tar

4. Deploy docker image to your server
- Install docker (follow step 1) on your server
- Load .tar file to docker images on server
    docker load < ldap-user-management.tar
- List all current images on your machine by:
    docker images 
  
    + Here is the output: 

    REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE    
    ldap-user-management    latest              258b78d37b28        7 days ago          869 MB

- Run image:
    docker run -d -t -p 80:3000 ldap-user-management

    Where 80 is port you want to run the site on.

- List all containers running on docker
    docker ps

    + here is the output

    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                              NAMES
    58733f1d761d        ldap-user-management      "node server.js"    5 seconds ago       Up 4 seconds        4000/tcp, 0.0.0.0:80->3000/tcp   ecstatic_mayer


- Stop current running image:
    docker stop 58733f1d761d

    + 58733f1d761d is the CONTAINER ID above 


