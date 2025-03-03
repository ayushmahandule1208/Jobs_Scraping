from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import json

def google_job(number_page=10):
    """
    Retrieve job title, location, posting date, and job link from Google Careers.
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
        URL = f'https://careers.google.com/jobs/results/?page={i+1}'

        driver.get(URL)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "job-title")))
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scraping job listing details
        job_titles = [td.text.strip() for td in soup.find_all("h2", class_="job-title")]
        locations = [td.text.strip() for td in soup.find_all("div", class_="location")]
        posting_dates = [td.text.strip() for td in soup.find_all("div", class_="posting-date")]
        job_links = ['https://careers.google.com' + td.find('a')['href'] for td in soup.find_all("h2", class_="job-title")]

        # Now scrape individual job details
        for link in job_links:
            driver.get(link)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "job-title")))
            job_soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Extract detailed job information
            try:
                job_title = job_soup.find('h1', class_='job-title').get_text(strip=True)
                job_id = job_soup.find('div', class_='job-id').get_text(strip=True)
                job_description = job_soup.find('div', class_='job-description').get_text(strip=True)
                qualifications = job_soup.find('div', class_='qualifications').get_text(strip=True)

                job_details.append({
                    'job_title': job_title,
                    'job_id': job_id,
                    'job_description': job_description,
                    'qualifications': qualifications,
                    'location': locations[job_links.index(link)],  # Corresponding location for the job
                    'posting_date': posting_dates[job_links.index(link)],  # Corresponding posting date
                    'job_link': link
                })
            except AttributeError as e:
                print(f"Failed to scrape details for {link}: {e}")
                continue

    driver.quit()
    return job_details

# Extract job information (Make sure to have ChromeDriver installed)
jobs = google_job(2)  # Adjust number of pages to scrape
print(json.dumps(jobs, indent=4))