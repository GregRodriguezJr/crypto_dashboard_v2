// URL Variables and API endpoints
const baseUrl = 'https://api.coingecko.com/api/v3/';
const trendingEndPoint = 'search/trending';
const coinsEndPoint = 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h';
const globalEndPoint = "global";
const listEndPoint = 'coins/list?include_platform=false';
// Default value for chart
let coinSelection = "bitcoin";
// Array to store top 100 coins
let coinsArr;
// Array to store all 10k coins
let allCoinsArr;

const searchInputEl = document.getElementById('searchInput');

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

// Dynamically created a bootstrap card
const renderCard = (coin, index, elementID) => {
    // Clear out previous card
    elementID.html('');
    // Destructing object from local array
    const { atl, ath, symbol, total_supply, total_volume, market_cap, image } = coin[index];
    // Append to html element Id to the DOM
    elementID.append(`
    <div class="card-header d-flex align-items-center">
        <img class="coin-img" src=${image}>
        <p class="my-0 mx-2"><strong>${symbol.toUpperCase()}</strong></p>
	</div>
    <ul class="list-group">
        <li class="list-group-item border-0 border-bottom">All time high: $${ath}</li>
        <li class="list-group-item border-0 border-bottom bg-light">All time low: $${atl}</li>
        <li class="list-group-item border-0 border-bottom">Market Cap: $${market_cap.toLocaleString()}</li>
        <li class="list-group-item border-0 border-bottom bg-light">Total Supply: ${total_supply.toLocaleString()}</li>
        <li class="list-group-item border-0">Total Volume: ${total_volume.toLocaleString()}</li>
    </ul>
`);
}

// API call to get searched coin and render card
const getSearchedCoin = async (searchValue) => {
    // Local endpoint variable with search value for query get request
    const searchEndPoint = `coins/markets?vs_currency=usd&ids=${searchValue.toLowerCase()}&order=market_cap_desc&page=1&sparkline=false&price_change_percentage=24h`;
    // Html element to target the DOM
    const elementID = $('#searchResults');
    // Coin search is exact, only one possible result of index 0
    const index = 0;
    try {
        const coin = await getCoinGecko(searchEndPoint);
        // Conditional to check if search value is a valid coin
        if (coin[0] == null) {
            $('#search-error', ).addClass('show');
            $('#coinList').addClass('show');
        } else {
            $('#search-error').removeClass('show');
            $('coinList').removeClass('show');
            renderCard(coin, index, elementID); 
        }
    } catch (error) {
        console.log(error);
    }
}

// API call to get full coin list
const getCoinList = async (endPoint) => {
    try {
        allCoinsArr = await getCoinGecko(endPoint);
    } catch (error) {
        console.log(error);
    }
}

// Update coinlist with user from search input
const updateCoinList = () => {
    let filteredCoins = [];
    allCoinsArr.forEach(coin => {
        if(coin.name.toLowerCase().includes(searchInputEl.value)) {
            filteredCoins.push(coin)
        }
    })
   renderSuggestedCoins(filteredCoins);
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
    getSearchedCoin(searchValue);
    // Clear input box after function is called
    $(document).ready(function() {
        $('#searchInput').val('');
    });
});

// Eventlistener to update coinlist with keyboard input
searchInputEl.addEventListener('input', updateCoinList);

// Onload function calls
renderChart(coinSelection);
getGlobalData(globalEndPoint);
getCoins(coinsEndPoint);
getTrending(trendingEndPoint);
getCoinList(listEndPoint);