require 'mail'

# TODO move gmail username and password to environment variables
GMAIL_USERNAME = '0xabedef'
#GMAIL_PASSWORD = 'TODO MUST BE DEFINED'

options = { :address              => 'smtp.gmail.com',
            :port                 => 587,
            :user_name            => "#{GMAIL_USERNAME}",
            :password             => "#{GMAIL_PASSWORD}",
            :authentication       => 'plain',
            :enable_starttls_auto => true  }

Mail.defaults do
  delivery_method :smtp, options
end

# TODO add separate logic for prof and ta emails
def send_verification_code(utorid)
  code = rand(1000...10000)

  Mail.deliver do
    to "#{utorid}@teach.cs.toronto.edu"
    from "#{GMAIL_USERNAME}@gmail.com"
    subject 'Koolaid Verification (POC)'
    body "Your Koolaid verification code is #{code}."
  end

  puts "Sent verification code #{code} to utorid #{utorid}"

  return code
end
