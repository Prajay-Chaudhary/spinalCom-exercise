import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './Config/apiConfig';
import { Spinner } from 'flowbite-react';

function BuildingOccupation({ data }) {
  const [occupation, setOccupation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataForRoom = async () => {
      try {
        // Fetch data from the API endpoint based on the 'data' prop
        const response = await axios.get(`${API_BASE_URL}/room/${data}/control_endpoint_list`);
        console.log('API Response room data:', response.data);

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
      } finally {
        setLoading(false)
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
      const isActive = occupation[3]?.currentValue;
      if (typeof isActive === 'boolean') {
        // Determine the CSS class based on 'isActive'
        return <span className={`${isActive ? 'text-red-500 bg-red-100 border-red-200' : 'text-green-500 bg-green-100'} px-3 py-1 rounded-full font-semibold text-sm`}>{isActive ? 'OCCUPÉ' : 'NON OCCUPÉ'}</span>;
      }
    }

    return <span className='text-slate-600 bg-slate-100 text-sm font-semibold px-3 py-2 rounded-full'>UNDEFINED</span>;
  };

  return (
    <div>
      {loading ? <Spinner
        aria-label="Small spinner example"
        size="sm"
      /> : renderOccupation()}
    </div>
  );
}

export default BuildingOccupation;



