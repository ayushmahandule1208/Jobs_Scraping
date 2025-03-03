import requests
from bs4 import BeautifulSoup

# URL of the job listing page
# url = "https://www.amazon.jobs/en/jobs/2913325/software-development-manager-measurement-ad-tech-and-data-science-mads"
url = "https://www.amazon.jobs/en/jobs/2904517/software-dev-engineer-2-years-contract"
# Send GET request to the page
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the page content with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the job title
    job_title = soup.find('h1', class_='title').get_text(strip=True)

    # Extract the job ID
    job_id = soup.find('p', class_='meta').get_text(strip=True)

    # Extract the job description
    job_description = soup.find('div', class_='section description').get_text(strip=True)

    # Extract the basic qualifications
    basic_qualifications = soup.find('div', class_='section').find_next('div', class_='section').get_text(strip=True)

    # Extract the preferred qualifications
    preferred_qualifications = soup.find('div', class_='section').find_all_next('div', class_='section')[1].get_text(strip=True)

    # Print the extracted details
    print("Job Title:", job_title)
    print("Job ID:", job_id)
    print("Job Description:", job_description)
    print("Basic Qualifications:", basic_qualifications)
    print("Preferred Qualifications:", preferred_qualifications)
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
