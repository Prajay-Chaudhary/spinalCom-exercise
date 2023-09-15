import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './Config/apiConfig';
import { Accordion } from 'flowbite-react';
import BuildingOccupation from './BuildingOccupation';

function FloorData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make a GET request using Axios
    axios
      .get(`${API_BASE_URL}/geographicContext/space`)
      .then((response) => {
        // Handle the successful response here
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <>
      <div>
        <h1 className='text-4xl font-bold mb-6 hover:uppercase'>Affiche l’occupation de chaque pièce</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          // Only render the data when loading is false
          <div>
            {/* Accessing nested data */}
            {data.children && data.children.length > 0 && (
              <div>
                {data.children.map((child1) => (
                  <div key={child1.staticId}>
                    <Accordion className='border-blue-700 shadow-xl bg-green-100'>
                      <Accordion.Panel>
                        <Accordion.Title>
                          <p className='text-2xl'>Occupation du bâtiment : {child1.name}</p>
                        </Accordion.Title>
                        {child1.children && child1.children.length > 0 && (
                          <div>
                            {child1.children.map((child2) => (
                              <div key={child2.staticId}>
                                <Accordion.Content className='bg-blue-100'>
                                  <Accordion className='border-blue-700'>
                                    <Accordion.Panel>
                                      <Accordion.Title>
                                        <p className='font-bold'>{child2.name}</p>
                                      </Accordion.Title>
                                      {/* Accessing the third level of nested data (children of grandchildren) */}
                                      {child2.children && child2.children.length > 0 && (
                                        <div>
                                          {child2.children.map((child3) => (
                                            <div key={child3.staticId}>
                                              <Accordion.Content>
                                                <div className='flex flex-row justify-between'>
                                                  <div>
                                                    <p className='font-semibold'>- {child3.name}</p>
                                                  </div>
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
        )}
      </div>
    </>
  );
}

export default FloorData;




