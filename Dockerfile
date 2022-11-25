FROM nginx:latest

ENV TZ 'Asia/Shanghai'

WORKDIR /app

COPY ./dist /app/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./.key /app/.key
COPY ./.pem /app/.pem

RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && \
	echo ${TZ} > /etc/timezone && \
	mkdir /app/logs


EXPOSE 80
EXPOSE 443