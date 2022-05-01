# Alt Season Index
Compute (nine) Alt Season Index. Index is useful to know the big picture of crypto market or when DEX trading become profitable.

Each index depends on the timeframe (7d, 30d and 90d) and tokens rank without stablecoins (top 50, top 100 and top 500).

90d timeframe with top 50 rank is considered the main index.

Based on CoinMarketCap APIs.

## Setup
1. ```npm install```
2. **complete ".env_template" file**
3. **rename the file ".env_template" to ".env"**
4. ```node index.js```


## TODO:
- [X] Send results to InfluxDB
- [ ] Grafana dashboards
- [ ] Telegram notification

