const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending';

// API call to Coin Gecko
const getCoinGecko = async (endPoint) => {
    try {
        const res = await fetch(baseUrl + endPoint);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    };
};

// getCoinGecko(coinList);

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

// API call to get top 100 crypto currencies
const getCoins = async () => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderCoins(data);
    } catch (error) {
        console.log(error);
    };
};

const renderCoins = async (coins) => {
    console.log(coins);
    coins.forEach((coin, index) => {
        $('#coinTable').append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${coin.name}</td>
            <td>${coin.current_price}</td>
            <td>${coin.price_change_percentage_24h}</td>
            <td>${coin.market_cap}</td>
            <td class="text-center"><a href="#" class="btn btn-outline-primary btn-sm">Details</a></td>
        </tr>
        `)
    });
};

getCoins();

