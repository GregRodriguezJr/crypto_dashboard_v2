const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending'

// API call to Coin Gecko
const getCoinGecko = async (endPoint) => {
    try {
        const res = await fetch(baseUrl + endPoint);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    };
};

// Render to DOM
{/* <li class="list-group-item">Cras justo odio</li> */}

// API call to get top 7 trending coins
const getTrending = async (endPoint) => {
    try {
        const res = await fetch(baseUrl + endPoint);
        const data = await res.json();
        console.log(data.coins);
    } catch (error) {
        console.log(error);
    }
}

getTrending(trendingEndPoint);