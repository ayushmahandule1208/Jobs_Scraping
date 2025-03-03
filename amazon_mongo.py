from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import time
import json
from pymongo import MongoClient

def amazon_job(number_page=10):
    """
    Retrieve job title, location, posting date, and job link from Amazon Jobs.
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
        URL = f'https://www.amazon.jobs/en/search?offset={10*i}&result_limit=10&sort=relevant&category=software-development&distanceType=Mi&radius=24km'

        driver.get(URL)
        time.sleep(2)  # Allow some time for the page to load
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scraping job listing details
        job_titles = [td.find('h2').text.strip() for td in soup.find_all("div", class_="job-tile")]
        locations = [td.text.split('|', 1)[0].strip() for td in soup.find_all("div", class_="location-and-id")]
        posting_dates = [re.sub('Posted ', '', td.text.strip()) for td in soup.find_all("h2", class_="posting-date")]
        job_links = ['https://www.amazon.jobs' + td.find('a')['href'] for td in soup.find_all("div", class_="job-tile")]

        # Now scrape individual job details
        for link in job_links:
            driver.get(link)
            time.sleep(2)  # Allow some time for the job page to load
            job_soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Extract detailed job information
            try:
                job_title = job_soup.find('h1', class_='title').get_text(strip=True)
                job_id = job_soup.find('p', class_='meta').get_text(strip=True)
                job_description = job_soup.find('div', class_='section description').get_text(strip=True)
                basic_qualifications = job_soup.find('div', class_='section').find_next('div', class_='section').get_text(strip=True)
                preferred_qualifications = job_soup.find('div', class_='section').find_all_next('div', class_='section')[1].get_text(strip=True)

                job_details.append({
                    'job_title': job_title,
                    'job_id': job_id,
                    'job_description': job_description,
                    'basic_qualifications': basic_qualifications,
                    'preferred_qualifications': preferred_qualifications,
                    'location': locations[job_links.index(link)],  # Corresponding location for the job
                    'posting_date': posting_dates[job_links.index(link)],  # Corresponding posting date
                    'job_link': link
                })
            except AttributeError as e:
                print(f"Failed to scrape details for {link}: {e}")
                continue

    driver.quit()
    return job_details

def save_to_mongodb(jobs):
    """
    Save the scraped job data to MongoDB Atlas.
    Ensure uniqueness using the job_id or job_link as a unique identifier.

    Arguments:
    jobs -- List of job details to be saved.
    """
    # MongoDB Atlas connection string
    connection_string = "mongodb+srv://ayushmahandule:brxkatGr7m8dJuNE@cluster0.wbuff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    client = MongoClient(connection_string)

    # Connect to the database and collection
    db = client.job_database  # Replace with your database name
    collection = db.jobs  # Replace with your collection name

    # Insert or update jobs in MongoDB
    for job in jobs:
        # Use job_id or job_link as the unique identifier
        query = {"job_id": job["job_id"]}  # or {"job_link": job["job_link"]}
        update = {"$set": job}
        collection.update_one(query, update, upsert=True)

    print(f"Inserted/Updated {len(jobs)} jobs into MongoDB.")

# Extract job information (Make sure to have ChromeDriver installed)
jobs = amazon_job(2)  # Adjust number of pages to scrape

# Save jobs to MongoDB Atlas
save_to_mongodb(jobs)

# Print jobs in JSON format
print(json.dumps(jobs, indent=4))