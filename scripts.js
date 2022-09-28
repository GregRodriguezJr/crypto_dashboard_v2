const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingUrl = 'search/trending'

// API call to Coin Gecko
const getCoinGecko = async () => {
    try {
        const res = await fetch(baseUrl);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    };
};
// getCoinGecko();