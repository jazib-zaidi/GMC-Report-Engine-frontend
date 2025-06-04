import React, { useState } from 'react';
import GoBack from '../GoBack';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { StoreIcon } from 'lucide-react';
import LiaMetrics from './LiaMetrics';
import SelectedDate from './selectedDate';

const LocalDashboard = () => {
  const { liaReportData, setLiaStoreData } = useAuth();
  const [expandedStore, setExpandedStore] = useState(null);

  const mapableStore = [
    {
      id: '86ec4ae5-d8c6-4061-9913-9712d9249b41',
      address:
        'Macquarie Street, Cnr Brabyn Street, Windsor NSW 2756, Australia',
      name: 'Hawkesbury Auto Spares',
      link: 'https://business.google.com/n/17770002753445198432/profile?fid=1013671348874402249',
    },
    {
      id: 'cd7e8645-e374-490e-8bb6-c798cc25fa2d',
      address:
        '1389 Healesville-kooweerup Road, Woori Yallock VIC 3139, Australia',
      name: 'Auto One Woori Yallock',
      link: 'https://business.google.com/n/4608868614277918193/profile?fid=11347975003322462773',
    },
    {
      id: '31686a72-3eaf-4eaa-8d33-751cae7c1ce6',
      address: '71 Main Street, West Wyalong NSW 2671, Australia',
      name: 'Auto One West Wyalong',
      link: 'https://business.google.com/n/12201661673176868043/profile?fid=2252072079107679260',
    },
    {
      id: '3b4eb798-d62f-4cf2-8f83-5e43ff73e01a',
      address: '52 Medcalf Street, Warners Bay NSW 2282, Australia',
      name: 'Auto One Warners Bay',
      link: 'https://business.google.com/n/5881263725072119787/profile?fid=15137488151935432923',
    },
    {
      id: 'e9e4ffb3-f8b7-4532-b2a3-201a79ce8bd3',
      address: '80 Pacific Highway, Waitara NSW 2077, Australia',
      name: 'Auto One Waitara',
      link: 'https://business.google.com/n/7895442067200782444/profile?fid=16847581659281905960',
    },
    {
      id: '8bd0f9a1-70b7-4cd7-a4f4-240ace55ec3d',
      address: '1-3 Pearson Street, Wagga Wagga NSW 2650, Australia',
      name: 'Auto One Wagga Wagga',
      link: 'https://business.google.com/n/15562202599102028646/profile?fid=9358012490032990964',
    },
    {
      id: '2cfefb99-bcbb-4d40-be85-e3179ad7ccad',
      address: 'Reed Street North, Athllon Drive, Greenway ACT 2900, Australia',
      name: 'Auto One Tuggeranong',
      link: 'https://business.google.com/n/18141670459564914847/profile?fid=3433812287776364467',
    },
    {
      id: '64451c8f-a45b-466f-a6e8-a63c9217433c',
      address: '298 Bayswater Rd, Garbutt QLD 4814, Australia',
      name: 'Auto One Townsville',
      link: 'https://business.google.com/n/817859712061296187/profile?fid=9583767977504330921',
    },
    {
      id: 'AONO',
      address: '1/40 Carrington Rd, Castle Hill NSW 2154, Australia',
      name: 'Auto One Support Office',
      link: 'https://business.google.com/n/12933828320359683951/profile?fid=7925448393629026923',
    },
    {
      id: '200995fa-c1e8-4bf1-8842-9f57b915fa38',
      address: '5/176 Forrester Road, St Marys NSW 2760, Australia',
      name: 'Auto One St Marys',
      link: 'https://business.google.com/n/2124573352650450882/profile?fid=16408538424696667829',
    },
    {
      id: '5717ef92-df8a-4e0e-9e47-7fe8f7bdb5db',
      address: 'Campbell Street, Bourke Street, Singleton NSW 2330, Australia',
      name: 'Auto One Singleton',
      link: 'https://business.google.com/n/431523722765426333/profile?fid=13782778363309946862',
    },
    {
      id: 'A1sea',
      address:
        '9 Seaford Road, Seaford Meadows South Australia 5169, Australia',
      name: 'Auto One Seaford',
      link: 'https://business.google.com/n/787684366784814837/profile?fid=9733771659020372716',
    },
    {
      id: '95f31c4b-a8a2-45ce-adfe-4419d17de05c',
      address: '186 Kelly Street, Scone NSW 2337, Australia',
      name: 'Auto One Scone',
      link: 'https://business.google.com/n/7708547022239776049/profile?fid=17454540392779403656',
    },
    {
      id: '36a07027-7042-4301-9f76-deee91fe1b73',
      address: '75a Dixon Road, Rockingham WA 6168, Australia',
      name: 'Auto One Rockingham',
      link: 'https://business.google.com/n/11438761620859022042/profile?fid=17743368665661456020',
    },
    {
      id: '26ab83d3-d680-43db-aadc-d55ae3d26c06',
      address: '6B Augusta Highway, Port Augusta SA 5700, Australia',
      name: 'Auto One Port Augusta',
      link: 'https://business.google.com/n/8136864202273277562/profile?fid=2807736072871590047',
    },
    {
      id: '383b9beb-22ba-411f-b5ac-e9cb3dd2e17a',
      address:
        'Cnr Murray Street and, Pinjarra Road, Pinjarra Western Australia 6208, Australia',
      name: 'Auto One Pinjarra',
      link: 'https://business.google.com/n/12455560708964953439/profile?fid=10536385444697675625',
    },
    {
      id: 'd361d04b-e564-4e8f-9fc3-49078450139b',
      address: '155 Bellarine Highway, Newcomb VIC 3219, Australia',
      name: 'Auto One Newcomb',
      link: 'https://business.google.com/n/3009609087513711179/profile?fid=4438200845940320478',
    },
    {
      id: '94652202-a3cb-49c7-ac24-8b7c1c3ffbcb',
      address: '55-57 Nullum St, Murwillumbah NSW 2484, Australia',
      name: 'Auto One Murwillumbah',
      link: 'https://business.google.com/n/15107943468904092936/profile?fid=9115640410654614376',
    },
    {
      id: 'aebf14dd-68ee-40b6-b3bb-21fb3dec192a',
      address: 'Perry Street, Gladstone Street, Mudgee NSW 2850, Australia',
      name: 'Auto One Mudgee',
      link: 'https://business.google.com/n/8457944009208894638/profile?fid=18118798330734395128',
    },
    {
      id: '084307d3-a1ec-4078-978f-4b20c7f9b0b4',
      address: '1/160 Russell Street, Morley WA 6062, Australia',
      name: 'Auto One Morley',
      link: 'https://business.google.com/n/18204138296952858254/profile?fid=13942653075196068181',
    },
    {
      id: 'a8a94c9f-4b6c-4d90-9a75-0c1443635a47',
      address:
        'Shop 1, 3/156 Great Eastern Highway, Midvale WA 6056, Australia',
      name: 'Auto One Midland',
      link: 'https://business.google.com/n/1299156775350781000/profile?fid=3363114762841339791',
    },
    {
      id: '4128544f-f6b3-45f1-86d3-cf669016a5b5',
      address: '1137-1139 Botany Road, Mascot NSW 2020, Australia',
      name: 'Auto One Mascot',
      link: 'https://business.google.com/n/10999166551696087973/profile?fid=12219923531311802626',
    },
    {
      id: '5fd84fa2-3dd2-4a6d-9bc9-2ae551843907',
      address: '1/16 Stanford Way, Malaga WA 6090, Australia',
      name: 'Auto One Malaga',
      link: 'https://business.google.com/n/10881654108274726364/profile?fid=7194634668918333604',
    },
    {
      id: 'bbeb75d6-ae65-4c82-aef7-80af46921a7c',
      address: '40 Karratha Terrace, Karratha WA 6714, Australia',
      name: 'Auto One Karratha',
      link: 'https://business.google.com/n/16606107806948277652/profile?fid=6313323524929759095',
    },
    {
      id: '0c2150f9-eae8-4bce-a203-f916456bfb02',
      address: '23 Canning Road, Kalamunda WA 6076, Australia',
      name: 'Auto One Kalamunda',
      link: 'https://business.google.com/n/968053206674826285/profile?fid=16966392212014292347',
    },
    {
      id: 'Auto One Kadina',
      address: '1 Railway Terrace, Kadina SA 5554, Australia',
      name: 'Auto One Kadina',
      link: 'https://business.google.com/n/16360897398885847261/profile?fid=5864793363479822986',
    },
    {
      id: 'pn41n3v3evt1n082',
      address: '11 Goldsmith St, Goulburn NSW 2580, Australia',
      name: 'Auto One Goulburn',
      link: 'https://business.google.com/n/18346881272987678927/profile?fid=2040318139607872260',
    },
    {
      id: '2f4be74e-6cf7-4e2f-b11e-de50551d2f6c',
      address: '78 North West Coastal Highway, Wonthella WA 6530, Australia',
      name: 'Auto One Geraldton',
      link: 'https://business.google.com/n/10150506251533260451/profile?fid=15971342745687727327',
    },
    {
      id: 'c2a18738-3326-4c28-993e-c504f33a8249',
      address: '21 Pacific Highway, Gateshead NSW 2290, Australia',
      name: "Auto One Gateshead (Wolfy's)",
      link: 'https://business.google.com/n/5198501186811838626/profile?fid=2220511576062898488',
    },
    {
      id: 'd3594bcb-8d9d-4f96-b27d-e45d399573b3',
      address: 'Unit 7, 17 Iron Knob St, Fyshwick ACT 2609, Australia',
      name: 'Auto One Fyshwick',
      link: 'https://business.google.com/n/1909578432534592047/profile?fid=9704653254150656327',
    },
    {
      id: '79f5a509-46c8-4b59-93b5-33ed22569124',
      address: '94 Forrest St, Collie WA 6225, Australia',
      name: 'Auto One Collie',
      link: 'https://business.google.com/n/1349899495527663867/profile?fid=5440345473401589957',
    },
    {
      id: 'A1CT',
      address: '92 Kelly Rd, Modbury SA 5092, Australia',
      name: 'Auto One Clovercrest',
      link: 'https://business.google.com/n/2086102566120056968/profile?fid=11399884361571205634',
    },
    {
      id: '1f40773b-30d2-4eb7-8622-570ad52ec079',
      address:
        'Shop 4&5 / 52-54 Governor Macquarie Drive, Chipping Norton NSW 2170, Australia',
      name: 'Auto One Chipping Norton',
      link: 'https://business.google.com/n/14124019145266563582/profile?fid=6132595761548706249',
    },
    {
      id: 'e95b0ea1-80f3-4acc-887e-0eec81c69073',
      address: '2/9 Hoyle Avenue, Castle Hill NSW 2154, Australia',
      name: 'Auto One Castle Hill',
      link: 'https://business.google.com/n/18151901434047307862/profile?fid=15019524248896220771',
    },
    {
      id: 'f7921836-894f-4ac5-b006-282b6d29a0df',
      address: '77 Cook St, Busselton WA 6280, Australia',
      name: 'Auto One Busselton',
      link: 'https://business.google.com/n/8863804957230042333/profile?fid=9869875352990198135',
    },
    {
      id: '2819b501-22f4-4ed1-9c68-eab1d548ef42',
      address: '177-179 Bass Highway, Cooee TAS 7320, Australia',
      name: 'Auto One Burnie',
      link: 'https://business.google.com/n/7420683432384445847/profile?fid=17337830791186226073',
    },
    {
      id: 'f2bd48f1-8e7a-40a2-93ed-0f935dd1a5c6',
      address: 'Warehouse Street, Bunbury WA 6230, Australia',
      name: 'Auto One Bunbury',
      link: 'https://business.google.com/n/10221684495460234369/profile?fid=16262007940743244326',
    },
    {
      id: '2af582ae-0c6c-43bc-ad11-2b213e4af92a',
      address: '18 Commerce Dr, Browns Plains Queensland 4118, Australia',
      name: 'Auto One Browns Plains',
      link: 'https://business.google.com/n/9707032508751768378/profile?fid=18252405532716236522',
    },
    {
      id: 'b0408736-0f3e-488e-b6c1-0876c428af5e',
      address: '32 Nettlefold St, Belconnen ACT 2617, Australia',
      name: 'Auto One Belconnen',
      link: 'https://business.google.com/n/16457369502811874210/profile?fid=5897133785745083371',
    },
    {
      id: 'c893b2fa-125f-42f1-a11d-a439bb87aa70',
      address: '83 Erindale Road, Balcatta WA 6021, Australia',
      name: 'Auto One Balcatta',
      link: 'https://business.google.com/n/3482028042249859497/profile?fid=10481061249083809758',
    },
    {
      id: '7284655761946990064',
      address: 'Australia and Castle Hill NSW 2154, Australia',
      name: 'Auto One Australia National Support Office',
      link: 'https://business.google.com/n/7284655761946990064/profile?fid=11266763617790791068',
    },
    {
      id: '0e04a558-6a6f-497f-8845-3d2083c38f3b',
      address: '67 Champion Drive, Armadale WA 6112, Australia',
      name: 'Auto One Armadale',
      link: 'https://business.google.com/n/6142174922984662784/profile?fid=14411721399930362850',
    },
    {
      id: '4f4edcb4-c769-4493-93fd-51d1e904f10a',
      address: '106-108 Lockyer Ave, Centennial Park WA 6330, Australia',
      name: 'Auto One Albany',
      link: 'https://business.google.com/n/16986537789756253813/profile?fid=16000408999252249842',
    },
  ];
  // Function to toggle store expansion
  const toggleStore = (storeId) => {
    if (expandedStore === storeId) {
      setExpandedStore(null);
    } else {
      setExpandedStore(storeId);
    }
  };

  // Safely get the store data from formattedStoreQueryData
  const storeData = liaReportData?.formattedStoreQueryData || {};
  const topProductsData = liaReportData?.topProductsPerStore || {};

  // Function to safely calculate metrics for each store
  const calculateStoreMetrics = (products) => {
    // Ensure products is always an array
    const productsArray = Array.isArray(products) ? products : [];

    return {
      clicks: productsArray.reduce(
        (sum, product) => sum + (product?.clicks || 0),
        0
      ),
      impressions: productsArray.reduce(
        (sum, product) => sum + (product?.impressions || 0),
        0
      ),
      conversions: productsArray.reduce(
        (sum, product) => sum + (product?.conversions || 0),
        0
      ),
      cost: productsArray.reduce(
        (sum, product) => sum + (product?.cost || 0),
        0
      ),
      conversions_value: productsArray.reduce(
        (sum, product) => sum + (product?.conversions_value || 0),
        0
      ),
    };
  };

  // Function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatNumber = (num: number) => num.toLocaleString();

  const matrixData = liaReportData?.formattedStoreQueryData
    .filter((item) => item.store_id) // only include entries with a store_id
    .reduce(
      (acc, item) => {
        acc.clicks += item.clicks;
        acc.impressions += item.impressions;
        acc.conversions_value += item.conversions_value;
        acc.cost += item.cost;
        return acc;
      },
      {
        clicks: 0,
        impressions: 0,
        conversions_value: 0,
        cost: 0,
      }
    );

  const mapabl = (id) => {
    const filterData = mapableStore.filter((i) => {
      if (i.id == id.split('/')[1]) {
        return i;
      }
    });

    return filterData[0];
  };

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <GoBack />
        <SelectedDate />
      </div>
      <div className=''>
        <br />
        <h1 className='text-2xl font-bold mb-6'>Local Performance</h1>
        {/* so the materic would be for local only same for the online one  */}

        <LiaMetrics matrices={matrixData} />
      </div>
      <br />
      {Object.keys(storeData).length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          No store data available
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Store
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Impressions
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Clicks
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  CTR
                </th>

                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Conversions
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Cost
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  ROAS
                </th>

                <th
                  scope='col'
                  className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {liaReportData.formattedStoreQueryData
                .filter((store) => store?.store_id)
                .map((channel) => {
                  return (
                    <tr className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <span className='px-2.5 py-0.5 rounded-full text-sm font-medium hover:underline  text-blue-800 flex items-center gap-1'>
                            <StoreIcon />
                            <a
                              target='_blank'
                              href={`https://www.google.com/search?q=${
                                mapabl(channel?.store_id)?.name ||
                                channel?.store_id
                              }`}
                            >
                              <>
                                <p>
                                  {' '}
                                  {mapabl(channel?.store_id)?.name ||
                                    channel?.store_id}
                                </p>
                                <p className='text-gray-500 text-xs'>
                                  {mapabl(channel?.store_id)?.address ||
                                    channel?.store_id}
                                </p>
                              </>
                            </a>
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.impressions)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.clicks)}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {channel.impressions > 0
                          ? (
                              (channel.clicks / channel.impressions) *
                              100
                            ).toFixed(2)
                          : '0.00'}
                        %
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.conversions)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatCurrency(channel.cost)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(
                          (channel.conversions_value / channel.cost).toFixed(
                            2
                          ) * 100
                        )}
                        %
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <button className='text-[#0077e0] hover:text-[#0077e0] cursor-pointer whitespace-nowrap !rounded-button'>
                          <Link
                            onClick={() => setLiaStoreData([])}
                            to={`/LOCAL/${btoa(channel.store_id)}`}
                          >
                            <span className='flex items-center gap-1'>
                              View Details
                            </span>
                          </Link>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LocalDashboard;
