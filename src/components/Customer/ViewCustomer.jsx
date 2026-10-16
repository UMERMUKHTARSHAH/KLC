import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import MaterialPoModal from '../../hooks/MaterialPoModal';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import useCustomer from '../../hooks/useCustomer';
import { CHANGELOYALTY, customStyles as createCustomStyles } from '../../Constants/utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FaBook, FaCross } from 'react-icons/fa6';
import reactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { CgCross } from 'react-icons/cg';
import { ImCross } from 'react-icons/im';
import { TiTickOutline } from 'react-icons/ti';
import { Button } from 'react-bootstrap';
import LoyaltyTierBadge from './LoyaltyTierBadge';
import InviteToLegacyModal from './InviteToLegacyModal';

const ViewCustomer = () => {
  const {
    Customer,
    Customerr,
    getCustomerr,
    getCustomer,
    handleDelete,
    pagination,
    handleUpdate,
    handlePageChange,
    GetCustomerById,
  } = useCustomer();

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

  const [selectedMaterialPos, setSelectedMaterialPos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔽 NEW: Legacy invite modal state
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    getCustomer();
    getCustomerr();
  }, []);

  const handleViewMaterialPos = (materialPos) => {
    setSelectedMaterialPos(materialPos);
    setShowModal(true);
  };

  console.log(Customer, 'cusssssssss');

  const formattedCustomer = Customerr.map((cust) => ({
    label: cust.customerName,
    value: cust.customerName,
  }));

  const renderTableRows = () => {
    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return Customer.map((item, index) => (
      <tr key={index} className="bg-white dark:bg-slate-700 dark:text-white">
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.customerName}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.countryName}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{item?.email}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item?.contactNumber}
          </p>
        </td>

        {/* 🔽 Loyalty Tier badge */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <LoyaltyTierBadge tier={item?.currentTier} />
        </td>

        {/* 🔽 Invite to Legacy button */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
       <button
  type="button"
  onClick={() => {
    setSelectedCustomer(item);
    setLegacyModalOpen(true);
  }}
  style={{ backgroundColor: '#3f4f67' }}
  disabled={item?.currentTier?.toLowerCase()?.includes('legacy')}
  className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm transition ${
    item?.currentTier?.toLowerCase()?.includes('legacy')
      ? ' cursor-not-allowed opacity-60'
      : ' hover:opacity-90'
  }`}
>
  {item?.currentTier?.toLowerCase()?.includes('legacy')
    ? 'Already Legacy'
    : 'Invite To Legacy'}
</button>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FaBook
              size={17}
              className="text-teal-500 hover:text-teal-700 mx-2"
              onClick={(e) => navigate(`/customer/updateLedger/${item?.id}`)}
              title="Update Ledger"
            />
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            {item?.updateLedger == true ? (
              <TiTickOutline size={30} />
            ) : (
              <ImCross size={30} />
            )}
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FiEdit
              size={17}
              className="text-teal-500 hover:text-teal-700 mx-2"
              onClick={(e) => handleUpdate(e, item)}
              title="Edit Customer"
            />{' '}
            |
            <FiTrash2
              size={17}
              className="text-red-500 hover:text-red-700 mx-2"
              onClick={(e) => handleDelete(e, item?.id)}
              title="Delete Customer"
            />
          </p>
        </td>
      </tr>
    ));
  };

  const handleSubmit = (values) => {
    const filters = {
      customerName: values.customerName || undefined,
    };
    getCustomer(pagination.currentPage - 1, filters);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Customer / View Customer" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className="items-center justify-center">
            <Formik
              initialValues={{ customerName: '' }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="flex flex-row items-center justify-between w-full">
                    <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                      <span>CUSTOMER VIEW</span>
                      <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                        TOTAL CUSTOMERS: {pagination.totalItems}
                      </span>
                    </h2>
                  </div>

                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Customer
                      </label>
                      <Field
                        name="customerName"
                        component={reactSelect}
                        options={[
                          { label: 'View All Customer', value: null },
                          ...formattedCustomer,
                        ]}
                        styles={customStyles}
                        placeholder="Select Customer"
                        value={formattedCustomer.find(
                          (option) => option.value === values.customerName
                        )}
                        onChange={(option) =>
                          setFieldValue(
                            'customerName',
                            option ? option.value : ''
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Loyalty Tier
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Legacy Invitation
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Update Ledger
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Updated Ledger
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>

            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* 🔽 Legacy Invite Modal */}
      <InviteToLegacyModal
        isOpen={legacyModalOpen}
        onClose={() => {
          setLegacyModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSubmit={(payload) => {
          console.log('Legacy invite payload:', payload);  
          const updatetier =fetch(CHANGELOYALTY, {
            method:'post',
           headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            body: JSON.stringify({
              customerId: payload.customerId,
              earnRatePercent: payload.earnRatePercent,
              relationshipManager: payload.relationshipManager,
              grantedBy: payload.grantedBy
            })
          }).then((response) => {
             getCustomer(); 
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          }).catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
          // TODO: call your API here, e.g.
          // inviteToLegacy(payload).then(() => getCustomer());
        }}
      />
    </DefaultLayout>
  );
};

export default ViewCustomer;