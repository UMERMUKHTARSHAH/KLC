// PrintEntryPayment.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { PRINTEntries_URL } from '../../../Constants/utils';

const PrintEntryPayment = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id, gstRegistration } = useParams();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${PRINTEntries_URL}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "jhjhjh");

                if (response.ok) {
                    setPaymentData(data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id, token]);

    useEffect(() => {
        if (paymentData && !loading) {
            const timer = setTimeout(() => { window.print(); }, 500);
            return () => clearTimeout(timer);
        }
    }, [paymentData, loading]);

    const getCompanyAddress = () => {
        const addresses = {
            delhi: {
                name: "Kashmir Loom Company Pvt Ltd",
                address: "C-65, Basement, Nizamuddin East, New Delhi",
                gstin: "07AABCK4463H1ZK",
                cin: "U74899DL2000PTC104407",
                contact: "+911146502902, 9810511952",
                email: "shop@kashmirloom.com",
                state: "Delhi",
                stateCode: "07"
            },
            srinagar: {
                name: "Kashmir Loom Company Pvt Ltd",
                address: "GULSHAN ANNEX, MUSKAN ROAD, LAL MANDI, SRINAGAR",
                gstin: "01AABCK4463H1ZW",
                cin: "U74899DL2000PTC104407",
                contact: "+911942313989, 9266577005",
                email: "shop@kashmirloom.com",
                state: "Jammu & Kashmir",
                stateCode: "01"
            }
        };

        const gstRegistration = paymentData?.locationState?.toLowerCase() || '';

        if (gstRegistration.includes('delhi')) {
            return addresses.delhi;
        } else if (gstRegistration.includes('srinagar')) {
            return addresses.srinagar;
        }

        return addresses.srinagar;
    };

    const companyAddress = getCompanyAddress();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0.00';
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const numberToWords = (num) => {
        if (!num || isNaN(num)) return 'Zero Rupees Only';

        const number = parseFloat(num);
        if (number === 0) return 'Zero Rupees Only';

        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

        const rupees = Math.floor(number);
        const paise = Math.round((number - rupees) * 100);

        const convertBelowHundred = (n) => {
            if (n === 0) return '';
            if (n < 10) return units[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) {
                const ten = Math.floor(n / 10);
                const unit = n % 10;
                return tens[ten] + (unit > 0 ? ' ' + units[unit] : '');
            }
            return '';
        };

        const convertBelowThousand = (n) => {
            if (n === 0) return '';

            const hundred = Math.floor(n / 100);
            const remainder = n % 100;

            let words = '';
            if (hundred > 0) {
                words += units[hundred] + ' Hundred';
            }
            if (remainder > 0) {
                if (words !== '') words += ' ';
                words += convertBelowHundred(remainder);
            }
            return words;
        };

        const convertToWords = (n) => {
            if (n === 0) return 'Zero';

            let words = '';
            let crore = Math.floor(n / 10000000);
            let lakh = Math.floor((n % 10000000) / 100000);
            let thousand = Math.floor((n % 100000) / 1000);
            let hundred = n % 1000;

            if (crore > 0) {
                words += convertBelowThousand(crore) + ' Crore ';
            }
            if (lakh > 0) {
                words += convertBelowThousand(lakh) + ' Lakh ';
            }
            if (thousand > 0) {
                words += convertBelowThousand(thousand) + ' Thousand ';
            }
            if (hundred > 0) {
                words += convertBelowThousand(hundred);
            }

            return words.trim();
        };

        let result = '';

        if (rupees > 0) {
            result += convertToWords(rupees) + ' Rupee';
            if (rupees !== 1) result += 's';
        }

        if (paise > 0) {
            if (result !== '') result += ' and ';
            result += convertToWords(paise) + ' Paise';
        }

        if (result === '') result = 'Zero Rupees';

        return result + ' Only';
    };

    // Helper function to calculate taxable value (excluding GST)
    const calculateTaxableValue = (item) => {
        const mrp = item.mrp || 0;
        const gstRate = item.gstCalculation?.totalGstRate ||
            (item.igstRate || item.cgstRate + item.sgstRate || 0);

        if (gstRate > 0) {
            return mrp / (1 + (gstRate / 100));
        }
        return mrp;
    };

    const styles = {
        container: {
            fontFamily: "'Arial', sans-serif",
            fontSize: '12px',
            lineHeight: '1.3',
            color: '#000',
            padding: '15px',
            maxWidth: '210mm',
            margin: '0 auto',
            backgroundColor: '#fff'
        },
        header: {
            borderBottom: '2px solid #000',
            paddingBottom: '10px',
            marginBottom: '15px'
        },
        companyName: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '4px',
            textTransform: 'uppercase'
        },
        companyAddress: {
            fontSize: '11px',
            marginBottom: '2px'
        },
        invoiceTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '15px 0',
            textTransform: 'uppercase'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            marginBottom: '10px'
        },
        tableHeader: {
            border: '1px solid #000',
            padding: '6px 4px',
            textAlign: 'left',
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0'
        },
        tableCell: {
            border: '1px solid #000',
            padding: '6px 4px',
            verticalAlign: 'top'
        },
        totalRow: {
            fontWeight: 'bold',
            backgroundColor: '#f8f8f8'
        },
        sectionTitle: {
            fontSize: '12px',
            fontWeight: 'bold',
            margin: '10px 0 5px 0'
        },
        signatureArea: {
            marginTop: '50px',
            borderTop: '1px solid #000',
            paddingTop: '15px'
        },
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <div>Loading invoice data...</div>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div>Error: {error}</div>
        </Container>
    );

    if (!paymentData) return (
        <Container className="text-center mt-5">
            <div>No invoice data found</div>
        </Container>
    );

    console.log(paymentData, "okok");

    // ✅ Single source of truth: when isExport is true, hide ALL GST-related UI.
    const showGst = !paymentData.isExport;

    return (
        <Container style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <Row className="align-items-start">
                    <Col md={8} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={styles.companyName}>{companyAddress.name}</div>
                            <div style={styles.companyAddress}>{companyAddress.address}</div>
                            <div style={styles.companyAddress}>
                                <strong>GSTIN/UIN:</strong> {companyAddress.gstin}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>State Name:</strong> {companyAddress.state}, <strong>Code:</strong> {companyAddress.stateCode}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>CIN:</strong> {companyAddress.cin}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>Contact:</strong> {companyAddress.contact}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>E-Mail:</strong> {companyAddress.email}
                            </div>
                        </div>
                    </Col>

                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={styles.invoiceTitle}>TAX INVOICE</div>
                    </Col>
                </Row>
            </div>

            {/* Consignee and Buyer Section */}
            {paymentData.typeOfVoucher == "Sales" && (
                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <td style={styles.tableHeader} width="50%">Consignee (Ship to)</td>
                            <td style={styles.tableHeader} width="50%">Buyer (Bill to)</td>
                        </tr>
                        <tr>
                            <td style={styles.tableCell}>
                                <strong>{paymentData.ledgerName}</strong> <br />
                                {paymentData.shippingAddress}
                            </td>
                            <td style={styles.tableCell}>
                                <strong>{paymentData.ledgerName}</strong> <br />
                                {paymentData.billingAddress}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {paymentData.typeOfVoucher == "Purchase" && (
                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <td style={styles.tableHeader} width="50%">Consignee (Ship to)</td>
                            <td style={styles.tableHeader} width="50%">Supplier (Bill from)</td>
                        </tr>
                        <tr>
                            <td style={styles.tableCell}>
                                <div>
                                    <div style={styles.companyName}>{companyAddress.name}</div>
                                    <div style={styles.companyAddress}>{companyAddress.address}</div>
                                    <div style={styles.companyAddress}>
                                        <strong>GSTIN/UIN:</strong> {companyAddress.gstin}
                                    </div>
                                    <div style={styles.companyAddress}>
                                        <strong>State Name:</strong> {companyAddress.state}, <strong>Code:</strong> {companyAddress.stateCode}
                                    </div>
                                    <div style={styles.companyAddress}>
                                        <strong>CIN:</strong> {companyAddress.cin}
                                    </div>
                                    <div style={styles.companyAddress}>
                                        <strong>Contact:</strong> {companyAddress.contact}
                                    </div>
                                    <div style={styles.companyAddress}>
                                        <strong>E-Mail:</strong> {companyAddress.email}
                                    </div>
                                </div>
                            </td>
                            <td style={styles.tableCell}>
                                <strong>{paymentData.ledgerName}</strong> <br />
                                {paymentData.billingAddress}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {/* Invoice Details */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="25%">Invoice No.</td>
                        <td style={styles.tableCell} width="25%">{paymentData.recieptNumber}</td>
                        <td style={styles.tableHeader} width="25%">Dated</td>
                        <td style={styles.tableCell} width="25%">{formatDate(paymentData.date)}</td>
                    </tr>
                    <tr>
                        <td style={styles.tableHeader}>Delivery Note</td>
                        <td style={styles.tableCell}>{paymentData.deliveryNote || '-'}</td>
                        <td style={styles.tableHeader}>Mode/Terms of Payment</td>
                        <td style={styles.tableCell}>{paymentData.paymentTerms || '-'}</td>
                    </tr>

                    {paymentData.typeOfVoucher === "Sales" && (
                        <tr>
                            <td style={styles.tableHeader}>Buyer's Order No.</td>
                            <td style={styles.tableCell}>{paymentData.buyerOrderNo || '-'}</td>
                            <td style={styles.tableHeader}>Delivery Note Date</td>
                            <td style={styles.tableCell}>{formatDate(paymentData.deliveryNoteDate)}</td>
                        </tr>
                    )}

                    {paymentData.isExport === true && (
                        <tr>
                            <td style={styles.tableHeader}>LUT/Bond Details</td>
                            <td style={styles.tableCell} colSpan="5">
                                <span className='font-semibold'>LUT No:</span> {paymentData?.lut?.lutNumber || '-'} <br />
                                <span className='font-semibold'>From:</span> {paymentData?.lut?.fromDate || '-'} <br />
                                <span className='font-semibold'>To:</span> {paymentData?.lut?.toDate || '-'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Products Table — GST columns only when showGst */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="3%">Sl No.</th>
                        <th style={styles.tableHeader} width="25%">Description of Goods</th>
                        <th style={styles.tableHeader} width="7%">HSN/SAC</th>
                        <th style={styles.tableHeader} width="5%">Qty</th>
                         {showGst && (
                        <th style={styles.tableHeader} width="8%">MRP (Inc. GST)</th>
                         )}
                        <th style={styles.tableHeader} width="8%">Rate</th>
                        {showGst && (
                            <>
                                <th style={styles.tableHeader} width="8%">CGST</th>
                                <th style={styles.tableHeader} width="8%">SGST</th>
                                <th style={styles.tableHeader} width="8%">IGST</th>
                            </>
                        )}

                        <th style={styles.tableHeader} width="8%">Disc. %</th>
                        <th style={styles.tableHeader} width="8%">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentData.paymentDetails?.map((product, index) => {
                        const quantity = product.quantity || 1;
                        const mrp = product.mrp || 0;
                        const discount = product.discount || 0;

                        const taxableValue = calculateTaxableValue(product) * quantity;

                        const gstCalc = product.gstCalculation || {};
                        const cgstRate = gstCalc.cgstRate ?? product.cgstRate ?? 0;
                        const sgstRate = gstCalc.sgstRate ?? product.sgstRate ?? 0;
                        const igstRate = gstCalc.igstRate ?? product.igstRate ?? 0;

                        const cgstAmount = taxableValue * (cgstRate / 100);
                        const sgstAmount = taxableValue * (sgstRate / 100);
                        const igstAmount = taxableValue * (igstRate / 100);

                        const discountMultiplier = (100 - discount) / 100;
                        const totalAmount = product.value;

                        return (
                            <tr key={index}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{product.productDescription}</td>
                                <td style={styles.tableCell}>{product?.hsnCode?.hsnCodeName}</td>
                                <td style={styles.tableCell}>{quantity} {product.unit}</td>
                                {showGst && (
                                <td style={styles.tableCell}>₹{formatCurrency(mrp)}</td>
                                )}
                                <td style={styles.tableCell}>₹{formatCurrency(taxableValue)}</td>
                                {showGst && (
                                    <>
                                        <td style={styles.tableCell}>
                                            {cgstRate > 0 ? `₹${formatCurrency(cgstAmount)} (${cgstRate}%)` : '-'}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {sgstRate > 0 ? `₹${formatCurrency(sgstAmount)} (${sgstRate}%)` : '-'}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {igstRate > 0 ? `₹${formatCurrency(igstAmount)} (${igstRate}%)` : '-'}
                                        </td>
                                    </>
                                )}

                                <td style={styles.tableCell}>{discount}%</td>
                                <td style={styles.tableCell}>₹{formatCurrency(totalAmount)}</td>
                            </tr>
                        );
                    })}

                    {/* Totals Row */}
                    <tr style={styles.totalRow}>
                        <td style={styles.tableCell} colSpan="3" className="text-right">Total</td>
                        <td style={styles.tableCell} className="text-left">
                            {paymentData.paymentDetails?.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                        </td>
                        <td style={styles.tableCell}>-</td>

                        {showGst && (
                            <td style={styles.tableCell}>
                                ₹{formatCurrency(
                                    paymentData.paymentDetails?.reduce((sum, item) => {
                                        return sum + (calculateTaxableValue(item) * (item.quantity || 1));
                                    }, 0)
                                )}
                            </td>
                        )}

                        <td style={styles.tableCell} colSpan={showGst ? 5 : 2} className="text-right">
                            ₹{formatCurrency(paymentData.totalAmount || 0)}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Tax Summary Section — only when showGst */}
            {showGst && paymentData.typeOfVoucher == "Sales" && (
                <>
                    <table style={styles.table}>
                        <tbody>
                            {paymentData.totalCgst > 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Total CGST</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.totalCgst)}</strong>
                                    </td>
                                </tr>
                            )}
                            {paymentData.totalSgst > 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Total SGST</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.totalSgst)}</strong>
                                    </td>
                                </tr>
                            )}
                            {paymentData.totalIgst > 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Total IGST</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.totalIgst)}</strong>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td style={styles.tableCell} colSpan="5" className="text-right">
                                    <strong>Total GST</strong>
                                </td>
                                <td style={styles.tableCell}>
                                    <strong>₹{formatCurrency(paymentData.totalGst)}</strong>
                                </td>
                            </tr>
                            {paymentData.discountAmount > 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Discount</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.discountAmount)}</strong>
                                    </td>
                                </tr>
                            )}
                            {paymentData.roundOffAmount && paymentData.roundOffAmount !== 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Round Off</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.roundOffAmount)}</strong>
                                    </td>
                                </tr>
                            )}
                            {paymentData.courrierAmount > 0 && (
                                <tr>
                                    <td style={styles.tableCell} colSpan="5" className="text-right">
                                        <strong>Courier Charges</strong>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <strong>₹{formatCurrency(paymentData.courrierAmount)}</strong>
                                    </td>
                                </tr>
                            )}
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="5" className="text-right">
                                    <strong>Total Amount</strong>
                                </td>
                                <td style={styles.tableCell}>
                                    <strong>₹{formatCurrency(paymentData.totalAmount)}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Amount in Words */}
                    <div style={styles.sectionTitle}>
                        Amount Chargeable (in words): INR {numberToWords(paymentData.totalAmount)}
                    </div>

                    <div style={styles.sectionTitle}>
                        Tax Amount (in words): INR {numberToWords(paymentData.totalGst)}
                    </div>
                </>
            )}

            {/* HSN Summary Section — only when showGst */}
            {showGst && paymentData.typeOfVoucher == "Sales" && (
                (() => {
                    const cgstSgstItems = [];
                    const igstItems = [];

                    if (paymentData.paymentDetails && paymentData.paymentDetails.length > 0) {
                        paymentData.paymentDetails.forEach(item => {
                            if (item.hsnCode && item.hsnCode.hsnCodeName) {
                                const gstCalc = item.gstCalculation || {};
                                const quantity = item.quantity || 1;
                                const taxableValue = calculateTaxableValue(item) * quantity;

                                if (gstCalc.type === 'CGST+SGST' || (item.cgstRate > 0 && item.sgstRate > 0)) {
                                    cgstSgstItems.push({
                                        hsnCode: item.hsnCode.hsnCodeName,
                                        taxableValue: taxableValue,
                                        cgstRate: gstCalc.cgstRate || item.cgstRate || 0,
                                        sgstRate: gstCalc.sgstRate || item.sgstRate || 0,
                                        cgstAmount: taxableValue * ((gstCalc.cgstRate || item.cgstRate || 0) / 100),
                                        sgstAmount: taxableValue * ((gstCalc.sgstRate || item.sgstRate || 0) / 100),
                                        totalTax: taxableValue * (((gstCalc.cgstRate || item.cgstRate || 0) + (gstCalc.sgstRate || item.sgstRate || 0)) / 100)
                                    });
                                } else if (gstCalc.type === 'IGST' || item.igstRate > 0) {
                                    igstItems.push({
                                        hsnCode: item.hsnCode.hsnCodeName,
                                        taxableValue: taxableValue,
                                        igstRate: gstCalc.igstRate || item.igstRate || 0,
                                        igstAmount: taxableValue * ((gstCalc.igstRate || item.igstRate || 0) / 100),
                                        totalTax: taxableValue * ((gstCalc.igstRate || item.igstRate || 0) / 100)
                                    });
                                }
                            }
                        });
                    }

                    return (
                        <>
                            {cgstSgstItems.length > 0 && (
                                <>
                                    <div style={styles.sectionTitle}>HSN Summary (CGST+SGST)</div>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.tableHeader}>HSN/SAC</th>
                                                <th style={styles.tableHeader}>Taxable Value</th>
                                                <th style={styles.tableHeader}>CGST Rate</th>
                                                <th style={styles.tableHeader}>CGST Amount</th>
                                                <th style={styles.tableHeader}>SGST Rate</th>
                                                <th style={styles.tableHeader}>SGST Amount</th>
                                                <th style={styles.tableHeader}>Total Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cgstSgstItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={styles.tableCell}>{item.hsnCode}</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.taxableValue)}</td>
                                                    <td style={styles.tableCell}>{item.cgstRate}%</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.cgstAmount)}</td>
                                                    <td style={styles.tableCell}>{item.sgstRate}%</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.sgstAmount)}</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.totalTax)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {igstItems.length > 0 && (
                                <>
                                    <div style={styles.sectionTitle}>HSN Summary (IGST)</div>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.tableHeader}>HSN/SAC</th>
                                                <th style={styles.tableHeader}>Taxable Value</th>
                                                <th style={styles.tableHeader}>IGST Rate</th>
                                                <th style={styles.tableHeader}>IGST Amount</th>
                                                <th style={styles.tableHeader}>Total Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {igstItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={styles.tableCell}>{item.hsnCode}</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.taxableValue)}</td>
                                                    <td style={styles.tableCell}>{item.igstRate}%</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.igstAmount)}</td>
                                                    <td style={styles.tableCell}>₹{formatCurrency(item.totalTax)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </>
                    );
                })()
            )}

            {/* Declaration and Signatures */}
            <div style={styles.signatureArea}>
                <Row>
                    <Col md={6}>
                        <div style={styles.sectionTitle}>Declaration</div>
                        <div style={styles.companyAddress}>
                            Unused goods can be exchanged within 14 days from date of invoice.
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <div style={{ marginTop: '40px' }}>
                            <strong>For {companyAddress.name}</strong>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Authorised Signatory</strong>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
                <div><strong>SUBJECT TO {companyAddress.state.toUpperCase()} COURTS ONLY JURISDICTION</strong></div>
                <div>This is a Computer Generated Invoice</div>
            </div>
        </Container>
    );
};

export default PrintEntryPayment;