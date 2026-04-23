"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check, CreditCard, Building2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface PaymentMethod {
  id: string;
  type: "UPI" | "BANK_ACCOUNT";
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  accountHolderName?: string;
  isPreferred: boolean;
}

interface FormData {
  type: "UPI" | "BANK_ACCOUNT";
  upiId: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  isPreferred: boolean;
}

function UserAccountCard({ userId }: { userId: string }) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    type: "UPI" as "UPI" | "BANK_ACCOUNT",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountHolderName: "",
    isPreferred: false,
  });

  useEffect(() => {
    fetchMethods();
  }, [userId]);

  const fetchMethods = async () => {
    try {
      const res = await fetch(`/api/payout/methods?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setMethods(data);
      }
    } catch (error) {
      toast.error("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      type: "UPI",
      upiId: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      isPreferred: false,
    });
    setEditingMethod(null);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      upiId: method.upiId || "",
      accountNumber: method.accountNumber || "",
      ifscCode: method.ifscCode || "",
      bankName: method.bankName || "",
      accountHolderName: method.accountHolderName || "",
      isPreferred: method.isPreferred,
    });
    openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingMethod ? "/api/payout/methods" : "/api/payout/methods";
      const method = editingMethod ? "PUT" : "POST";
      const payload = editingMethod
        ? { id: editingMethod.id, userId, ...formData }
        : { ...formData, userId };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingMethod
            ? "Payment method updated successfully"
            : "Payment method added successfully"
        );
        fetchMethods();
        closeModal();
        resetForm();
      } else {
        toast.error(data.error || "Failed to save payment method");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const res = await fetch(`/api/payout/methods?id=${id}&userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Payment method deleted");
        fetchMethods();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSetPreferred = async (id: string) => {
    try {
      const res = await fetch("/api/payout/methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId, isPreferred: true }),
      });

      if (res.ok) {
        toast.success("Preferred method updated");
        fetchMethods();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleModalClose = () => {
    closeModal();
    resetForm();
  };

  if (loading && methods.length === 0) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Payment Methods
          </h4>

          <div className="space-y-4">
            {methods.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No payment methods added yet</p>
            ) : (
              methods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-xl ${method.isPreferred
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {method.type === "UPI" ? (
                          <CreditCard size={18} className="text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Building2 size={18} className="text-gray-600 dark:text-gray-400" />
                        )}
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {method.type === "UPI" ? "UPI" : "Bank Account"}
                        </span>
                        {method.isPreferred && (
                          <span className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            <Check size={12} />
                            Preferred
                          </span>
                        )}
                      </div>
                      {method.type === "UPI" ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.upiId}</p>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>
                            <span className="font-medium">Name:</span> {method.accountHolderName}
                          </p>
                          <p>
                            <span className="font-medium">Account:</span> {method.accountNumber}
                          </p>
                          <p>
                            <span className="font-medium">IFSC:</span> {method.ifscCode}
                          </p>
                          <p>
                            <span className="font-medium">Bank:</span> {method.bankName}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!method.isPreferred && (
                        <button
                          onClick={() => handleSetPreferred(method.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Set Preferred
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(method)}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            openModal();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:inline-flex lg:w-auto"
        >
          <Plus size={18} />
          Add Method
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {editingMethod
                ? "Update your payment method details."
                : "Add your preferred payment method for receiving payouts."}            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="h-auto overflow-y-auto px-2 pb-3">
              <div className="mb-5">
                <Label>Payment Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as "UPI" | "BANK_ACCOUNT" })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-gray-900 dark:text-white border-gray-300 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  disabled={!!editingMethod}
                >
                  <option value="UPI">UPI</option>
                  <option value="BANK_ACCOUNT">Bank Account</option>
                </select>
              </div>

              {formData.type === "UPI" ? (
                <div className="mb-5">
                  <Label>UPI ID</Label>
                  <Input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="example@upi"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <Label>Account Holder Name</Label>
                    <Input
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) =>
                        setFormData({ ...formData, accountHolderName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <Label>Account Number</Label>
                    <Input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, accountNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <Label>IFSC Code</Label>
                    <Input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <Label>Bank Name</Label>
                    <Input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPreferred}
                    onChange={(e) =>
                      setFormData({ ...formData, isPreferred: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Set as preferred method
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleModalClose} type="button">
                Close
              </Button>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-light)]" size="sm" type="submit" disabled={loading}>
                {loading
                  ? editingMethod
                    ? "Updating..."
                    : "Adding..."
                  : editingMethod
                    ? "Update Method"
                    : "Add Method"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default UserAccountCard;
