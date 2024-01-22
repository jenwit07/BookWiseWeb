import { anakinAPI } from "@api";
import helper from "@helper";
import { property } from "lodash-es";

export const getStore = async (
  cur_page = null,
  per_page = null,
  params = {}
) => {
    console.log('%c⧭', 'color: #e50000', {
      cur_page: cur_page,
      per_page: per_page,
      ...params,
    });
  let { data } = await anakinAPI().get(`/v1/stores`, {
    params: {
      cur_page: cur_page,
      per_page: per_page,
      ...params,
    },
  });


  console.log('%c⧭', 'color: #aa00ff', data);
  return data;
};

// addressLine1: "1333 ถ. กรุงเทพ - นนทบุรี แขวง วงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800"
// addressLine2: undefined
// detail: undefined
// location: {location: {…}, type: 'search', name: 'THE LINE WONGSAWANG เดอะ ไลน์ วงศ์สว่าง', place_id: 'ChIJ6w2uVH6b4jARmdaWxOTfK6E', website: 'https://www.plus.co.th/project/%E0%B9%80%E0%B8%94%…-googlegmb-theline_wongsawang&utm_content=theline', …}
// name: "THE LINE WONGSAWANG เดอะ ไลน์ วงศ์สว่าง"
// university: undefined
// zipCode: "10800"

/*
  {
      "gps": {
          "lat": 13.844214,
          "long": 100.569104
      },
      "zipCode": "100",
      "addressLine1": "ทดสอบ",
      "addressLine2": "",
      "university": "MU"
  }
*/
export const createAddress = async ({
  addressLine1,
  addressLine2,
  zipCode,
  location,
  university
}) => {

let requestBody = {
  addressLine1,
  addressLine2,
  zipCode,
  location,
  university,
  gps: {
    lat: location?.location?.lat,
    lng: location?.location?.lng
  }
}

let { data } = await anakinAPI().post(`/v1/address`, requestBody);


console.log('%c⧭', 'color: #aa00ff', data);
return data;
}

/*
  {
    "name": "test",
    "detail": "aaaaa",
    "address_id": 1
  }
*/
export const createStore = async ({
  name,
  detail,
  addressId
}) => {
  let requestBody = {
    "stores_id": stores_id,
    "name": name,
    "detail": detail,
    "address_id": addressId
  }
  
  let { data } = await anakinAPI().post(`/v1/stores`, requestBody);

  console.log('%c⧭', 'color: #aa00ff', data);
  return data;
}

export const updateStore = async ({
  stores_id,
  name,
  detail,
  address_id
}) => {
  let requestBody = {
    stores_id,
    "name": name,
    "detail": detail,
    "address_id": address_id
  }
  
  let { data } = await anakinAPI().put(`/v1/stores`, requestBody);

  return data;
}

export const updateAddress = async ({
  address_id,
  addressLine1,
  addressLine2,
  zipCode,
  location,
  university
}) => {
  let requestBody = {
    address_id,
    addressLine1,
    addressLine2,
    zipCode,
    location,
    university,
    gps: {
      lat: location?.location?.lat,
      lng: location?.location?.lng
    }
  }

  let { data } = await anakinAPI().put(`/v1/address`, requestBody);

  console.log('%c⧭', 'color: #aa00ff', data);
  return data;
}

export const deleteStore = async ({
  stores_id
}) => {

  let { data } = await anakinAPI().delete(`/v1/stores`, {params: {stores_id: stores_id}});

  console.log('%c⧭', 'color: #aa00ff', data);
  return data;
}

export const deleteAddress = async ({
  address_id
}) => {

  let { data } = await anakinAPI().delete(`/v1/address`, {params: {address_id: address_id}});

  console.log('%c⧭', 'color: #aa00ff', data);
  return data;
}
