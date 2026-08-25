import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Count,
  DOWNLOADCUSTOMER_REPORT,
  DOWNLOADPRODUCTRE_REPORT,
} from '../Constants/utils';

// Import Icons
import { LuScale, LuPanelLeftClose } from 'react-icons/lu';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { AiOutlinePartition, AiOutlineClose } from 'react-icons/ai';
import {
  RiProgress1Line,
  RiProgress8Fill,
  RiUserReceived2Fill,
  RiAlignItemBottomFill,
} from 'react-icons/ri';
import { FcApproval, FcCancel } from 'react-icons/fc';
import { GrCompliance, GrUpdate } from 'react-icons/gr';
import {
  MdRepartition,
  MdOutlinePendingActions,
  MdOutlinePending,
  MdRecommend,
  MdEditSquare,
} from 'react-icons/md';
import { PiGearFineFill } from 'react-icons/pi';
import { CiCalendarDate } from 'react-icons/ci';
import { VscDiffModified } from 'react-icons/vsc';
import { toast } from 'react-toastify';
import { TbReorder } from 'react-icons/tb';
import { GiWool } from 'react-icons/gi';
import { GiRolledCloth } from 'react-icons/gi';
import { GiCottonFlower } from 'react-icons/gi';
import { GiBandageRoll } from 'react-icons/gi';
import { GiScrollUnfurled } from 'react-icons/gi';
import { FaDropbox } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';

const Home = () => {
  const [unitCount, setUnitCount] = useState([]);
  const [isDownloadingAllGroups, setIsDownloadingAllGroups] = useState(false);
  const [isDownloadingCustomer, setIsDownloadingCustomer] = useState(false);

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { user, token } = currentUser;
  const role = user?.authorities?.map((auth) => auth.authority) || [];
  const appMode = useSelector((state) => state?.persisted?.appMode);

  const { mode } = appMode;
  console.log(mode, 'kk');

  // Spinner Overlay Component
  const SpinnerOverlay = () => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-white/90 p-4 rounded-lg shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm font-medium text-gray-700 mt-2">Downloading...</p>
      </div>
    </div>
  );

  const handleDownloadAllGroupsProductReport = async () => {
    setIsDownloadingAllGroups(true);
    try {
      const response = await fetch(`${DOWNLOADPRODUCTRE_REPORT}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'AllGroupsProductReport.xlsx';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download report');
    } finally {
      setIsDownloadingAllGroups(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloadingCustomer(true);
    try {
      const response = await fetch(`${DOWNLOADCUSTOMER_REPORT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to download report');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'Customer.csv';
      if (disposition && disposition.includes('attachment')) {
        const match = disposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while downloading the report');
    } finally {
      setIsDownloadingCustomer(false);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(Count, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUnitCount(data || []);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [token]);

  // Convert unitCount array to an object for quick lookup
  const countMapping = unitCount.reduce((acc, item) => {
    acc[item.tableName] = item.count;
    return acc;
  }, {});

  // Role-based card mapping
  const roleBasedCards = {
    ROLE_ADMIN: [
      {
        title: 'Production Dashboard',
        link: '/kaniProducts',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelUp: true,
        description: 'Approval, in-progress, and completion status across every order.'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.'
      },
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business'
      },
      {
        title: 'All Reports',
        link: '/allReports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'The full library of report views for this workspace.'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.'
      },
      {
        title: 'Financial Reports',
        link: '/report/freports',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Revenue, dues, and payment status across all customers.'
      },
      {
        title: 'Customer Report',
        icon: <RiProgress1Line className="w-5 h-5" />,
        levelUp: true,
        isDownload: true,
        description: 'Order history and activity broken down by customer.'
      },
      {
        title: 'Product Report',
        link: '/report/product',
        icon: <GrCompliance className="w-5 h-5" />,
        levelUp: true,
        description: 'Volume and status broken down by individual product.'
      },
      {
        title: 'All Groups Product Report',
        icon: <GrCompliance className="w-5 h-5" />,
        levelUp: true,
        isDownload: true,
        isAllGroupsDownload: true,
        description: 'The same product view, rolled up across every product group.'
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        icon: <AiOutlinePartition className="w-5 h-5" />,
        levelUp: true,
        description: 'Import orders, products, or inventory from a spreadsheet.'
      },
    ],
    ROLE_EXECUTOR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.'
      },
    ],
    ROLE_ADMIN_DLI: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.'
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        icon: <AiOutlinePartition className="w-5 h-5" />,
        levelUp: true,
        description: 'Import orders, products, or inventory from a spreadsheet.'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.'
      },
    ],
    ROLE_QUALITYCONTROL: [
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.'
      },
    ],
    ROLE_FINANCE: [],
    ROLE_ADMIN_SXR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.'
      },
    ],
    ROLE_USER: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.'
      },
    ],
  };

  // Kani-based card mapping
  const kaniModeCards = [
    {
      title: 'Kani Section',
      link: '/kaniSection',
      countKey: 'kaniOrders',
      icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      description: 'Manage Kani section orders and production.'
    },
    {
      title: 'Pashmina Embroidery',
      link: '/pashminaEmbroidery',
      countKey: 'pashminaEmbroidery',
      icon: <GiScrollUnfurled className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-purple-500 to-purple-600',
      description: 'Track Pashmina embroidery orders.'
    },
    {
      title: 'Contemporary Pashmina',
      link: '/contemporaryPashmina',
      countKey: 'contemporaryPashmina',
      icon: <GiBandageRoll className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-green-500 to-green-600',
      description: 'Manage contemporary Pashmina production.'
    },
    {
      title: 'Papier Mache',
      link: '/papierMache',
      countKey: 'papierMache',
      icon: <TbReorder className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-red-500 to-red-600',
      description: 'Track Papier Mache orders and status.'
    },
    {
      title: 'Wool Embroidery',
      link: '/woolEmbroidery',
      countKey: 'woolEmbroidery',
      icon: <GiWool className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-amber-700 to-amber-800',
      description: 'Manage Wool embroidery production.'
    },
    {
      title: 'Contemporary Wool',
      link: '/contemporaryWool',
      countKey: 'contemporaryWool',
      icon: <GiRolledCloth className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-orange-600 to-orange-700',
      description: 'Track contemporary wool orders.'
    },
    {
      title: 'Cotton',
      link: '/cotton',
      countKey: 'cotton',
      icon: <GiCottonFlower className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-yellow-600 to-yellow-700',
      description: 'Manage cotton product orders.'
    },
    {
      title: 'Contemporary Saree',
      link: '/contemporarySaree',
      countKey: 'contemporarySaree',
      icon: <FaDropbox className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-teal-500 to-teal-600',
      description: 'Track contemporary saree orders.'
    },
  ];

  // Accounts mode cards
  const accountsModeCards = [
    {
      title: 'Day Book',
      link: '/configurator/dayBook',
      icon: <FaBook className="w-5 h-5" />,
      levelUp: true,
      description: 'View daily accounting entries and transactions.'
    },
  ];

  // Get all cards user should see based on roles
  const cardsToShow = (() => {
    if (mode === 'production') {
      return role.flatMap((roleName) => roleBasedCards[roleName] || []);
    }
    if (mode === 'accounts' && role.includes('ROLE_ADMIN')) {
      return accountsModeCards;
    }
    if (mode === 'kani') {
      return kaniModeCards;
    }
    return [];
  })();

  // Group cards by categories
  const getGroupedCards = () => {
    const operations = [];
    const reports = [];
    const dataTools = [];

    cardsToShow.forEach(card => {
      if (['Production Dashboard', 'Orders Dashboard', 'Monthly Order Calendar'].includes(card.title)) {
        operations.push(card);
      } else if (['Reports', 'All Reports', 'Retail/Wholesale Reports', 'Financial Reports', 
                  'Customer Report', 'Product Report', 'All Groups Product Report'].includes(card.title)) {
        reports.push(card);
      } else if (['Upload Excel'].includes(card.title)) {
        dataTools.push(card);
      } else {
        // If not categorized, put in operations
        operations.push(card);
      }
    });

    return { operations, reports, dataTools };
  };

  const { operations, reports, dataTools } = getGroupedCards();

  // Render a group of cards with heading
  const renderCardGroup = (cards, heading) => {
    if (cards.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{heading}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card, index) => {
            const isAllGroupsDownloading = card.isAllGroupsDownload && isDownloadingAllGroups;
            const isCustomerDownloading = card.isDownload && !card.isAllGroupsDownload && isDownloadingCustomer;
            const isDownloading = isAllGroupsDownloading || isCustomerDownloading;

            return card.isDownload ? (
              <div
                key={index}
                onClick={isDownloading ? undefined : card.isAllGroupsDownload ? handleDownloadAllGroupsProductReport : handleDownloadReport}
                className={`cursor-pointer relative ${isDownloading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              >
                {isDownloading && <SpinnerOverlay />}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {card.title}
                        </h3>
                        {card.levelUp && (
                          <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ↑
                          </span>
                        )}
                        {card.levelDown && (
                          <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ↓
                          </span>
                        )}
                      </div>
                      {card.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {card.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-600">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm font-medium text-blue-600">
                    {isDownloading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        Download
                        <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link to={card.link} key={index}>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 h-full">
                  <div className="flex items-start justify-between h-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {card.title}
                        </h3>
                        {/* {card.levelUp && (
                          <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ↑
                          </span>
                        )}
                        {card.levelDown && (
                          <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ↓
                          </span>
                        )} */}
                      </div>
                      {card.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {card.description}
                        </p>
                      )}
                      {card.countKey && countMapping[card.countKey] !== undefined && (
                        <span className="inline-block mt-2 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {countMapping[card.countKey]} items
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-600">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-3 flex items-center text-sm font-medium text-blue-600">
                    Open
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Home" />
      
      {/* Operations Group */}
      {renderCardGroup(operations, "Operations")}
      
      {/* Reports Group */}
      {renderCardGroup(reports, "Reports")}
      
      {/* Data Tools Group */}
      {renderCardGroup(dataTools, "Data tools")}
    </DefaultLayout>
  );
};

export default Home;