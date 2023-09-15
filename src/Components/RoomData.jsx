// import React, { useEffect, useState } from 'react';
// import API_BASE_URL from './Config/apiConfig';

// const RoomData = () => {
//   const [data, setData] = useState([]);

//   // get all the Room data
//   const getRoomdata = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/room/${room_id}/control_endpoint_list`, {
//         method: 'get',
//         headers: {
//           'content-type': 'application/json',
//           'accept': 'application/json'
//         }
//       });
//       const api_data = await response.json();
//       setData(api_data);
//       console.log("Room_data:", api_data);
//     } catch (error) {
//       alert("Please try later");
//     }
//   };

//   useEffect(() => {
//     getRoomdata();
//   }, []);
//   return (
//     <div>RoomData</div>
//   )
// }

// export default RoomData



import React, { useEffect, useState } from 'react';
import API_BASE_URL from './Config/apiConfig';
import axios from 'axios';

function RoomData() {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {

  //   // Make a GET request using Axios
  //   axios.get(`${API_BASE_URL}/room/${dynamicId}/control_endpoint_list`)
  //     .then((response) => {
  //       // Handle the successful response here
  //       setData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       // Handle any errors here
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div>
      <h1>Room Data</h1>
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <pre>{data.name}</pre>
      )} */}
    </div>
  );
}

export default RoomData;