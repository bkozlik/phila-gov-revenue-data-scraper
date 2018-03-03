### phila-gov-revenue-data-scraper

Sample application for scraping the contents of http://www.phila.gov/revenue/realestatetax and return the scraped data in a JSON payload.

### Executing without docker

cd /opt/
git clone <giturl>
cd /opt/phila-gov-revenue-data-scraper
npm install
npm start

### Executing with docker

cd /opt/
git clone <giturl>
cd /opt/phila-gov-revenue-data-scraper
docker build -t phila-gov-revenue-data-scraper .
docker run -p 3000:3000 -d phila-gov-revenue-data-scraper

### Verifying results

Navigate to <yourserver>:3000/real-estate-tax-data/brt/<accountNumber> to verify results

