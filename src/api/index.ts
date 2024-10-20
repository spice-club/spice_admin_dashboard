
// import { useAuth } from '../context/AuthContext';
// import Cookies from 'js-cookie';

export * from './userprofiles';
export * from './sendNoti'
export * from './userRef'
export * from './quiz'
// const getHeaders = async () => {
  
//   const token = Cookies.get('token'); // Retrieve token from cookies
//   if (!token) return;
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// };

// const get = async (
//   endpoint: string,
//   params?: Record<string, string | string[]>
// ) => {
//   const headers = await getHeaders();
//   const paramString = Object.entries(params || {})
//     .map(([k, v]) =>
//       Array.isArray(v)
//         ? v.map((v2) => `${k}=${encodeURIComponent(v2)}`)
//         : [`${k}=${encodeURIComponent(v)}`]
//     )
//     .join("&");
//   const response = await fetch(
//     `${process.env.API_URL}/${endpoint}${paramString ? "?" : ""}${paramString}`,
//     { method: "GET", headers }
//   );
//   return await response.json();
// };

// const post = async (endpoint: string, body: any) => {
//   const headers = await getHeaders();
//   console.log(`POST Request to: ${process.env.API_URL}/${endpoint}`, body); // {{ edit_1 }}
  
//   return await fetch(`${process.env.API_URL}/${endpoint}`, {
//     method: "POST",
//     headers: {
//       ...headers,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   }).then(response => {
//     console.log(`Response from ${endpoint}:`, response); // {{ edit_2 }}
//     return response.json();
//   });
// };

// const put = async (endpoint: string, body: any) => {
//   const headers = await getHeaders();
//   const response = await fetch(`${process.env.API_URL}/${endpoint}`, {
//     body: JSON.stringify(body),
//     headers,
//     method: "PUT",
//   });
//   return await response.json();
// };

// const deleteApi = async (
//   endpoint: string,
//   params?: Record<string, string | string[]>
// ) => {
//   const headers = await getHeaders();
//   const paramString = Object.entries(params || {})
//     .map(([k, v]) =>
//       Array.isArray(v)
//         ? v.map((v2) => `${k}=${encodeURIComponent(v2)}`)
//         : [`${k}=${encodeURIComponent(v)}`]
//     )
//     .join("&");
//   const response = await fetch(
//     `${process.env.API_URL}/${endpoint}${paramString ? "?" : ""}${paramString}`,
//     { method: "DELETE", headers, body: "{}" }
//   );
//   return await response.json();
// };
