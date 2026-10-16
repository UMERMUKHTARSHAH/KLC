// InviteToLegacyModal.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ImCross } from 'react-icons/im';

const InviteToLegacyModal = ({ isOpen, onClose, customer, onSubmit }) => {
  // Adjust this path to match your Redux state tree.
  const currentUser = useSelector((state) => state?.persisted?.user);
console.log(currentUser,"4545");

  if (!isOpen || !customer) return null;

  const initialValues = {
    earnRatePercent: '',
  };

  const validationSchema = Yup.object({
    earnRatePercent: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Cannot be negative')
      .max(100, 'Cannot exceed 100')
      .required('Earn Rate % is required'),
  });

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const payload = {
      customerId: customer.id,
      earnRatePercent: parseFloat(values.earnRatePercent),
      relationshipManager: currentUser?.currentUser?.user?.name || '',
      grantedBy: currentUser?.currentUser?.user?.authorities?.[0]?.authority || '',
    };

    onSubmit(payload);
    resetForm();
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 " style={{ backgroundColor: '#3f4f67' }}>
          <h3 className="text-white font-semibold text-lg">
            Invite to Legacy
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <ImCross size={18} />
          </button>
        </div>

        {/* Body */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="px-6 py-5 space-y-4">
                {/* Read-only context */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300">
                      Customer
                    </span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {customer.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300">
                      Customer ID
                    </span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {customer.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300">
                      Relationship Manager
                    </span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {currentUser?.currentUser?.user?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300">
                      Granted By
                    </span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {currentUser?.currentUser?.user?.authorities?.[0]?.authority || '-'}
                    </span>
                  </div>
                </div>

                {/* Only input field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Earn Rate % <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="earnRatePercent"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 12.5"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-slate-800 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/40 transition"
                  />
                  <ErrorMessage
                    name="earnRatePercent"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#3f4f67' }}
                  className="px-5 py-2 rounded-lg  text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InviteToLegacyModal;