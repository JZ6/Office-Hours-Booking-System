FROM ruby:latest

WORKDIR /usr/src/api

# TODO automate gem installation
RUN gem install sinatra
RUN gem install mail

COPY api.rb cdf_mailer.rb ./

CMD ["/usr/bin/env", "ruby", "./api.rb"]
