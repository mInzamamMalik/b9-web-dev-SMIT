import express from 'express';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();

const app = express();
app.use(express.json()); // body parser
// app.use(cors())


app.get('/profile', (req, res) => {
    console.log('this is profile!', new Date());
    res.send('this is profile' + new Date());
})


//  http://abcweather.com/weather/karachi?unit=metric&side=west&age=23

app.get('/weather/:cityName', (req, res) => {
    console.log('this is profile!', new Date());

    console.log("req.params.cityName: ", req.params.cityName)

    console.log("req.query.unit: ", req.query.unit)
    console.log("req.query.side: ", req.query.side)
    console.log("req.query.age: ", req.query.age)

    console.log("req.body.name: ", req.body.name)
    console.log("req.body.class: ", req.body.class)
    console.log("req.body.rollNumber: ", req.body.rollNumber)




    let weatherData = {
        karachi: {
            city: 'karachi',
            tempInC: 30,
            humidity: 56,
            high: 32,
            low: 18
        },
        london: {
            city: 'london',
            tempInC: 5,
            humidity: 56,
            high: 32,
            low: 18
        },
    }

    let userInputCityName = req.params.cityName.toLowerCase();
    console.log("userInputCityName: ", userInputCityName);

    let weatherDataToSend = weatherData[userInputCityName];

    if (weatherDataToSend) {
        res.send(weatherDataToSend);
    } else {
        res.status(404)
            .send(`weather data is not available for ${req.params.cityName}`);
    }
})

let comments = [];

app.post('/comment/:name', (req, res, next) => {
    const name = req.params.name;
    const comment = req.body.comment;

    comments.push({
        name: name,
        comment: comment
    })

    res.send({
        message: "comment posted successfully"
    });

})
app.get('/comments', (req, res, next) => {
    res.send(comments);
})


app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})


// google cloud - Google Compute engine;
// AWS - ES2 instance

// micro service architecture
// google app engine - cyclic - railway app - heroku - aws elastic beanstalk

// very cheap - per call charge - short lived
// nano service architecture
// google cloud functions - aws lambda functions - netlify functions
