FROM node:4.8.1


ENV OPENLDAP_VERSION 2.4.40

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
        slapd=${OPENLDAP_VERSION}* ldap-utils && \    
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

VOLUME ["/etc/ldap", "/var/lib/ldap"]

RUN npm install -g bower
RUN npm install -g gulp

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/client
RUN mkdir -p /usr/src/app/server

COPY client/ /usr/src/app/client
COPY server/ /usr/src/app/server

EXPOSE 3000
EXPOSE 4000


RUN cd /usr/src/app/client; npm install
RUN cd /usr/src/app/client; bower install --allow-root
RUN cd /usr/src/app/client; gulp build

RUN cd /usr/src/app/server; npm install

WORKDIR /usr/src/app/server
CMD ["node", "server.js"]


