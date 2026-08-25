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
import { IoArrowForward } from 'react-icons/io5';

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
        description: 'Approval, in-progress, and completion status across every order.',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'All Reports',
        link: '/allReports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'The full library of report views for this workspace.',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      },
      {
        title: 'Financial Reports',
        link: '/report/freports',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Revenue, dues, and payment status across all customers.',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      {
        title: 'Customer Report',
        icon: <RiProgress1Line className="w-5 h-5" />,
        levelUp: true,
        isDownload: true,
        description: 'Order history and activity broken down by customer.',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
      },
      {
        title: 'Product Report',
        link: '/report/product',
        icon: <GrCompliance className="w-5 h-5" />,
        levelUp: true,
        description: 'Volume and status broken down by individual product.',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      },
      {
        title: 'All Groups Product Report',
        icon: <GrCompliance className="w-5 h-5" />,
        levelUp: true,
        isDownload: true,
        isAllGroupsDownload: true,
        description: 'The same product view, rolled up across every product group.',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600'
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        icon: <AiOutlinePartition className="w-5 h-5" />,
        levelUp: true,
        description: 'Import orders, products, or inventory from a spreadsheet.',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600'
      },
    ],
    ROLE_EXECUTOR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
    ],
    ROLE_ADMIN_DLI: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        icon: <AiOutlinePartition className="w-5 h-5" />,
        levelUp: true,
        description: 'Import orders, products, or inventory from a spreadsheet.',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
    ],
    ROLE_QUALITYCONTROL: [
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
    ],
    ROLE_FINANCE: [],
    ROLE_ADMIN_SXR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      },
      {
        title: 'Orders Dashboard',
        link: '/chart',
        icon: <SiHomeassistantcommunitystore className="w-5 h-5" />,
        levelDown: true,
        description: 'Track pending, delayed, and shipped orders in one place.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Monthly Order Calendar',
        link: '/Order/monthlyorders',
        icon: <RiProgress8Fill className="w-5 h-5" />,
        levelUp: true,
        description: 'See every order plotted against its month, at a glance.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
    ],
    ROLE_USER: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Analysis by area of the business',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        title: 'Retail/Wholesale Reports',
        link: '/report/wsRetailReport',
        icon: <RiAlignItemBottomFill className="w-5 h-5" />,
        levelUp: true,
        description: 'Compare sales performance across retail and wholesale channels.',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
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
      description: 'Manage Kani section orders and production.',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pashmina Embroidery',
      link: '/pashminaEmbroidery',
      countKey: 'pashminaEmbroidery',
      icon: <GiScrollUnfurled className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-purple-500 to-purple-600',
      description: 'Track Pashmina embroidery orders.',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Contemporary Pashmina',
      link: '/contemporaryPashmina',
      countKey: 'contemporaryPashmina',
      icon: <GiBandageRoll className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-green-500 to-green-600',
      description: 'Manage contemporary Pashmina production.',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Papier Mache',
      link: '/papierMache',
      countKey: 'papierMache',
      icon: <TbReorder className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-red-500 to-red-600',
      description: 'Track Papier Mache orders and status.',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Wool Embroidery',
      link: '/woolEmbroidery',
      countKey: 'woolEmbroidery',
      icon: <GiWool className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-amber-700 to-amber-800',
      description: 'Manage Wool embroidery production.',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Contemporary Wool',
      link: '/contemporaryWool',
      countKey: 'contemporaryWool',
      icon: <GiRolledCloth className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-orange-600 to-orange-700',
      description: 'Track contemporary wool orders.',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Cotton',
      link: '/cotton',
      countKey: 'cotton',
      icon: <GiCottonFlower className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-yellow-600 to-yellow-700',
      description: 'Manage cotton product orders.',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Contemporary Saree',
      link: '/contemporarySaree',
      countKey: 'contemporarySaree',
      icon: <FaDropbox className="w-5 h-5" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-teal-500 to-teal-600',
      description: 'Track contemporary saree orders.',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
  ];

  // Accounts mode cards
  const accountsModeCards = [
    {
      title: 'Day Book',
      link: '/configurator/dayBook',
      icon: <FaBook className="w-5 h-5" />,
      levelUp: true,
      description: 'View daily accounting entries and transactions.',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
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
        <h6 className="text-sm font-bold text-black mb-4">{heading}</h6>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                <div className="bg-white rounded-xl shadow-sm p-5 hover:border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg || 'bg-gray-100'} flex items-center justify-center`}>
                        <div className={`${card.iconColor || 'text-gray-600'}`}>
                          {card.icon}
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-black mt-2">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="text-sm text-gray-500">
                          {card.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3 mt-1">
                      <IoArrowForward className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to={card.link} key={index}>
                <div className="bg-white rounded-xl shadow-sm p-5 hover:border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg || 'bg-gray-100'} flex items-center justify-center`}>
                        <div className={`${card.iconColor || 'text-gray-600'}`}>
                          {card.icon}
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-black mt-2">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="text-sm text-gray-500">
                          {card.description}
                        </p>
                      )}
                      {card.countKey && countMapping[card.countKey] !== undefined && (
                        <span className="inline-block mt-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {countMapping[card.countKey]} items
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3 mt-1">
                      <IoArrowForward className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
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