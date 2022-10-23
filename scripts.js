// URL Variables and API endpoints
const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending';
const coinsEndPoint = 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h';
const globalEndPoint = "global";
// Default value for chart
let coinSelection = "bitcoin";
// Array to store top 100 coins
let coinsArr;

// Render chart widget from Coin Gecko CDN
const renderChart = (coinSelection) => {
    $('#chartContainer').html(`
        <coingecko-coin-compare-chart-widget coin-ids="${coinSelection}" currency="usd" locale="en"></coingecko-coin-compare-chart-widget>
    `);
};

// API calls and rendering to the DOM

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

// API call to get top 7 trending coins and render card
const getTrending = async (endPoint) => {
    try {
        const data = await getCoinGecko(endPoint);
        const coins = data.coins;
        // Pass in coin id to render marquee from API
        $('#trendingContainer').html(`
            <coingecko-coin-price-marquee-widget  coin-ids="${coins[0].item.id},${coins[1].item.id},${coins[2].item.id},${coins[3].item.id},${coins[4].item.id},${coins[5].item.id},${coins[6].item.id}" currency="usd" background-color="#ffffff" locale="en"></coingecko-coin-price-marquee-widget>
        `)
    } catch (error) {
        $('#trendingContainer').html("Something went wrong with marquee :(");
        console.log(error);
    };
};

// API call to get top 100 crypto currencies and render table
const getCoins = async (endPoint) => {
    try {
        const coins = await getCoinGecko(endPoint);
        // Store 100 coins in local array for modal
        coinsArr = coins;
        coins.forEach((coin, index) => {
            // Destructuring coins data object
            const {
                name: name, 
                image: image,
                current_price: price,
                price_change_percentage_24h: change24h,
                market_cap: cap,
                id: id
            } = coin;            
            $('#coinTable').append(`
            <tr>
                <th scope="row">${index + 1}</th>
                <td><img class="coin-img" src="${image}"></td>
                <td class="coin-name">${name}</td>
                <td>$${price}</td>
                <td>${change24h.toFixed(2)}</td>
                <td>$${cap.toLocaleString()}</td>
                <td id="${id}">
                    <button type="button" id="${index}" class="btn btn-link p-0 details-btn" data-bs-toggle="modal" data-bs-target="#modal">Details</button>
                </td>
            </tr>
            `);
        });
    } catch (error) {
        console.log(error);
    };
};

// Assign elements and values to modal body
const detailsModal = (index) => {
    // Destructuring local array of selected coin object
    const { atl, ath, symbol, total_supply, total_volume, market_cap } = coinsArr[index];
    // Clear out previous title
    $('.modal-title').html('');
    // Render new title
    $('.modal-title').html(`${symbol.toUpperCase()}`);
    // Clear out modal html
    $('#modalBody').html('')
    // Render list of details in modal
    $('#modalBody').append(`
        <ul class="list-group">
            <li class="list-group-item">All time high: $${ath}</li>
            <li class="list-group-item">All time low: $${atl}</li>
            <li class="list-group-item">Market Cap: $${market_cap.toLocaleString()}</li>
            <li class="list-group-item">Total Supply: ${total_supply.toLocaleString()}</li>
            <li class="list-group-item">Total Volume: ${total_volume.toLocaleString()}</li>
        </ul>
    `);
}

// API call to get searched coin and render card
const getSearchedCoin = async (searchValue) => {
    let searchEndPoint = `coins/markets?vs_currency=usd&ids=${searchValue.toLowerCase()}&order=market_cap_desc&page=1&sparkline=false&price_change_percentage=24h`
    try {
        console.log(searchValue);
        const coin = await getCoinGecko(searchEndPoint);
        console.log(coin); 
    } catch (error) {
        console.log(error);
    }
}
                      
// Eventlisteners

// Eventlistner to grab the ids of the coin clicked
$('table').on("click", ".details-btn" , function() {
    // Assign new id to variable to update chart
    coinSelection = $(this).parent()[0].id;
    renderChart(coinSelection);
    // Assign index of coin to attach coin selected to modal
    coinIndex = $(this)[0].id;
    detailsModal(coinIndex);
});

// Eventlistener to grab text input from search box
$('#search-btn').click(function() {
    const searchValue = $('#searchInput').val();
  });

// Onload function calls
// renderChart(coinSelection);
// getGlobalData(globalEndPoint);
// getCoins(coinsEndPoint);
// getTrending(trendingEndPoint);

// todo 
// possible search feature for coins outside of top 100 api call
// test for mobile responsiveness
