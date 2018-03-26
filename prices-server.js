module.exports = function(app, Price) {

    //just the default route showing all data (makes sure we are getting data)
    app.route('/api/prices') 
        .get(function(req, resp) {
            Price.find({}, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });

    //get price info for each day in the month (question c.) still need to do, will need to regex the month out of the date and match (the actual regex to get month out is (?<=^[^-]+-)[^-]+ but i need to match based on param)
    app.route('/api/prices/symandmonth/:symbol/:month') 
        .get(function(req, resp) {
            // Price.find({ date: new RegExp('\d+\-' + req.params.month, "i"), name: req.params.symbol },  function(err, data) {
            //Price.find({ date: /\d{4}-01/i , name: req.params.symbol }, function(err, data) {
            var month = req.params.month;
            var pattern = "\\d{4}-";
            var patAndMonth = pattern + month;
            Price.find({ date: new RegExp(patAndMonth), name: req.params.symbol }, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });
        
    //get average close value for each month in the year (question d.) complete
    app.route('/api/prices/average/:symbol') 
        .get(function(req, resp) {
            var year = "2017-";
            Price.find({ date: new RegExp(year), name: req.params.symbol.toUpperCase() }, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    let tempArray = data;
                    let monthlyData =[];
                    for (let i =1; i<13; i++){
                        let tempMonthArray = []
                        let tempDate = "2017-" +('0' + i).slice(-2);
                        let tempMonth = "" + ('0' + i).slice(-2);
                        tempMonthArray=tempArray.filter((el)=>{
                            if (el.date.includes(tempDate)){
                                return el;
                            }
                        });
                        let count = 0, runningCloseTally = 0, closeAvg = 0;
                        for (let el of tempMonthArray){
                            count++; runningCloseTally+=el.close;
                        }
                        closeAvg = runningCloseTally/count;
                        monthlyData.push({year: "2017", month: tempMonth, closeavg: closeAvg.toFixed(2)});
                    }
                    resp.json(monthlyData);
                }
            });
        });
    
    //get price information for that date (question e.) Done
    app.route('/api/prices/symanddate/:symbol/:date') 
        .get(function (req, resp) {
            Price.find({name: req.params.symbol, date: new RegExp(req.params.date)}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to price' });
                }
                else {
                    resp.json(data);
                }
            });
        });

    //get latest price information for that symbol (question f.) 
    app.post('/api/prices/latest', function(req, resp) {
            console.log(req);
            Price.find({name: req.params.symbol}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to price' });
                }
                else {
                    data.sort((a,b)=> {return (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0);} );
                    let latestPrice = data[0];
                    resp.json({date : latestPrice.date, open:latestPrice.open, high: latestPrice.high, low:latestPrice.low, close:latestPrice.close, symbol: latestPrice.name});
                }
            });
        });
        
    //get latest price information for that symbol (question f.) 
    app.post('/api/prices/late/array/', function(req, resp) {
        let arrayToReturn = [];
            let body = req.body;
            let pushToArray = el=> {let y = el; console.log(y)};
            let findStock = (element)=>{
                Price.find({name: element.symbol}, function(err, data) {
                    if(err) {
                        resp.json({ message: 'Unable to connect to price' });
                    }
                    else {
                        data.sort((a,b)=> {return (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0);} );
                        let latestPrice = data[0];
                        pushToArray ({date : latestPrice.date, open:latestPrice.open, high: latestPrice.high, low:latestPrice.low, close:latestPrice.close, symbol: latestPrice.name});
                    }
            })};
            body.map((element)=>findStock(element));
        // resp.json(x());
    });
};
    
    
        
    
