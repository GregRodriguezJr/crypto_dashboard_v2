// URL Variables
const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending';
const coinsEndPoint = 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h';
const globalEndPoint = "global";
let chartSelection = "bitcoin";

// Render chart from Coin Gecko CDN
const renderChart = (chartSelection) => {
    $('#chartContainer').html(`
        <coingecko-coin-compare-chart-widget  coin-ids="${chartSelection}" currency="usd" locale="en"></coingecko-coin-compare-chart-widget>
    `);
};

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
        // Destructuring gobal data object
        const {
            data:{active_cryptocurrencies: totalCoins},
            data:{markets: exchanges},
            data:{total_market_cap:{usd: marketCap}},
            data:{market_cap_percentage:{btc: btcDominance}}
        } = data;
        $('#globalData').append(`
            <p class="m-0 mx-3">Total Coins: <span class="text-primary">${totalCoins.toLocaleString()}</span></p>
            <p class="m-0 mx-3">Total Exchanges: <span class="text-primary">${exchanges}</span></p>
            <p class="m-0 mx-3">Market Cap: <span class="text-primary">$${Math.round(marketCap).toLocaleString()}</span></p>
            <p class="m-0 mx-3">BTC Dominance: <span class="text-primary">${Math.round(btcDominance)}%</span></p>
        `);
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
                <li class="list-group-item text-right">
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
                <td id="${coin.id}"><span class="details">Details</span></td>
            </tr>
            `);
        });
    } catch (error) {
        console.log(error);
    };
};

getCoins(coinsEndPoint);

// Eventlisteners

// Eventlistner to grab the id of the coin clicked
$('table').on("click", ".details" , function() {
    // Assign new id to variable
    chartSelection = $(this).parent()[0].id;
    // Call function to update and render chart
    renderChart(chartSelection);
});

// Onload function calls
renderChart(chartSelection);
