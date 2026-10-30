import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Modal from 'react-modal';
import { GET_GROUPLedger_URL } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

Modal.setAppElement('#root'); // This line is important for accessibility

const ViewTable = ({ title, units, totalItems, handleDelete, handleUpdate, pagination, searchvalue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [ledgers, setLedgers] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;

  if (totalItems < 1) return (<><hr className='text-slate-300' /><p className='text-slate-400 text-2xl text-center py-5'>No {title} Available</p></>);

  // Function to generate table headers dynamically
  const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

  const renderTableHeaders = () => {
    const excludedKeys = ['affectGrossProfit', 'subLedgerGroup', 'balanceReporting', "calculation", "gstDetails", "hsnCode", "slabBasedRates", "subGroup"];

    if (!units || units.length === 0) return null;

    const headers = Object.keys(units[0])
      .filter(key => !excludedKeys.includes(key))
      .map(header => header === 'id' ? 'Sno' : header);

    return headers
      .map((header, index) => (
        <th
          key={index}
          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
        >
          {header}
        </th>
      ))
      .concat([
        <th
          key="view-ledger"
          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
        >
          View Ledger
        </th>,
        <th
          key="actions"
          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
        >
          Actions
        </th>
      ]);
  };

  const handleSetLedger = async (id, group) => {
    try {
      const response = await fetch(`${GET_GROUPLedger_URL}/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setLedgers(data);
        setSelectedGroup(group);
        setIsModalOpen(true);
      } else {
        toast.error("Failed to fetch ledger data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch ledger data");
    }
  };

  const renderTableRows = () => {
    const excludedKeys = ['affectGrossProfit', 'subLedgerGroup', 'balanceReporting', "calculation", "gstDetails", "hsnCode", "slabBasedRates", "subGroup"];

    if (!units || units.length === 0) return null;

    return units.map((item, rowIndex) => {
      const updatedItem = { ...item, id: startingSerialNumber + rowIndex };

      return (
        <tr key={rowIndex} className='bg-white dark:bg-slate-700 dark:text-white'>
          {Object.entries(updatedItem)
            .filter(([key]) => !excludedKeys.includes(key))
            .map(([key, value], colIndex) => (
              <td key={colIndex} className="px-5 py-5 border-b border-gray-200 text-sm align-top">
                {Array.isArray(value) ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-900">
                    {value.map((item, i) => (
                      <p key={i} className="text-gray-900 whitespace-pre-wrap">{item}</p>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">{value}</p>
                )}
              </td>
            ))}

          <td key="view-ledger" className="px-5 py-5 border-b border-gray-200 text-sm">
            <button
              onClick={() => handleSetLedger(item.id, item)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FiEye size={17} className="mx-auto" title={`View Ledgers for ${item.name}`} />
            </button>
          </td>

          <td key="actions" className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap justify-center">
              <FiEdit
                size={17}
                className='text-teal-500 hover:text-teal-700 mx-2'
                onClick={(e) => handleUpdate(e, item)}
                title={`Edit ${title}`}
              />
              |
              <FiTrash2
                size={17}
                className='text-red-500 hover:text-red-700 mx-2'
                onClick={(e) => handleDelete(e, item.id)}
                title={`Delete ${title}`}
              />
            </p>
          </td>
        </tr>
      );
    });
  };


  // Calculate totals for the modal
  const calculateTotals = () => {
    if (!ledgers || !Array.isArray(ledgers)) {
      return {
        totalDebit: 0,
        totalCredit: 0,
        totalOpeningBalance: 0,
        totalClosingBalance: 0,
      };
    }

    // Sum all debits and credits across all ledgers and their ledgerSuppliers
    let totalDebit = 0;
    let totalCredit = 0;
    let totalOpeningBalance = 0;

    ledgers.forEach((ledger) => {
      // Add ledger's opening balance
      totalOpeningBalance += Number(ledger?.openingBalance) || 0;

      // Sum debits and credits from ledgerSuppliers
      ledger.ledgerSuppliers?.forEach((ls) => {
        totalDebit += Number(ls.debit) || 0;
        totalCredit += Number(ls.credit) || 0;
      });
    });

    // Calculate total closing balance
    const totalClosingBalance = totalOpeningBalance + totalCredit - totalDebit;

    return {
      totalDebit,
      totalCredit,
      totalOpeningBalance,
      totalClosingBalance,
    };
  };

  const {
    totalDebit,
    totalCredit,
    totalOpeningBalance,
    totalClosingBalance
  } = calculateTotals();

  // Modal styles
  const customStyles = {
    content: {
      top: '50%',
      left: '62%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '80vh',
      borderRadius: '8px',
      padding: '20px',
      overflow: 'auto'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="pt-5">
        <div className='flex justify-between'>
          <h2 className="text-2xl font-semibold leading-tight text-center">View {title} </h2>
          <p
            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium 
                        bg-success text-success dark:bg-white dark:text-slate-800`}
          >
            Total {title} : {totalItems}
          </p>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ledger Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Ledger Details"
      >
        <div className="modal-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ledgers for {selectedGroup?.name || 'Group'}</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Opening Balance</h3>
              <p className="text-lg font-semibold">
                {formatCurrency(totalOpeningBalance)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-blue-500">Total Debit</h3>
              <p className="text-lg font-semibold text-blue-700">
                {formatCurrency(totalDebit)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-green-500">Total Credit</h3>
              <p className="text-lg font-semibold text-green-700">
                {formatCurrency(totalCredit)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-purple-500">Total Closing Balance</h3>
              <p className={`text-lg font-semibold ${totalClosingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {formatCurrency(totalClosingBalance)}
              </p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {/* Opening Balance Row */}


                {/* Ledger Rows */}
                {ledgers?.map((ledger, index) => {
                  // Calculate total credit for this ledger
                  const totalCredit = ledger.ledgerSuppliers?.reduce(
                    (sum, ls) => sum + (parseFloat(ls.credit) || 0),
                    0
                  ) || 0;
                  const opening = Number(ledger?.openingBalance) || 0;

                  // Calculate total debit for this ledger
                  const totalDebit = ledger.ledgerSuppliers?.reduce(
                    (sum, ls) => sum + (parseFloat(ls.debit) || 0),
                    0
                  ) || 0;
                  const typeOfOpening = ledger.typeOfOpeningBalance

                  // Calculate running balance up to this index
                  const runningBalance = opening + totalCredit - totalDebit
              

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ledger.supplier?.name || '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalDebit > 0 ? formatCurrency(totalDebit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalCredit > 0 ? formatCurrency(totalCredit) : '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${typeOfOpening =="CR" ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {formatCurrency(opening)}
                        {typeOfOpening && (
                          <span className={`ml-1 ${typeOfOpening === 'CR' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {typeOfOpening}
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${runningBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {formatCurrency(runningBalance)}
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    Totals:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(totalOpeningBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${totalClosingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {formatCurrency(totalClosingBalance)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewTable;