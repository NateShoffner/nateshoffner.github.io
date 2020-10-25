FROM python:3.7-alpine as prebuild
# TODO port this to ruby so we don't need a python stage
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# get required python modules
RUN pip install -r requirements.txt

# build post meta
RUN python ./_extra/generate_post_meta.py &

# build project pages
RUN python ./_extra/generate_project_pages.py

FROM jekyll/jekyll:3.8.5 AS build

WORKDIR /usr/src/app

# copy generated post meta
COPY --from=prebuild --chown=jekyll /usr/src/app/ /usr/src/app

# install yarn
RUN wget https://yarnpkg.com/latest.tar.gz \
    && mkdir -p /opt/yarn \
    && tar -xf latest.tar.gz -C /opt/yarn --strip 1 \
    && mkdir -p /var/app \
    && rm latest.tar.gz
    ENV PATH="$PATH:/opt/yarn/bin"

# install packages
RUN yarn install

# build site
RUN mkdir _site && mkdir .jekyll-cache && \
    chown -R jekyll:jekyll _site

RUN jekyll build --trace

FROM nginx:alpine As server

# remove default nginx pages
RUN rm -f /etc/nginx/conf.d/*

# copy nginx config
COPY conf/nginx.conf /etc/nginx/conf.d/static.conf

# copy generated site from jekyll
COPY --from=build /usr/src/app/_site /usr/share/nginx/html

WORKDIR /etc/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]