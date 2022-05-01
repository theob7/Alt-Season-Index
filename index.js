import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TIME_FRAME = ["7d", "30d", "90d"];

let altSeasonIndexes = [];
let bitcoinPercentChanges = [];

const altSeasonIndex = {
    timeFrame: "",
    top50: 0,
    top100: 0,
    top500: 0,
    toString: function () {
        console.log(
            `Alt season index ${this.timeFrame}
            -> Top 50:  ${this.top50}
            -> Top 100: ${this.top100}
            -> Top 500: ${this.top500}`)
    }
}

async function main() {
    objInit();
    let cmcApiResult = await requestCoinMarketCap();
    populateBitcoinData(cmcApiResult);
    computeIndex(cmcApiResult, [50, 100, 500]); // Compute alt season index for top 50, top 100 and top 500 tokens rank

    altSeasonIndexes.forEach(elem => elem.toString());
}

// Create Index object for all timeframes
function objInit() {
    if(TIME_FRAME.length > 0) {
        for (let timeFrame of TIME_FRAME) {
            let index = {};
            Object.assign(index, altSeasonIndex);
            index.timeFrame = timeFrame;
            altSeasonIndexes.push(index);
        }
    } else {
        throw new Error('TIME_FRAME cannot be empty');
    }
}

// Retrieve tokens data from CoinMarketCap. Stablecoins excluded.
async function requestCoinMarketCap() {
    try {
        let apiResult = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?cryptocurrency_type=coins&limit=500", { headers: {'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY } });
        return JSON.parse(JSON.stringify(apiResult.data));
    } catch (e) {
        throw new Error(`CoinMarketCap API request error. Invalid API key ? ${e}`);
    }
}

// Populate bitcoin percentChange data
function populateBitcoinData(cmcApiResult) {
    try {
        let bitcoinInfo = cmcApiResult.data.find(elem => elem.symbol === "BTC");

        bitcoinPercentChanges = Object.keys(bitcoinInfo.quote.USD)
            .filter(key => TIME_FRAME.includes(key.split('_')[key.split('_').length - 1])) // Extract bitcoin percentChange properties matching with TIME_FRAME
            .reduce((obj, key) => {
                obj[key] = bitcoinInfo.quote.USD[key];
                return obj;
            }, {});
    } catch(e) {
        throw new Error(`Parsing bitcoin data error. ${e}`);
    }
}

function computeIndex(cmcApiResult, topToCompute) {
    for (let timeFrame of TIME_FRAME) {
        for (let top of topToCompute) {
            let betterThanBitcoin = cmcApiResult.data.filter(elem => elem.cmc_rank <= top) // Filter by rank
                .filter(elem => elem.quote.USD[`percent_change_${timeFrame}`] > bitcoinPercentChanges[`percent_change_${timeFrame}`]) // Better percentChange than bitcoin
                .length;

            let worstThanBitcoin = cmcApiResult.data.filter(e => e.cmc_rank <= top)
                .filter(elem => elem.quote.USD[`percent_change_${timeFrame}`] < bitcoinPercentChanges[`percent_change_${timeFrame}`])
                .length;

            let objectIndex = altSeasonIndexes.findIndex(elem => elem.timeFrame === timeFrame); // Find the object matching the timeframe
            altSeasonIndexes[objectIndex][`top${top}`] = average(betterThanBitcoin, worstThanBitcoin); // Store alt season index
        }
    }
}

function average(a, b) {
    return ((a / (a + b)) * 100).toFixed(0);
}

main();