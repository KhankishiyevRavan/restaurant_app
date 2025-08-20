"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router";
import {
  getAllNotifications,
  NotificationType,
} from "../../services/notificationsService";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DatePicker from "../form/date-picker";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Select from "../form/Select";
import Label from "../form/Label";

export default function NotificationsTable() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showInspection, setShowInspection] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending"); // default: gözləmədə
  const [notificationPerPage, setNotificationPerPage] = useState(() => {
    const saved = localStorage.getItem("notificationPerPage");
    return saved ? Number(saved) : 10;
  });

  type PageItem = number | "...";

  // Dinamik səhifə düymələri
  function getPageItems(
    current: number,
    total: number,
    siblings: number = 1
  ): PageItem[] {
    // Kiçik total-da ellipsis lazım deyil
    if (total <= 1) return [1];
    if (total <= 2 + 2 * siblings) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: PageItem[] = [];
    const first = 1;
    const last = total;

    const left = Math.max(current - siblings, 2); // 2-dən başlayır (1 artıq əlavə olunacaq)
    const right = Math.min(current + siblings, total - 1); // total-1-də bitir (son ayrıca əlavə olunacaq)

    pages.push(first);

    // Sol tərəfdə boşluq varsa "..."
    if (left > 2) pages.push("...");

    // Orta diapazon
    for (let p = left; p <= right; p++) pages.push(p);

    // Sağ tərəfdə boşluq varsa "..."
    if (right < total - 1) pages.push("...");

    pages.push(last);

    // Dublikatları təmizlə (nadir hallarda kənar hallarda ola bilər)
    return pages.filter((v, i, a) => i === 0 || v !== a[i - 1]);
  }
  // --- Axtarış üçün state və helper ---
  const [searchTerm, setSearchTerm] = useState("");
  const safe = (v: unknown) => (v ?? "").toString().toLowerCase();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(1); // Ayın ilk günü
    return formatDate(date);
  };

  const getDefaultEndDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 0); // Ayın son günü
    return formatDate(date);
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  const fetchNotifications = async (start: string, end: string) => {
    try {
      const query = `startDate=${start}&endDate=${end}`;
      const data = await getAllNotifications(query);
      setNotifications(data);
    } catch (err: any) {
      alert("Naməlum xəta");
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (type: "inspection" | "payment") => {
    if (type === "inspection") {
      if (showInspection && !showPayment) return;
      setShowInspection((prev) => !prev);
    } else {
      if (!showInspection && showPayment) return;
      setShowPayment((prev) => !prev);
    }
    setCurrentPage(1);
  };

  // --- Filtrlənmiş nəticələr (status, tip toggle və search birlikdə) ---
  const filteredNotifications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return notifications.filter((note) => {
      const typeMatch =
        (showInspection && note.type === "Texniki baxış") ||
        (showPayment && note.type === "Ödəniş günü");

      const statusMatch =
        statusFilter === "all" || note.status === statusFilter;

      if (!typeMatch || !statusMatch) return false;

      if (!q) return true;

      const dateStr = String(note.notificationDate ?? "")
        .slice(0, 10)
        .toLowerCase(); // YYYY-MM-DD

      return (
        safe(note._id).includes(q) ||
        dateStr.includes(q) ||
        safe(note.subscriberName).includes(q) ||
        safe(note.contractId).includes(q) ||
        safe(note.type).includes(q) ||
        safe(note.status).includes(q)
      );
    });
  }, [notifications, showInspection, showPayment, statusFilter, searchTerm]);

  // Axtarış/filtr dəyişəndə səhifəni sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, showInspection, showPayment]);

  const indexOfLastItem = currentPage * notificationPerPage;
  const indexOfFirstItem = indexOfLastItem - notificationPerPage;
  const currentItems = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    filteredNotifications.length / notificationPerPage
  );

  const [isOpen, setIsOpen] = useState<string | null>(null);

  return (
    <>
      <ComponentCard title={``}>
        {/* Toggle Section */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div
            onClick={() => handleToggle("inspection")}
            className={`cursor-pointer px-4 py-2 rounded-xl border ${
              showInspection
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
          >
            Texniki baxış
          </div>
          <div
            onClick={() => handleToggle("payment")}
            className={`cursor-pointer px-4 py-2 rounded-xl border ${
              showPayment
                ? "border-green-500 bg-green-100 text-green-700"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
          >
            Ödəniş günü
          </div>
          {/* Search input */}
          <div className="">
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Axtar: ID, tarix, istifadəçi, müqavilə, tip, status"
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                  title="Təmizlə"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Date range + actions */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <DatePicker
            value={startDate}
            id="date-picker-start"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              setStartDate(currentDateString);
            }}
            className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            maxDate={endDate}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            tarixdən
          </span>
          <DatePicker
            value={endDate}
            id="date-picker-end"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              setEndDate(currentDateString);
            }}
            className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            minDate={startDate}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            -ə qədər
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              fetchNotifications(startDate, endDate);
              setCurrentPage(1);
            }}
          >
            Göstər
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const defaultStart = getDefaultStartDate();
              const defaultEnd = getDefaultEndDate();
              setStartDate(defaultStart);
              setEndDate(defaultEnd);
              fetchNotifications(defaultStart, defaultEnd);
              setCurrentPage(1);
            }}
          >
            Sıfırla
          </Button>
        </div>

        {/* Status Select */}
        <div className=" mb-3 flex flex-wrap items-center gap-2 mb-3">
          {/* <Label>Status</Label> */}
          <div className="w-fit">
            <Select
              value={statusFilter}
              onChange={(value: string) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              defaultValue="all"
              options={[
                { value: "all", label: "Hamısı" },
                { value: "pending", label: "Gözləmədə" },
                { value: "finish", label: "Tamamlandı" },
              ]}
              className=" border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-200 "
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            statusu
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tarix
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    İstifadəçi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Müqavilə Nömrəsi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Notifikasiya Tipi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Statusu
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fəaliyyət
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((note) => (
                  <TableRow key={note?._id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note?._id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {String(note.notificationDate).slice(0, 10)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.subscriberName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.contractId}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.type}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.status === "pending" ? "Gözləmədə" : "Tamamlandı"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="relative inline-block">
                        <button
                          className="dropdown-toggle"
                          onClick={() =>
                            setIsOpen(
                              isOpen === note._id ? null : (note._id as string)
                            )
                          }
                        >
                          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                        </button>
                        <Dropdown
                          isOpen={isOpen === note._id}
                          onClose={() => setIsOpen(null)}
                          className="w-40 p-2"
                        >
                          <DropdownItem
                            onItemClick={() => {
                              navigate(`/notifications/edit/${note._id}`);
                              setIsOpen(null);
                            }}
                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          >
                            Statusu dəyiş
                          </DropdownItem>

                          <DropdownItem
                            onItemClick={() => {
                              // silmə funksiyası
                              console.log("Sil:", note._id);
                              setIsOpen(null);
                            }}
                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          >
                            Sil
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="relative flex justify-center items-center gap-2 p-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="absolute left-4 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm 
            bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              >
                <ArrowLeft />
                Əvvəlki
              </button>

              <div className="flex gap-2">
                {getPageItems(currentPage, totalPages, 2).map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-3 py-1 rounded text-sm bg-transparent text-gray-500 dark:text-gray-400 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      size="sm"
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === item
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="absolute right-4 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm 
            bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              >
                Növbəti
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
