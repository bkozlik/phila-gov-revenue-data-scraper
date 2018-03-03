// Load URL from configuration 
const config = require('../config/config.js');
const scrapeURL = config.real_estate_tax_url;

// Screen scraper packages
const rp = require('request-promise');
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');


// API processor
exports.getTaxDataByBRT = (req, res) => {
  // Validate supplied account number is a number and has 9 digits /  fail and return
  var accountNumber = req.params.brt || 0;
  if( !isNumeric(accountNumber) || accountNumber.toString().length!=9 ){
    res.json({ error: "Invalid BRT account number" })
    console.log(`event=Returned error response, error=Invalid BRT account number, accountNumber=${accountNumber}`);
    return;  
  }

  // Valid BRT - make request to data source and load response body into parser
  console.log(`event=Making request to data source, URL=${scrapeURL}${accountNumber}, accountNumber=${accountNumber}`);
  rp({
    uri: `${scrapeURL}${accountNumber}`,
    transform: function (body) {
      console.log(`event=Received data from source, URL=${scrapeURL}${accountNumber}, bodyLength=${body.length}`);
      return cheerio.load(body);
    }
  })
    .then(($) => {
      // Parse data out of HTML response
      tableParser($);
      var data = $("#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_grdPaymentsHistory").parsetable(true, true, true);
      if(data.length<1) {
        throw new Error(`No data available for BRT account number ${accountNumber}`);
      }

      var outputObject = {
        AccountNumber: $('#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_frm_lblPropertyTaxAccountNo').text(),
        Address: $('#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_frm_lblPropertyAddress').text(),
        OwnerName: $('#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_frm_lblOwnerName').text(),
        LienSaleAccount: $('#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_frm_lblLienSaleAccount').text(),
        PaymentsThroughDate: $('#ctl00_BodyContentPlaceHolder_GetTaxInfoControl_frm_lblPaymentPostDate').text(),
        balances: {
          [data[1][0]]: data[1].slice(-1),
          [data[2][0]]: data[2].slice(-1),
          [data[3][0]]: data[3].slice(-1),
          [data[4][0]]: data[4].slice(-1),
          [data[5][0]]: data[5].slice(-1)
        }
      }

      // Return output
      //console.dir(outputObject);
      res.json(outputObject);
      console.log(`event=Returned success response, responseCode=${res.statusCode}, payloadJSON=${JSON.stringify(outputObject)}, bodyLength=${JSON.stringify(outputObject).length}`);
      
    })
    .catch((err) => {
      // Process error message to make it friendly for cases where the original data request fails (404, 500, etc)
      let friendlyErrorMsg = err.message;
      if(err.statusCode) {
        friendlyErrorMsg = `Service unavailable - data source returned HTTP code ${err.statusCode}`;
      }
      res.json({ error: friendlyErrorMsg })
      console.log(`event=Returned error response, responseCode=${res.statusCode}`);
      
    });

}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}