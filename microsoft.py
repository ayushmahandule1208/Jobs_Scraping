from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import time
import json

def microsoft_job(number_page=10):
    """
    Retrieve job title, location, posting date, and job link from Microsoft Careers.
    Then, scrape the details of each job by navigating to its page using Selenium and scraping with BeautifulSoup.

    Arguments:
    number_page -- Number of pages to retrieve the data from.

    Returns:
    A list of job details including title, location, posting date, job link, description, qualifications, etc.
    """
    job_details = []

    # Setup Chrome in headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    service = Service("C:/Windows/chromedriver-win64/chromedriver.exe")  # Change this path to your ChromeDriver location
    driver = webdriver.Chrome(service=service, options=chrome_options)

    for i in range(number_page):
        URL = f'https://jobs.careers.microsoft.com/global/en/search?l=en_us&pg={i + 1}&pgSz=20&o=Relevance&flt=true&ref=cms'

        try:
            print(f"Accessing URL: {URL}")
            driver.get(URL)
            time.sleep(5)  # Allow some time for the page to load

            # Check if the page loaded successfully
            if "Microsoft Careers" not in driver.title:
                print(f"Failed to load page: {URL}")
                continue

            soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Scraping job listing details
            job_cards = soup.find_all('li', class_='jobs-list-item')  # Update this based on the actual HTML structure
            if not job_cards:
                print(f"No job cards found on page: {URL}")
                continue

            for card in job_cards:
                try:
                    job_title = card.find('h3', class_='job-title').get_text(strip=True)  # Update this based on the actual HTML structure
                    location = card.find('span', class_='job-location').get_text(strip=True)  # Update this based on the actual HTML structure
                    posting_date = card.find('span', class_='job-date').get_text(strip=True)  # Update this based on the actual HTML structure
                    job_link = 'https://jobs.careers.microsoft.com' + card.find('a', class_='job-link')['href']  # Update this based on the actual HTML structure

                    # Navigate to the job details page
                    print(f"Accessing job link: {job_link}")
                    driver.get(job_link)
                    time.sleep(3)  # Allow some time for the job page to load

                    # Check if the job page loaded successfully
                    if "Microsoft Careers" not in driver.title:
                        print(f"Failed to load job page: {job_link}")
                        continue

                    job_soup = BeautifulSoup(driver.page_source, 'html.parser')

                    # Extract detailed job information
                    job_description = job_soup.find('div', class_='job-description').get_text(strip=True)  # Update this based on the actual HTML structure
                    qualifications = job_soup.find('div', class_='qualifications').get_text(strip=True)  # Update this based on the actual HTML structure
                    responsibilities = job_soup.find('div', class_='responsibilities').get_text(strip=True)  # Update this based on the actual HTML structure

                    job_details.append({
                        'job_title': job_title,
                        'location': location,
                        'posting_date': posting_date,
                        'job_link': job_link,
                        'job_description': job_description,
                        'qualifications': qualifications,
                        'responsibilities': responsibilities
                    })
                except AttributeError as e:
                    print(f"Failed to scrape details for {job_link}: {e}")
                    continue
        except Exception as e:
            print(f"Failed to access {URL}: {e}")
            continue

    driver.quit()
    return job_details

# Extract job information (Make sure to have ChromeDriver installed)
jobs = microsoft_job(2)  # Adjust number of pages to scrape
print(json.dumps(jobs, indent=4))