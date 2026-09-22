import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Pagination from '../Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa6';
import { TiTickOutline } from 'react-icons/ti';
import { ImCross } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import reactSelect from 'react-select';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const ViewZohoContact = () => {
  const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state?.persisted?.user);
      const { token } = currentUser;
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');

  // ---- Fetch contacts from API ----
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/zoho/contacts',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Adjust based on your auth method
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Adjust based on actual API response shape
      const list = Array.isArray(data) ? data : data?.contacts || data?.data || [];
      console.log(list,"4444444444440");
      
      setContacts(list);
      setPagination(prev => ({
        ...prev,
        totalItems: list.length,
        totalPages: Math.ceil(list.length / prev.itemsPerPage),
      }));
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to fetch contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ---- Helpers ----
  const filteredContacts = contacts.filter(item => {
    if (!searchQuery) return true;
    const name = item?.customerName || item?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const response = await fetch(`http://localhost:8081/api/zoho/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      // Refresh list
      fetchContacts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete contact');
    }
  };

  const handleUpdate = (e, item) => {
    e.preventDefault();
    // Adjust route as needed
    navigate(`/customer/update/${item?.id}`);
  };

  // ---- Search form ----
  const formattedContacts = contacts.map(c => ({
    label: c.customerName || c.name,
    value: c.customerName || c.name,
  }));

  const handleSubmit = (values) => {
    setSearchQuery(values.customerName || '');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // ---- Table rows ----
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-5">Loading...</td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-5 text-red-500">{error}</td>
        </tr>
      );
    }
    if (filteredContacts.length==0) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-5">No results found</td>
        </tr>
      );
    }

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const pageItems = filteredContacts.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );

    return pageItems.map((item, index) => (
      <tr key={item?.id || index} className="bg-white dark:bg-slate-700 dark:text-white">
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {startIndex + index + 1}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {item?.customerName || item?.name}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {item?.Phone || item?.Phone}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {item?.billingAddress}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {item?.customerOrigin || item?.customerOrigin}
          </p>
        </td>
           <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap dark:text-white">
            {item?.shippingAddress }
          </p>
        </td>
      
      </tr>
    ));
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
                      <span>Zoho Contacts </span>
                      <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                        TOTAL CONTACTS: {filteredContacts.length}
                      </span>
                    </h2>
                  </div>

                  {/* <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Customer
                      </label>
                      <Field
                        name="customerName"
                        component={reactSelect}
                        options={[
                          { label: 'View All Customer', value: null },
                          ...formattedContacts,
                        ]}
                        styles={customStyles}
                        placeholder="Select Customer"
                        value={formattedContacts.find(
                          option => option.value === values.customerName
                        )}
                        onChange={option =>
                          setFieldValue('customerName', option ? option.value : '')
                        }
                      />
                    </div>
                  </div> */}
                  {/* <div className="flex justify-center">
                    <button
                      type="submit"
                      className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                    >
                      Search
                    </button>
                  </div> */}
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
                      Phone
                    </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Billing Address
                    </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                     Customer Origin

                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                     Shipping Address
                    </th>
                    
                    
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Update Ledger
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Updated Ledger
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th> */}
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

export default ViewZohoContact;