# Alt Season Index
Compute (nine) Alt Season Index. Index is useful to know the big picture of crypto market or when DEX trading become profitable.

Each index depends on the timeframe (7d, 30d and 90d) and tokens rank without stablecoins (top 50, top 100 and top 500).

90d timeframe with top 50 rank is considered the main index.

Based on CoinMarketCap APIs.

## Setup
- #### [NodeJS](https://nodejs.org/en/)
- #### [Git (Optional)](https://git-scm.com/downloads)

## Download project
Clone the project `git clone https://github.com/theob7/Alt-Season-Index.git`

## Install packages
run `npm install` in the git clone destination directory

## Configure project environment variables
1. **Rename the file ".env_template" to ".env"**
2. **Fill ".env"**

## Run
`node index.js`

## Recommanded usage
Add a cron job every hour to update Alt Season indexes: 
- `0 * * * * node /YOUR_PATH/Alt-Season-Index/index.js`

## TODO:
- [X] Send results to InfluxDB
- [X] Grafana dashboards
- [ ] Telegram notification
