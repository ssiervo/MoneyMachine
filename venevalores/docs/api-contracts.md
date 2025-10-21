# VeneValores API Contracts

All endpoints require a valid Firebase ID token in the `Authorization: Bearer` header.

## POST /api/trades
Create a trade and trigger broker email.

### Request Body
```
{
  "ticker": "ABC",
  "side": "BUY",
  "quantity": 10,
  "priceVES": 25.5
}
```

### Response
```
{
  "tradeId": "abc123",
  "status": "SENT"
}
```

## GET /api/trades
Returns last 50 trades for the authenticated user.

```
{
  "trades": [ ... ]
}
```

## GET /api/portfolio
Returns holdings, totals in all currencies, and latest FX.

## GET /api/portfolio/history
Returns portfolio history points for charts.

## GET /api/fx
Latest FX rates and timestamp.

## GET /api/settings
Loads user settings (broker email, currency, fx source, language).

## PUT /api/settings
Updates user settings.
```
{
  "brokerEmail": "broker@example.com",
  "defaultCurrency": "USD_BCV",
  "fxSource": "BCV",
  "language": "en"
}
```
