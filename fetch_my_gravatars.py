import hashlib
from urllib.parse import urlencode
import sys
import requests
from pathlib import Path
import re

# options = ('404', 'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank')
# 404, mp, and blank are not fun
GENERATORS = ('identicon', 'monsterid', 'wavatar', 'retro', 'robohash', )

def sanitize_email_for_filename(email):
    """
    Convert an email address into a safe filename by replacing unsafe characters.
    
    Args:
        email (str): The email address to convert
        
    Returns:
        str: A filename-safe version of the email address
    
    Examples:
        >>> sanitize_email_for_filename("user@example.com")
        'user_at_example.com'
        >>> sanitize_email_for_filename("complex.user+tag@sub.example.com")
        'complex.user_plus_tag_at_sub.example.com'
    """
    # Replace @ with _at_
    email = email.replace('@', '_at_')
    
    # Replace other potentially problematic characters
    replacements = {
        '+': '_plus_',
        '/': '_',
        '\\': '_',
        '*': '_star_',
        '?': '_question_',
        '%': '_percent_',
        '|': '_pipe_',
        '"': '_quote_',
        '<': '_lt_',
        '>': '_gt_',
        ' ': '_'
    }
    
    for char, replacement in replacements.items():
        email = email.replace(char, replacement)
    
    # Remove any other characters that aren't alphanumeric, dot, hyphen, or underscore
    email = re.sub(r'[^\w.-]', '_', email)
    
    # Ensure the filename doesn't start or end with a dot or space
    email = email.strip('. ')
    
    return email

def create_URLs_from_email(email : str, size : int = 180, generators : list = GENERATORS): 
   """
   Generates the URLs for the Gravatar service with all the 
   relevant options.

   Args:
        email (str): The email to be used - does not have to have a Gravatar account associated with it
        size (int): The size of the image to be created (default: 180)
        generators (list of str): The different generators to be used when generating the Gravatars (default: GENERATORS)
    
    Returns:
        dict: Dictionary with the URLs for the Gravatar service. The keys of the dictionary are the names of the generator used. Empty dict if any of the operations fail.
   """ 
   try:
      # Encode the email to lowercase and then to bytes
      email_encoded = email.lower().encode('utf-8')
      
      # Generate the SHA256 hash of the email
      email_hash = hashlib.sha256(email_encoded).hexdigest()

      urls = dict()
      for gen in generators:
         # Construct the URL with encoded query parameters
         query_params = urlencode({'d': gen, 's': str(size)})
         urls[gen] = f"https://www.gravatar.com/avatar/{email_hash}?{query_params}"

      return urls
   except Exception as e:
      print(f'Failed during URL generation with: {e}')
      return dict()

def download_gravatar(url, generator, email, save_dir="gravatars"):
    """
    Download a Gravatar image from a URL and save it to disk.
    
    Args:
        url (str): The Gravatar URL to download from
        generator (str): The name of the generator used
        email (str): The email used to generate the URL
        save_dir (str): Directory to save the images (default: 'gravatars')
    
    Returns:
        str: Path to the saved image file, or None if download failed
    """
    try:
        # Create the save directory if it doesn't exist
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        
        # Extract a filename from the URL's hash
        filename = f'{sanitize_email_for_filename(email)}_{generator}.png'
        save_path = Path(save_dir).joinpath(filename)
        
        # Download the image
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Save the image
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        return str(save_path)
    
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return None
    except IOError as e:
        print(f"Error saving {url}: {e}")
        return None

def download_multiple_gravatars(urls, email, save_dir="gravatars"):
    """
    Download multiple Gravatar images from a dictionary of URLs.
    
    Args:
        urls (dict): Dictionary of Gravatar URLs to download. The keys must be the generators used for each
        email (str): The email used for the URLs
        save_dir (str): Directory to save the images (default: 'gravatars')
    
    Returns:
        list: List of successfully downloaded image paths
    """
    successful_downloads = []
    
    for gen, url in urls.items():
        result = download_gravatar(url, gen, email, save_dir)
        if result:
            successful_downloads.append(result)
            print(f"Successfully downloaded: {result}")
    
    return successful_downloads

if __name__ == '__main__':
   try:
      the_email = str(sys.argv[1])
      size = int(sys.argv[2])
      
      gravatar_urls = create_URLs_from_email(the_email, size)
      downloaded_files = download_multiple_gravatars(gravatar_urls, the_email)
      print(f"\nDownloaded {len(downloaded_files)} images successfully")

   except Exception as e:
      print(e)