require 'sinatra'
require_relative 'cdf_mailer'

FAILURE_JSON = {
  :status => 'not found',
  :code => 404,
  :result => {}
}.to_json

set :bind, '0.0.0.0'
disable :show_exceptions

get '/verify/:utorid' do
  content_type :json

  utorid = params['utorid']
  puts "Verification request for utorid #{utorid}" # TODO unify logging

  code = send_verification_code(utorid)

  # TODO add separate flows for errors

  {
    :status => 'ok',
    :code => 200,
    :result => {
      :verification_code => code
    }
  }.to_json
end

get '/*' do
  FAILURE_JSON
end
