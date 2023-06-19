import express from 'express';
import cors from 'cors';
import path  from 'path';
const __dirname = path.resolve();

const app = express();
// app.use(cors())


app.get('/profile', (req, res) => {
    console.log('this is profile!', new Date());
    res.send('this is profile' + new Date());
})
app.get('/weather/:cityName', (req, res) => {
    console.log('this is profile!', new Date());

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


app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})