import { useEffect, useState } from "react";
import ServiceFeedbackForm, { type Waiter } from "./ServiceFeedbackForm";
import { getWaiters } from "../service/waiterService";

export default function ServiceFeedback() {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const data = await getWaiters();
        console.log(data);

        setWaiters(data);
      } catch (err: any) {
        console.error("Error fetching waiters:", err);
        // setError(err.response?.data?.message || "Naməlum xəta");
      }
    };
    fetchWaiters();
  }, []);
  return (
    <div>
      <ServiceFeedbackForm
        waiters={waiters}
      />
    </div>
  );
}
