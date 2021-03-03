const {
    HOST_NINJAVAN,
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;
const createOrder = async (payload) => {
    const token = await generateOAuthAccessToken();
    let body = buildData(payload);
    console.log('============NINJAVAN-REQUEST==============');
    console.log(body);
    console.log('==========================================');
    const response = await fetch(`${HOST_NINJAVAN}/VN/4.1/orders`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    const json = await response.json();
    console.log('============NINJAVAN-CREATE-ORDER==============');
    console.log(json);
    console.log('===============================================');
    return json;
};

const buildData = (payload) => {
    let items = [];
    payload.line_items.forEach(line_item => {
        items.push({
            "item_description": line_item.title,
            "quantity": line_item.quantity,
            "is_dangerous_good": false
        });
    });
    return {
        "service_type": payload.service_type,
        "service_level": payload.service_level,
        //"requested_tracking_number": "1234-56789",
        "reference": {
            "merchant_order_number": "SHIP-" + payload.order_id
        },
        "from": {
            "name": payload.from.name,
            "phone_number": payload.from.phone,
            "email": 'temp-localtion@isobar.com',
            "address": {
                "address1": payload.from.address1,
                "address2": payload.from.address2,
                "area": payload.from.city,
                "city": payload.from.city,
                "province": payload.from.province,
                "address_type": "office",
                "country": payload.from.countryCodeV2,
                "postcode": payload.from.zip
            }
        },
        "to": {
            "name": payload.to.name,
            "phone_number": payload.to.phone,
            "email": payload.email,
            "address": {
                "address1": payload.to.address1,
                "address2": payload.to.address2,
                "city": payload.to.city,
                "province": payload.to.province,
                "country": payload.to.countryCodeV2,
                "postcode": payload.to.zip
            }
        },
        "parcel_job": {
            "is_pickup_required": true,
            "pickup_address_id": 98989012,
            "pickup_service_type": "Scheduled",
            "pickup_service_level": "Premium",
            "pickup_date": "2018-01-18T00:00:00.000Z",
            "pickup_timeslot": {
                "start_time": "09:00",
                "end_time": "12:00",
                "timezone": "Asia/Singapore"
            },
            "pickup_instructions": "Pickup with care!",
            "delivery_instructions": "If recipient is not around, leave parcel in power riser.",
            "delivery_start_date": "2018-01-19",
            "delivery_timeslot": {
                "start_time": "09:00",
                "end_time": "22:00",
                "timezone": "Asia/Singapore"
            },
            "items": items
        }
    };
};

const generateOAuthAccessToken = async () => {
    const body = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    };

    const response = await fetch(`${HOST_NINJAVAN}/VN/2.0/oauth/access_token`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    });
    console.log(response);
    console.log('============NINJAVAN-TOKEN==============');
    console.log(response);
    console.log('========================================');
    return await response.json();
};

module.exports = createOrder;