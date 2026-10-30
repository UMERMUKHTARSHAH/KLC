import React from 'react';
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ViewTable = ({ 
    title, 
    units = [], 
    totalItems, 
    handleDelete, 
    handleUpdate, 
    pagination,
    columns = [] // Accept custom columns
}) => {
    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;


    // Function to generate dynamic headers
    const renderTableHeaders = () => {
        // If custom columns are provided, use them
        if (columns.length > 0) {
            return columns.map((col, index) => (
                <th
                    key={index}
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
                >
                    {col.label}
                </th>
            ));
        }

        // Otherwise generate from first item's keys
        if (!units || units.length === 0) return null;
        
        const excludedKeys = ['id', 'affectGrossProfit', 'subLedgerGroup', 'balanceReporting', 
                              "calculation", "gstDetails", "hsnCode", "slabBasedRates", "subGroup"];
        
        const headers = Object.keys(units[0])
            .filter(key => !excludedKeys.includes(key))
            .map(header => header === 'id' ? 'Sno' : header);

        return headers.map((header, index) => (
            <th
                key={index}
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
            >
                {header}
            </th>
        ));
    };

    // Function to render table rows
    const renderTableRows = () => {
        if (!units || units.length === 0) return null;

        return units.map((item, rowIndex) => {
            const serialNumber = startingSerialNumber + rowIndex;

            // If custom columns are provided, use them
            if (columns.length > 0) {
                return (
                    <tr key={rowIndex} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600'>
                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                            {serialNumber}
                        </td>
                        
                        {columns.map((col, colIndex) => (
                            <td key={colIndex} className="px-5 py-5 border-b border-gray-200 text-sm">
                                {col.render 
                                    ? col.render(item[col.key], item)
                                    : <p className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap">
                                        {item[col.key] || '-'}
                                      </p>
                                }
                            </td>
                        ))}
                        
                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                            <div className="flex justify-center space-x-3">
                                <FiEdit
                                    size={17}
                                    className='text-teal-500 hover:text-teal-700 cursor-pointer'
                                    onClick={(e) => handleUpdate(e, item)}
                                    title={`Edit ${title}`}
                                />
                                <FiTrash2
                                    size={17}
                                    className='text-red-500 hover:text-red-700 cursor-pointer'
                                    onClick={(e) => handleDelete(e, item.id)}
                                    title={`Delete ${title}`}
                                />
                            </div>
                        </td>
                    </tr>
                );
            }

            // Otherwise use dynamic keys
            const excludedKeys = ['id', 'affectGrossProfit', 'subLedgerGroup', 'balanceReporting', 
                                  "calculation", "gstDetails", "hsnCode", "slabBasedRates", "subGroup"];
            
            return (
                <tr key={rowIndex} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600'>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        {serialNumber}
                    </td>
                    
                    {Object.entries(item)
                        .filter(([key]) => !excludedKeys.includes(key))
                        .map(([key, value], colIndex) => (
                            <td key={colIndex} className="px-5 py-5 border-b border-gray-200 text-sm">
                                {Array.isArray(value) ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {value.map((item, i) => (
                                            <p key={i} className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap">
                                                {item}
                                            </p>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap">
                                        {value}
                                    </p>
                                )}
                            </td>
                        ))}
                    
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        <div className="flex justify-center space-x-3">
                            <FiEdit
                                size={17}
                                className='text-teal-500 hover:text-teal-700 cursor-pointer'
                                onClick={(e) => handleUpdate(e, item)}
                                title={`Edit ${title}`}
                            />
                            <FiTrash2
                                size={17}
                                className='text-red-500 hover:text-red-700 cursor-pointer'
                                onClick={(e) => handleDelete(e, item.id)}
                                title={`Delete ${title}`}
                            />
                        </div>
                    </td>
                </tr>
            );
        });
    };

    if (totalItems < 1) return (
        <>
            <hr className='text-slate-300' />
            <p className='text-slate-400 text-2xl text-center py-5'>No {title} Available</p>
        </>
    );

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <div className="pt-5">
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-2xl font-semibold leading-tight">View {title}</h2>
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
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                        S.No
                                    </th>
                                    {renderTableHeaders()}
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTable;