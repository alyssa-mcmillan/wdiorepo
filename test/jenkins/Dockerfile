FROM node:14.17.3-stretch-slim

# Installing Chrome
ARG CHROME_VERSION="google-chrome-stable"
RUN mkdir /usr/share/man/man1 \
  && apt-get update \
  && apt-get install -y wget gnupg2 unzip openjdk-8-jdk-headless python3 git make g++ \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install \
    ${CHROME_VERSION:-google-chrome-stable} \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*
ARG CHROME_DRIVER_VERSION
RUN if [ -z "$CHROME_DRIVER_VERSION" ]; \
  then CHROME_MAJOR_VERSION=$(google-chrome --version | sed -E "s/.* ([0-9]+)(\.[0-9]+){3}.*/\1/") \
    && CHROME_DRIVER_VERSION=$(wget --no-verbose -O - "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_MAJOR_VERSION}"); \
  fi \
  && echo "Using chromedriver version: "$CHROME_DRIVER_VERSION \
  && wget --no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip \
  && rm -rf /opt/selenium/chromedriver \
  && unzip /tmp/chromedriver_linux64.zip -d /opt/selenium \
  && rm /tmp/chromedriver_linux64.zip \
  && mv /opt/selenium/chromedriver /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
  && chmod 755 /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
  && ln -fs /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION /usr/bin/chromedriver

WORKDIR /home/jenkins

# create user with the passed IDs of the host machine user
ARG USER_ID
ARG GROUP_ID
RUN groupadd -g ${GROUP_ID} jenkins &&\
    useradd -l -u ${USER_ID} -g jenkins jenkins && \
    install -d -m 0755 -o jenkins -g jenkins /home/jenkins

# Install sfdx
RUN npm i -g sfdx-cli
USER jenkins

# authenticate sfdx so it'll be able to communicate with our scratch org
ARG keyfile
COPY "server.key" .
USER root
RUN chown ${USER_ID}:${GROUP_ID} /home/jenkins/server.key
USER jenkins

# *** this first cmd is commented out because it would actually create a scratch org in the tsr-core repo,
# *** which we don't want to do in this repo. I've left it in so you can see how we would be consuming all
# *** that sfdx/scratch org auth/variables in our 'real' implementation].
#
# [upon docker run] npm installs tsr-core, creates new scratch org, runs tests, & removes scratch org
# CMD sfdx force:auth:jwt:grant -u jenkins@tractionrec.com -f "server.key" -i "$consumerkey" -d \
#   && export SFDX_DISABLE_SOURCE_MEMBER_POLLING='true' \
#   && npm i \
#   && node_modules/.bin/gulp co --alias "$ORG_ALIAS" \
#   && node_modules/.bin/gulp deployrecNoData --alias "$ORG_ALIAS" \
#   && node_modules/.bin/gulp deploycommunity --alias "$ORG_ALIAS" \
#   && cp .env.$ORG_ALIAS .env \
#   && echo "\nSleeping 180s after org creation \n" && sleep 180s \
#   && if [ ! -z "$TEST_PLAN_NAME" ] ; \
#   then echo "Running test plan '$TEST_PLAN_NAME'" && npm run test:wdio:plan --plan="$TEST_PLAN_NAME" ; \
#   else echo "Running entire sfdx test repository" && npx wdio ; \
#   fi \
#   && sfdx force:org:delete -u "${ORG_ALIAS}" -p

RUN create-alyssa-test-org chives

WORKDIR /home/jenkins/wdiorepo/run
# [upon docker run] npm installs tsr-core, creates new scratch org, runs tests, & removes scratch org
CMD npm i \
  && if [ ! -z "$TEST_PLAN_NAME" ] ; \
  then echo "Running test plan '$TEST_PLAN_NAME'" && npm run test:wdio:plan --plan="$TEST_PLAN_NAME" ; \
  else echo "Running entire test repository" && npx wdio; \
  fi