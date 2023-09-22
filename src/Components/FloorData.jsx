import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './Config/apiConfig';
import { Accordion, Spinner } from 'flowbite-react';
import BuildingOccupation from './BuildingOccupation'
import { globalApiActions } from './apis/global';

function FloorData() {
  // State variables for data, loading state, and error handling
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State variable to store room occupation counts
  const [roomCounts, setRoomCounts] = useState({
    RDC: { total: 0, occupied: 0, nonOccupied: 0, undefined: 0 },
    Toiture: { total: 0, occupied: 0, nonOccupied: 0, undefined: 0 },
    Etage1: { total: 0, occupied: 0, nonOccupied: 0, undefined: 0 },
  });

  // Function to fetch room data for a specific room
  const fetchRoomData = async (dynamicId, category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room/${dynamicId}/control_endpoint_list`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const endpoints = response.data[0].endpoints;
        if (Array.isArray(endpoints) && endpoints.length > 3) {
          const isActive = endpoints[3]?.currentValue;
          // Update roomCounts based on the fetched data
          setRoomCounts(prevCounts => {
            const updatedCounts = { ...prevCounts };
            updatedCounts[category].total += 1;
            if (typeof isActive === 'boolean') {
              if (isActive) {
                updatedCounts[category].occupied += 1;
              } else {
                updatedCounts[category].nonOccupied += 1;
              }
            } else {
              updatedCounts[category].undefined += 1;
            }
            return updatedCounts;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  // Function to fetch all data for rooms and categories
  const getAllList = async () => {
    try {
      const data = await globalApiActions.getAllList()
      setData(data);

      // Loop through the data to categorize and fetch room data
      data.children.forEach(child1 => {
        child1.children.forEach(child2 => {
          const category = child2.name;
          // Explicitly check for the categories to ensure they are being processed
          const isCategoryMatch = category === 'RDC' || category === 'Toiture' || category === 'Etage1'
          if (isCategoryMatch) {
            child2.children.forEach(child3 => {
              fetchRoomData(child3.dynamicId, category);
            });
          }
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    getAllList()
  }, []);

  // Function to calculate room occupation percentages
  const calculatePercentage = (category) => {
    const categoryData = roomCounts[category];
    if (!categoryData) {
      return { occupied: 0, nonOccupied: 0, undefined: 0 }; // Return default percentages if categoryData doesn't exist
    }

    const total = categoryData.total;
    return {
      occupied: total === 0 ? 0 : ((categoryData.occupied / total) * 100).toFixed(2),
      nonOccupied: total === 0 ? 0 : ((categoryData.nonOccupied / total) * 100).toFixed(2),
    };
  };

  // Function to calculate total occupied percentage
  const calculateTotalOccupiedPercentage = () => {
    // Calculate the total occupied percentage based on roomCounts
    const totalOccupied = roomCounts.RDC.occupied + roomCounts.Toiture.occupied + roomCounts.Etage1.occupied;
    const totalRooms = roomCounts.RDC.total + roomCounts.Toiture.total + roomCounts.Etage1.total;
    const wholeOccupancyRate = totalRooms === 0 ? 0 : ((totalOccupied / totalRooms) * 100).toFixed(2);
    return wholeOccupancyRate;
  }


  return (
    <div className='p-4 space-y-4'>
      <h1 className='text-4xl font-bold mb-6'>Affiche l’occupation de chaque pièce</h1>

      {/* Display a loading spinner while data is being fetched */}
      {loading && <Spinner aria-label="Large spinner example" size="lg" />}
      {/* Display an error message if there is an error */}
      {error && <p>Error: {error}</p>}

      {/* Display the fetched data */}
      {data && (
        <div>
          {data.children.map((child1) => (
            <div key={child1.staticId}>
              {/* Accordion component for each building */}
              <Accordion className='border-gray-200 shadow-sm'>
                <Accordion.Panel>
                  <Accordion.Title className='!shadow-none'>
                    <p className='text-2xl'>Occupation du bâtiment : {child1.name}</p>
                    <p>Taux d'occupation: <span className='text-red-500'>{calculateTotalOccupiedPercentage()}%</span></p>
                  </Accordion.Title>
                  {child1.children && child1.children.length > 0 && (
                    <div>
                      {child1.children.map((child2) => (
                        <div key={child2.staticId}>
                          <Accordion.Content>
                            {/* Accordion component for each category */}
                            <Accordion className='border-gray-100'>
                              <Accordion.Panel>
                                <Accordion.Title className='flex flex-column bg-gray-100 focus:shadow-none justify-between'>
                                  <p className='font-semibold'>{child2.name}</p>

                                  <div>
                                    {/* Display occupied and nonOccupied room percentages */}
                                    <p>Pieces occupées: <span className='text-red-500'>{calculatePercentage(child2.name).occupied}%</span></p>
                                    <p>Pieces non-occupée: <span className='text-green-500'>{calculatePercentage(child2.name).nonOccupied}%</span></p>
                                  </div>

                                </Accordion.Title>
                                {child2.children && child2.children.length > 0 && (
                                  <div>
                                    {child2.children.map((child3) => (
                                      <div key={child3.staticId}>
                                        <Accordion.Content>
                                          {/* Display individual room data and occupation */}
                                          <div className='flex flex-row justify-between border-b-2 border-gray-100 pb-4 '>
                                            <div>
                                              <p>{child3.name}</p>
                                            </div>
                                            {/* Use the BuildingOccupation component to display room occupation */}
                                            <BuildingOccupation data={child3.dynamicId} />
                                          </div>
                                        </Accordion.Content>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </Accordion.Panel>
                            </Accordion>
                          </Accordion.Content>
                        </div>
                      ))}
                    </div>
                  )}
                </Accordion.Panel>
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FloorData;
