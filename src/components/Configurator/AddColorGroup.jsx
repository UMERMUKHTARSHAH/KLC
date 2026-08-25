import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Form, Formik, FieldArray } from 'formik';
import Pagination from '../Pagination/Pagination';

import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import useColors from '../../hooks/useColor';

import useproductSubGroup from '../../hooks/useproductSubGroup';
import ReactSelect from 'react-select';

import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux';
const AddColorGroup = () => {
  const {
    colors,
    edit,
    currentColor,
    pagination,
    handlePageChange,
    handleSubmit,
    handleUpdate,
    handleDelete,
    getColors,
  } = useColors();

  console.log(currentColor, edit, 'umerrrr');

  const { groups } = useproductSubGroup();

  const theme = useSelector((state) => state?.persisted?.theme);

  const customStyles = createCustomStyles(theme?.mode);

  console.log(groups, '44444444444');

  const groupOptions = groups?.map((group) => {
    return { value: group.id, label: group.productGroupName };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColors, setFilteredColors] = useState([]);

  // Filter colors based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = colors.filter((color) =>
        color.colorName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredColors(filtered);
    } else {
      setFilteredColors(colors);
    }
  }, [searchTerm, colors]);

  // Render table rows
  const renderTableRows = () => {
    if (!filteredColors || filteredColors.length === 0) {
      return (
        <tr>
          <td
            colSpan="3"
            className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
          >
            No Design groups found
          </td>
        </tr>
      );
    }

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return filteredColors.map((item, index) => (
      <tr
        key={item.id}
        className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
      >
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-center">
          {startingSerialNumber + index}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">
          {item.productGroupName || '-'}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">
          {item.colors && item.colors.length > 0
            ? item.colors.map((color) => (
                <div className="mb-1 block font-semibold " key={color.id}>
                  <span
                    style={{ fontWeight: 'bolder ' }}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {color.colorName}
                  </span>
                </div>
              ))
            : '-'}
        </td>

        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleUpdate(e, item)}
              className="text-teal-500 hover:text-teal-700 transition-colors duration-200"
              title="Edit Design Group"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={(e) => handleDelete(e, item.id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Delete Design Group"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={
          edit
            ? 'Configurator/Update Design Group'
            : 'Configurator/Add Design Group'
        }
      />
      <div className="container mx-auto px-4 sm:px-8">
        {/* Form Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
              {edit ? 'Update Design Group' : 'Add New Design Group'}
            </h3>
          </div>
          <div className="p-6.5">
            <Formik
              initialValues={{
                productGroupId: edit ? currentColor.id : null,
                colors:
                  edit && currentColor.colors && currentColor.colors.length > 0
                    ? currentColor.colors.map((color) => ({
                        id: color.id, // Keep id for update tracking
                        colorName: color.colorName,
                      }))
                    : [{ colorName: '' }], // Start with one empty row for create
              }}
              enableReinitialize={true}
              validate={(values) => {
                const errors = {};

                // Validate product group
                if (!values.productGroupId) {
                  errors.productGroupId = 'Product group is required';
                }

                // Validate each color name
                const colorErrors = [];
                values.colors.forEach((color, index) => {
                  if (!color.colorName || color.colorName.trim() === '') {
                    colorErrors[index] = {
                      colorName: 'Design Group is required',
                    };
                  }
                });

                if (colorErrors.length > 0) {
                  errors.colors = colorErrors;
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                const payload = {
                  productGroupId: values.productGroupId,
                  colors: values.colors.map((color) => ({
                    id: color.id,
                    colorName: color.colorName,
                  })),
                };
                handleSubmit(payload, { setSubmitting, resetForm });
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <div className="flex flex-row mb-4.5 gap-8">
                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Product Group
                      </label>

                      <ReactSelect
                        name="productGroupId"
                        options={groupOptions}
                        value={
                          groupOptions.find(
                            (option) =>
                              String(option.value) ===
                              String(values.productGroupId),
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setFieldValue(
                            'productGroupId',
                            selectedOption ? selectedOption.value : null,
                          );
                        }}
                        className="w-full z-90 bg-transparent dark:bg-form-Field"
                        styles={customStyles}
                        placeholder="Select Product Group"
                      />
                    </div>
                    <div>
                      <FieldArray name="colors">
                        {({ push, remove, form }) => {
                          const { values, errors } = form;

                          return (
                            <div className="mb-4">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Design Group{' '}
                                <span className="text-red-500 ml-1">*</span>
                              </label>

                              {/* Color Rows */}
                              <div className="space-y-3">
                                {values.colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="flex-1">
                                      <Field
                                        type="text"
                                        name={`colors.${index}.colorName`}
                                        placeholder={`Enter Design Group ${
                                          index + 1
                                        }`}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                      />
                                      {errors?.colors?.[index]?.colorName && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errors.colors[index].colorName}
                                        </div>
                                      )}
                                    </div>

                                    {/* Delete Button */}
                                    {values.colors.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <FiX size={20} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Add Row Button */}
                              <button
                                type="button"
                                onClick={() => push({ colorName: '' })}
                                className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium
             text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg
             hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800
             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
             transition-all duration-200"
                              >
                                <FiPlus size={16} />
                                Add Design Group
                              </button>
                            </div>
                          );
                        }}
                      </FieldArray>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {edit ? 'Updating...' : 'Creating...'}
                        </>
                      ) : edit ? (
                        'Update Design Group'
                      ) : (
                        'Create Design Group'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* View Section - Only show when not in edit mode */}
        {!edit && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-slate-500 text-xl dark:text-white">
                  Design Group List
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search design groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 pl-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full gap-3 p-2">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center w-20">
                      S.No
                    </th>
                    <th>Product Group</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Corresponding Design Groups
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
              <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}

            {/* Total count info */}
            {filteredColors.length > 0 && (
              <div className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                Showing {filteredColors.length} of {pagination.totalItems} total
                Design groups
              </div>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default AddColorGroup;
