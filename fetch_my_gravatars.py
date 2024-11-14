import hashlib
from urllib.parse import urlencode
import sys

options = ('404', 'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank')

if __name__ == '__main__':
   try:
      the_email = str(sys.argv[1])
      size = int(sys.argv[2])
      
      # Encode the email to lowercase and then to bytes
      email_encoded = the_email.lower().encode('utf-8')
      
      # Generate the SHA256 hash of the email
      email_hash = hashlib.sha256(email_encoded).hexdigest()

      for option in options:
         # Construct the URL with encoded query parameters
         query_params = urlencode({'d': option, 's': str(size)})
         gravatar_url = f"https://www.gravatar.com/avatar/{email_hash}?{query_params}"
         
         print(gravatar_url)

   except Exception as e:
      print(e)