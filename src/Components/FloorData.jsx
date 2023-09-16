import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './Config/apiConfig';
import { Accordion } from 'flowbite-react';
import BuildingOccupation from './BuildingOccupation';
import { Spinner } from 'flowbite-react';

function FloorData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/geographicContext/space`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4 space-y-4'>
      <h1 className='text-4xl font-bold mb-6'>
        Affiche l’occupation de chaque pièce
      </h1>

      {loading && <Spinner
        aria-label="Large spinner example"
        size="lg"
      />}
      {error && <p>Error: {error}</p>}

      {data && (
        <div>
          {data.children.map((child1) => (
            <div key={child1.staticId}>
              <Accordion className='border-gray-200 shadow-sm'>
                <Accordion.Panel>
                  <Accordion.Title className='!shadow-none'>
                    <p className='text-2xl'>Occupation du bâtiment : {child1.name}</p>
                  </Accordion.Title>
                  {child1.children && child1.children.length > 0 && (
                    <div>
                      {child1.children.map((child2) => (
                        <div key={child2.staticId}>
                          <Accordion.Content>
                            <Accordion className='border-gray-100'>
                              <Accordion.Panel>
                                <Accordion.Title className='flex flex-column bg-gray-100 focus:shadow-none justify-between'>
                                  <p className='font-semibold'>{child2.name}</p>

                                  <p className='font-semibold text-gray-500'> 100% d’occupation</p>

                                </Accordion.Title>
                                {child2.children && child2.children.length > 0 && (
                                  <div>
                                    {child2.children.map((child3) => (
                                      <div key={child3.staticId}>
                                        <Accordion.Content>
                                          <div className='flex flex-row justify-between border-b-2 border-gray-100 pb-4 '>
                                            <div>
                                              <p>{child3.name}</p>
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
  );
}

export default FloorData;

