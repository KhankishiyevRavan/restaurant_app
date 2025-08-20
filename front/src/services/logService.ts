import api from "../api/axios";

export interface LogType {
  _id: string;
  userId: {
    fname: string;
    lname: string;
  };
  timestamp:string;
  operation: string;
  entityType: string;
  entityId: string;
  details: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  createdAt: string;
}

export const getAllLogs = async (): Promise<LogType[]> => {
  const token = localStorage.getItem("token");

  const response = await api.get("/logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
