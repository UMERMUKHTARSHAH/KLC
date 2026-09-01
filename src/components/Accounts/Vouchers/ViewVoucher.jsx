import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import { Field, Formik, Form } from 'formik';
import {
  DELETE_Voucher_URL,
  GET_VoucherName_URL,
  GET_VoucherNameFromType_URL,
  GET_Vouchersearch_URL,
  UPDATETOGGLE_Voucher_URL,
} from '../../../Constants/utils';
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from 'react-icons/md';
import useVoucher from '../../../hooks/useVoucher';
import { IoIosAdd } from 'react-icons/io';

const ViewVoucher = () => {
  const { Voucherr, getVoucherr } = useVoucher();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const theme = useSelector((state) => state?.persisted?.theme);
  const [isLoading, setisLoading] = useState(false);
  const customStyles = createCustomStyles(theme?.mode);
  const [prodIdOptions, setprodIdOptions] = useState([]);

  const { token } = currentUser;
  const [voucherrr, setvoucherrr] = useState([]);
  const [voucherTypee, setvoucherTypee] = useState([]);
  const [Voucher, setVoucher] = useState();
  const [voucherTypeee, setvoucherTypeee] = useState(null); // Initialize as null

  const Order = useSelector((state) => state?.nonPersisted?.Voucher);
  const navigate = useNavigate();
  const [IsVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [SelectedVoucherData, setSelectedVoucherData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10, // Add this
  });

  // Fetch all voucher names and types on mount
  useEffect(() => {
    getVoucher();
    getVouchernameAndType();
  }, []);

  // Fetch voucher types when voucherTypeee changes
  useEffect(() => {
    if (voucherTypeee) {
      getVoucherType();
    }
  }, [voucherTypeee]);

  const getVouchernameAndType = async () => {
    try {
      const response = await fetch(`${GET_VoucherName_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setvoucherrr(data);
      console.log('Voucher names and types:', data);
    } catch (error) {
      console.error('Error fetching voucher names and types:', error);
      toast.error('Failed to fetch voucher types');
    }
  };

  const getVoucherType = async () => {
    try {
      const response = await fetch(
        `${GET_VoucherNameFromType_URL}${voucherTypeee}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setvoucherTypee(data);
      console.log('Voucher names for selected type:', data);
    } catch (error) {
      console.error('Error fetching voucher names by type:', error);
      toast.error('Failed to fetch voucher names');
    }
  };

  const getVoucher = async (page = 1, filters = {}) => {
    try {
      const response = await fetch(`${GET_Vouchersearch_URL}?page=${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      console.log('Received data:', data);

      setVoucher(data.content || []);

      setPagination({
        totalItems: data?.totalElements || 0,
        data: data?.content || [],
        totalPages: data?.totalPages || 1,
        currentPage: data?.number !== undefined ? data.number + 1 : 1,
        itemsPerPage: data?.size || 10,
      });
    } catch (error) {
      console.error('Error in getVoucher:', error);
      toast.error(error.message || 'Failed to fetch vouchers');
      setVoucher([]);
      setPagination((prev) => ({
        ...prev,
        totalItems: 0,
        data: [],
        totalPages: 1,
        currentPage: 1,
      }));
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getVoucher(newPage);
  };

  // Prepare dropdown options (with safe checks)
  const voucherTypeOptions =
    voucherrr && voucherrr.length > 0
      ? [
          ...new Map(
            voucherrr.map((item) => [item.typeOfVoucher, item]),
          ).values(),
        ].map((vouch) => ({
          label: vouch.typeOfVoucher,
          value: vouch.typeOfVoucher,
        }))
      : [];

  const voucherNameOptions =
    voucherTypee && voucherTypee.length > 0
      ? voucherTypee.map((vouch) => ({
          label: vouch?.name,
          value: vouch?.name,
        }))
      : [];

  const handleSubmit = (values) => {
    console.log(values, 'form values');
    const filters = {
      typeOfVoucher: values?.typeOfVoucher || undefined,
      name: values.name || undefined,
    };
    getVoucher(1, filters); // Reset to page 1 when searching
  };

  const renderTableRows = () => {
    if (!Voucher || Voucher.length === 0) {
      return (
        <tr className="bg-white dark:bg-slate-700 dark:text-white">
          <td
            colSpan="8"
            className="px-5 py-5 border-b border-gray-200 text-sm"
          >
            <p className="text-gray-900 whitespace-no-wrap text-center">
              No Voucher Found
            </p>
          </td>
        </tr>
      );
    }

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    const handleDelete = async (e, id) => {
      e.preventDefault();
      try {
        const response = await fetch(`${DELETE_Voucher_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(`Voucher Deleted Successfully !!`);

          const isCurrentPageEmpty = Voucher.length === 1;
          if (isCurrentPageEmpty && pagination.currentPage > 1) {
            const previousPage = pagination.currentPage - 1;
            handlePageChange(previousPage);
          } else {
            getVoucher(pagination.currentPage);
          }
        } else {
          toast.error(`${data.errorMessage}`);
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred');
      }
    };

    const handleToggle = async (voucher) => {
      try {
        const newStatus = !voucher.actVoucher;
        const response = await fetch(
          `${UPDATETOGGLE_Voucher_URL}/${voucher.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ actVoucher: newStatus }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update voucher status');
        }

        toast.success(
          `Voucher ${newStatus ? 'Activated' : 'Deactivated'} successfully`,
        );
        getVoucher(pagination.currentPage);
      } catch (err) {
        console.error(err);
        toast.error('Error updating voucher status');
      }
    };

    console.log(Voucher, '665');

    return Voucher.map((item, index) => (
      <tr
        key={item.id || index}
        className="bg-white dark:bg-slate-700 dark:text-white"
      >
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{item?.name}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item?.typeOfVoucher}
          </p>
        </td>
        <td>
          <span
            onClick={() => {
              let path = `/voucher/create/${item.id}`;

              if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'debitnote'
              ) {
                path = `/voucher/createdebitNote/${item.id}`;
              } else if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'creditnote'
              ) {
                path = `/voucher/createcreditNote/${item.id}`;
              } else if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'contra'
              ) {
                path = `/voucher/createcontra/${item.id}`;
              } else if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'journal'
              ) {
                path = `/voucher/createjournal/${item.id}`;
              } else if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'receipt'
              ) {
                path = `/voucher/createreceipt/${item.id}`;
              } else if (
                item.typeOfVoucher?.toLowerCase().replace(/\s+/g, '') ===
                'stockjournal'
              ) {
                path = `/voucher/createstockJournel/${item.id}`;
              }

              navigate(path);
            }}
            className="view-badge bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer"
          >
            Add Entry
          </span>
        </td>

        {
          // For Debit Note, Credit Note, Receipt, and Stock Journal - always show View Entries
          [
            'debitnote',
            'debit note',
            'credit note',
            'creditnote',
            'receipt',
            'stockjournal',
            'contra',
          ].includes(item.typeOfVoucher?.toLowerCase()) ? (
            <td>
              <span
                onClick={() => {
                  let viewPath = '';

                  if (
                    item.typeOfVoucher?.toLowerCase().replace(/\s/g, '') ===
                    'debitnote'
                  ) {
                    viewPath = `/voucherEntriesView/${item.id}?DEBIT_NOTE`;
                  } else if (
                    item.typeOfVoucher?.toLowerCase().replace(/\s/g, '') ===
                    'creditnote'
                  ) {
                    viewPath = `/voucherEntriesView/${item.id}?CREDIT_NOTE`;
                  } else if (item.typeOfVoucher?.toLowerCase() === 'receipt') {
                    viewPath = `/voucherEntriesView/${item.id}?RECEIPT_NOTE`;
                  } else if (
                    item.typeOfVoucher?.toLowerCase().replace(/\s/g, '')  === 'stockjournal'
                  ) {
                    viewPath = `/voucherEntriesStockJournal/${item.id}`;
                  } else if (item.typeOfVoucher?.toLowerCase() === 'contra') {
                    viewPath = `/voucherEntriesView/${item.id}?CONTRA`;
                  }

                  navigate(viewPath);
                }}
                className="view-badge bg-blue-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer"
              >
                View Entries
              </span>
            </td>
          ) : // For other voucher types (Contra, Payment, Journal, etc.), check entryPayments
          item.entryPayments && item.entryPayments.length > 0 ? (
            <td>
              <span
                onClick={() => {
                  let viewPath = '';

                  // Check voucher type for View Entries navigation
                  if (item.name?.toLowerCase() === 'contra') {
                    viewPath = `/voucherEntriesContra/${item.id}`;
                  } else if (item.typeOfVoucher === 'Payment') {
                    viewPath = `/voucherEntriesPayment/${item.id}`;
                  } else {
                    viewPath = `/voucherEntries/${item.id}`;
                  }

                  navigate(viewPath);
                }}
                className="view-badge bg-blue-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer"
              >
                View Entries
              </span>
            </td>
          ) : (
            <td>
              <span className="text-gray-400 text-[10px] font-medium me-2 text-center py-2 px-4">
                No Entries
              </span>
            </td>
          )
        }

        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <IoIosAdd
            size={30}
            onClick={() => navigate(`/configurator/vouchers/${item.id}`)}
            className="cursor-pointer"
          />
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item?.defGstRegist?.state}
          </p>
        </td>
        <td className="px-5 py-5 text-sm">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item?.actVoucher || false}
              onChange={() => handleToggle(item)}
            />
            <div className="relative w-11 h-6 bg-black rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 transition-all duration-300 ease-in-out peer-checked:bg-green-500">
              <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white border-2 border-gray-800 rounded-full transition-all duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:border-green-500"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {item?.actVoucher ? 'Active' : 'Inactive'}
            </span>
          </label>
        </td>

        <td className="px-5 py-5 bBudget-b bBudget-gray-200 text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FiEdit
              size={17}
              className="text-teal-500 hover:text-teal-700 mx-2"
              onClick={() => navigate(`/Voucher/updateVoucher/${item?.id}`)}
              title="Edit Voucher"
            />{' '}
            |
            <FiTrash2
              size={17}
              className="text-red-500 hover:text-red-700 mx-2"
              onClick={(e) => handleDelete(e, item?.id)}
              title="Delete Voucher"
            />
          </p>
        </td>
      </tr>
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Voucher/ View Voucher" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 mb-4">
        <div className="pt-5 pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
              <span> Voucher View</span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                Count: {pagination.totalItems}
              </span>
            </h2>
          </div>

          <div className="items-center justify-center mb-3">
            <Formik
              initialValues={{
                typeOfVoucher: '',
                name: '',
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-6 flex justify-center items-center gap-6 mt-8">
                    {/* Voucher Type Field */}
                    <div className="min-w-[300px]">
                      <label className="mb-2.5 block font-bold text-black dark:text-white">
                        Voucher Type
                      </label>
                      <ReactSelect
                        name="typeOfVoucher"
                        value={voucherTypeOptions.find(
                          (option) => option.value === values.typeOfVoucher,
                        )}
                        onChange={(option) => {
                          setFieldValue(
                            'typeOfVoucher',
                            option ? option.value : '',
                          );
                          setvoucherTypeee(option ? option.value : null);
                          setFieldValue('name', ''); // Reset name when type changes
                        }}
                        options={[
                          { label: 'View All', value: '' },
                          ...voucherTypeOptions,
                        ]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Voucher Type"
                        isClearable
                      />
                    </div>

                    {/* Voucher Name Field */}
                    <div className="min-w-[300px]">
                      <label className="mb-2.5 block font-bold text-black dark:text-white">
                        Voucher Name
                      </label>
                      <ReactSelect
                        name="name"
                        value={voucherNameOptions.find(
                          (option) => option.value === values.name,
                        )}
                        onChange={(option) =>
                          setFieldValue('name', option ? option.value : '')
                        }
                        options={[
                          { label: 'View All', value: '' },
                          ...voucherNameOptions,
                        ]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Voucher Name"
                        isClearable
                        isDisabled={
                          !values.typeOfVoucher && values.typeOfVoucher !== ''
                        } // Disable if no type selected
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="flex w-[240px] h-[44px] rounded-lg justify-center items-center bg-primary font-medium text-white hover:bg-opacity-90 transition duration-300 shadow-md hover:shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Search
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div className="pr-9">
        <div className="mt-9 bg-white">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SNO
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      VoucherName
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Voucher Type
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Add Entries
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      View Entries
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ADD SUB VOUCHER
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      GST REGISTRATION
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Activation Status
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
    </DefaultLayout>
  );
};

export default ViewVoucher;
