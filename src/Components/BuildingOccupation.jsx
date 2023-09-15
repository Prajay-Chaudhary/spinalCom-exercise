import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './Config/apiConfig';

function BuildingOccupation({ data }) {
  const [occupation, setOccupation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataForRoom = async () => {
      try {
        // Fetch data from the API endpoint based on the 'data' prop
        const response = await axios.get(`${API_BASE_URL}/room/${data}/control_endpoint_list`);
        console.log('API Response:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          // Check if the API response is an array and not empty
          const endpoints = response.data[0].endpoints;
          if (Array.isArray(endpoints) && endpoints.length > 3) {
            // Check if 'endpoints' is an array and has at least 4 objects
            setOccupation(endpoints);
            setLoading(false);
          } else {
            console.warn('The endpoints array does not have at least 4 objects.');
            setLoading(false);
          }
        } else {
          console.warn('API Response is empty or does not have the expected structure.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    // Call the function to fetch data when the 'data' prop changes
    fetchDataForRoom();
  }, [data]);

  const renderOccupation = () => {
    if (!data) {
      return <p>Undefined</p>; // Render "Undefined" if data is empty
    }

    if (occupation) {
      const fourthObjectValue = occupation[3]?.currentValue;
      if (typeof fourthObjectValue === 'boolean') {
        // Determine the CSS class based on 'fourthObjectValue'
        const className = fourthObjectValue ? 'text-red-500 font-bold' : 'text-green-500 font-bold';
        return <span className={className}>{fourthObjectValue ? 'TRUE' : 'FALSE'}</span>;
      }
    }

    return <span className='text-slate-600 font-bold'>UNDEFINED</span>;
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : renderOccupation()}
    </div>
  );
}

export default BuildingOccupation;