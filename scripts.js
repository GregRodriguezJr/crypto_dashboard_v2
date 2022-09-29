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

// Render trending coins to a card
const renderCard = (coins) => {
    coins.forEach((coin, index) => {
        $('#trending-ul').append(`
            <li class="list-group-item">
                ${index + 1}. ${coin.item.name}
            </li>
        `)
    });
};

// API call to get top 7 trending coins
const getTrending = async (endPoint) => {
    try {
        const res = await fetch(baseUrl + endPoint);
        const data = await res.json();
        renderCard(data.coins);
    } catch (error) {
        console.log(error);
    }
}

getTrending(trendingEndPoint);
console.log("test");