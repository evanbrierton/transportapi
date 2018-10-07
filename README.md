---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell
  - javascript

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# Introduction

Welcome to the Dublin Area Transport API. This API can be used to access various endpoints which provide information on the three major forms of public transport in the Dublin area, Dublin Bus, Luas and DART.

We have language bindings in Shell and JavaScript! You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

# Authentication

> To authorize, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "https://dublintransportapi.herokuapp.com/api/endpoint-here"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
```

> Make sure to replace `your-key-here` with your API key.

The Dublin Area Transport API uses API keys to allow access to the API. You can register a new API key at our [developer portal](https://dublintransportapi.herokuapp.com/developers).

An API key need not be included in the request but you will be limited to 120 requests per hour without one, you can contact us at the developer portal if you require more requests.

`Auth: your-key-here`

<aside class="notice">
You must replace <code>your-key-here</code> with your personal API key.
</aside>

# Bus

## Get All Stops

```shell
curl "https://dublintransportapi.herokuapp.com/api/bus/stops"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.bus.get().then(stops => stops);
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 6,
    "name": "St. Martin's Chapel",
    "location": {
      "latitude": 53.352744,
      "longitude": -6.264443
    },
    "routes": ["4"]
  },
  {
    "id": 7,
    "name": "Parnell Square",
    "location": {
      "latitude": 53.35283611,
      "longitude": -6.264561944
    },
    "routes": ["40", "140", "40D", "40B", "13"]
  }
]
```

This endpoint retrieves all bus stops.

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/bus/stops`

<aside class="success">
Remember — include your auth token in the header!
</aside>

## Get Real Time Information

```shell
curl "https://dublintransportapi.herokuapp.com/api/bus/stops/543"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.bus.get(543).then(stop => stop);
```

> The above command returns JSON structured like this:

```json
{
  "id": 543,
  "name": "Dublin Rd",
  "location": {
    "latitude": 53.385055,
    "longitude": -6.142371111
  },
    "routes": ["31", "31A", "32", "31B"],
    "services": [
      {
      "due": 11,
      "destination": "Malahide",
      "route": "32"
    },
    {
      "due": 14,
      "destination": "Sheilmartin Rd",
      "route": "31A"
    },
  ]
}
```

This endpoint retrieves the realtime information of a specific bus stop.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/bus/stops/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the bus stop to retrieve.

## Find Nearby Stops

```shell
curl "http://localhost:3000/api/bus/stops/nearby"
  -H "Auth: your-key-here"
  -H "Content-Type: application/json"
  -d '{ "location": { "latitude": 53.3498, "longitude": -6.2603 } }'
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.bus.nearby({ latitude: 53.3498, longitude: -6.2603 }).then(nearby => nearby);
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 318,
    "name": "Westmoreland Street",
    "location": {
        "latitude": 53.34630111,
        "longitude": -6.259078889
    },
    "routes": ["25X", "66X", "67X"],
    "distance": 299.47
  },
  {
    "id": 265,
    "name": "Parnell Square",
    "location": {
        "latitude": 53.35335806,
        "longitude": -6.26203
    },
    "routes": ["38", "38A", "1", "38D", "38B", "44"],
    "distance": 300.76
  },
]
```

This endpoint lists all stops within 15 minutes walking distance along with the walking distance specific to each stop.

### HTTP Request

`POST https://dublintransportapi.herokuapp.com/api/bus/stops/nearby`

### Request Body

Parameter | Description
--------- | -----------
location | An object containing latitude and longitude coordinates.

# DART

## Get All Stops

```shell
curl "https://dublintransportapi.herokuapp.com/api/dart/stops"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.dart.get().then(stops => stops);
```

> The above command returns JSON structured like this:

```json
[
  {
  "name": "Shankill",
  "location": {
    "longitude": -6.11691,
    "latitude": 53.2364
  },
  "code": "SKILL",
  "id": 136
  },
  {
    "name": "Bray",
    "location": {
      "longitude": -6.10046,
      "latitude": 53.2043
    },
    "code": "BRAY",
    "id": 140
  }
]
```

This endpoint retrieves all dart stops.

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/dart/stops`

<aside class="success">
Remember — include your auth token in the header!
</aside>


## Get Real Time Information

```shell
curl "https://dublintransportapi.herokuapp.com/api/dart/stops/dlery"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.dart.get('DLERY').then(stop => stop);
```

> The above command returns JSON structured like this:

```json
{
  "name": "Dun Laoghaire",
  "location": {
    "longitude": -6.13498,
    "latitude": 53.2951
  },
  "code": "DLERY",
  "id": 131,
  "services": [
    {
      "destination": "Bray",
      "location": "Arrived Blackrock",
      "due": 6,
      "type": "DART",
      "direction": "Southbound"
    },
    {
      "destination": "Howth",
      "location": "Departed Killiney",
      "due": 10,
      "type": "DART",
      "direction": "Northbound"
    }
  ]
}
```

This endpoint retrieves realtime information of a specific dart station.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/dart/stops/<CODE>`

### URL Parameters

Parameter | Description
--------- | -----------
CODE | The code of the dart stop to retrieve.

## Find Nearby Stops

```shell
curl "http://localhost:3000/api/dart/stops/nearby"
  -H "Auth: your-key-here"
  -H "Content-Type: application/json"
  -d '{ "location": { "latitude": 53.342998628, "longitude": -6.256165642 } }'
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.dart.nearby({ latitude: 53.342998628, longitude: -6.256165642 }).then(nearby => nearby);
```

> The above command returns JSON structured like this:

```json
[
  {
    "name": "Dublin Pearse",
    "location": {
        "longitude": -6.24829,
        "latitude": 53.3433
    },
    "code": "PERSE",
    "id": 150,
    "distance": 503.55
  },
  {
    "name": "Tara Street",
    "location": {
        "longitude": -6.25425,
        "latitude": 53.347
    },
    "code": "TARA",
    "id": 124,
    "distance": 759.2
  }
]
```

This endpoint lists all stops within 15 minutes walking distance along with the walking distance specific to each stop.

### HTTP Request

`POST https://dublintransportapi.herokuapp.com/api/dart/stops/nearby`

### Request Body

Parameter | Description
--------- | -----------
location | An object containing latitude and longitude coordinates.

# Luas

## Get All Stops

```shell
curl "https://dublintransportapi.herokuapp.com/api/luas/stops"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.luas.get().then(stops => stops);
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 47,
    "name": "Cherrywood",
    "code": "CHE",
    "location": {
      "longitude": -6.14585277777778,
      "latitude": 53.2453333333333
    }
  },
  {
    "id": 48,
    "name": "Bride's Glen",
    "code": "BRI",
    "location": {
      "longitude": -6.1427831,
      "latitude": 53.2418708
    }
  }
]
```

This endpoint retrieves all luas stops.

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/luas/stops`

<aside class="success">
Remember — include your auth token in the header!
</aside>


## Get Real Time Information

```shell
curl "https://dublintransportapi.herokuapp.com/api/luas/stops/che"
  -H "Auth: your-key-here"
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.luas.get('CHE').then(stop => stop);
```

> The above command returns JSON structured like this:

```json
{
  "id": 47,
  "name": "Cherrywood",
  "code": "CHE",
  "location": {
    "longitude": -6.14585277777778,
    "latitude": 53.2453333333333
  },
  "services": [
    {
      "direction": "Inbound",
      "destination": "Broombridge",
      "due": 10
    },
    {
      "direction": "Outbound",
      "destination": "Bride's Glen",
      "due": 10
    }
  ]
}
```

This endpoint retrieves realtime information about a specific luas stop.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/luas/stops/<CODE>`

### URL Parameters

Parameter | Description
--------- | -----------
CODE | The code of the luas stop to retrieve.

## Find Nearby Stops

```shell
curl "http://localhost:3000/api/luas/stops/nearby"
  -H "Auth: your-key-here"
  -H "Content-Type: application/json"
  -d '{ "location": { "latitude": 53.3498, "longitude": -6.2603 } }'
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.luas.nearby({ latitude: 53.3498, longitude: -6.2603 }).then(nearby => nearby);
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 62,
    "name": "Marlborough",
    "code": "MAR",
    "location": {
      "latitude": 53.3492449,
      "longitude": -6.2577316
    },
    "distance": 180.91
  },
  {
    "id": 21,
    "name": "Abbey Street",
    "code": "ABB",
    "location": {
      "longitude": -6.25817222222222,
      "latitude": 53.3485888888889
    },
    "distance": 195.62
  }
]
```

This endpoint lists all stops within 15 minutes walking distance along with the walking distance specific to each stop.

### HTTP Request

`POST https://dublintransportapi.herokuapp.com/api/luas/stops/nearby`

### Request Body

Parameter | Description
--------- | -----------
location | An object containing latitude and longitude coordinates.

# Nearby

## Get Nearby Stops

```shell
curl "https://dublintransportapi.herokuapp.com/api/nearby"
  -H "Auth: your-key-here"
  -H "Content-Type: application/json"
  -d '{ "location": { "latitude": 53.3515, "longitude": -6.2497 } }'
```

```javascript
const api = require('dublintransportjs');

api.authorize('your-key-here');
api.nearby({ latitude: 53.3515, longitude: -6.2497 }).then(stops => stops);
```

> The above command returns JSON structured like this:

```json
[{
    "name": "dart",
    "service": [{
        "name": "Dublin Connolly",
        "location": {
          "longitude": -6.24591,
          "latitude": 53.3531
        },
        "code": "CNLLY",
        "id": 100,
        "distance": 384.92
      },
      {
        "name": "Tara Street",
        "location": {
          "longitude": -6.25425,
          "latitude": 53.347
        },
        "code": "TARA",
        "id": 124,
        "distance": 706.94
      }
    ]
  },
  {
    "name": "luas",
    "service": [{
        "id": 23,
        "name": "Connolly",
        "code": "CON",
        "location": {
          "longitude": -6.24994166666667,
          "latitude": 53.3509222222222
        },
        "distance": 62.12
      },
      {
        "id": 22,
        "name": "Busáras",
        "code": "BUS",
        "location": {
          "latitude": 53.3500984,
          "longitude": -6.2514561
        },
        "distance": 175.55
      }
    ]
  },
  {
    "name": "bus",
    "service": [{
        "id": 1500,
        "name": "Amiens Street",
        "location": {
          "latitude": 53.35102,
          "longitude": -6.250105
        },
        "routes": ["151", "27"],
        "distance": 47.8
      },
      {
        "id": 620,
        "name": "Talbot Place",
        "location": {
          "latitude": 53.350965,
          "longitude": -6.252734
        },
        "routes": ["32", "31B", "31", "29A", "31A", "27A", "130", "747"],
        "distance": 174.45
      }
    ]
  }
]
```

This endpoint lists all stops of all three transport services within 15 minutes walking distance along with the walking distance specific to each stop.

### HTTP Request

`GET https://dublintransportapi.herokuapp.com/api/nearby`

<aside class="success">
Remember — include your auth token in the header!
</aside>