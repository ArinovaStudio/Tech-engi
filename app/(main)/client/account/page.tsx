'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DollarSign, Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, MessageSquare, Send, X, CreditCard, Building2, Copy } from 'lucide-react';

interface PaymentRequest {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: string;
  invoice?: string;
  extensionDate?: string;
  transactionId?: string;
  paymentProof?: string;
  paymentDate?: string;
  hasClientPaid: boolean;
  createdAt: string;
  paymentMethod: string;
  gateway?: string;
  ticketId?: string;
  ticket?: {
    id: string;
    description: string;
    status: string;
    raisedById: string;
    messages: TicketMessage[];
  };
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
}
interface TicketMessage {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  description: string;
  status: string;
  createdAt: string;
  raisedById: string;
  messages: TicketMessage[];
}

export default function ClientPayoutPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [extensionDate, setExtensionDate] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [paymentForm, setPaymentForm] = useState({
    transactionId: '',
    paymentDate: '',
    paymentProof: ''
  });

  useEffect(() => {
    fetchRequests();
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch('/api/client/payout/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }

  async function openTicketChat(ticketId: string) {
    try {
      const res = await fetch(`/api/client/payout/tickets?ticketId=${ticketId}`);
      const data = await res.json();

      if (res.ok) {
        setSelectedTicket(data.ticket);
        setShowChatModal(true);
      } else {
        toast.error(data.message || "Failed to open ticket");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  async function handleSendMessage() {
    if (!chatMessage.trim() || !selectedTicket) return;

    try {
      const res = await fetch("/api/client/payout/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: chatMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedTicket((prev) =>
          prev
            ? { ...prev, messages: data.messages || [] }
            : prev
        );
        setChatMessage("");
        toast.success('Message sent');
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  }

  async function handleResolveTicket() {
    if (!selectedTicket) return;

    const res = await fetch("/api/client/payout/tickets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: selectedTicket.id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Ticket resolved");
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: "RESOLVED" } : prev
      );
    } else {
      toast.error(data.message || "Failed to resolve");
    }
  }


  async function fetchBankDetails() {
    setLoadingBankDetails(true);
    try {
      const res = await fetch('/api/client/payout/bank-details');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setBankDetails(data.data);
        } else {
          toast.error('Bank details not available');
        }
      } else {
        toast.error('Failed to fetch bank details');
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to fetch bank details');
    } finally {
      setLoadingBankDetails(false);
    }
  }

  async function handleGatewayPayment(request: PaymentRequest) {
    try {
      setLoading(true);
      
      const orderRes = await fetch('/api/razorpay/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseFloat(request.amount),
          paymentRequestId: request.id 
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const isLoaded = await import('@/lib/loadRazorpay').then(m => m.loadRazorpay());
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Payment Request',
        description: request.title,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          await verifyPayment(response, request.id);
        },
        theme: { color: '#3b82f6' },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment(payment: any, requestId: string) {
    try {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        toast.error('Payment verification failed');
        return;
      }

      // Submit payment to backend
      const submitRes = await fetch('/api/client/payout/payment/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentRequestId: requestId,
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        }),
      });

      if (submitRes.ok) {
        toast.success('Payment successful!');
        fetchRequests();
      } else {
        toast.error('Failed to record payment');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Payment verification failed');
    }
  }
  async function handlePaymentSubmit() {
    if (!selectedRequest) return;
    const res = await fetch('/api/client/payout/payment/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentRequestId: selectedRequest.id,
        ...paymentForm
      })
    });
    if (res.ok) {
      toast.success('Payment submitted successfully');
      fetchRequests();
      setShowPaymentModal(false);
      setPaymentForm({ transactionId: '', paymentDate: '', paymentProof: '' });
    } else {
      const err = await res.json();
      toast.error(err.message || 'Failed to submit payment');
    }
  }

  async function handleExtensionRequest() {
    if (!selectedRequest) return;
    const res = await fetch('/api/client/payout/request-extension', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentRequestId: selectedRequest.id,
        date: extensionDate
      })
    });
    if (res.ok) {
      toast.success('Extension request submitted');
      fetchRequests();
      setShowExtensionModal(false);
      setExtensionDate('');
    } else {
      toast.error('Failed to request extension');
    }
  }

async function handleRaiseTicket() {
  if (!selectedRequest || !ticketDescription.trim()) {
    toast.error('Please provide a description');
    return;
  }

  try {
    const res = await fetch('/api/client/payout/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentRequestId: selectedRequest.id,
        description: ticketDescription
      })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Ticket raised successfully');
      setShowTicketModal(false);
      setTicketDescription("");
      fetchRequests();
      await openTicketChat(data.ticket.id);
    } else {
      toast.error(data.message || 'Failed to raise ticket');
    }
  } catch (error) {
    console.error('Error raising ticket:', error);
    toast.error('Failed to raise ticket');
  }
}


  const handleViewBankDetails = async () => {
    setShowBankDetailsModal(true);
    if (!bankDetails) {
      await fetchBankDetails();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'CANCELLED': return 'bg-red-500/20 text-red-500 border-red-500';
      case 'NOT_RECEIVED': return 'bg-orange-500/20 text-orange-500 border-orange-500';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your payment requests and invoices</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No payment requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 ${isOverdue(request.dueDate) && request.status === 'PENDING'
                ? 'border-red-500'
                : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{request.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.description}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{parseFloat(request.amount).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar size={16} /> Due Date
                  </span>
                  <span className={`font-medium ${isOverdue(request.dueDate) && request.status === 'PENDING' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                    {new Date(request.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <CreditCard size={16} /> Payment Method
                  </span>
                  <span className={`font-medium ${isOverdue(request.dueDate) && request.status === 'PENDING' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                    {request.paymentMethod}
                  </span>
                </div>

                {request.extensionDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Extension Requested</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {new Date(request.extensionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleViewBankDetails}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Building2 size={18} />
                  View Company's Bank Details
                </button>

                {request.invoice && (

                  <a href={request.invoice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FileText size={16} /> View Invoice
                  </a>
                )}
              </div>

              {request.paymentMethod === 'GATEWAY' && !request.hasClientPaid && request.status === 'PENDING' && (
                <button
                  onClick={async () => {
                    setSelectedRequest(request);
                    await handleGatewayPayment(request);
                  }}
                  className="flex-1 px-4 py-2 mb-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-500 transition flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} /> Pay ₹{parseFloat(request.amount).toLocaleString()} via {request.gateway}
                </button>
              )}

              {request.status === 'PENDING' && !request.hasClientPaid && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowPaymentModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center justify-center gap-2"
                  >
                    Submit Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowExtensionModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Clock size={18} />
                  </button>

                  <button
                    onClick={async () => {
                      setSelectedRequest(request);
                      // if ticket already exists → open chat
                      if (request.ticket) {
                        setSelectedTicket(request.ticket);
                        setShowChatModal(true);
                      } else {
                        setShowTicketModal(true);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              )}

              {request.hasClientPaid && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle size={16} /> Payment submitted
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Bank Details Modal */}
      {showBankDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Bank Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use these details for payment</p>
                </div>
              </div>
              <button
                onClick={() => setShowBankDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {loadingBankDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : bankDetails ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Holder Name</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white">{bankDetails.accountHolderName}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountHolderName, 'Account holder name')}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bank Name</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white">{bankDetails.bankName}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.bankName, 'Bank name')}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white font-mono">{bankDetails.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IFSC Code</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white font-mono">{bankDetails.ifscCode}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.ifscCode, 'IFSC code')}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Branch Name</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white">{bankDetails.branchName}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.branchName, 'Branch name')}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                      <CreditCard size={14} /> UPI ID
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-purple-900 dark:text-purple-300 font-mono text-sm">{bankDetails.upiId}</p>
                      <button
                        onClick={() => copyToClipboard(bankDetails.upiId, 'UPI ID')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> Please use these bank details for making payments. After payment, submit the transaction details using the "Submit Details" button.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 dark:text-gray-400">Bank details not available</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowBankDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Submit Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Transaction ID</label>
                <input
                  type="text"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter transaction ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Payment Date</label>
                <input
                  type="datetime-local"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Payment Proof URL (Optional)</label>
                <input
                  type="url"
                  value={paymentForm.paymentProof}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentProof: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Modal */}
      {showExtensionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request Extension</h2>
              <button onClick={() => setShowExtensionModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Due Date</label>
                <input
                  type="date"
                  value={extensionDate}
                  onChange={(e) => setExtensionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExtensionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExtensionRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Raise Ticket</h2>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Issue Description</label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="Describe your issue..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTicketModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseTicket}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showChatModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Invoice Issue Ticket
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${selectedTicket.status === "RESOLVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {selectedTicket.description}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedTicket.messages.map((msg) => {
                const isCurrentUser = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${isCurrentUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            {selectedTicket.status === "OPEN" && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
                  >
                    Send
                  </button>
                </div>

                <button
                  onClick={handleResolveTicket}
                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Mark as Resolved
                </button>
              </div>
            )}

            {/* Close */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setSelectedTicket(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}