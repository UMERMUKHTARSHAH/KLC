import React, { useEffect, useState, useMemo } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import Pagination from '../Pagination/Pagination'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { VIEW_SUPPLIER_ORDERS } from '../../Constants/utils'

const SUPPLIERS_PER_PAGE = 5

const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return isNaN(d) ? date : d.toLocaleDateString('en-GB') // dd/mm/yyyy
}

const thClass =
    'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'
const tdClass = 'px-5 py-4 border-b border-gray-200 text-sm'

const ViewSupplierOrders = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user)
    const { token } = currentUser

    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [collapsed, setCollapsed] = useState({}) // { [supplierId]: true }

    const getSupplierOrders = async () => {
        setLoading(true)
        try {
            const response = await fetch(VIEW_SUPPLIER_ORDERS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const data = await response.json() // List<AllSupplierDTO>
            setSuppliers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching supplier orders:', error)
            toast.error('Failed to fetch supplier orders')
            setSuppliers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSupplierOrders()
    }, [])

    const toggle = (id) =>
        setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))

    const totalOrders = useMemo(
        () => suppliers.reduce((sum, s) => sum + (s.orders?.length || 0), 0),
        [suppliers]
    )

    // Client-side pagination by supplier
    const totalPages = Math.max(1, Math.ceil(suppliers.length / SUPPLIERS_PER_PAGE))

    const paginatedSuppliers = useMemo(() => {
        const start = (currentPage - 1) * SUPPLIERS_PER_PAGE
        return suppliers.slice(start, start + SUPPLIERS_PER_PAGE)
    }, [suppliers, currentPage])

    const renderSupplier = (supplier) => {
        const orders = supplier.orders || []
        const isCollapsed = !collapsed[supplier.id]

        return (
             
            <div
                key={supplier.id}
                className="mb-6 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600"
            >
                {/* Supplier header */}
                <div
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-slate-200 dark:bg-slate-700 dark:text-white cursor-pointer"
                    onClick={() => toggle(supplier.id)}
                >
                    <div>
                        <h3 className="text-lg font-semibold">{supplier.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Code: {supplier.supplierCode || '-'}
                            {'  |  '}
                            Phone: {supplier.phoneNumber || '-'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex rounded-full py-1 px-3 text-xs font-medium bg-success bg-opacity-10 text-success dark:bg-white dark:text-slate-800">
                            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                        </span>
                        <span className="text-sm">{isCollapsed ? '▼' : '▲'}</span>
                    </div>
                </div>

                {/* Orders of this supplier */}
                {!isCollapsed && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className={thClass}>SNO</th>
                                    <th className={thClass}>Order No</th>
                                    <th className={thClass}>Order Date</th>
                                    <th className={thClass}>Shipping Date</th>
                                    <th className={thClass}>Created By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length ? (
                                    orders.map((order, index) => (
                                        <tr
                                            key={order.id ?? index}
                                            className="bg-white dark:bg-slate-800 dark:text-white"
                                        >
                                            <td className={tdClass}>{index + 1}</td>
                                            <td className={tdClass}>{order.orderNo || '-'}</td>
                                            <td className={tdClass}>{formatDate(order.orderDate)}</td>
                                            <td className={tdClass}>{formatDate(order.shippingDate)}</td>
                                            <td className={tdClass}>{order.createdBy || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white dark:bg-slate-800 dark:text-white">
                                        <td colSpan="4" className={`${tdClass} text-center`}>
                                            No orders for this supplier
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order / Supplier Orders" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className="flex flex-wrap justify-between gap-2 mb-4">
                        <h2 className="text-xl font-semibold leading-tight">View Supplier Orders</h2>
                        <div className="flex gap-2">
                            <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                                SUPPLIERS: {suppliers.length}
                            </p>
                            <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                                TOTAL ORDERS: {totalOrders}
                            </p>
                        </div>
                    </div>

                    <div className="py-4">
                        {loading ? (
                            <p className="text-center py-10 dark:text-white">Loading...</p>
                        ) : paginatedSuppliers.length ? (
                            paginatedSuppliers.map(renderSupplier)
                        ) : (
                            <p className="text-center py-10 dark:text-white">No Supplier Found</p>
                        )}

                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            handlePageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ViewSupplierOrders