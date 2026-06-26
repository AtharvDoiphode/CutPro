import { useEffect, useState } from "react";
import { getAllCustomers } from "../../lib/adminApi";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const CustomersPanel = () => {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadCustomers =
      async () => {
        try {
          const response =
            await getAllCustomers();

          setCustomers(
            response.data || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadCustomers();
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        Loading Customers...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-5xl font-bold text-white">
        Customers
      </h1>

      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="rounded-3xl bg-[#111] p-6"
          >
            <h3 className="text-xl font-bold text-white">
              {customer.name}
            </h3>

            <p className="text-zinc-400">
              {customer.email}
            </p>

            <p className="text-zinc-400">
              {customer.phone}
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Joined:
              {" "}
              {new Date(
                customer.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersPanel;