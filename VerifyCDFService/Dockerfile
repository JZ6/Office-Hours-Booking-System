FROM ruby:latest

WORKDIR /usr/src/api

COPY api.rb cdf_mailer.rb ./

# TODO automate gem installation
RUN gem install sinatra
RUN gem install mail

CMD ["/usr/bin/env", "ruby", "./api.rb"]
