### phila-gov-revenue-data-scraper

Sample application for scraping the contents of http://www.phila.gov/revenue/realestatetax and return the scraped data in a JSON payload.

### Executing without docker
```
cd /opt/
git clone https://github.com/bkozlik/phila-gov-revenue-data-scraper
cd /opt/phila-gov-revenue-data-scraper
npm install
npm start

# log should show this message on successful startup:
# Phila.gov data service listening on port 3000
```


### Executing with docker

```
cd /opt/
git clone https://github.com/bkozlik/phila-gov-revenue-data-scraper
cd /opt/phila-gov-revenue-data-scraper
docker build -t phila-gov-revenue-data-scraper .
docker run -p 3000:3000 -d phila-gov-revenue-data-scraper
docker ps # get container_id 
docker logs container_id # view logs

# log should show this message on successful startup:
# Phila.gov data service listening on port 3000
```

### Verifying results

Navigate to yourserver:3000/real-estate-tax-data/brt/:accountNumber (account number) to verify results, for example:

```
>> curl -l localhost:3000/real-estate-tax-data/brt/183189500
{"AccountNumber":"183189500","Address":"00539 W BERKS ST","OwnerName":"BELL B J","LienSaleAccount":"","PaymentsThroughDate":"03/01/2018","balances":{"Principal":["$3,003.96"],"Interest":["$4,561.62"],"Penalty":["$181.49"],"Other":["$1,312.45"],"Total":["$9,059.52"]}}
```
