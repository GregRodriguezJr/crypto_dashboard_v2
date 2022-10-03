// URL Variables
const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending';
const coinsEndPoint = 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h';
const globalEndPoint = "global"

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

// API call to get global data and render in header
const getGlobalData = async (endpoint) => {
    try {
        const data = await getCoinGecko(endpoint);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

getGlobalData(globalEndPoint);

// API call to get top 7 trending coins and render card
const getTrending = async (endPoint) => {
    try {
        const data = await getCoinGecko(endPoint);
        const coins = data.coins;
        coins.forEach((coin, index) => {
            $('#trending-ul').append(`
                <li class="list-group-item">
                    ${index + 1}.  <img src="${coin.item.thumb}"> ${coin.item.name}
                </li>
            `);
        });
    } catch (error) {
        console.log(error);
    };
};

getTrending(trendingEndPoint);

// API call to get top 100 crypto currencies and render table
const getCoins = async (endPoint) => {
    try {
        const coins = await getCoinGecko(endPoint);
        console.log(coins);
        coins.forEach((coin, index) => {
            $('#coinTable').append(`
            <tr>
                <th scope="row">${index + 1}</th>
                <td class="d-flex align-items-center">
                    <img class="coin-img" src="${coin.image}">
                    <p class="coin-name my-0 mx-3">${coin.name}</p>

                </td>
                <td>${coin.current_price}</td>
                <td>${coin.price_change_percentage_24h}</td>
                <td>${coin.market_cap}</td>
                <td class"details">Details</td>
            </tr>
            `)
        });
    } catch (error) {
        console.log(error);
    };
};

getCoins(coinsEndPoint);

