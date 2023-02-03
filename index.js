// https://api.openweathermap.org/data/2.5/weather/?q=Gwalior&appid=33f488fea4708fa66b4eb8d92ab1bc3b
const http = require("http");
const fs = require("fs");
const requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%temp_val%}", orgVal.main.temp);
    temperature = temperature.replace("{%temp_min%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%temp_max%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req,res) => {

    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather/?q=Pune&units=metric&appid=33f488fea4708fa66b4eb8d92ab1bc3b')
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
          console.log(arrData[0]);
            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
            res.end();
        //   console.log('end');
        });
    }
    else{
        res.writeHead(404,{ "Content-type" : "text/html" });
        res.end("<h1>404 Error. This Page doesn't exists.</h1>");
    }
});
server.listen(8000,"127.0.0.1");