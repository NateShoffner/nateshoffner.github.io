FROM jekyll/jekyll:3.4 AS build

WORKDIR /usr/src/app

# needed cause sass likes to break
RUN gem install sass

# install pip/yarn
COPY requirements.txt ./requirements.txt
RUN apk add --no-cache python3 py3-pip yarn
RUN python3 --version
RUN pip3 install -r requirements.txt

# copy yarn files
COPY .yarnrc package.json ./

# install yarn packages
RUN yarn install

# copy site files
COPY index.html ./
COPY _extra/ ./_extra/
COPY _includes/ ./_includes/
COPY _layouts/ ./_layouts/
COPY _sass/ ./_sass/
COPY about/ ./about/
COPY assets/ ./assets/
COPY blog/ ./blog/
COPY contact/ ./contact/
COPY projects ./projects

COPY _config.yml 404.html favicon.ico feed.xml index.html ./

# most likely to be modified
COPY _posts/ ./_posts/
COPY _data/ ./_data/

# generate meta and slugs
RUN python3 ./_extra/generate_post_meta.py
RUN python3 ./_extra/generate_project_pages.py

# build site 
RUN jekyll build -d web --verbose

FROM nginx:1.17.1-alpine As server

# remove default nginx pages
RUN rm -f /etc/nginx/conf.d/*

# copy nginx config
COPY conf/nginx.conf /etc/nginx/conf.d/static.conf

# copy generated site from jekyll
COPY --from=build /usr/src/app/web /usr/share/nginx/html

# Define working directory.
WORKDIR /etc/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]